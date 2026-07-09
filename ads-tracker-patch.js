// renderAdsenseTracker - SEO 심사 현황 패널 렌더링
const _origRenderSites = renderSites;

function renderAdsenseTracker() {
  const tracker = document.getElementById('adsense-tracker');
  if (!tracker) return;

  const adSites = SITES.filter(s => s.adsense !== 'none');
  const approved = SITES.filter(s => s.adsense === 'approved').length;
  const pending  = SITES.filter(s => s.adsense === 'pending').length;
  const seoText  = SITES.filter(s => s.seoText).length;
  const none     = SITES.filter(s => s.adsense === 'none').length;
  const total    = SITES.length;

  const set = (id, val) => { const e = document.getElementById(id); if(e) e.textContent = val; };
  const setW = (id, pct) => { const e = document.getElementById(id); if(e) e.style.width = pct+'%'; };
  set('ads-count-approved', approved);
  set('ads-count-pending', pending);
  set('ads-count-seo', seoText);
  set('ads-count-none', none);
  setTimeout(() => {
    setW('ads-bar-approved', Math.round(approved/total*100));
    setW('ads-bar-pending', Math.round(pending/total*100));
    setW('ads-bar-seo', Math.round(seoText/total*100));
    setW('ads-bar-none', Math.round(none/total*100));
  }, 600);

  tracker.innerHTML = '';
  adSites.forEach(s => {
    const pill = s.adsense === 'approved'
      ? `<span class="ads-status-pill ads-pill-approved">\u2713 승인완료</span>`
      : `<span class="ads-status-pill ads-pill-pending">\u23F3 심사중</span>`;

    const tasks = [
      { label: 'ads.txt 등록',     done: true },
      { label: 'sitemap.xml 제출', done: !!s.gsc },
      { label: 'SEO 텍스트 강화',  done: !!s.seoText },
      { label: 'AdSense 승인',     done: s.adsense === 'approved' },
    ];
    const taskHtml = tasks.map(t => `
      <div class="ads-task ${t.done?'done':'todo'}">
        <span class="ads-task-icon">${t.done?'✅':'○'}</span>
        <span>${t.label}</span>
      </div>`).join('');

    const doneCount = tasks.filter(t=>t.done).length;
    const progressPct = Math.round(doneCount / tasks.length * 100);
    const progressColor = s.adsense==='approved' ? 'var(--emerald)' : progressPct>=75 ? 'var(--teal)' : progressPct>=50 ? 'var(--amber)' : 'var(--rose)';

    const card = document.createElement('div');
    card.className = 'ads-site-card';
    card.style.setProperty('--ads-color', s.color);
    card.innerHTML = `
      <div class="ads-status-row">
        <div>
          <div class="ads-site-name">${s.name}</div>
          <div class="ads-site-domain">${s.domain}</div>
        </div>
        ${pill}
      </div>
      <div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;">
        <div style="height:100%;width:0%;background:${progressColor};border-radius:2px;transition:width 1s var(--ease);" data-pct="${progressPct}"></div>
      </div>
      <div class="ads-tasks">${taskHtml}</div>
    `;
    tracker.appendChild(card);
  });

  // animate progress bars
  setTimeout(() => {
    tracker.querySelectorAll('[data-pct]').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }, 300);
}
