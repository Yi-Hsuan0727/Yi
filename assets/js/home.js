(() => {
  'use strict';

  const PROJECTS = {
    unesco: { title: 'UNESCO Volunteer Recruitment', kind: 'Campaign Website', desc: 'A recruitment website design for UNESCO volunteers, focused on clear calls to action and an approachable visual voice.', url: 'unesco.html', img: 'assets/img/main images/UNESCO.png' },
    lawfare: { title: 'International Lawfare Website', kind: 'Website', desc: 'An informational website presenting international lawfare research with a structured, readable content hierarchy.', url: 'lawfare.html', img: 'assets/img/main images/International Lawfare.png' },
    lt: { title: 'Longtan Walker Pace Counter APP', kind: 'Mobile App', desc: 'A pace-counter walking app for the Longtan community, designed for effortless step tracking on the go.', url: 'lt.html', img: 'assets/img/main images/Longtan Walker.png' },
    quickbite: { title: 'QuickBite AI Assistant', kind: 'AI Concept', desc: 'An AI food-ordering assistant concept that shortens the path from craving to checkout.', url: 'quickbite.html', img: 'assets/img/main images/QuickBite.png' },
    magnate: { title: 'Magnate Technology Official Website', kind: 'Corporate Website', desc: "The official website for Magnate Technology, presenting the company's services with a clean, credible visual system.", url: 'magnate.html', img: 'assets/img/main images/Magnate.png' }
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileMq = window.matchMedia('(max-width: 900px)');
  const isMobile = () => mobileMq.matches;

  /* ---- Scroll / enter reveals ---- */
  function initRevealAnimations() {
    const configs = [
      { selector: '.mc-hero-title', delay: 0, immediate: true },
      { selector: '.mc-hero-eyes', delay: 140, immediate: true },
      { selector: '.mc-intro-heading', delay: 220, immediate: true },
      { selector: '.mc-intro-actions', delay: 300, immediate: true },
      { selector: '.mc-intro-copy', delay: 380, immediate: true },
      { selector: '.mc-featured .mc-eyebrow', delay: 0 },
      { selector: '.mc-featured .mc-section-title', delay: 90 },
      { selector: '.mc-featured-grid .mc-card', stagger: 110 },
      { selector: '.mc-more-work-head h2', delay: 0 },
      { selector: '.mc-more-work-head p', delay: 100 },
      { selector: '.mc-bring-title', delay: 0 },
      { selector: '.mc-bring-item', stagger: 120 },
      { selector: '.mc-about-title', delay: 0 },
      { selector: '.mc-about-copy p', stagger: 90 },
      { selector: '.mc-timeline h3', stagger: 70 },
      { selector: '.mc-timeline-row', stagger: 80 },
      { selector: '.mc-about-photo', delay: 140 },
      { selector: '.mc-contact-info .mc-eyebrow', delay: 0 },
      { selector: '.mc-contact-title', delay: 90 },
      { selector: '.mc-contact-actions', delay: 180 },
      { selector: '.mc-form-intro', delay: 0 },
      { selector: '.mc-form-fields > *', stagger: 70 }
    ];

    const elements = [];
    configs.forEach(({ selector, delay = 0, stagger = 0, immediate = false }) => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('mc-reveal');
        el.style.setProperty('--reveal-delay', (delay + i * stagger) + 'ms');
        if (immediate) el.dataset.revealImmediate = 'true';
        elements.push(el);
      });
    });

    if (!elements.length) return;

    const reveal = (el) => {
      if (el.classList.contains('is-visible')) return;
      el.classList.add('is-visible');
    };

    if (reduced) {
      elements.forEach(reveal);
      return;
    }

    elements.filter((el) => el.dataset.revealImmediate).forEach(reveal);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, isMobile()
      ? { threshold: 0.05, rootMargin: '0px 0px 8% 0px' }
      : { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });

    elements.filter((el) => !el.dataset.revealImmediate).forEach((el) => observer.observe(el));

    const featured = document.querySelector('.mc-panel--featured');
    if (featured && isMobile()) {
      const featuredObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          featured.querySelectorAll('.mc-reveal').forEach(reveal);
          featuredObserver.disconnect();
        });
      }, { threshold: 0.08 });
      featuredObserver.observe(featured);
    }
  }

  initRevealAnimations();

  /* ---- Eyes follow cursor ---- */
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
  let rafPending = false;

  function updatePupils() {
    rafPending = false;
    document.querySelectorAll('[data-eye]').forEach((eye) => {
      const pupil = eye.querySelector('[data-pupil]');
      if (!pupil) return;
      const r = eye.getBoundingClientRect();
      if (r.width === 0) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / 240, 1);
      const maxX = r.width * 0.2;
      const maxY = r.height * 0.2;
      const tx = (dx / dist) * maxX * reach;
      const ty = (dy / dist) * maxY * reach;
      pupil.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
    });
  }

  function requestPupilUpdate() {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(updatePupils);
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    requestPupilUpdate();
  }, { passive: true });

  window.addEventListener('scroll', requestPupilUpdate, { passive: true, capture: true });

  /* ---- Blinking (lid covers, eye does not shrink) ---- */
  if (!reduced) {
    const blinkEye = (eye, className, duration) => {
      eye.classList.add(className);
      setTimeout(() => eye.classList.remove(className), duration);
    };

    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 4000;
      setTimeout(() => {
        document.querySelectorAll('[data-eye]').forEach((eye) => blinkEye(eye, 'is-blinking', 160));
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
  }

  /* ---- Click to wink ---- */
  document.addEventListener('click', (e) => {
    const eye = e.target.closest && e.target.closest('[data-eye]');
    if (!eye) return;
    eye.classList.remove('is-blinking');
    eye.classList.add('is-winking');
    setTimeout(() => eye.classList.remove('is-winking'), 320);
  });

  /* ---- Hover tooltips ---- */
  const tip = document.createElement('div');
  tip.className = 'mc-tooltip';
  document.body.appendChild(tip);

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest && e.target.closest('[data-tip]');
    if (!el) return;
    if (isMobile() && el.closest('.mc-marquee-tile')) return;
    const r = el.getBoundingClientRect();
    tip.textContent = el.getAttribute('data-tip');
    tip.style.left = (r.left + r.width / 2) + 'px';
    tip.style.top = (el.getAttribute('data-tip-pos') === 'top' ? r.top + 14 : r.bottom + 10) + 'px';
    tip.classList.add('is-visible');
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest && e.target.closest('[data-tip]')) {
      tip.classList.remove('is-visible');
    }
  });

  /* ---- Parallax scrolling (desktop only) ---- */
  const parallaxSelector = '.mc-more-work, .mc-bring, .mc-about, .mc-contact';

  const ensureCoverInner = (section) => {
    let inner = section.querySelector(':scope > .mc-cover-inner');
    if (inner) return inner;
    inner = document.createElement('div');
    inner.className = 'mc-cover-inner';
    while (section.firstChild) {
      inner.appendChild(section.firstChild);
    }
    section.appendChild(inner);
    return inner;
  };

  document.querySelectorAll(parallaxSelector).forEach(ensureCoverInner);

  if (!reduced && !isMobile()) {
    let plxPending = false;
    const parallax = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;

      document.querySelectorAll('[data-plx]').forEach((el) => {
        const factor = parseFloat(el.getAttribute('data-plx')) || 0;
        const sec = el.closest('[data-screen-label]') || el.parentElement;
        const r = sec.getBoundingClientRect();
        const d = (r.top + r.height / 2) - vh / 2;
        el.style.transform = 'translateY(' + (-d * factor).toFixed(1) + 'px)';
      });

      document.querySelectorAll(parallaxSelector).forEach((section) => {
        const inner = section.querySelector(':scope > .mc-cover-inner');
        if (!inner) return;
        const factor = parseFloat(section.getAttribute('data-plx-section')) || 0.06;
        const roll = parseFloat(section.getAttribute('data-plx-roll')) || 0;
        const r = section.getBoundingClientRect();
        const d = (r.top + r.height / 2) - vh / 2;
        const ty = (-d * factor).toFixed(1);
        const rot = roll ? ((d / vh) * roll).toFixed(2) : '0';
        inner.style.transform = 'translateY(' + ty + 'px) rotate(' + rot + 'deg)';
      });
    };
    const onScrollPlx = () => {
      if (!plxPending) {
        plxPending = true;
        requestAnimationFrame(() => { plxPending = false; parallax(); });
      }
    };
    document.addEventListener('scroll', onScrollPlx, { passive: true, capture: true });
    window.addEventListener('resize', onScrollPlx, { passive: true });
    parallax();

    mobileMq.addEventListener('change', () => {
      if (isMobile()) {
        document.querySelectorAll('.mc-cover-inner').forEach((el) => {
          el.style.transform = '';
        });
      } else {
        parallax();
      }
    });
  }

  /* ---- Muted inline video autoplay ---- */
  document.querySelectorAll('video').forEach((v) => {
    v.muted = true;
    v.setAttribute('muted', '');
    if (v.paused) {
      const pr = v.play();
      if (pr && pr.catch) pr.catch(() => {});
    }
  });

  /* ---- Project popup modal ---- */
  const modalOverlay = document.getElementById('project-modal');
  const modalMediaImg = modalOverlay.querySelector('.mc-modal-media img');
  const modalKind = modalOverlay.querySelector('.mc-modal-kind');
  const modalTitle = modalOverlay.querySelector('.mc-modal-title');
  const modalDesc = modalOverlay.querySelector('.mc-modal-desc');
  const modalLink = modalOverlay.querySelector('.mc-modal-link');

  function openProject(key) {
    const p = PROJECTS[key];
    if (!p) return;
    modalMediaImg.src = p.img;
    modalMediaImg.alt = p.title;
    modalKind.textContent = p.kind;
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.desc;
    modalLink.href = p.url;
    modalOverlay.setAttribute('aria-label', p.title);
    modalOverlay.classList.add('is-open');
  }

  function closeModal() {
    modalOverlay.classList.remove('is-open');
  }

  document.querySelectorAll('[data-project]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openProject(el.getAttribute('data-project'));
    });
  });

  modalOverlay.addEventListener('click', closeModal);
  modalOverlay.querySelector('.mc-modal').addEventListener('click', (e) => e.stopPropagation());
  modalOverlay.querySelector('.mc-modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ---- Contact form (shared with the rest of the site, see contact-form.js) ---- */
  if (typeof ContactFormLogic !== 'undefined') {
    ContactFormLogic.init();
  }
})();
