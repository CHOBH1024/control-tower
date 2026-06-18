// api/ga4.js — Google Analytics 4 Data API v1
// Vercel Serverless Function
// 환경변수: GOOGLE_SA_JSON (Service Account JSON, base64 인코딩)
//           GA4_PROPERTY_MAP (JSON: { "siteId": "properties/XXXXXXX" })

const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const SITE_PROPERTY_MAP = {
  'mz-radar':         'properties/462745473',
  'burnout-radar':    'properties/462745473', // 같은 GA 속성 공유 시 예시
  'genius-radar':     'properties/462745473',
  'fx-radar':         'properties/462745473',
  'mood-weather':     'properties/462745473',
  'money-radar':      'properties/462745473',
  'mind-prism':       'properties/462745473',
  'ilban-leadership': 'properties/462745473',
  'ilban-leader1024': 'properties/462745473',
  'aikiugihimdulda':  'properties/462745473',
  'jeongbu-lead':     'properties/462745473',
  'focus-flow':       'properties/462745473',
  'serverguchuk':     'properties/462745473',
  'techtipcho':       'properties/462745473',
  'chotan':           'properties/462745473',
  'jeongbu':          'properties/462745473',
  'jikjang':          'properties/462745473',
  'sinang-inside':    'properties/462745473',
  'regulation-hub':   'properties/462745473',
  'control-tower':    'properties/462745473',
};

function getAnalyticsClient() {
  const saJson = process.env.GOOGLE_SA_JSON;
  if (!saJson) throw new Error('GOOGLE_SA_JSON 환경변수가 없습니다.');
  const credentials = JSON.parse(
    Buffer.from(saJson, 'base64').toString('utf-8')
  );
  return new BetaAnalyticsDataClient({ credentials });
}

async function fetchPropertyMetrics(client, propertyId, dateRange = '30daysAgo') {
  const [response] = await client.runReport({
    property: propertyId,
    dateRanges: [{ startDate: dateRange, endDate: 'today' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
    ],
    dimensions: [{ name: 'date' }],
  });

  let uv = 0, pv = 0, sessions = 0;
  (response.rows || []).forEach(row => {
    uv       += parseInt(row.metricValues[0].value || '0', 10);
    sessions += parseInt(row.metricValues[1].value || '0', 10);
    pv       += parseInt(row.metricValues[2].value || '0', 10);
  });

  return { uv, sessions, pv };
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // 캐시: 1시간 (CDN 레이어에서 캐싱)
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');

  try {
    // 환경변수에서 property map 오버라이드 가능
    const propertyMapEnv = process.env.GA4_PROPERTY_MAP;
    const propertyMap = propertyMapEnv
      ? JSON.parse(propertyMapEnv)
      : SITE_PROPERTY_MAP;

    const client = getAnalyticsClient();

    // 사이트별 GA4 property ID가 다를 경우 개별 쿼리, 같을 경우 하나만 호출
    const uniqueProperties = [...new Set(Object.values(propertyMap))];
    
    const propertyResults = {};
    await Promise.all(
      uniqueProperties.map(async (propId) => {
        try {
          propertyResults[propId] = await fetchPropertyMetrics(client, propId);
        } catch (e) {
          propertyResults[propId] = { uv: 0, pv: 0, sessions: 0, error: e.message };
        }
      })
    );

    // 사이트별 결과 조합
    const siteData = {};
    for (const [siteId, propId] of Object.entries(propertyMap)) {
      siteData[siteId] = propertyResults[propId] || { uv: 0, pv: 0, sessions: 0 };
    }

    const totalUV = Object.values(siteData).reduce((s, d) => s + (d.uv || 0), 0);
    const totalPV = Object.values(siteData).reduce((s, d) => s + (d.pv || 0), 0);

    res.status(200).json({
      ok: true,
      updatedAt: new Date().toISOString(),
      sites: siteData,
      total: { uv: totalUV, pv: totalPV },
    });
  } catch (err) {
    console.error('[api/ga4] Error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
