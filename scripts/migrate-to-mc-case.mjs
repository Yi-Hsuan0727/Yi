/*
 * migrate-to-mc-case.mjs — convert legacy project pages to the pic2split/lcm mc-case layout.
 * Preserves <!--page-content:start-->…<!--page-content:end--> body content.
 *
 * Usage: node scripts/migrate-to-mc-case.mjs [projectId ...]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { processFile as normalizeProcessFile } from './normalize-case-process.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const START = '<!--page-content:start-->';
const END = '<!--page-content:end-->';
const MIGRATE_PAGES = {
  unesco: 'unesco.html',
  uav: 'uav.html',
  lawfare: 'lawfare.html',
  agsec: 'agsec.html',
  lt: 'lt.html',
  quickbite: 'quickbite.html',
  magnate: 'magnate.html',
  spring: 'spring.html',
  dailymoo: 'dailymoo.html',
  enchanter: 'enchanter.html',
  stiffy: 'stiffy.html',
  tnaf: 'tnaf.html',
  whatnow: 'whatnow.html'
};

const componentsPath = resolve(root, 'assets/js/components.js');
const componentsSrc = readFileSync(componentsPath, 'utf8');
const sandbox = { exports: {}, module: { exports: {} } };
const fn = new Function('exports', 'module', componentsSrc + '\n;return PortfolioApp;');
const PortfolioApp = fn(sandbox.exports, sandbox.module);
const projectById = Object.fromEntries(PortfolioApp.projectList.map((p) => [p.id, p]));

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function extractBetween(source, startMark, endMark) {
  const start = source.indexOf(startMark);
  const end = source.indexOf(endMark);
  if (start === -1 || end === -1 || end <= start) return '';
  return source.slice(start + startMark.length, end).trim();
}

function extractHeadField(source, pattern) {
  const m = source.match(pattern);
  return m ? m[1].trim() : '';
}

function getProjectMeta(pageId) {
  const fromList = projectById[pageId] || {};
  const fromData = PortfolioApp.data?.[pageId] || {};
  return { ...fromData, ...fromList, id: pageId };
}

function getNextProjects(currentId, count = 2) {
  const featured = PortfolioApp.projectList.filter((p) => !p.comingSoon && p.link && p.link !== '#');
  const idx = featured.findIndex((p) => p.id === currentId);
  const result = [];
  if (idx === -1) {
    for (let i = 0; i < count && i < featured.length; i++) {
      if (featured[i].id !== currentId) result.push(featured[i]);
    }
    return result.slice(0, count);
  }
  for (let j = 1; j <= featured.length && result.length < count; j++) {
    const pick = featured[(idx + j) % featured.length];
    if (pick.id !== currentId) result.push(pick);
  }
  return result;
}

function enhanceContent(html) {
  let autoIndex = 0;
  return html.replace(/<section\b([^>]*)>/gi, (full, attrs) => {
    let nextAttrs = attrs;
    let id = (nextAttrs.match(/\bid="([^"]+)"/) || [])[1];
    if (!id) {
      autoIndex += 1;
      id = `section-${String(autoIndex).padStart(2, '0')}`;
      nextAttrs += ` id="${id}"`;
    }
    if (!/\bdata-spy-target=/.test(nextAttrs)) {
      nextAttrs += ` data-spy-target="${id}"`;
    }
    if (/\bclass="/.test(nextAttrs)) {
      nextAttrs = nextAttrs.replace(/\bclass="([^"]*)"/, (_, classes) => {
        const merged = classes.includes('mc-section') ? classes : `mc-section mc-legacy-section ${classes}`;
        return `class="${merged.trim()}"`;
      });
    } else {
      nextAttrs += ' class="mc-section mc-legacy-section"';
    }
    if (!/\bdata-screen-label=/.test(nextAttrs)) {
      nextAttrs += ` data-screen-label="${escapeHtml(id)}"`;
    }
    return `<section${nextAttrs}>`;
  });
}

function extractTocEntries(content) {
  const entries = [];
  const sectionRegex = /<section\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/section>/gi;
  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    const id = match[1];
    if (id === 'section-overview') continue;
    const inner = match[2];
    const labelMatch =
      inner.match(/class="[^"]*case-section-label[^"]*"[^>]*>\s*([^<]+)/i) ||
      inner.match(/class="[^"]*-label[^"]*"[^>]*>\s*([^<]+)/i) ||
      inner.match(/<h2[^>]*>\s*([^<]+)/i);
    const label = labelMatch ? decodeHtml(labelMatch[1].trim()) : id.replace(/-/g, ' ');
    entries.push({ id, label });
  }
  return entries;
}

function flattenStrong(html) {
  return html.replace(/<\/?strong>/gi, '');
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

function extractAndRemoveOverviewSection(content) {
  const sectionRegex = /<section\b[^>]*\bid="section-overview"[^>]*>[\s\S]*?<\/section>/i;
  const sectionMatch = content.match(sectionRegex);
  if (!sectionMatch) return { content, text: '', note: '', media: '' };

  const section = sectionMatch[0];
  let text = '';
  let note = '';
  let media = '';

  const titleMatch = section.match(
    /<h2[^>]*class="[^"]*case-overview-title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i
  );
  if (titleMatch) text = flattenStrong(titleMatch[1].trim());

  const noteMatch = section.match(
    /<p[^>]*class="[^"]*(?:un-intro|case-overview-note)[^"]*"[^>]*>[\s\S]*?<\/p>/i
  );
  if (noteMatch) {
    note = noteMatch[0]
      .replace(/\bclass="[^"]*un-intro[^"]*"/, 'class="mc-case-overview-note"')
      .replace(/\bstyle="[^"]*"/, '');
  }

  if (!text) {
    const simpleMatch = section.match(/<h2[^>]*>\s*Overview\s*<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
    if (simpleMatch) text = simpleMatch[1].trim();
  }

  const heroMedia = extractBalancedDiv(section, 'case-overview-hero-media');
  const videoStage = extractBalancedDiv(section, 'mc-video-stage');
  const introStage = extractBalancedDiv(section, 'un-intro-video-stage');
  if (heroMedia) {
    media = heroMedia.replace(/^<div[^>]*>/, '').replace(/<\/div>$/, '').trim();
  } else if (introStage) {
    media = introStage;
  } else if (videoStage) {
    media = videoStage;
  }

  return {
    content: content.replace(sectionRegex, '').trim(),
    text,
    note,
    media
  };
}

function buildOverviewHeaderHtml(text, note, media, fallbackIntro) {
  const copy = text || fallbackIntro || '';
  const copyParts = [];
  if (copy) copyParts.push(`    <p class="mc-case-overview">${copy}</p>`);
  if (note) copyParts.push(`    ${note}`);
  const copyHtml = copyParts.length ? `\n${copyParts.join('\n')}\n` : '';
  const mediaHtml = media
    ? `\n    <div class="mc-case-overview-media">\n      ${media}\n    </div>\n`
    : '';
  return { copyHtml, mediaHtml };
}

function buildToolsHtml(tools) {
  if (!tools?.length) return '';
  return tools
    .map((t) => `<span role="listitem" class="mc-tool">${escapeHtml(t)}</span>`)
    .join('\n              ');
}

function buildTagsHtml(tags) {
  if (!tags?.length) return '';
  return tags.map((t) => `<span class="mc-case-tag">${escapeHtml(t)}</span>`).join('\n      ');
}

function buildStatsHtml(project) {
  const stats = project.spotlightStats;
  if (!stats?.length) return '';
  return `
      <div class="mc-stat-grid" aria-label="Project impact summary">
        ${stats
          .slice(0, 4)
          .map((stat) => {
            const numeric = String(stat.value).match(/^(\d+)/);
            const isCopy = !numeric && !/^\d/.test(String(stat.value));
            const valueClass = isCopy ? 'mc-stat-value mc-stat-value--copy' : 'mc-stat-value';
            const inner = numeric
              ? `<span data-count="${numeric[1]}">0</span>${String(stat.value).slice(numeric[1].length)}`
              : escapeHtml(stat.value);
            const heading = stat.headline || stat.metric || 'Impact';
            return `<div>
          <p class="mc-stat-label">${escapeHtml(heading)}</p>
          <p class="${valueClass}">${inner}</p>
          <p class="mc-stat-caption">${escapeHtml(stat.label)}</p>
        </div>`;
          })
          .join('\n        ')}
      </div>`;
}

function buildNextProjectsHtml(pageId) {
  const projects = getNextProjects(pageId, 2);
  if (!projects.length) return '';
  const cards = projects
    .map((p) => {
      const tags = (p.tags || []).slice(0, 2);
      const imgStyle = p.cardImagePosition ? ` style="object-position: ${p.cardImagePosition};"` : '';
      return `        <a href="${p.link}" class="mc-next-card">
          <span class="mc-next-media"><img src="${p.image}" alt="${escapeHtml(p.title)}"${imgStyle}></span>
          <span class="mc-next-body">
            <span class="mc-next-name">${escapeHtml(p.title)}</span>
            <span class="mc-next-desc">${escapeHtml(p.subtitle || p.desc || '')}</span>
            <span class="mc-next-tags">
              ${tags.map((t) => `<span class="mc-next-tag">${escapeHtml(t)}</span>`).join('\n              ')}
            </span>
          </span>
        </a>`;
    })
    .join('\n');

  return `
  <section data-screen-label="Next projects" class="mc-next">
    <div class="mc-next-inner">
      <h2 class="mc-next-title">Next projects</h2>
      <div class="mc-next-grid">
${cards}
      </div>
    </div>
  </section>`;
}

function buildPage(pageId, fileName) {
  const sourcePath = resolve(root, fileName);
  const source = readFileSync(sourcePath, 'utf8');
  let content = extractBetween(source, START, END);
  if (!content) {
    throw new Error(`Missing page content markers in ${fileName}`);
  }

  content = content.replace(/<div class="case-hero">[\s\S]*?<\/div>\s*(?=<)/i, '');
  const overviewExtract = extractAndRemoveOverviewSection(content);
  content = overviewExtract.content;
  content = enhanceContent(content);

  let toc = extractTocEntries(content);
  if (!toc.length && content.trim()) {
    content = `<section id="section-01" data-spy-target="section-01" data-screen-label="Content" class="mc-section mc-legacy-section">\n${content}\n</section>`;
    toc = extractTocEntries(content);
  }

  const project = getProjectMeta(pageId);
  const tocHtml = toc
    .map(({ id, label }) => `      <a data-spy="${id}" href="#${id}" class="mc-toc-link">${escapeHtml(label)}</a>`)
    .join('\n');

  const title = extractHeadField(source, /<title>([^<]+)<\/title>/i) || `${project.title} — Michelle Chen`;
  const description = extractHeadField(source, /<meta name="description" content="([^"]*)"/i) || project.desc || '';
  const canonical = extractHeadField(source, /<link rel="canonical" href="([^"]*)"/i) || `https://themichellechen.com/${fileName}`;
  const ogImage = extractHeadField(source, /<meta property="og:image" content="([^"]*)"/i) || project.image || project.heroImage || '';

  const teamRoster = project.teamRoster || [];
  const teamCount = teamRoster.length || null;
  const teamLabel = teamCount ? `Team (${teamCount})` : 'Team';
  const teamValue = teamRoster.length ? teamRoster.join(', ') : project.team || '—';
  const intro = project.demoIntro || project.desc || '';
  const overviewParts = buildOverviewHeaderHtml(
    overviewExtract.text,
    overviewExtract.note,
    overviewExtract.media,
    intro
  );
  const overviewCopyHtml = overviewParts.copyHtml;
  const overviewMediaHtml = overviewParts.mediaHtml;
  const heroSrc = project.heroImage || project.image || '';
  const heroAlt = project.heroAlt || `${project.title} main hero image`;
  const statsHtml = buildStatsHtml(project);
  const hasStats = Boolean(statsHtml);
  const metaClass = hasStats ? 'mc-case-meta' : 'mc-case-meta mc-case-meta--solo';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Michelle Chen">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(ogImage)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(ogImage)}">

    <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/css/style.css?v=20260707h">
<link rel="stylesheet" href="assets/css/cursor.css?v=20260630n">
<link rel="stylesheet" href="assets/css/case-infographic.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&amp;family=Montserrat:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="assets/css/case.css?v=20260708a">
<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
<script src="https://t.contentsquare.net/uxa/71f187ae3daf5.js" defer></script>
</head>
<body class="mc-case">
<div class="mc-root">

  <nav class="mc-nav" aria-label="Primary">
    <a href="index.html" class="mc-nav-home" aria-label="Home" data-tip="Home">
      <span data-eye="true" class="mc-eye-nav"><span data-pupil="true"></span></span>
      <span data-eye="true" class="mc-eye-nav"><span data-pupil="true"></span></span>
    </a>
    <div class="mc-nav-links">
      <a href="index.html#featured-work" class="mc-nav-link" aria-label="Work" data-tip="Work"><i class="fas fa-briefcase" aria-hidden="true"></i></a>
      <a href="index.html#about" class="mc-nav-link" aria-label="About" data-tip="About"><i class="fas fa-user" aria-hidden="true"></i></a>
      <a href="index.html#contact" class="mc-nav-link" aria-label="Contact" data-tip="Contact"><i class="fas fa-envelope" aria-hidden="true"></i></a>
    </div>
  </nav>

  <header data-screen-label="Case header" class="mc-case-header">
    <h1 class="mc-case-h1">${escapeHtml(project.title)}</h1>
    ${project.subtitle ? `<p class="mc-case-sub">${escapeHtml(project.subtitle)}</p>` : ''}
    ${project.tags?.length ? `<div class="mc-case-tags">\n      ${buildTagsHtml(project.tags)}\n    </div>` : ''}

    <div class="${metaClass}">
      <div class="mc-meta-left">
        <div class="mc-meta-facts">
          <div>
            <p class="mc-meta-label">${escapeHtml(teamLabel)}</p>
            <p class="mc-meta-value">${escapeHtml(teamValue)}</p>
          </div>
          ${project.timeline ? `<div>
            <p class="mc-meta-label">Timeline</p>
            <p class="mc-meta-value">${escapeHtml(project.timeline)}</p>
          </div>` : ''}
          ${project.tools?.length ? `<div class="mc-meta-full">
            <p class="mc-meta-label">Tools</p>
            <div class="mc-tool-list" role="list" aria-label="Project tools">
              ${buildToolsHtml(project.tools)}
            </div>
          </div>` : ''}
        </div>
      </div>
      ${statsHtml}
    </div>
${overviewCopyHtml}    ${heroSrc ? `<div class="mc-case-hero-img">
      <img src="${heroSrc}" alt="${escapeHtml(heroAlt)}">
    </div>${overviewMediaHtml}` : `${overviewMediaHtml}`}
  </header>

  <div class="mc-case-body">
    <nav class="mc-toc" aria-label="On this page">
${tocHtml}
    </nav>

    <div class="mc-sections mc-sections--legacy">
${content}
    </div>
  </div>
${buildNextProjectsHtml(pageId)}

  <section data-screen-label="Footer" class="mc-cta">
    <div class="mc-cta-inner">
      <div class="mc-cta-eyes" aria-hidden="true">
        <span data-eye="true" class="mc-eye-big"><span data-pupil="true"></span></span>
        <span data-eye="true" class="mc-eye-big"><span data-pupil="true"></span></span>
      </div>
      <h2 class="mc-cta-title">Let's build something<br>that ships.</h2>
      <div class="mc-cta-actions">
        <a href="https://www.linkedin.com/in/mchen0727/" target="_blank" rel="noopener noreferrer" class="mc-icon-btn" aria-label="LinkedIn"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a>
        <a href="mailto:themichellechen@gmail.com" class="mc-icon-btn" aria-label="Email"><i class="fas fa-envelope" aria-hidden="true"></i></a>
        <a href="index.html#contact" class="mc-cta-btn">Get in touch <i class="fas fa-arrow-up" aria-hidden="true"></i></a>
      </div>
    </div>
    <footer class="mc-footer">
      This Portfolio is built with pure HTML / CSS / JS. Co-built with <a href="https://cursor.com" target="_blank" rel="noopener noreferrer">Cursor</a> &amp; <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</a>. Hosted on <a href="https://github.com/Yi-Hsuan0727/Yi" target="_blank" rel="noopener noreferrer">GitHub <i class="fab fa-github" aria-hidden="true"></i></a>.
    </footer>
  </section>
</div>

<script src="assets/js/case.js?v=20260708a"></script>
</body>
</html>
`;
}

function main() {
  const args = process.argv.slice(2);
  const targets = args.length
    ? args.filter((id) => MIGRATE_PAGES[id])
    : Object.keys(MIGRATE_PAGES);

  for (const pageId of targets) {
    const fileName = MIGRATE_PAGES[pageId];
    try {
      const html = buildPage(pageId, fileName);
      writeFileSync(resolve(root, fileName), html);
      const norm = normalizeProcessFile(resolve(root, fileName));
      console.log(`migrated ${fileName}${norm.changed ? ` (+ ${norm.sections} process section(s))` : ''}`);
    } catch (err) {
      console.error(`FAILED ${fileName}:`, err.message);
      process.exitCode = 1;
    }
  }
}

main();
