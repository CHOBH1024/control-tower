/**
 * Google Service Account 인증 헬퍼
 * 환경변수 GOOGLE_SA_JSON: Service Account JSON 전체 문자열 또는 base64
 */

function isConfigured() {
  return Boolean(process.env.GOOGLE_SA_JSON && process.env.GOOGLE_SA_JSON.trim());
}

function parseCredentials() {
  const raw = process.env.GOOGLE_SA_JSON;
  if (!raw || !raw.trim()) {
    const err = new Error('GOOGLE_SA_JSON 환경변수가 없습니다.');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }

  let text = raw.trim();
  // base64 인코딩된 경우 디코드
  if (!text.startsWith('{')) {
    try {
      text = Buffer.from(text, 'base64').toString('utf-8');
    } catch {
      // raw JSON 문자열로 재시도
    }
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    const err = new Error('GOOGLE_SA_JSON 파싱 실패: ' + e.message);
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function notConfigured(res, service) {
  res.setHeader('Cache-Control', 's-maxage=60');
  return res.status(200).json({
    ok: false,
    configured: false,
    service,
    error: 'GOOGLE_SA_JSON 미설정 — Vercel 환경변수에 Service Account를 추가하세요.',
    updatedAt: new Date().toISOString(),
  });
}

module.exports = {
  isConfigured,
  parseCredentials,
  setCors,
  notConfigured,
};
