/*
 * consolidate-case-overview.mjs — move overview copy into the case header (above hero),
 * remove duplicate #section-overview blocks, and drop Overview from the scrollspy TOC.
 *
 * Usage: node scripts/consolidate-case-overview.mjs [file.html ...]
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function flattenStrong(html) {
  return html.replace(/<\/?strong>/gi, '');
}

function plainText(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function chooseOverview(introHtml, overviewHtml) {
  const introLen = plainText(introHtml).length;
  const overviewLen = plainText(overviewHtml).length;
  if (overviewLen > introLen) return overviewHtml;
  if (introLen > 0) return introHtml;
  return overviewHtml || introHtml;
}

function extractBalancedDiv(html, className) {
  const openRe = new RegExp(`<div[^>]*class="[^"]*${className}[^"]*"[^>]*>`, 'i');
  const openMatch = openRe.exec(html);
  if (!openMatch) return '';
  const start = openMatch.index;
  let depth = 0;
  for (let i = start; i < html.length; i += 1) {
    if (html.startsWith('<div', i)) depth += 1;
    if (html.startsWith('</div>', i)) {
      depth -= 1;
      if (depth === 0) return html.slice(start, i + 6);
    }
  }
  return '';
}

function extractOverviewSection(sectionHtml) {
  let text = '';
  let note = '';
  let media = '';

  const titleMatch = sectionHtml.match(
    /<h2[^>]*class="[^"]*case-overview-title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i
  );
  if (titleMatch) text = flattenStrong(titleMatch[1].trim());

  const noteMatch = sectionHtml.match(
    /<p[^>]*class="[^"]*(?:un-intro|case-overview-note)[^"]*"[^>]*>[\s\S]*?<\/p>/i
  );
  if (noteMatch) {
    note = noteMatch[0]
      .replace(/\bclass="[^"]*un-intro[^"]*"/, 'class="mc-case-overview-note"')
      .replace(/\bstyle="[^"]*"/, '');
  }

  if (!text) {
    const simpleMatch = sectionHtml.match(/<h2[^>]*>\s*Overview\s*<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
    if (simpleMatch) text = simpleMatch[1].trim();
  }

  const heroMedia = extractBalancedDiv(sectionHtml, 'case-overview-hero-media');
  const videoStage = extractBalancedDiv(sectionHtml, 'mc-video-stage');
  const introStage = extractBalancedDiv(sectionHtml, 'un-intro-video-stage');
  if (heroMedia) {
    media = heroMedia.replace(/^<div[^>]*>/, '').replace(/<\/div>$/, '').trim();
  } else if (introStage) {
    media = introStage;
  } else if (videoStage) {
    media = videoStage;
  }

  return { text, note, media };
}

function buildOverviewBlock(text, note, media) {
  const parts = [];
  if (text) parts.push(`    <p class="mc-case-overview">${text}</p>`);
  if (note) parts.push(`    ${note}`);
  if (media) parts.push(`    <div class="mc-case-overview-media">\n      ${media}\n    </div>`);
  return parts.length ? `${parts.join('\n')}\n` : '';
}

function processFile(filePath) {
  let html = readFileSync(filePath, 'utf8');
  if (!html.includes('body class="mc-case"')) return { changed: false };

  let changed = false;
  const sectionRegex = /<section\b[^>]*\bid="section-overview"[^>]*>[\s\S]*?<\/section>/i;
  const sectionMatch = html.match(sectionRegex);
  let overviewText = '';
  let overviewNote = '';
  let overviewMedia = '';

  if (sectionMatch) {
    const extracted = extractOverviewSection(sectionMatch[0]);
    overviewText = extracted.text;
    overviewNote = extracted.note;
    overviewMedia = extracted.media;
    html = html.replace(sectionRegex, '');
    changed = true;
  }

  const tocRegex = /\s*<a[^>]*\bdata-spy="section-overview"[^>]*>[\s\S]*?<\/a>/gi;
  if (tocRegex.test(html)) {
    html = html.replace(tocRegex, '');
    changed = true;
  }

  const introRegex = /<p class="mc-case-intro">([\s\S]*?)<\/p>\s*/i;
  const introMatch = html.match(introRegex);
  const introText = introMatch ? introMatch[1].trim() : '';
  if (introMatch) {
    html = html.replace(introRegex, '');
    changed = true;
  }

  const finalText = chooseOverview(introText, overviewText);
  const hasOverviewBlock = html.includes('class="mc-case-overview"');
  const overviewBlock = buildOverviewBlock(finalText, overviewNote, overviewMedia);

  if (overviewBlock && !hasOverviewBlock) {
    if (html.includes('class="mc-case-hero-img"')) {
      html = html.replace(/(\s*<div class="mc-case-hero-img">)/, `\n${overviewBlock}$1`);
    } else {
      html = html.replace(/(\s*<\/header>)/, `\n${overviewBlock}$1`);
    }
    changed = true;
  } else if (overviewBlock && hasOverviewBlock && (overviewNote || overviewMedia)) {
    html = html.replace(
      /(<p class="mc-case-overview">[\s\S]*?<\/p>)/,
      `$1\n${overviewNote ? `    ${overviewNote}\n` : ''}${overviewMedia ? `    <div class="mc-case-overview-media">\n      ${overviewMedia}\n    </div>\n` : ''}`
    );
    changed = true;
  }

  if (changed) writeFileSync(filePath, html);
  return { changed };
}

function main() {
  const args = process.argv.slice(2);
  const files = args.length
    ? args.map((f) => resolve(root, f))
    : readdirSync(root)
        .filter((f) => f.endsWith('.html'))
        .map((f) => resolve(root, f));

  let count = 0;
  for (const filePath of files) {
    const { changed } = processFile(filePath);
    if (changed) {
      count += 1;
      console.log(`updated ${filePath.replace(root + '/', '')}`);
    }
  }
  console.log(count ? `done (${count} file(s))` : 'no changes');
}

main();
