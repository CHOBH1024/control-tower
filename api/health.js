// api/health.js — 전체 사이트 HTTP 헬스체크
// GET /api/health  →  사이트별 statusCode · latency · health + 요약 지표
// 캐시: CDN 60초 (과도한 외부 핑 방지)

const https = require('https');
const http = require('http');
const { SITES, CATEGORY_LABELS } = require('../lib/sites');

const TIMEOUT_MS = 8000;

/**
 * @returns {Promise<{ domain: string, statusCode: number, ok: boolean, health: string, ms: number, error?: string }>}
 */
function checkSite(domain) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const url = `https://${domain}`;
    const lib = url.startsWith('https') ? https : http;

    const req = lib.get(
      url,
      {
        timeout: TIMEOUT_MS,
        headers: {
          'User-Agent': 'AntiControlTower/1.0 (health-check)',
          Accept: 'text/html,*/*',
        },
      },
      (res) => {
        res.resume();
        const ms = Date.now() - t0;
        const statusCode = res.statusCode || 0;
        const ok = statusCode >= 200 && statusCode < 400;
        let health = 'offline';
        if (ok) health = 'online';
        else if (statusCode >= 400 && statusCode < 500) health = 'degraded';
        else if (statusCode >= 500) health = 'offline';

        resolve({ domain, statusCode, ok, health, ms });
      }
    );

    req.on('error', (e) => {
      resolve({
        domain,
        statusCode: 0,
        ok: false,
        health: 'offline',
        ms: Date.now() - t0,
        error: e.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        domain,
        statusCode: 0,
        ok: false,
        health: 'offline',
        ms: Date.now() - t0,
        error: 'timeout',
      });
    });
  });
}

function buildLatencySummary(results) {
  const onlineMs = results
    .filter((r) => r.health === 'online' && typeof r.ms === 'number')
    .map((r) => r.ms);

  if (!onlineMs.length) {
    return { avgMs: null, maxMs: null, minMs: null, slowest: [] };
  }

  const sum = onlineMs.reduce((a, b) => a + b, 0);
  const avgMs = Math.round(sum / onlineMs.length);
  const maxMs = Math.max(...onlineMs);
  const minMs = Math.min(...onlineMs);

  const slowest = [...results]
    .filter((r) => r.health === 'online')
    .sort((a, b) => (b.ms || 0) - (a.ms || 0))
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      name: r.name,
      domain: r.domain,
      ms: r.ms,
    }));

  return { avgMs, maxMs, minMs, slowest };
}

function buildCategoryBreakdown(results) {
  const map = {};
  for (const r of results) {
    const cat = r.category || 'other';
    if (!map[cat]) {
      map[cat] = {
        id: cat,
        label: CATEGORY_LABELS[cat] || cat,
        total: 0,
        online: 0,
        degraded: 0,
        offline: 0,
      };
    }
    map[cat].total += 1;
    if (r.health === 'online') map[cat].online += 1;
    else if (r.health === 'degraded') map[cat].degraded += 1;
    else map[cat].offline += 1;
  }
  return Object.values(map);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const results = await Promise.all(
      SITES.map(async (site) => {
        const ping = await checkSite(site.domain);
        return {
          id: site.id,
          name: site.name,
          sub: site.sub,
          category: site.category,
          status: site.status,
          adsense: site.adsense,
          gsc: site.gsc,
          seoText: site.seoText,
          domain: site.domain,
          github: site.github,
          icon: site.icon,
          color: site.color,
          desc: site.desc,
          health: ping.health,
          statusCode: ping.statusCode,
          ms: ping.ms,
          ok: ping.ok,
          error: ping.error || null,
        };
      })
    );

    // 오프라인 우선 정렬 (문제 사이트 상단)
    const order = { offline: 0, degraded: 1, online: 2 };
    results.sort((a, b) => (order[a.health] ?? 9) - (order[b.health] ?? 9));

    const latency = buildLatencySummary(results);
    const byCategory = buildCategoryBreakdown(results);

    const problems = results
      .filter((r) => r.health !== 'online')
      .map((r) => ({
        id: r.id,
        name: r.name,
        domain: r.domain,
        health: r.health,
        statusCode: r.statusCode,
        ms: r.ms,
        error: r.error,
      }));

    const summary = {
      total: results.length,
      online: results.filter((r) => r.health === 'online').length,
      degraded: results.filter((r) => r.health === 'degraded').length,
      offline: results.filter((r) => r.health === 'offline').length,
      adsenseApproved: results.filter((r) => r.adsense === 'approved').length,
      adsensePending: results.filter((r) => r.adsense === 'pending').length,
      adsenseNone: results.filter((r) => r.adsense === 'none').length,
      avgMs: latency.avgMs,
      maxMs: latency.maxMs,
      minMs: latency.minMs,
      slowest: latency.slowest,
      byCategory,
      problemCount:
        results.filter((r) => r.health === 'offline').length +
        results.filter((r) => r.health === 'degraded').length,
    };

    res.status(200).json({
      ok: true,
      checkedAt: new Date().toISOString(),
      summary,
      problems,
      sites: results,
    });
  } catch (err) {
    console.error('[api/health] Error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
