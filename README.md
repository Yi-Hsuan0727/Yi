# themichellechen.com

[![Accessibility checks](https://github.com/Yi-Hsuan0727/Yi/actions/workflows/a11y.yml/badge.svg)](https://github.com/Yi-Hsuan0727/Yi/actions/workflows/a11y.yml)

Personal portfolio of **Michelle Chen** — design engineer & accessibility-focused
product designer. Built with plain HTML, CSS, and JavaScript; deployed on
GitHub Pages at [themichellechen.com](https://themichellechen.com/).

## How it's built

- **Static-first.** Every page ships its full content — nav, hero, case study
  bodies, contact, footer — as semantic HTML. JavaScript is progressive
  enhancement only (animations, card flips, marquee); the site is fully
  readable and navigable with JS disabled.
- **Shared layout, no framework.** Page chrome is defined once in
  `assets/js/layout-components.js` and baked into the static files by a small
  prerender step:

  ```sh
  node scripts/prerender.mjs
  ```

  Run it after editing page content (kept between the
  `<!--page-content:start/end-->` markers in each .html file) or the shared
  layout/project data.
- **Accessibility as code.** Native keyboard scrolling, a skip link and
  `<main>` landmark on every page, consistent `:focus-visible` indicators,
  reduced-motion support throughout, and marquee/carousel clones hidden from
  assistive tech.

## Accessibility CI

Every push runs [a GitHub Actions workflow](.github/workflows/a11y.yml) that
serves the site and:

1. runs **axe-core** against all 18 pages scoped to the WCAG 2.0/2.1 A + AA
   rulesets — any violation fails the build;
2. runs **Lighthouse CI** on every page and requires an accessibility score
   of **100** (performance regressions warn instead of failing).
