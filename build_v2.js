const fs = require('fs');

const sitesData = fs.readFileSync('d:/OneDrive/Anti/control-tower/extracted-sites.js', 'utf8');

const htmlTemplate = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anti Control Tower - Command Center</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg-dark: #05050a;
    --glass-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-glow: rgba(255, 255, 255, 0.02);
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    
    --accent-blue: #3b82f6;
    --accent-purple: #8b5cf6;
    --accent-teal: #14b8a6;
    --accent-rose: #f43f5e;
    --accent-amber: #f59e0b;
    --accent-emerald: #10b981;
    
    --radius-sm: 8px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Pretendard', -apple-system, sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-main);
    overflow-x: hidden;
    line-height: 1.5;
  }
  
  /* Dynamic Background Orbs */
  .bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    z-index: -1;
    opacity: 0.4;
    animation: float 20s infinite ease-in-out alternate;
  }
  .orb-1 { width: 500px; height: 500px; background: rgba(59, 130, 246, 0.3); top: -200px; left: -100px; }
  .orb-2 { width: 400px; height: 400px; background: rgba(139, 92, 246, 0.2); bottom: -100px; right: -50px; animation-delay: -5s; }
  .orb-3 { width: 600px; height: 600px; background: rgba(20, 184, 166, 0.15); top: 30%; left: 40%; animation-delay: -10s; }
  @keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(50px, 30px) scale(1.1); } }

  /* Layout */
  .container { max-width: 1400px; margin: 0 auto; padding: 40px 24px; }
  
  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }
  .title-group { display: flex; align-items: center; gap: 16px; }
  .title-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; color: white;
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
  }
  .title h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; }
  .title p { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
  
  /* Dashboard Summary */
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }
  .summary-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: 24px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex; flex-direction: column; gap: 8px;
  }
  .summary-title { font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .summary-value { font-size: 36px; font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: -0.03em; }
  
  /* Controls (Search & Filter) */
  .controls-bar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap; gap: 16px;
  }
  .search-box {
    display: flex; align-items: center;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);
    padding: 0 16px;
    height: 44px;
    width: 320px;
    transition: border-color 0.3s ease;
  }
  .search-box:focus-within { border-color: var(--accent-blue); }
  .search-box i { color: var(--text-muted); margin-right: 12px; }
  .search-box input {
    background: transparent; border: none; outline: none;
    color: var(--text-main); font-family: inherit; font-size: 15px; width: 100%;
  }
  
  .filter-tabs {
    display: flex; gap: 8px;
    background: var(--glass-bg);
    padding: 4px; border-radius: var(--radius-sm);
    border: 1px solid var(--glass-border);
  }
  .filter-btn {
    background: transparent; border: none; color: var(--text-muted);
    padding: 8px 16px; border-radius: 6px; font-family: inherit; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .filter-btn:hover { color: var(--text-main); background: rgba(255,255,255,0.05); }
  .filter-btn.active { background: rgba(255,255,255,0.1); color: var(--text-main); }
  
  /* Sites Grid */
  .sites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
  }
  
  /* Site Card */
  .site-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: 24px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: transform 0.3s var(--ease), border-color 0.3s var(--ease), box-shadow 0.3s var(--ease);
    position: relative; overflow: hidden;
    display: flex; flex-direction: column; gap: 16px;
  }
  .site-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,0.2);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  }
  
  /* Card Header */
  .card-header { display: flex; gap: 16px; align-items: flex-start; }
  .card-icon {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .card-info { flex-grow: 1; min-width: 0; }
  .card-name { font-size: 18px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-domain { font-size: 13px; color: var(--text-muted); font-family: 'Inter', sans-serif; margin-top: 4px; }
  
  .ping-badge {
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
    padding: 4px 8px; border-radius: 20px;
    background: rgba(255,255,255,0.05); color: var(--text-muted);
  }
  .ping-badge.online { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); }
  .ping-badge.offline { background: rgba(244, 63, 94, 0.1); color: var(--accent-rose); }
  
  /* Card Metrics */
  .card-metrics { display: flex; gap: 12px; }
  .metric-chip {
    background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05);
    padding: 6px 10px; border-radius: 6px;
    font-size: 12px; color: var(--text-muted); font-family: 'Inter', sans-serif;
    display: flex; align-items: center; gap: 6px;
  }
  .metric-chip i { font-size: 10px; }
  .metric-chip.highlight { color: var(--text-main); border-color: rgba(255,255,255,0.1); }
  
  /* AdSense Tracker section */
  .ads-section {
    background: rgba(0,0,0,0.2); border-radius: 8px; padding: 12px;
  }
  .ads-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 13px; font-weight: 500; }
  
  .status-pill {
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.05em;
  }
  .pill-approved { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); }
  .pill-pending { background: rgba(245, 158, 11, 0.1); color: var(--accent-amber); }
  .pill-none { background: rgba(255,255,255, 0.05); color: var(--text-muted); }
  
  .task-list { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .task-item { font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }
  .task-item.done { color: var(--text-main); }
  .task-item.done i { color: var(--accent-emerald); }
  .task-item.todo i { color: rgba(255,255,255,0.2); }
  
  .progress-wrap { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 12px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 2px; transition: width 1s var(--ease); }
  
  /* Card Actions */
  .card-actions { display: flex; gap: 8px; border-top: 1px solid var(--glass-border); padding-top: 16px; margin-top: auto; }
  .action-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    height: 36px; border-radius: 6px; background: rgba(255,255,255,0.05);
    color: var(--text-main); text-decoration: none; font-size: 13px; font-weight: 500;
    transition: background 0.2s; cursor: pointer; border: none; font-family: inherit;
  }
  .action-btn:hover { background: rgba(255,255,255,0.1); }
