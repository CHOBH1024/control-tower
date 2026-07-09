
    const SITES = [
  { id:"mz-radar",         name:"MZ 레이더",          sub:"MZ 직장인 유형 진단",    status:"running",     adsense:"approved", gsc:true,  seoText:true,  domain:"mz-radar.vercel.app",                 github:"CHOBH1024/mz-radar",            icon:"fa-rocket",             color:"#4f8ef7", visitors:8200, desc:"MZ세대 직장인의 업무 유형과 조직 내 포지셔닝을 에니어그램 기반으로 분석.", perf:[85,90,95,80,95], sslDays:45, domDays:280 },
  { id:"burnout-radar",    name:"번아웃 레이더",        sub:"번아웃 위험도 진단",      status:"running",     adsense:"pending",  gsc:true,  seoText:true,  domain:"burnout-radar.vercel.app",            github:"CHOBH1024/burnout-radar",        icon:"fa-fire-extinguisher",  color:"#fb4570", visitors:4100, desc:"직장인 번아웃의 6가지 영역을 MBI 모델 기반으로 측정하여 스트레스 완화 솔루션 제공.", perf:[75,72,88,70,92], sslDays:90, domDays:140 },
  { id:"genius-radar",     name:"지니어스 레이더",      sub:"천재 유형 진단",          status:"running",     adsense:"approved", gsc:true,  seoText:true,  domain:"genius-radar.vercel.app",              github:"CHOBH1024/genius-radar",         icon:"fa-brain",              color:"#9f6ef6", visitors:7600, desc:"하워드 가드너의 다중지능 이론을 응용한 지능 강점 및 최적 학습법 분석 도구.", perf:[90,85,90,88,96], sslDays:60, domDays:320 },
  { id:"fx-radar",         name:"FX 레이더",           sub:"환율 투자 심리 진단",     status:"running",     adsense:"approved", gsc:true,  seoText:false, domain:"fx-radar1024.vercel.app",              github:"CHOBH1024/fx-radar",             icon:"fa-arrow-trend-up",     color:"#2dd4bf", visitors:6200, desc:"행동경제학 이론을 접목한 외환 거래 투자 편향 분석 및 트레이딩 마인드 컨트롤 가이드.", perf:[88,92,94,85,95], sslDays:55, domDays:310 },
  { id:"mood-weather",     name:"무드 웨더",            sub:"감정 날씨 일기",          status:"running",     adsense:"approved", gsc:true,  seoText:false, domain:"mood-weather1024.vercel.app",          github:"CHOBH1024/mood-weather",         icon:"fa-cloud-sun",          color:"#fbbf24", visitors:4800, desc:"기분 변화를 기상 현상에 빗대어 기록하고 긍정 심리 피드백으로 감정 회복 탄력성을 돕는 다이어리.", perf:[72,78,88,70,92], sslDays:48, domDays:290 },
  { id:"money-radar",      name:"머니 레이더",          sub:"소비 유형 진단",          status:"running",     adsense:"none",     gsc:false, seoText:false, domain:"money-radar-five.vercel.app",          github:"CHOBH1024/money-radar",          icon:"fa-coins",              color:"#22c55e", visitors:3900, desc:"소비 패턴과 재정 심리를 분석하여 맞춤형 금융 행동 가이드를 제공하는 머니 성향 진단 앱.", perf:[75,82,88,72,93], sslDays:42, domDays:260 },
  { id:"mind-prism",       name:"마인드 프리즘",        sub:"심리 유형 분석",          status:"running",     adsense:"pending",  gsc:true,  seoText:true,  domain:"mind-prism1024.vercel.app",            github:"CHOBH1024/MindPrism1024",        icon:"fa-shapes",             color:"#6366f1", visitors:3200, desc:"인지 기능과 자아 지향을 분석하여 16가지 성격 유형의 대인관계 적합성과 정서 훈련 팁 제공.", perf:[65,40,85,50,94], sslDays:52, domDays:160 },
  { id:"ilban-leadership", name:"일반 리더십",          sub:"조직 리더십 진단",        status:"maintenance", adsense:"none",     gsc:false, seoText:false, domain:"ilban-leadership.vercel.app",          github:"CHOBH1024/ilban-leadership-site", icon:"fa-people-group",       color:"#94a3b8", visitors:900,  desc:"비전형·코칭형 등 6가지 리더십 스타일을 측정하여 조직 맞춤 리더십 훈련 가이드 제공.", perf:[30,10,75,25,88], sslDays:42, domDays:120 },
  { id:"ilban-leader1024", name:"일반 리더십1024",      sub:"조직 리더십 (1024)",      status:"running",     adsense:"pending",  gsc:true,  seoText:true,  domain:"ilbanleadership1024.vercel.app",        github:"CHOBH1024/ilban-leadership",     icon:"fa-user-tie",           color:"#0ea5e9", visitors:1100, desc:"리더십 아키타입 진단 사이트 1024 버전. 다차원 리더십 역량 평가 및 강점 피드백 제공.", perf:[45,25,82,35,90], sslDays:78, domDays:340 },
  { id:"aikiugihimdulda",  name:"아이키우기힘들다",      sub:"Mirror Inside Parenting", status:"running",     adsense:"pending",  gsc:true,  seoText:true,  domain:"aikiugihimdulda.vercel.app",           github:"CHOBH1024/aikiugihimdulda",      icon:"fa-baby",               color:"#f472b6", visitors:2100, desc:"육아 스타일을 5가지 차원으로 분석하여 맞춤형 육아 페르소나와 가이드를 제공하는 진단 앱.", perf:[55,30,80,48,91], sslDays:38, domDays:200 },
  { id:"jeongbu-lead",     name:"정부지원 리더십",       sub:"리더십 진단 (정부용)",    status:"maintenance", adsense:"none",     gsc:false, seoText:false, domain:"jeongbuleadership1024.vercel.app",      github:"CHOBH1024/Gajeong",              icon:"fa-building-columns",   color:"#64748b", visitors:1800, desc:"정부 공직자를 위한 리더십 아키타입 진단 사이트.", perf:[40,15,78,30,85], sslDays:22, domDays:95 },
  { id:"focus-flow",       name:"FocusFlow",            sub:"생산성 집중 도구",        status:"running",     adsense:"pending",  gsc:true,  seoText:true,  domain:"focus-flow1024.vercel.app",            github:"CHOBH1024/FocusFlow1024",        icon:"fa-hourglass-half",     color:"#a855f7", visitors:800,  desc:"포모도로 업무 시간 구조화와 딥워크 실천 가이드를 결합한 집중력 향상 웹 앱.", perf:[60,50,85,55,88], sslDays:90, domDays:95 },
  { id:"serverguchuk",     name:"서버구축1024",          sub:"서버 구축 가이드",        status:"running",     adsense:"pending",  gsc:true,  seoText:true,  domain:"serverguchuk1024.vercel.app",          github:"CHOBH1024/serverguchuk1024",     icon:"fa-server",             color:"#22d3ee", visitors:1500, desc:"중소기업 및 개인을 위한 서버 구축 실전 가이드. AWS, GCP 등 클라우드 플랫폼 튜토리얼 제공.", perf:[50,25,82,42,89], sslDays:35, domDays:180 },
  { id:"techtipcho",       name:"테크팁KR",              sub:"AI 기술 레퍼런스",        status:"running",     adsense:"pending",  gsc:true,  seoText:true,  domain:"techtipcho.vercel.app",                github:"CHOBH1024/hyper-automation-tower",icon:"fa-laptop-code",        color:"#f97316", visitors:1400, desc:"ChatGPT, Claude 및 자동화 툴 활용 팁을 정리한 가이드 웹사이트. 실무 생산성 향상 전문.", perf:[50,30,80,40,86], sslDays:35, domDays:115 },
  { id:"chotan",           name:"신앙인사이드 커리어",   sub:"목회자 커리어 코칭",      status:"running",     adsense:"pending",  gsc:true,  seoText:false, domain:"cho-tan.vercel.app",                   github:"CHOBH1024/chotan",               icon:"fa-user-tie",           color:"#e879f9", visitors:1100, desc:"가정연합 내부 목회자를 타겟으로 설계된 역량 종합 분석 플랫폼.", perf:[45,25,82,35,96], sslDays:78, domDays:340 },
  { id:"jeongbu",          name:"정부지원 가이드",        sub:"보조금 정보",             status:"running",     adsense:"pending",  gsc:true,  seoText:true,  domain:"jeongbu.vercel.app",                   github:"CHOBH1024/jeongbu",              icon:"fa-landmark",           color:"#84cc16", visitors:2200, desc:"정부 보조금 및 지원 사업 정보를 큐레이션하고 자격 조건 매칭을 도와주는 정보 플랫폼.", perf:[55,20,82,45,88], sslDays:30, domDays:160 },
  { id:"jikjang",          name:"직장인 가이드",          sub:"직장 생활 정보",          status:"running",     adsense:"pending",  gsc:true,  seoText:false, domain:"jikjang.vercel.app",                   github:"CHOBH1024/jikjang",              icon:"fa-briefcase",          color:"#fb7185", visitors:1800, desc:"직장인을 위한 실무 가이드와 커리어 성장 정보를 제공하는 정보 플랫폼.", perf:[50,20,80,42,87], sslDays:28, domDays:150 },
  { id:"sinang-inside",    name:"신앙인사이드",            sub:"신앙 성향 진단",           status:"running",     adsense:"pending",  gsc:true,  seoText:true,  domain:"sinang-inside.vercel.app",             github:"CHOBH1024/sinang-inside",        icon:"fa-hands-praying",      color:"#4ade80", visitors:500,  desc:"신앙인의 성향과 심정 스펙트럼을 5가지 페르소나로 진단하는 자기성찰 도구.", perf:[70,65,85,72,90], sslDays:60, domDays:365 },
  { id:"regulation-hub",   name:"규정 허브",             sub:"규정 문서 통합 관리",     status:"running",     adsense:"none",     gsc:false, seoText:false, domain:"regulation-hub-henna.vercel.app",      github:"CHOBH1024/regulation-hub",       icon:"fa-scale-balanced",     color:"#475569", visitors:300,  desc:"FFWPU 총무국 규정·지침 문서를 6개 카테고리로 통합 관리하고 모든 포맷을 PDF 통일 보기로 제공하는 규정 허브.", perf:[82,75,88,80,95], sslDays:60, domDays:365 },
  { id:"control-tower",    name:"Anti 관제탑",           sub:"통합 대시보드",           status:"running",     adsense:"none",     gsc:false, seoText:false, domain:"hyper-automation-tower.vercel.app",    github:"CHOBH1024/control-tower",        icon:"fa-tower-broadcast",    color:"#38bdf8", visitors:500,  desc:"CHOBH1024 운영 중인 전체 사이트 실시간 관제 및 트래픽·AdSense 통계 대시보드.", perf:[80,60,90,70,99], sslDays:90, domDays:365 },
  { id:"side-hustle-radar",name:"사이드허슬 레이더",     sub:"N잡러 성향 진단",         status:"running",     adsense:"pending",  gsc:true,  seoText:true,  domain:"side-hustle-radar.vercel.app",         github:"CHOBH1024/side-hustle-radar",    icon:"fa-money-bill-trend-up",color:"#eab308", visitors:150,  desc:"N잡러의 업무 스타일과 강점을 분석해 최적의 부업을 추천하는 진단 시스템.", perf:[85,85,85,85,85], sslDays:90, domDays:365 },
  { id:"mirror-insight",   name:"미러 인사이트",         sub:"심리 진단 템플릿",        status:"running",     adsense:"pending",  gsc:true,  seoText:true,  domain:"mirror-insight-system.vercel.app",     github:"CHOBH1024/MIRRIOR-APP",          icon:"fa-clone",              color:"#64748b", visitors:120,  desc:"모든 레이더 진단 사이트의 베이스가 되는 미러 인사이트 시스템 기본 템플릿.", perf:[90,90,90,90,90], sslDays:90, domDays:365 },
  { id:"mijeonshi",        name:"미전시",                sub:"미래 전략 시스템",        status:"running",     adsense:"none",     gsc:false, seoText:false, domain:"mijeonshi.vercel.app",                 github:"CHOBH1024/mijeonshi",            icon:"fa-chess-knight",       color:"#be185d", visitors:80,   desc:"전략적 의사결정 및 미래 시나리오 분석을 위한 기획·전략 시스템.", perf:[85,85,85,85,85], sslDays:90, domDays:365 }
];
    
    let currentFilter = 'all';
    let currentSearch = '';

    function init() {
      renderSummary();
      renderSites();
    }

    function renderSummary() {
      const total = SITES.length;
      const approved = SITES.filter(s => s.adsense === 'approved').length;
      const pending = SITES.filter(s => s.adsense === 'pending').length;
      const totalUv = SITES.reduce((acc, s) => acc + (s.visitors || 0), 0);

      const html = `
        <div class="summary-card">
          <div class="summary-title"><i class="fa-solid fa-globe" style="color:var(--accent-blue)"></i>전체 운영 사이트</div>
          <div class="summary-value">${total}<span style="font-size:14px;color:var(--text-muted);font-weight:400;margin-left:4px;">개</span></div>
        </div>
        <div class="summary-card">
          <div class="summary-title"><i class="fa-solid fa-check-circle" style="color:var(--accent-emerald)"></i>AdSense 승인 완료</div>
          <div class="summary-value" style="color:var(--accent-emerald)">${approved}</div>
        </div>
        <div class="summary-card">
          <div class="summary-title"><i class="fa-solid fa-hourglass-half" style="color:var(--accent-amber)"></i>심사 중 (대기)</div>
          <div class="summary-value" style="color:var(--accent-amber)">${pending}</div>
        </div>
        <div class="summary-card">
          <div class="summary-title"><i class="fa-solid fa-users" style="color:var(--accent-purple)"></i>일일 합산 UV</div>
          <div class="summary-value">${totalUv.toLocaleString()}<span style="font-size:14px;color:var(--text-muted);font-weight:400;margin-left:4px;">명</span></div>
        </div>
      `;
      document.getElementById('summary-grid').innerHTML = html;
    }

    function hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    function renderSites() {
      const grid = document.getElementById('sites-grid');
      grid.innerHTML = '';

      let list = SITES.filter(s => {
        if (currentFilter === 'running' && s.status !== 'running') return false;
        if (currentFilter === 'approved' && s.adsense !== 'approved') return false;
        if (currentFilter === 'pending' && s.adsense !== 'pending') return false;
        
        if (currentSearch) {
          const q = currentSearch.toLowerCase();
          return s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q);
        }
        return true;
      });

      list.forEach(s => {
        const c = s.color || '#3b82f6';
        const bgRgba = hexToRgba(c, 0.1);
        const borderRgba = hexToRgba(c, 0.3);

        let pillHtml = '<span class="status-pill pill-none">미신청</span>';
        let progressPct = 0;
        let pColor = 'var(--text-muted)';
        
        if (s.adsense === 'approved') {
          pillHtml = '<span class="status-pill pill-approved"><i class="fa-solid fa-check"></i> 승인완료</span>';
          progressPct = 100;
          pColor = 'var(--accent-emerald)';
        } else if (s.adsense === 'pending') {
          pillHtml = '<span class="status-pill pill-pending"><i class="fa-solid fa-hourglass-half"></i> 심사중</span>';
          const done = 1 + (s.gsc ? 1 : 0) + (s.seoText ? 1 : 0);
          progressPct = (done / 4) * 100;
          pColor = progressPct >= 75 ? 'var(--accent-teal)' : progressPct >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)';
        }

        const taskHtml = `
          <div class="task-list">
            <div class="task-item done"><i class="fa-solid fa-circle-check"></i> ads.txt 등록</div>
            <div class="task-item ${s.gsc ? 'done' : 'todo'}"><i class="fa-solid ${s.gsc ? 'fa-circle-check' : 'fa-circle'}"></i> sitemap 제출</div>
            <div class="task-item ${s.seoText ? 'done' : 'todo'}"><i class="fa-solid ${s.seoText ? 'fa-circle-check' : 'fa-circle'}"></i> SEO 텍스트 강화</div>
            <div class="task-item ${s.adsense === 'approved' ? 'done' : 'todo'}"><i class="fa-solid ${s.adsense === 'approved' ? 'fa-circle-check' : 'fa-circle'}"></i> AdSense 승인</div>
          </div>
        `;

        const card = document.createElement('div');
        card.className = 'site-card';
        card.innerHTML = `
          <div class="card-header">
            <div class="card-icon" style="background:${bgRgba}; color:${c}; border:1px solid ${borderRgba};">
              <i class="fa-solid ${s.icon}"></i>
            </div>
            <div class="card-info">
              <div class="card-name">${s.name}</div>
              <div class="card-domain">${s.domain}</div>
            </div>
            <div class="ping-badge" id="ping-${s.id}">...</div>
          </div>
          
          <div class="card-metrics">
            <div class="metric-chip highlight"><i class="fa-solid fa-users"></i> ${(s.visitors||0).toLocaleString()} UV</div>
            <div class="metric-chip"><i class="fa-brands fa-github"></i> ${s.github.split('/')[1] || 'repo'}</div>
          </div>

          <div class="ads-section">
            <div class="ads-head">
              <span>AdSense 상태</span>
              ${pillHtml}
            </div>
            ${s.adsense !== 'none' ? taskHtml : '<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:10px 0;">신청 내역 없음</div>'}
            ${s.adsense !== 'none' ? `<div class="progress-wrap"><div class="progress-fill" data-pct="${progressPct}" style="background:${pColor}; width:0%"></div></div>` : ''}
          </div>

          <div class="card-actions">
            <a href="https://${s.domain}" target="_blank" class="action-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> 접속</a>
            <a href="https://github.com/${s.github}" target="_blank" class="action-btn"><i class="fa-brands fa-github"></i> 깃허브</a>
            <button class="action-btn" onclick="copyDomain('${s.domain}')"><i class="fa-regular fa-copy"></i> 도메인</button>
          </div>
        `;
        grid.appendChild(card);
      });

      // Animate progress bars
      setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(el => {
          el.style.width = el.dataset.pct + '%';
        });
      }, 100);

      pingAll(list);
    }

    async function pingAll(list) {
      for (const s of list) {
        const badge = document.getElementById('ping-'+s.id);
        if (!badge) continue;
        const t0 = performance.now();
        try {
          await fetch(`https://${s.domain}/favicon.ico`, { mode: 'no-cors', cache: 'no-store' });
          const ms = Math.round(performance.now() - t0);
          badge.className = 'ping-badge online';
          badge.textContent = ms + 'ms';
        } catch {
          badge.className = 'ping-badge offline';
          badge.textContent = 'Offline';
        }
      }
    }

    function setFilter(f, btn) {
      currentFilter = f;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSites();
    }

    function handleSearch() {
      currentSearch = document.getElementById('search-input').value;
      renderSites();
    }

    function copyDomain(domain) {
      navigator.clipboard.writeText(domain);
      alert(domain + ' 복사 완료!');
    }

    document.addEventListener('DOMContentLoaded', init);
  