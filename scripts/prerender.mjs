/*
 * prerender.mjs — bakes the JS-built layout into the static .html files.
 *
 * Why: the portfolio's nav, hero, featured cards, contact band and footer are
 * defined once in assets/js/layout-components.js + components.js. Serving them
 * only via client-side JS meant crawlers and no-JS users got an empty page.
 * This script runs the exact same builders in jsdom and writes the resulting
 * markup into each page, so the served HTML is complete. At runtime,
 * PortfolioApp.init() sees <body data-prerendered> and skips the rebuild,
 * only binding behaviors.
 *
 * Usage:  node scripts/prerender.mjs
 *
 * Re-runnable: page-specific content is preserved between
 * <!--page-content:start--> / <!--page-content:end--> markers, so you can
 * edit content in the .html files (or project data in components.js) and
 * re-run this script to refresh the surrounding layout.
 */

import { JSDOM } from 'jsdom';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* pageType passed to PortfolioApp.init() per file (kept in sync with the
   inline init call in each page). */
const PAGES = {
    'index.html': 'home',
    'about.html': 'about',
    'playground.html': 'playground'
};

const layoutSrc = readFileSync(resolve(root, 'assets/js/layout-components.js'), 'utf8');
const componentsSrc = readFileSync(resolve(root, 'assets/js/components.js'), 'utf8');

const START = '<!--page-content:start-->';
const END = '<!--page-content:end-->';

function prerenderPage(file, pageType) {
    const path = resolve(root, file);
    const source = readFileSync(path, 'utf8');

    const dom = new JSDOM(source, {
        url: 'https://themichellechen.com/' + file,
        runScripts: 'outside-only'
    });
    const { window } = dom;
    const { document } = window;

    /* Preserve the body's <script> tags — buildLayout wipes body.innerHTML. */
    const scripts = [...document.body.querySelectorAll(':scope > script')].map((s) => s.outerHTML);

    /* Recover the authored page content. On a fresh (unprerendered) page it
       lives in #page-specific-content; on an already-prerendered page it sits
       between the content markers inside <main>. */
    let contentDiv = document.getElementById('page-specific-content');
    if (!contentDiv && source.includes(START)) {
        const inner = source.split(START)[1].split(END)[0];
        contentDiv = document.createElement('div');
        contentDiv.id = 'page-specific-content';
        contentDiv.innerHTML = inner;
        document.body.appendChild(contentDiv);
    }
    if (contentDiv) {
        /* Flow the markers through buildLayout so the content region stays
           recoverable on the next run. */
        contentDiv.innerHTML = START + contentDiv.innerHTML + END;
    }

    /* Evaluate the builder scripts in the page context, then build. The two
       files must share one eval scope (top-level const does not reach window),
       and the globals are exported explicitly. */
    window.eval(
        layoutSrc + '\n' + componentsSrc +
        '\n;window.LayoutComponents = LayoutComponents; window.PortfolioApp = PortfolioApp;'
    );
    window.PortfolioApp.injectHead(pageType);
    window.PortfolioApp.buildLayout(pageType);

    /* injectHead prepends charset/favicon meant for the JS-only path — drop
       the duplicates (the authored head already declares both). */
    const charsets = document.head.querySelectorAll('meta[charset]');
    for (let i = 1; i < charsets.length; i++) charsets[i].remove();
    const favicons = document.head.querySelectorAll('link[rel="icon"]');
    for (let i = 1; i < favicons.length; i++) favicons[i].remove();

    /* Restore the page's script tags after the layout (content first). */
    document.body.insertAdjacentHTML('beforeend', '\n' + scripts.join('\n') + '\n');

    /* Tell the runtime the layout already exists. */
    document.body.setAttribute('data-prerendered', '1');

    writeFileSync(path, '<!DOCTYPE html>\n' + document.documentElement.outerHTML + '\n');
    console.log(`prerendered ${file} (${pageType})`);
}

for (const [file, pageType] of Object.entries(PAGES)) {
    try {
        prerenderPage(file, pageType);
    } catch (err) {
        console.error(`FAILED ${file}:`, err.message);
        process.exitCode = 1;
    }
}
