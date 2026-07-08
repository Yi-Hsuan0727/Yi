/*
 * normalize-case-process.mjs — convert legacy design-process markup to mc-section--process / mc-phase (pic2split & lcm).
 *
 * Usage: node scripts/normalize-case-process.mjs [file.html ...]
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['pic2split.html', 'lcm.html']);

const defaultFiles = readdirSync(root)
  .filter((f) => f.endsWith('.html') && !SKIP.has(f))
  .map((f) => resolve(root, f));

const files = process.argv.length > 2 ? process.argv.slice(2).map((f) => resolve(root, f)) : defaultFiles;

function text(el) {
  return (el?.textContent || '').replace(/\s+/g, ' ').trim();
}

function isDesignProcessLabel(label) {
  return /design\s+process/i.test(label);
}

function findSectionRoot(el) {
  let node = el;
  while (node && node !== node.ownerDocument.body) {
    if (node.matches?.('section, .case-section, .mc-section, [class$="-section"]')) return node;
    node = node.parentElement;
  }
  return null;
}

function unwrapInnerWrappers(section) {
  const inner = section.querySelector(':scope > [class$="-inner"]');
  if (!inner || inner.parentElement !== section) return;
  while (inner.firstChild) section.insertBefore(inner.firstChild, inner);
  inner.remove();
}

function buildProcessIntro(section) {
  const labelEl =
    section.querySelector('[class$="-label"]') ||
    section.querySelector('.case-section-label');
  const titleEl =
    section.querySelector('[class$="-title"]') ||
    section.querySelector('.case-section-title');
  const introEl =
    section.querySelector('[class$="-intro"]') ||
    section.querySelector(':scope > p:not([class])') ||
    section.querySelector('.case-section-inner > p');

  const eyebrow = text(labelEl);
  const title = titleEl?.innerHTML?.trim() || '';
  const lede = introEl && introEl !== titleEl ? introEl.innerHTML.trim() : '';

  if (!eyebrow && !title) return null;

  const doc = section.ownerDocument;

  if (lede) {
    const wrap = doc.createElement('div');
    wrap.className = 'mc-2col-header';
    wrap.innerHTML = `<div>
      <p class="mc-eyebrow-bar">${eyebrow}</p>
      <h2 class="mc-section-h2">${title}</h2>
    </div>
    <p class="mc-lede">${lede}</p>`;
    labelEl?.closest('[class$="-header"], .case-section-header')?.remove();
    introEl?.remove();
    titleEl?.remove();
    labelEl?.remove();
    return wrap;
  }

  const wrap = doc.createElement('div');
  wrap.className = 'mc-process-intro';
  wrap.innerHTML = `<p class="mc-eyebrow-bar">${eyebrow}</p><h2 class="mc-section-h2">${title}</h2>`;
  labelEl?.closest('[class$="-header"], .case-section-header')?.remove();
  titleEl?.remove();
  labelEl?.remove();
  return wrap;
}

function upgradeFigcaption(figcaption) {
  if (!figcaption || figcaption.classList.contains('mc-figcaption')) return;
  const caption = figcaption.innerHTML.trim();
  figcaption.className = 'mc-figcaption';
  if (!caption.includes('mc-figcaption-dot')) {
    figcaption.innerHTML = `<span class="mc-figcaption-dot"></span>${caption}`;
  }
}

function upgradeFigure(figure) {
  if (!figure) return;
  figure.classList.remove('case-figure', 'case-figure-readable');
  figure.classList.add('mc-figure');
  const figcaption = figure.querySelector('figcaption');
  if (figcaption) upgradeFigcaption(figcaption);
}

function transformPhaseBlock(article) {
  const doc = article.ownerDocument;
  article.className = 'mc-phase';

  const header = article.querySelector('.case-phase-block-header');
  const kicker = header?.querySelector('.case-phase-kicker');
  const blockTitle = header?.querySelector('.case-phase-block-title');

  let insertBefore = article.firstChild;
  if (kicker) {
    const label = doc.createElement('p');
    label.className = 'mc-phase-label';
    label.textContent = text(kicker);
    article.insertBefore(label, insertBefore);
    insertBefore = label.nextSibling;
  }
  if (blockTitle) {
    const title = doc.createElement('h3');
    title.className = 'mc-phase-title mc-phase-title--tight';
    title.innerHTML = blockTitle.innerHTML;
    article.insertBefore(title, insertBefore);
  }
  header?.remove();

  const inner = article.querySelector('.case-phase-block-inner');
  if (!inner) return;

  const copy = inner.querySelector('.case-phase-block-copy');
  const media = inner.querySelector('.case-phase-block-media') || inner.querySelector('figure.case-phase-block-media');
  const chart = inner.querySelector(':scope > .case-research-chart, :scope > .p2s-research-chart');
  const withChart = inner.classList.contains('case-phase-block-inner--with-chart');
  const solo = inner.classList.contains('case-phase-block-inner--solo');

  copy?.querySelectorAll('.case-phase-result-head').forEach((el) => {
    el.classList.remove('case-phase-result-head');
    el.classList.add('mc-phase-result');
  });
  copy?.querySelectorAll('.case-phase-body').forEach((el) => {
    el.classList.remove('case-phase-body');
    el.classList.add('mc-phase-body');
  });

  if (solo || (!media && !chart && copy)) {
    if (copy) {
      copy.classList.remove('case-phase-block-copy');
      copy.classList.add('mc-phase-copy');
      inner.replaceWith(copy);
    } else {
      inner.remove();
    }
    return;
  }

  if (withChart || chart) {
    inner.classList.remove('case-phase-block-inner--solo');
    inner.classList.add('mc-phase-inner--with-chart');
    if (copy) {
      copy.classList.remove('case-phase-block-copy');
      copy.classList.add('mc-phase-copy');
    }
    if (media) {
      media.classList.remove('case-phase-block-media');
      media.classList.add('mc-phase-media');
      media.querySelectorAll('figure, .case-figure').forEach(upgradeFigure);
    }
    inner.querySelectorAll('figure.case-figure, figure.case-phase-block-media').forEach(upgradeFigure);
    return;
  }

  const split = doc.createElement('div');
  split.className = 'mc-phase-split';

  if (copy) {
    copy.classList.remove('case-phase-block-copy');
    copy.classList.add('mc-phase-copy');
    split.appendChild(copy);
  }

  if (media) {
    media.classList.remove('case-phase-block-media');
    if (media.matches('figure')) {
      const mediaWrap = doc.createElement('div');
      mediaWrap.className = 'mc-phase-media';
      upgradeFigure(media);
      mediaWrap.appendChild(media);
      split.appendChild(mediaWrap);
    } else {
      media.classList.add('mc-phase-media');
      media.querySelectorAll('figure, .case-figure').forEach(upgradeFigure);
      split.appendChild(media);
    }
  } else {
    inner.querySelectorAll(':scope > figure').forEach((fig) => {
      const mediaWrap = doc.createElement('div');
      mediaWrap.className = 'mc-phase-media';
      upgradeFigure(fig);
      mediaWrap.appendChild(fig);
      split.appendChild(mediaWrap);
    });
  }

  inner.replaceWith(split);
}

function isFullyNormalized(section) {
  const hasNativeIntro = section.querySelector('.mc-2col-header, .mc-process-intro');
  const hasLegacyHeader = section.querySelector('.case-section-header, [class$="-header"]');
  const hasLegacyPhases = section.querySelector('.case-phase-pairs, .case-phase-block');
  return hasNativeIntro && !hasLegacyHeader && !hasLegacyPhases;
}

function normalizeProcessSection(section) {
  if (isFullyNormalized(section)) return false;

  const pairs = section.querySelector('.case-phase-pairs');
  const labelEl =
    section.querySelector('[class$="-label"]') ||
    section.querySelector('.case-section-label');
  const isProcess =
    pairs ||
    isDesignProcessLabel(text(labelEl)) ||
    section.id?.includes('design-process');

  if (!isProcess) return false;

  section.className = 'mc-section mc-section--process';
  if (section.tagName === 'DIV') {
    const doc = section.ownerDocument;
    const sec = doc.createElement('section');
    [...section.attributes].forEach((attr) => sec.setAttribute(attr.name, attr.value));
    sec.className = 'mc-section mc-section--process';
    sec.innerHTML = section.innerHTML;
    section.replaceWith(sec);
    return normalizeProcessSection(sec);
  }

  const caseInner = section.querySelector(':scope > .case-section-inner');
  if (caseInner) {
    while (caseInner.firstChild) section.appendChild(caseInner.firstChild);
    caseInner.remove();
  }

  unwrapInnerWrappers(section);

  const intro = buildProcessIntro(section);
  const pairsEl = section.querySelector('.case-phase-pairs');

  if (intro) {
    section.insertBefore(intro, section.firstChild);
  }

  if (pairsEl) {
    while (pairsEl.firstChild) {
      section.insertBefore(pairsEl.firstChild, pairsEl);
    }
    pairsEl.remove();
  }

  section.querySelectorAll('.case-phase-block').forEach(transformPhaseBlock);

  section.querySelectorAll('figure.case-figure, .mc-phase .case-figure').forEach(upgradeFigure);
  section.querySelectorAll('figcaption.case-caption').forEach(upgradeFigcaption);

  return true;
}

export function processFile(filePath) {
  const src = readFileSync(filePath, 'utf8');
  if (!src.includes('case-phase-pairs') && !/design\s+process/i.test(src)) {
    return { filePath, changed: false, reason: 'no design process markup' };
  }
  if (SKIP.has(filePath.split('/').pop())) {
    return { filePath, changed: false, reason: 'reference page' };
  }

  const dom = new JSDOM(src);
  const { document } = dom.window;
  let count = 0;

  const candidates = [
    ...document.querySelectorAll('section'),
    ...document.querySelectorAll('.case-section'),
    ...document.querySelectorAll('.mc-legacy-section')
  ];

  const seen = new Set();
  for (const section of candidates) {
    if (seen.has(section)) continue;
    seen.add(section);
    if (normalizeProcessSection(section)) count += 1;
  }

  if (!count) return { filePath, changed: false, reason: 'no sections transformed' };

  let out = dom.serialize();
  out = out.replace(/<\/html>\s*$/, '\n');
  writeFileSync(filePath, out, 'utf8');
  return { filePath, changed: true, sections: count };
}

const isCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  for (const file of files) {
    try {
      const result = processFile(file);
      const name = file.split('/').pop();
      if (result.changed) {
        console.log(`✓ ${name} — ${result.sections} section(s)`);
      } else {
        console.log(`– ${name} — ${result.reason}`);
      }
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  }
}
