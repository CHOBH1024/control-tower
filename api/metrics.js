// api/metrics.js — GA4 + AdSense + GSC 통합 응답

const { setCors, isConfigured } = require('../lib/google-auth');

function captureHandler(handler) {
  return new Promise((resolve) => {
    const fakeRes = {
      _status: 200,
      _body: null,
      setHeader() {},
      status(code) {
        this._status = code;
        return this;
      },
      json(body) {
        this._body = body;
        resolve({ status: this._status, body });
      },
      end() {
        resolve({ status: this._status, body: this._body });
      },
    };
    Promise.resolve(handler({ method: 'GET', headers: {} }, fakeRes)).catch(
      (err) => {
        resolve({
          status: 500,
          body: { ok: false, configured: false, error: err.message },
        });
      }
    );
  });
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=300');

  // 미설정이면 무거운 google 라이브러리 로드 없이 즉시 응답
  if (!isConfigured()) {
    return res.status(200).json({
      ok: true,
      configured: false,
      updatedAt: new Date().toISOString(),
      services: {
        ga4: {
          ok: false,
          configured: false,
          error: 'GOOGLE_SA_JSON 미설정',
        },
        adsense: {
          ok: false,
          configured: false,
          error: 'GOOGLE_SA_JSON 미설정',
        },
        gsc: {
          ok: false,
          configured: false,
          error: 'GOOGLE_SA_JSON 미설정',
        },
      },
      ga4: null,
      adsense: null,
      gsc: null,
    });
  }

  const ga4 = require('./ga4');
  const adsense = require('./adsense');
  const gsc = require('./gsc');

  const [ga4Res, adsenseRes, gscRes] = await Promise.all([
    captureHandler(ga4),
    captureHandler(adsense),
    captureHandler(gsc),
  ]);

  const ga4Body = ga4Res.body || {};
  const adsenseBody = adsenseRes.body || {};
  const gscBody = gscRes.body || {};

  res.status(200).json({
    ok: true,
    configured: true,
    updatedAt: new Date().toISOString(),
    services: {
      ga4: {
        ok: Boolean(ga4Body.ok),
        configured: Boolean(ga4Body.configured),
        error: ga4Body.error || null,
      },
      adsense: {
        ok: Boolean(adsenseBody.ok),
        configured: Boolean(adsenseBody.configured),
        error: adsenseBody.error || null,
      },
      gsc: {
        ok: Boolean(gscBody.ok),
        configured: Boolean(gscBody.configured),
        error: gscBody.error || null,
      },
    },
    ga4: ga4Body.ok
      ? {
          total: ga4Body.total,
          sites: ga4Body.sites,
          range: ga4Body.range,
          updatedAt: ga4Body.updatedAt,
        }
      : null,
    adsense: adsenseBody.ok
      ? {
          today: adsenseBody.today,
          thisMonth: adsenseBody.thisMonth,
          lastMonth: adsenseBody.lastMonth,
          publisherId: adsenseBody.publisherId,
          updatedAt: adsenseBody.updatedAt,
          warnings: adsenseBody.warnings,
        }
      : null,
    gsc: gscBody.ok
      ? {
          total: gscBody.total,
          byId: gscBody.byId,
          range: gscBody.range,
          updatedAt: gscBody.updatedAt,
        }
      : null,
  });
};
