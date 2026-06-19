# design-sync notes — yi-portfolio-ds

## What this is
- The portfolio itself is a **static HTML/CSS/jQuery site** (no component library). The
  React design system in `design-system/` was **authored from the portfolio's hand-written
  CSS** as a faithful port — classes are namespaced under `ds-`, tokens come from the site's
  `:root` vars + `FIGMA_TOKENS.json`. It is NOT generated from the live site.

## Build
- Build command: `npm --prefix design-system run build` (tsup + `design-system/scripts/build-css.mjs`).
  Emits `design-system/dist/`: `index.es.js`, `index.d.ts`, `styles.css`, `tokens.css`.
- Converter is run from the repo root pointing INTO the subpackage:
  `--node-modules ./design-system/node_modules --entry ./design-system/dist/index.es.js`.
- `dist/styles.css` is **self-contained**: `build-css.mjs` inlines the tokens and hoists the
  remote Montserrat `@import` to the top. Do NOT make `styles.css` `@import "./tokens.css"` —
  that sibling import dangles once the converter copies it to `_ds_bundle.css`
  (`[CSS_IMPORT_MISSING]`). The build script exists specifically to avoid this.

## Config / overrides
- `overrides`: `Modal` → `single` (overlay dialog), `PieChart` + `ProjectCard` → `column`
  (wide donut / tilted deck overflow a grid cell — flagged by `[GRID_OVERFLOW]`).
- `FilterBar` props `Omit` `onChange` from `HTMLAttributes` (string handler vs FormEvent).

## Known render warns
- `[FONT_REMOTE] Montserrat` — expected; the font loads via a Google Fonts `@import`. No action.
- No other warn lines. Render check: 17/17 clean.

## Upload
- First sync was **blocked on auth**: the `DesignSync` tool could not get design scopes from
  `CLAUDE_CODE_OAUTH_TOKEN`. The user must run `/login` before the project can be created and
  uploaded. The local bundle (`ds-bundle/`) is fully built, validated (exit 0), and graded.

## Re-sync risks (watch-list)
- **The DS is a manual port, not generated.** If the portfolio's CSS/markup changes, these
  components and tokens will NOT auto-update — re-port by hand and rebuild.
- **Charts render in their static "revealed" state** by design (the site reveals bars/pie on
  scroll via `.is-visible`; the DS drops that gating so cards read correctly standalone).
- **Preview cover/figure images are inline SVG data URIs** — no external asset dependency.
- **playwright + chromium were installed into `.ds-sync/` (gitignored)** for the render check;
  a fresh clone must reinstall them (`cd .ds-sync && npm i playwright && npx playwright install chromium`).
