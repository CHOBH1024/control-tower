// api/gsc.js — Google Search Console API
// 환경변수: GOOGLE_SA_JSON, GSC_SITE_URLS (optional JSON array)

const { SITES } = require('../lib/sites');
const {
  isConfigured,
  parseCredentials,
  setCors,
  notConfigured,
} = require('../lib/google-auth');

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function defaultSiteUrls() {
  return SITES.filter((s) => s.gsc !== false).map(
    (s) => `https://${s.domain}/`
  );
}

function urlToSiteId(siteUrl) {
  try {
    const host = new URL(siteUrl).hostname;
    const hit = SITES.find((s) => s.domain === host);
    return hit ? hit.id : host;
  } catch {
    return siteUrl;
  }
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=600');

  if (!isConfigured()) return notConfigured(res, 'gsc');

  try {
    const { google } = require('googleapis');
    const credentials = parseCredentials();
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const siteUrls = process.env.GSC_SITE_URLS
      ? JSON.parse(process.env.GSC_SITE_URLS)
      : defaultSiteUrls();

    const sc = google.searchconsole({ version: 'v1', auth });

    const now = new Date();
    const endDate = formatDate(new Date(now.getTime() - 3 * 86400000));
    const startDate = formatDate(new Date(now.getTime() - 33 * 86400000));

    const results = await Promise.all(
      siteUrls.map(async (siteUrl) => {
        const siteId = urlToSiteId(siteUrl);
        try {
          const resp = await sc.searchanalytics.query({
            siteUrl,
            requestBody: {
              startDate,
              endDate,
              dimensions: [],
              rowLimit: 1,
            },
          });
          const row = resp.data.rows?.[0];
          return {
            siteUrl,
            siteId,
            clicks: row?.clicks || 0,
            impressions: row?.impressions || 0,
            ctr: row?.ctr || 0,
            position: row?.position || 0,
          };
        } catch (e) {
          return {
            siteUrl,
            siteId,
            clicks: 0,
            impressions: 0,
            ctr: 0,
            position: 0,
            error: e.message,
          };
        }
      })
    );

    const byId = {};
    for (const r of results) byId[r.siteId] = r;

    const totalClicks = results.reduce((s, r) => s + r.clicks, 0);
    const totalImpressions = results.reduce((s, r) => s + r.impressions, 0);
    const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const withPos = results.filter((r) => r.position > 0);
    const avgPosition =
      withPos.length > 0
        ? withPos.reduce((s, r) => s + r.position, 0) / withPos.length
        : 0;

    res.status(200).json({
      ok: true,
      configured: true,
      updatedAt: new Date().toISOString(),
      range: { startDate, endDate },
      sites: results,
      byId,
      total: {
        clicks: totalClicks,
        impressions: totalImpressions,
        avgCtr,
        avgPosition,
      },
    });
  } catch (err) {
    console.error('[api/gsc]', err);
    res.status(err.code === 'NOT_CONFIGURED' ? 200 : 500).json({
      ok: false,
      configured: err.code !== 'NOT_CONFIGURED',
      error: err.message,
    });
  }
};
