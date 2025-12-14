// Lightweight interactive behavior for the portfolio
(() => {
  // Elements
  const themeSelect = document.getElementById('theme-switcher');
  const body = document.body;
  const yearEl = document.getElementById('year');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectGrid = document.getElementById('portfolio-grid');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtns = document.querySelectorAll('[data-close]');
  const heroCanvas = document.getElementById('hero-canvas');

  // Set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme switching (store preference)
  themeSelect.value = body.classList.contains('theme-tech') ? 'theme-tech' :
                      body.classList.contains('theme-classic') ? 'theme-classic' : 'theme-comic';
  themeSelect.addEventListener('change', (e) => {
    body.classList.remove('theme-comic', 'theme-tech', 'theme-classic');
    body.classList.add(e.target.value);
    // persist
    try { localStorage.setItem('site-theme', e.target.value); } catch {}
  });
  // load persisted
  try {
    const stored = localStorage.getItem('site-theme');
    if (stored) { body.classList.remove('theme-comic','theme-tech','theme-classic'); body.classList.add(stored); themeSelect.value = stored; }
  } catch {}

  // Nav toggle (mobile)
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
  });

  // Filters
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      Array.from(projectGrid.children).forEach(card => {
        if (f === 'all' || card.dataset.type === f) {
          card.style.display = '';
          requestAnimationFrame(()=> card.style.opacity = '1');
        } else {
          card.style.opacity = '0';
          setTimeout(()=> card.style.display = 'none', 200);
        }
      });
    });
  });

  // Modal open for project cards (simple)
  function openModal(contentHtml = '') {
    modalBody.innerHTML = contentHtml;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus trap simple:
    modal.querySelector('.modal-close')?.focus();
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalBody.innerHTML = '';
  }
  projectGrid?.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (!card) return;
    openModal(`<div style="padding:1rem">
      <h3 id="modal-title">${card.querySelector('h4')?.textContent || 'Project'}</h3>
      <div style="height:320px;border-radius:8px;background:${card.querySelector('.thumb')?.style.backgroundImage || '#222'};margin:.8rem 0;"></div>
      <p class="muted">Project details. Replace with real content, case study links, or embedded videos.</p>
      <a class="btn-primary" href="#contact" onclick="document.getElementById('modal').setAttribute('aria-hidden','true')">Start a project</a>
    </div>`);
  });
  modalCloseBtns.forEach(b => b.addEventListener('click', closeModal));
  modal.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeModal();
  });
  modal.addEventListener('click', (ev) => {
    if (ev.target.dataset.close !== undefined) closeModal();
  });

  // Contact form (stub)
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Implement integration with backend or services (Formspree/Netlify).
    alert('Thanks! Message submitted (this is a demo stub).');
    contactForm.reset();
  });
  document.getElementById('clear-btn')?.addEventListener('click', () => contactForm.reset());

  // Hero canvas particle effect (simple, lightweight)
  const ctx = heroCanvas && heroCanvas.getContext ? heroCanvas.getContext('2d') : null;
  if (ctx && heroCanvas) {
    let w, h, particles = [];
    function resize() {
      w = heroCanvas.width = heroCanvas.clientWidth;
      h = heroCanvas.height = heroCanvas.clientHeight;
      initParticles();
    }
    function initParticles() {
      particles = [];
      const count = Math.max(18, Math.floor(w * 0.06));
      for (let i=0;i<count;i++){
        particles.push({
          x: Math.random()*w,
          y: Math.random()*h,
          r: 1 + Math.random()*3,
          vx: (Math.random()-0.5)*0.6,
          vy: (Math.random()-0.5)*0.6,
          hue: Math.random()*60 + 10
        });
      }
    }
    function draw() {
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8);
        gradient.addColorStop(0, `hsla(${p.hue},95%,60%,0.85)`);
        gradient.addColorStop(1, `hsla(${p.hue},85%,40%,0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  // Small enhancement: smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href').slice(1);
      const el = document.getElementById(targetId);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth',block:'start'});
      // close nav on mobile
      navList.classList.remove('show');
      navToggle?.setAttribute('aria-expanded','false');
    });
  });

})();
