/*
 * move-overview-media-below-hero.mjs — place .mc-case-overview-media after .mc-case-hero-img.
 *
 * Usage: node scripts/move-overview-media-below-hero.mjs [file.html ...]
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

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

function moveMediaBelowHero(html) {
  const mediaBlock = extractBalancedDiv(html, 'mc-case-overview-media');
  if (!mediaBlock) return { html, changed: false };

  const heroMatch = html.match(/<div class="mc-case-hero-img">[\s\S]*?<\/div>/);
  if (!heroMatch) return { html, changed: false };

  const heroEnd = heroMatch.index + heroMatch[0].length;
  const afterHero = html.slice(heroEnd);
  if (afterHero.trimStart().startsWith(mediaBlock.trim())) {
    return { html, changed: false };
  }

  let next = html.replace(mediaBlock, '');
  next = next.replace(/\n{3,}/g, '\n\n');
  const heroMatch2 = next.match(/<div class="mc-case-hero-img">[\s\S]*?<\/div>/);
  if (!heroMatch2) return { html, changed: false };

  next = next.replace(heroMatch2[0], `${heroMatch2[0]}\n${mediaBlock}`);
  return { html: next, changed: true };
}

function processFile(filePath) {
  const html = readFileSync(filePath, 'utf8');
  if (!html.includes('body class="mc-case"')) return false;
  const { html: next, changed } = moveMediaBelowHero(html);
  if (changed) writeFileSync(filePath, next);
  return changed;
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
    if (processFile(filePath)) {
      count += 1;
      console.log(`updated ${filePath.replace(root + '/', '')}`);
    }
  }
  console.log(count ? `done (${count} file(s))` : 'no changes');
}

main();
