// api/ga4.js — Google Analytics 4 Data API
// 환경변수: GOOGLE_SA_JSON, GA4_PROPERTY_MAP (optional JSON)

const { SITES } = require('../lib/sites');
const {
  isConfigured,
  parseCredentials,
  setCors,
  notConfigured,
} = require('../lib/google-auth');

const DEFAULT_PROPERTY = process.env.GA4_DEFAULT_PROPERTY || 'properties/462745473';

function buildDefaultMap() {
  const map = {};
  for (const s of SITES) map[s.id] = DEFAULT_PROPERTY;
  return map;
}

async function fetchPropertyMetrics(client, propertyId, startDate = '30daysAgo') {
  const [response] = await client.runReport({
    property: propertyId,
    dateRanges: [{ startDate, endDate: 'today' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
    ],
    metricAggregations: ['TOTAL'],
  });

  const totals = response.totals?.[0]?.metricValues;
  if (totals && totals.length >= 3) {
    return {
      uv: parseInt(totals[0].value || '0', 10),
      sessions: parseInt(totals[1].value || '0', 10),
      pv: parseInt(totals[2].value || '0', 10),
    };
  }

  const row = response.rows?.[0];
  if (row) {
    return {
      uv: parseInt(row.metricValues[0].value || '0', 10),
      sessions: parseInt(row.metricValues[1].value || '0', 10),
      pv: parseInt(row.metricValues[2].value || '0', 10),
    };
  }
  return { uv: 0, sessions: 0, pv: 0 };
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=600');

  if (!isConfigured()) return notConfigured(res, 'ga4');

  try {
    const { BetaAnalyticsDataClient } = require('@google-analytics/data');
    const credentials = parseCredentials();
    const client = new BetaAnalyticsDataClient({ credentials });

    const propertyMap = process.env.GA4_PROPERTY_MAP
      ? JSON.parse(process.env.GA4_PROPERTY_MAP)
      : buildDefaultMap();

    const uniqueProperties = [
      ...new Set(Object.values(propertyMap).filter(Boolean)),
    ];

    const propertyResults = {};
    await Promise.all(
      uniqueProperties.map(async (propId) => {
        try {
          propertyResults[propId] = await fetchPropertyMetrics(client, propId);
        } catch (e) {
          propertyResults[propId] = {
            uv: 0,
            pv: 0,
            sessions: 0,
            error: e.message,
          };
        }
      })
    );

    const siteData = {};
    for (const [siteId, propId] of Object.entries(propertyMap)) {
      siteData[siteId] = {
        ...(propertyResults[propId] || { uv: 0, pv: 0, sessions: 0 }),
        propertyId: propId,
      };
    }
    for (const s of SITES) {
      if (!siteData[s.id]) {
        siteData[s.id] = { uv: 0, pv: 0, sessions: 0, missing: true };
      }
    }

    const totalUV = Object.values(siteData).reduce((a, d) => a + (d.uv || 0), 0);
    const totalPV = Object.values(siteData).reduce((a, d) => a + (d.pv || 0), 0);
    const totalSessions = Object.values(siteData).reduce(
      (a, d) => a + (d.sessions || 0),
      0
    );

    res.status(200).json({
      ok: true,
      configured: true,
      updatedAt: new Date().toISOString(),
      range: '30days',
      sites: siteData,
      total: { uv: totalUV, pv: totalPV, sessions: totalSessions },
    });
  } catch (err) {
    console.error('[api/ga4]', err);
    res.status(err.code === 'NOT_CONFIGURED' ? 200 : 500).json({
      ok: false,
      configured: err.code !== 'NOT_CONFIGURED',
      error: err.message,
    });
  }
};
