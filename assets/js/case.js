(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Case-page entry wipe (green cover, no logo) ---- */
  if (!reduced && document.body.classList.contains('mc-case')) {
    const overlay = document.createElement('div');
    overlay.className = 'mc-case-splash';
    document.body.appendChild(overlay);
    document.body.classList.add('mc-case-splash-active');

    const COVER_MS = 750;
    const HOLD_MS = 180;
    const REVEAL_MS = 1050;
    const coverStart = 60;
    const readyAt = coverStart + COVER_MS;
    const revealStart = readyAt + HOLD_MS;
    const doneAt = revealStart + REVEAL_MS;

    window.setTimeout(() => {
      document.body.classList.add('mc-case-splash-cover');
    }, coverStart);

    window.setTimeout(() => {
      document.body.classList.add('mc-case-splash-ready');
    }, readyAt);

    window.setTimeout(() => {
      document.body.classList.add('mc-case-splash-reveal');
    }, revealStart);

    window.setTimeout(() => {
      overlay.remove();
      document.body.classList.remove(
        'mc-case-splash-active',
        'mc-case-splash-cover',
        'mc-case-splash-ready',
        'mc-case-splash-reveal'
      );
    }, doneAt);
  }

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
      const tx = (dx / dist) * r.width * 0.2 * reach;
      const ty = (dy / dist) * r.height * 0.2 * reach;
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

  /* ---- Blinking ---- */
  if (!reduced) {
    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 4000;
      setTimeout(() => {
        document.querySelectorAll('[data-eye]').forEach((eye) => {
          eye.style.transition = 'transform 0.12s ease';
          eye.style.transform = 'scaleY(0.08)';
          setTimeout(() => { eye.style.transform = 'scaleY(1)'; }, 150);
        });
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
  }

  /* ---- Click to wink ---- */
  document.addEventListener('click', (e) => {
    const eye = e.target.closest && e.target.closest('[data-eye]');
    if (!eye) return;
    eye.style.transition = 'transform 0.14s ease';
    eye.style.transform = 'scaleY(0.06)';
    setTimeout(() => { eye.style.transform = 'scaleY(1)'; }, 320);
  });

  /* ---- Hover tooltips ---- */
  const tip = document.createElement('div');
  tip.className = 'mc-tooltip';
  document.body.appendChild(tip);

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest && e.target.closest('[data-tip]');
    if (!el) return;
    const r = el.getBoundingClientRect();
    tip.textContent = el.getAttribute('data-tip');
    tip.style.left = (r.left + r.width / 2) + 'px';
    tip.style.top = (r.bottom + 10) + 'px';
    tip.classList.add('is-visible');
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest && e.target.closest('[data-tip]')) {
      tip.classList.remove('is-visible');
    }
  });

  /* ---- Count-up stats ---- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const t0 = performance.now();
    const dur = 1100;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target._counted) {
        entry.target._counted = true;
        if (reduced) {
          entry.target.textContent = entry.target.getAttribute('data-count');
        } else {
          animateCount(entry.target);
        }
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => countObserver.observe(el));

  /* ---- Scroll spy (table of contents) ---- */
  const links = {};
  document.querySelectorAll('[data-spy]').forEach((a) => {
    links[a.getAttribute('data-spy')] = a;
  });
  const setActive = (id) => {
    Object.entries(links).forEach(([key, a]) => {
      a.classList.toggle('is-active', key === id);
    });
  };
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.getAttribute('data-spy-target'));
    });
  }, { rootMargin: '-25% 0px -60% 0px' });
  document.querySelectorAll('[data-spy-target]').forEach((s) => spyObserver.observe(s));
  const firstSpy = document.querySelector('[data-spy-target]');
  if (firstSpy) setActive(firstSpy.getAttribute('data-spy-target'));

  /* ---- Before / after compare slider ---- */
  document.querySelectorAll('[data-compare]').forEach((compare) => {
    const stage = compare.querySelector('.mc-compare-stage');
    if (!stage) return;
    const viewport = stage.querySelector('.mc-compare-viewport') || stage;

    const setSplitFromClientX = (clientX) => {
      const rect = viewport.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const percent = (x / rect.width) * 100;
      viewport.style.setProperty('--split-pos', percent.toFixed(2) + '%');
    };

    let dragging = false;
    stage.addEventListener('pointerdown', (e) => {
      dragging = true;
      stage.setPointerCapture(e.pointerId);
      setSplitFromClientX(e.clientX);
    });
    stage.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      setSplitFromClientX(e.clientX);
    });
    stage.addEventListener('pointerup', () => { dragging = false; });
    stage.addEventListener('pointercancel', () => { dragging = false; });
  });

  /* ---- Muted inline video autoplay ---- */
  document.querySelectorAll('video').forEach((v) => {
    v.muted = true;
    v.setAttribute('muted', '');
    if (v.paused) {
      const pr = v.play();
      if (pr && pr.catch) pr.catch(() => {});
    }
  });

  /* ---- Case-page entry wipe (green cover, no logo) ---- */
  if (!reduced && document.body.classList.contains('mc-case')) {
    const overlay = document.createElement('div');
    overlay.className = 'mc-case-splash';
    document.body.appendChild(overlay);

    document.body.classList.add('mc-case-splash-active');

    const COVER_MS = 750;
    const HOLD_MS = 180;
    const REVEAL_MS = 1050;

    const coverStart = 60;
    const readyAt = coverStart + COVER_MS;
    const revealStart = readyAt + HOLD_MS;
    const doneAt = revealStart + REVEAL_MS;

    window.setTimeout(() => {
      document.body.classList.add('mc-case-splash-cover');
    }, coverStart);

    window.setTimeout(() => {
      document.body.classList.add('mc-case-splash-ready');
    }, readyAt);

    window.setTimeout(() => {
      document.body.classList.add('mc-case-splash-reveal');
    }, revealStart);

    window.setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('mc-case-splash-active', 'mc-case-splash-cover', 'mc-case-splash-ready', 'mc-case-splash-reveal');
    }, doneAt);
  }
})();
