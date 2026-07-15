// api/alert.js — 사이트 다운 알림 Cron Job
// Vercel Cron: 매일 UTC 23:00 (= KST 08:00)
// 환경변수: CRON_SECRET, TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID 또는 SLACK_WEBHOOK_URL

const https = require('https');
const { SITES } = require('../lib/sites');

const TIMEOUT_MS = 8000;

function checkSite(domain) {
  return new Promise((resolve) => {
    const req = https.get(
      `https://${domain}`,
      {
        timeout: TIMEOUT_MS,
        headers: { 'User-Agent': 'AntiControlTower/1.0 (alert-cron)' },
      },
      (res) => {
        res.resume();
        resolve({
          domain,
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 400,
        });
      }
    );
    req.on('error', (e) =>
      resolve({ domain, status: 0, ok: false, error: e.message })
    );
    req.on('timeout', () => {
      req.destroy();
      resolve({ domain, status: 0, ok: false, error: 'timeout' });
    });
  });
}

async function sendTelegramAlert(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const body = JSON.stringify({
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML',
  });
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'api.telegram.org',
        path: `/bot${token}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
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
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      resolve
    );
    req.on('error', () => resolve(null));
    req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  // Cron 인증 — 로컬 테스트 시 CRON_SECRET 없으면 스킵
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${secret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const alerts = [];

  // 1. 사이트 접속 상태 체크
  const pingResults = await Promise.all(SITES.map((s) => checkSite(s.domain)));
  const downSites = pingResults.filter((r) => !r.ok);

  if (downSites.length > 0) {
    const list = downSites
      .map((s) => {
        const meta = SITES.find((x) => x.domain === s.domain);
        const label = meta ? `${meta.name} (${s.domain})` : s.domain;
        return `• ${label} — ${s.error || s.status}`;
      })
      .join('\n');
    alerts.push(
      `🚨 <b>사이트 다운/이상 감지 (${downSites.length}개)</b>\n${list}`
    );
  }

  // 2. 알림 발송
  if (alerts.length > 0) {
    const fullMsg =
      `🗼 <b>관제탑 알림</b> (${new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
      })})\n\n` + alerts.join('\n\n');
    await Promise.all([
      sendTelegramAlert(fullMsg),
      sendSlackAlert(fullMsg.replace(/<\/?b>/g, '*')),
    ]);
  }

  res.status(200).json({
    ok: true,
    checkedAt: new Date().toISOString(),
    total: SITES.length,
    downCount: downSites.length,
    down: downSites,
    alertsSent: alerts.length > 0,
  });
};
