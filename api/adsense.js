// api/adsense.js — Google AdSense Management API v1.4
// Vercel Serverless Function
// 환경변수: GOOGLE_SA_JSON (Service Account JSON, base64)
//           ADSENSE_PUBLISHER_ID (예: ca-pub-9992037844935954)

const { google } = require('googleapis');

function getOAuthClient() {
  const saJson = process.env.GOOGLE_SA_JSON;
  if (!saJson) throw new Error('GOOGLE_SA_JSON 환경변수가 없습니다.');
  const credentials = JSON.parse(
    Buffer.from(saJson, 'base64').toString('utf-8')
  );
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/adsense.readonly'],
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
    const publisherId = process.env.ADSENSE_PUBLISHER_ID || 'ca-pub-9992037844935954';
    const auth = getOAuthClient();
    const adsense = google.adsense({ version: 'v2', auth });

    const now = new Date();
    const todayStr = formatDate(now);
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 이번달 수익
    const [monthReport, todayReport, lastMonthReport] = await Promise.all([
      adsense.accounts.reports.generate({
        account: `accounts/${publisherId.replace('ca-pub-', 'pub-')}`,
        'dateRange.startDate.year': firstOfMonth.getFullYear(),
        'dateRange.startDate.month': firstOfMonth.getMonth() + 1,
        'dateRange.startDate.day': firstOfMonth.getDate(),
        'dateRange.endDate.year': now.getFullYear(),
        'dateRange.endDate.month': now.getMonth() + 1,
        'dateRange.endDate.day': now.getDate(),
        metrics: ['ESTIMATED_EARNINGS', 'PAGE_VIEWS', 'CLICKS', 'IMPRESSIONS'],
      }).catch(e => ({ data: { totals: { cells: [{value:'0'},{value:'0'},{value:'0'},{value:'0'}] } }, error: e.message })),

      adsense.accounts.reports.generate({
        account: `accounts/${publisherId.replace('ca-pub-', 'pub-')}`,
        'dateRange.startDate.year': now.getFullYear(),
        'dateRange.startDate.month': now.getMonth() + 1,
        'dateRange.startDate.day': now.getDate(),
        'dateRange.endDate.year': now.getFullYear(),
        'dateRange.endDate.month': now.getMonth() + 1,
        'dateRange.endDate.day': now.getDate(),
        metrics: ['ESTIMATED_EARNINGS', 'PAGE_VIEWS', 'CLICKS'],
      }).catch(e => ({ data: { totals: { cells: [{value:'0'},{value:'0'},{value:'0'}] } }, error: e.message })),

      adsense.accounts.reports.generate({
        account: `accounts/${publisherId.replace('ca-pub-', 'pub-')}`,
        'dateRange.startDate.year': firstOfLastMonth.getFullYear(),
        'dateRange.startDate.month': firstOfLastMonth.getMonth() + 1,
        'dateRange.startDate.day': firstOfLastMonth.getDate(),
        'dateRange.endDate.year': lastOfLastMonth.getFullYear(),
        'dateRange.endDate.month': lastOfLastMonth.getMonth() + 1,
        'dateRange.endDate.day': lastOfLastMonth.getDate(),
        metrics: ['ESTIMATED_EARNINGS'],
      }).catch(e => ({ data: { totals: { cells: [{value:'0'}] } }, error: e.message })),
    ]);

    const getCells = (report) => report?.data?.totals?.cells || [];

    const monthCells    = getCells(monthReport);
    const todayCells    = getCells(todayReport);
    const lastMonCells  = getCells(lastMonthReport);

    const result = {
      ok: true,
      updatedAt: new Date().toISOString(),
      today: {
        earnings:    parseFloat(todayCells[0]?.value || '0'),
        pageViews:   parseInt(todayCells[1]?.value || '0', 10),
        clicks:      parseInt(todayCells[2]?.value || '0', 10),
      },
      thisMonth: {
        earnings:    parseFloat(monthCells[0]?.value || '0'),
        pageViews:   parseInt(monthCells[1]?.value || '0', 10),
        clicks:      parseInt(monthCells[2]?.value || '0', 10),
        impressions: parseInt(monthCells[3]?.value || '0', 10),
      },
      lastMonth: {
        earnings:    parseFloat(lastMonCells[0]?.value || '0'),
      },
    };

    res.status(200).json(result);
  } catch (err) {
    console.error('[api/adsense] Error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
