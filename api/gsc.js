// api/gsc.js — Google Search Console API v3
// Vercel Serverless Function
// 환경변수: GOOGLE_SA_JSON (Service Account JSON, base64)
//           GSC_SITE_URLS (JSON array: ["https://mz-radar.vercel.app/", ...])

const { google } = require('googleapis');

const DEFAULT_SITE_URLS = [
  'https://mz-radar.vercel.app/',
  'https://burnout-radar1024.vercel.app/',
  'https://genius-radar.vercel.app/',
  'https://fx-radar1024.vercel.app/',
  'https://mood-weather1024.vercel.app/',
  'https://money-radar-five.vercel.app/',
  'https://mind-prism1024.vercel.app/',
  'https://ilban-leadership.vercel.app/',
  'https://ilbanleadership1024.vercel.app/',
  'https://aikiugihimdulda.vercel.app/',
  'https://jeongbuleadership1024.vercel.app/',
  'https://focus-flow1024.vercel.app/',
  'https://serverguchuk1024.vercel.app/',
  'https://techtipcho.vercel.app/',
  'https://cho-tan.vercel.app/',
  'https://jeongbu.vercel.app/',
  'https://jikjang.vercel.app/',
  'https://sinang-inside.vercel.app/',
  'https://regulation-hub-henna.vercel.app/',
];

// 사이트 URL → SITES 배열 id 매핑
const URL_TO_SITE_ID = {
  'https://mz-radar.vercel.app/':                   'mz-radar',
  'https://burnout-radar1024.vercel.app/':           'burnout-radar',
  'https://genius-radar.vercel.app/':                'genius-radar',
  'https://fx-radar1024.vercel.app/':                'fx-radar',
  'https://mood-weather1024.vercel.app/':            'mood-weather',
  'https://money-radar-five.vercel.app/':            'money-radar',
  'https://mind-prism1024.vercel.app/':              'mind-prism',
  'https://ilban-leadership.vercel.app/':            'ilban-leadership',
  'https://ilbanleadership1024.vercel.app/':         'ilban-leader1024',
  'https://aikiugihimdulda.vercel.app/':             'aikiugihimdulda',
  'https://jeongbuleadership1024.vercel.app/':       'jeongbu-lead',
  'https://focus-flow1024.vercel.app/':              'focus-flow',
  'https://serverguchuk1024.vercel.app/':            'serverguchuk',
  'https://techtipcho.vercel.app/':                  'techtipcho',
  'https://cho-tan.vercel.app/':                     'chotan',
  'https://jeongbu.vercel.app/':                     'jeongbu',
  'https://jikjang.vercel.app/':                     'jikjang',
  'https://sinang-inside.vercel.app/':               'sinang-inside',
  'https://regulation-hub-henna.vercel.app/':        'regulation-hub',
};

function getAuth() {
  const saJson = process.env.GOOGLE_SA_JSON;
  if (!saJson) throw new Error('GOOGLE_SA_JSON 환경변수가 없습니다.');
  const credentials = JSON.parse(
    Buffer.from(saJson, 'base64').toString('utf-8')
  );
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
}

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');

  try {
    const siteUrls = process.env.GSC_SITE_URLS
      ? JSON.parse(process.env.GSC_SITE_URLS)
      : DEFAULT_SITE_URLS;

    const auth = getAuth();
    const sc = google.searchconsole({ version: 'v1', auth });

    const now = new Date();
    const endDate = formatDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)); // 3일 전 (GSC 지연)
    const startDate = formatDate(new Date(now.getTime() - 33 * 24 * 60 * 60 * 1000)); // 33일 전

    const results = await Promise.all(
      siteUrls.map(async (siteUrl) => {
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
            siteId: URL_TO_SITE_ID[siteUrl] || siteUrl,
            clicks:      row?.clicks      || 0,
            impressions: row?.impressions  || 0,
            ctr:         row?.ctr          || 0,
            position:    row?.position     || 0,
          };
        } catch (e) {
          return {
            siteUrl,
            siteId: URL_TO_SITE_ID[siteUrl] || siteUrl,
            clicks: 0, impressions: 0, ctr: 0, position: 0,
            error: e.message,
          };
        }
      })
    );

    const totalClicks      = results.reduce((s, r) => s + r.clicks, 0);
    const totalImpressions = results.reduce((s, r) => s + r.impressions, 0);
    const avgCtr           = totalImpressions > 0 ? totalClicks / totalImpressions : 0;

    res.status(200).json({
      ok: true,
      updatedAt: new Date().toISOString(),
      sites: results,
      total: {
        clicks: totalClicks,
        impressions: totalImpressions,
        avgCtr: avgCtr,
      },
    });
  } catch (err) {
    console.error('[api/gsc] Error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