</style>
</head>
<body>
  <div class="bg-orb orb-1"></div>
  <div class="bg-orb orb-2"></div>
  <div class="bg-orb orb-3"></div>

  <div class="container">
    <header class="header">
      <div class="title-group">
        <div class="title-icon"><i class="fa-solid fa-layer-group"></i></div>
        <div class="title">
          <h1>Anti Control Tower</h1>
          <p>중앙 통제 및 하이퍼 자동화 시스템 대시보드</p>
        </div>
      </div>
      <div>
        <span style="font-family:'Inter'; font-size:12px; color:var(--text-muted); background:var(--glass-bg); padding:6px 12px; border-radius:20px; border:1px solid var(--glass-border);">
          <i class="fa-solid fa-circle" style="color:var(--accent-emerald); font-size:8px; margin-right:6px;"></i> System Online
        </span>
      </div>
    </header>

    <div class="summary-grid" id="summary-grid">
      <!-- Generated via JS -->
    </div>

    <div class="controls-bar">
      <div class="search-box">
        <i class="fa-solid fa-search"></i>
        <input type="text" id="search-input" placeholder="사이트 이름 또는 도메인 검색..." onkeyup="handleSearch()">
      </div>
      <div class="filter-tabs">
        <button class="filter-btn active" onclick="setFilter('all', this)">전체보기</button>
        <button class="filter-btn" onclick="setFilter('running', this)">운영중</button>
        <button class="filter-btn" onclick="setFilter('approved', this)">애드센스 승인</button>
        <button class="filter-btn" onclick="setFilter('pending', this)">심사중</button>
      </div>
    </div>

    <div class="sites-grid" id="sites-grid">
      <!-- Cards Generated via JS -->
    </div>
  </div>

  <script>
    ${sitesData}
    
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

      const html = \`
        <div class="summary-card">
          <div class="summary-title"><i class="fa-solid fa-globe" style="color:var(--accent-blue)"></i>전체 운영 사이트</div>
          <div class="summary-value">\${total}<span style="font-size:14px;color:var(--text-muted);font-weight:400;margin-left:4px;">개</span></div>
        </div>
        <div class="summary-card">
          <div class="summary-title"><i class="fa-solid fa-check-circle" style="color:var(--accent-emerald)"></i>AdSense 승인 완료</div>
          <div class="summary-value" style="color:var(--accent-emerald)">\${approved}</div>
        </div>
        <div class="summary-card">
          <div class="summary-title"><i class="fa-solid fa-hourglass-half" style="color:var(--accent-amber)"></i>심사 중 (대기)</div>
          <div class="summary-value" style="color:var(--accent-amber)">\${pending}</div>
        </div>
        <div class="summary-card">
          <div class="summary-title"><i class="fa-solid fa-users" style="color:var(--accent-purple)"></i>일일 합산 UV</div>
          <div class="summary-value">\${totalUv.toLocaleString()}<span style="font-size:14px;color:var(--text-muted);font-weight:400;margin-left:4px;">명</span></div>
        </div>
      \`;
      document.getElementById('summary-grid').innerHTML = html;
    }

    function hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
      return \`rgba(\${r},\${g},\${b},\${alpha})\`;
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

        const taskHtml = \`
          <div class="task-list">
            <div class="task-item done"><i class="fa-solid fa-circle-check"></i> ads.txt 등록</div>
            <div class="task-item \${s.gsc ? 'done' : 'todo'}"><i class="fa-solid \${s.gsc ? 'fa-circle-check' : 'fa-circle'}"></i> sitemap 제출</div>
            <div class="task-item \${s.seoText ? 'done' : 'todo'}"><i class="fa-solid \${s.seoText ? 'fa-circle-check' : 'fa-circle'}"></i> SEO 텍스트 강화</div>
            <div class="task-item \${s.adsense === 'approved' ? 'done' : 'todo'}"><i class="fa-solid \${s.adsense === 'approved' ? 'fa-circle-check' : 'fa-circle'}"></i> AdSense 승인</div>
          </div>
        \`;

        const card = document.createElement('div');
        card.className = 'site-card';
        card.innerHTML = \`
          <div class="card-header">
            <div class="card-icon" style="background:\${bgRgba}; color:\${c}; border:1px solid \${borderRgba};">
              <i class="fa-solid \${s.icon}"></i>
            </div>
            <div class="card-info">
              <div class="card-name">\${s.name}</div>
              <div class="card-domain">\${s.domain}</div>
            </div>
            <div class="ping-badge" id="ping-\${s.id}">...</div>
          </div>
          
          <div class="card-metrics">
            <div class="metric-chip highlight"><i class="fa-solid fa-users"></i> \${(s.visitors||0).toLocaleString()} UV</div>
            <div class="metric-chip"><i class="fa-brands fa-github"></i> \${s.github.split('/')[1] || 'repo'}</div>
          </div>

          <div class="ads-section">
            <div class="ads-head">
              <span>AdSense 상태</span>
              \${pillHtml}
            </div>
            \${s.adsense !== 'none' ? taskHtml : '<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:10px 0;">신청 내역 없음</div>'}
            \${s.adsense !== 'none' ? \`<div class="progress-wrap"><div class="progress-fill" data-pct="\${progressPct}" style="background:\${pColor}; width:0%"></div></div>\` : ''}
          </div>

          <div class="card-actions">
            <a href="https://\${s.domain}" target="_blank" class="action-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> 접속</a>
            <a href="https://github.com/\${s.github}" target="_blank" class="action-btn"><i class="fa-brands fa-github"></i> 깃허브</a>
            <button class="action-btn" onclick="copyDomain('\${s.domain}')"><i class="fa-regular fa-copy"></i> 도메인</button>
          </div>
        \`;
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
          await fetch(\`https://\${s.domain}/favicon.ico\`, { mode: 'no-cors', cache: 'no-store' });
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
  </script>
</body>
</html>
`;

fs.writeFileSync('d:/OneDrive/Anti/control-tower/index_v2.html', htmlTemplate, 'utf8');
console.log('index_v2.html created successfully.');
