(() => {
  'use strict';

  const STORAGE_KEY = 'lcm-case-unlock';
  const PASSWORD = '870727';

  const unlock = () => {
    document.body.classList.remove('mc-case-locked');
    const gate = document.getElementById('mc-case-gate');
    if (gate) gate.remove();
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (_) {}
  };

  if (sessionStorage.getItem(STORAGE_KEY) === '1') return;

  document.body.classList.add('mc-case-locked');

  const gate = document.createElement('div');
  gate.id = 'mc-case-gate';
  gate.className = 'mc-case-gate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'mc-case-gate-title');
  gate.innerHTML =
    '<div class="mc-case-gate-card">' +
      '<p class="mc-case-gate-eyebrow">Protected case study</p>' +
      '<h1 id="mc-case-gate-title" class="mc-case-gate-title">Indigenous Cultural Museums</h1>' +
      '<p class="mc-case-gate-copy">Enter the password to view this project.</p>' +
      '<form class="mc-case-gate-form" autocomplete="off">' +
        '<label class="mc-case-gate-label" for="mc-case-gate-input">Password</label>' +
        '<input id="mc-case-gate-input" class="mc-case-gate-input" type="password" inputmode="numeric" autocomplete="current-password" required>' +
        '<p class="mc-case-gate-error" hidden>Incorrect password. Please try again.</p>' +
        '<button class="mc-case-gate-btn" type="submit">Unlock</button>' +
      '</form>' +
      '<a class="mc-case-gate-back" href="index.html">← Back to home</a>' +
    '</div>';

  document.body.appendChild(gate);

  const form = gate.querySelector('.mc-case-gate-form');
  const input = gate.querySelector('.mc-case-gate-input');
  const error = gate.querySelector('.mc-case-gate-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value === PASSWORD) {
      unlock();
      return;
    }
    error.hidden = false;
    input.focus();
    input.select();
  });

  input.focus();
})();
