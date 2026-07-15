// api/adsense.js — Google AdSense Management API v2
// 환경변수: GOOGLE_SA_JSON, ADSENSE_PUBLISHER_ID (기본 ca-pub-9992037844935954)

const {
  isConfigured,
  parseCredentials,
  setCors,
  notConfigured,
} = require('../lib/google-auth');

function accountName(publisherId) {
  const id = publisherId.replace(/^ca-/, '');
  return `accounts/${id}`;
}

function emptyTotals(n) {
  return {
    data: {
      totals: {
        cells: Array.from({ length: n }, () => ({ value: '0' })),
      },
    },
  };
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=600');

  if (!isConfigured()) return notConfigured(res, 'adsense');

  try {
    // googleapis 는 무거움 — 인증 설정된 경우에만 로드
    const { google } = require('googleapis');
    const credentials = parseCredentials();
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/adsense.readonly'],
    });

    const publisherId =
      process.env.ADSENSE_PUBLISHER_ID || 'ca-pub-9992037844935954';
    const adsense = google.adsense({ version: 'v2', auth });
    const account = accountName(publisherId);

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [monthReport, todayReport, lastMonthReport] = await Promise.all([
      adsense.accounts.reports
        .generate({
          account,
          'dateRange.startDate.year': firstOfMonth.getFullYear(),
          'dateRange.startDate.month': firstOfMonth.getMonth() + 1,
          'dateRange.startDate.day': firstOfMonth.getDate(),
          'dateRange.endDate.year': now.getFullYear(),
          'dateRange.endDate.month': now.getMonth() + 1,
          'dateRange.endDate.day': now.getDate(),
          metrics: [
            'ESTIMATED_EARNINGS',
            'PAGE_VIEWS',
            'CLICKS',
            'IMPRESSIONS',
          ],
        })
        .catch((e) => ({ ...emptyTotals(4), error: e.message })),

      adsense.accounts.reports
        .generate({
          account,
          'dateRange.startDate.year': now.getFullYear(),
          'dateRange.startDate.month': now.getMonth() + 1,
          'dateRange.startDate.day': now.getDate(),
          'dateRange.endDate.year': now.getFullYear(),
          'dateRange.endDate.month': now.getMonth() + 1,
          'dateRange.endDate.day': now.getDate(),
          metrics: ['ESTIMATED_EARNINGS', 'PAGE_VIEWS', 'CLICKS'],
        })
        .catch((e) => ({ ...emptyTotals(3), error: e.message })),

      adsense.accounts.reports
        .generate({
          account,
          'dateRange.startDate.year': firstOfLastMonth.getFullYear(),
          'dateRange.startDate.month': firstOfLastMonth.getMonth() + 1,
          'dateRange.startDate.day': firstOfLastMonth.getDate(),
          'dateRange.endDate.year': lastOfLastMonth.getFullYear(),
          'dateRange.endDate.month': lastOfLastMonth.getMonth() + 1,
          'dateRange.endDate.day': lastOfLastMonth.getDate(),
          metrics: ['ESTIMATED_EARNINGS'],
        })
        .catch((e) => ({ ...emptyTotals(1), error: e.message })),
    ]);

    const getCells = (report) => report?.data?.totals?.cells || [];
    const monthCells = getCells(monthReport);
    const todayCells = getCells(todayReport);
    const lastMonCells = getCells(lastMonthReport);

    const apiErrors = [monthReport, todayReport, lastMonthReport]
      .map((r) => r.error)
      .filter(Boolean);

    res.status(200).json({
      ok: true,
      configured: true,
      updatedAt: new Date().toISOString(),
      publisherId,
      today: {
        earnings: parseFloat(todayCells[0]?.value || '0'),
        pageViews: parseInt(todayCells[1]?.value || '0', 10),
        clicks: parseInt(todayCells[2]?.value || '0', 10),
      },
      thisMonth: {
        earnings: parseFloat(monthCells[0]?.value || '0'),
        pageViews: parseInt(monthCells[1]?.value || '0', 10),
        clicks: parseInt(monthCells[2]?.value || '0', 10),
        impressions: parseInt(monthCells[3]?.value || '0', 10),
      },
      lastMonth: {
        earnings: parseFloat(lastMonCells[0]?.value || '0'),
      },
      warnings: apiErrors.length ? apiErrors : undefined,
    });
  } catch (err) {
    console.error('[api/adsense]', err);
    res.status(err.code === 'NOT_CONFIGURED' ? 200 : 500).json({
      ok: false,
      configured: err.code !== 'NOT_CONFIGURED',
      error: err.message,
    });
  }
};
