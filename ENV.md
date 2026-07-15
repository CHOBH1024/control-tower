# Control Tower — 환경변수 설정

수익·트래픽 실데이터를 보려면 Vercel 프로젝트 `anti-control-tower`에 아래를 추가하세요.

## 필수

| 변수 | 설명 |
|------|------|
| `GOOGLE_SA_JSON` | Google Cloud Service Account JSON **전체** 또는 **base64** |

### Service Account 권한

1. [Google Cloud Console](https://console.cloud.google.com/) → IAM → 서비스 계정 생성
2. 역할: 최소한 없음(키만 사용) 가능 — API 쪽 권한은 각 제품에서 부여
3. JSON 키 다운로드 후:
   ```bash
   # base64 권장 (개행 이슈 방지)
   base64 -w0 service-account.json
   ```
4. Vercel → Project → Settings → Environment Variables → `GOOGLE_SA_JSON`

### 제품별 연결

| API | 추가 작업 |
|-----|----------|
| **GA4** | GA4 속성 → 관리 → 속성 액세스 → 서비스 계정 이메일을 **뷰어**로 추가 |
| **AdSense** | AdSense API 사용 설정 + SA에 AdSense 계정 액세스 (또는 OAuth 대안) |
| **GSC** | Search Console → 설정 → 사용자 및 권한 → SA 이메일을 **전체** 권한 추가 |

## 선택

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `ADSENSE_PUBLISHER_ID` | `ca-pub-9992037844935954` | AdSense 게시자 ID |
| `GA4_DEFAULT_PROPERTY` | `properties/462745473` | 기본 GA4 속성 |
| `GA4_PROPERTY_MAP` | (전체 사이트 → DEFAULT) | JSON `{"mz-radar":"properties/XXX",...}` |
| `GSC_SITE_URLS` | `lib/sites` 중 gsc 사이트 | JSON `["https://mz-radar.vercel.app/",...]` |
| `CRON_SECRET` | (없음) | `/api/alert` 크론 인증 |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | — | 다운 알림 |
| `SLACK_WEBHOOK_URL` | — | 다운 알림 |

## CLI 예시

```bash
cd control-tower
vercel env add GOOGLE_SA_JSON production
# 붙여넣기 후 엔터
vercel --prod
```

## 확인

```
GET https://anti-control-tower.vercel.app/api/metrics
```

- `configured: false` → 환경변수 미설정
- `configured: true` + `services.*.ok` → 연동 성공
