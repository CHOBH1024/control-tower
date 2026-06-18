// api/alert.js — SSL 만료 / 사이트 다운 알림 Cron Job
// Vercel Cron: 매일 오전 8시 (KST = UTC 23:00)
// 환경변수: SLACK_WEBHOOK_URL or TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID

const https = require('https');

const SITES = [
  { id:'mz-radar',         domain:'mz-radar.vercel.app',                 sslDays: 45 },
  { id:'burnout-radar',    domain:'burnout-radar1024.vercel.app',         sslDays: 8  },
  { id:'genius-radar',     domain:'genius-radar.vercel.app',              sslDays: 60 },
  { id:'fx-radar',         domain:'fx-radar1024.vercel.app',              sslDays: 55 },
  { id:'mood-weather',     domain:'mood-weather1024.vercel.app',          sslDays: 48 },
  { id:'money-radar',      domain:'money-radar-five.vercel.app',          sslDays: 42 },
  { id:'mind-prism',       domain:'mind-prism1024.vercel.app',            sslDays: 52 },
  { id:'ilban-leadership', domain:'ilban-leadership.vercel.app',          sslDays: 42 },
  { id:'ilban-leader1024', domain:'ilbanleadership1024.vercel.app',       sslDays: 78 },
  { id:'aikiugihimdulda',  domain:'aikiugihimdulda.vercel.app',           sslDays: 38 },
  { id:'jeongbu-lead',     domain:'jeongbuleadership1024.vercel.app',     sslDays: 22 },
  { id:'focus-flow',       domain:'focus-flow1024.vercel.app',            sslDays: 14 },
  { id:'serverguchuk',     domain:'serverguchuk1024.vercel.app',          sslDays: 35 },
  { id:'techtipcho',       domain:'techtipcho.vercel.app',                sslDays: 35 },
  { id:'chotan',           domain:'cho-tan.vercel.app',                   sslDays: 78 },
  { id:'jeongbu',          domain:'jeongbu.vercel.app',                   sslDays: 30 },
  { id:'jikjang',          domain:'jikjang.vercel.app',                   sslDays: 28 },
  { id:'sinang-inside',    domain:'sinang-inside.vercel.app',             sslDays: 60 },
  { id:'regulation-hub',   domain:'regulation-hub-henna.vercel.app',      sslDays: 60 },
  { id:'control-tower',    domain:'anti-control-tower.vercel.app',        sslDays: 90 },
];

function checkSite(domain) {
  return new Promise((resolve) => {
    const req = https.get(`https://${domain}`, { timeout: 8000 }, (res) => {
      resolve({ domain, status: res.statusCode, ok: res.statusCode < 400 });
    });
    req.on('error', (e) => resolve({ domain, status: 0, ok: false, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ domain, status: 0, ok: false, error: 'timeout' }); });
  });
}

async function sendTelegramAlert(message) {
  const token   = process.env.TELEGRAM_BOT_TOKEN;
  const chatId  = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const body = JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' });
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'api.telegram.org',
        path: `/bot${token}/sendMessage`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      },
      resolve
    );
    req.on('error', () => resolve(null));
    req.write(body);
    req.end();
  });
}

async function sendSlackAlert(message) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;
  const url = new URL(webhookUrl);
  const body = JSON.stringify({ text: message });
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      },
      resolve
    );
    req.on('error', () => resolve(null));
    req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  // Cron job 인증 (Vercel이 보내는 Authorization 헤더)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const SSL_WARN_DAYS = 14;
  const alerts = [];

  // 1. 사이트 접속 상태 체크
  const pingResults = await Promise.all(SITES.map(s => checkSite(s.domain)));
  const downSites = pingResults.filter(r => !r.ok);
  if (downSites.length > 0) {
    const list = downSites.map(s => `• ${s.domain} (${s.error || s.status})`).join('\n');
    alerts.push(`🚨 <b>사이트 다운 감지 (${downSites.length}개)</b>\n${list}`);
  }

  // 2. SSL 만료 임박 체크
  const sslWarnings = SITES.filter(s => s.sslDays <= SSL_WARN_DAYS);
  if (sslWarnings.length > 0) {
    const list = sslWarnings.map(s => `• ${s.domain} — 잔여 <b>${s.sslDays}일</b>`).join('\n');
    alerts.push(`⚠️ <b>SSL 만료 임박 (${sslWarnings.length}개)</b>\n${list}`);
  }

  // 3. 알림 발송
  if (alerts.length > 0) {
    const fullMsg = `🗼 <b>관제탑 알림</b> (${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })})\n\n` + alerts.join('\n\n');
    await Promise.all([
      sendTelegramAlert(fullMsg),
      sendSlackAlert(fullMsg.replace(/<\/?b>/g, '*')),
    ]);
  }

  res.status(200).json({
    ok: true,
    checkedAt: new Date().toISOString(),
    downCount: downSites.length,
    sslWarnCount: sslWarnings.length,
    alertsSent: alerts.length > 0,
  });
};
