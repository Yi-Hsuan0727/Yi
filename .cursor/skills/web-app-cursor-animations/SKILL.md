---
name: web-app-cursor-animations
description: Implements and extends custom pointer animations for this portfolio and general web apps — sticker cursor, hover labels, image previews, and cursor-following effects. Use when the user mentions custom cursor, pointer animation, cursor hover label, cursor preview, cursor sticker, CursorLogic, cursor.js, cursor.css, or pointer effects on web pages.
---

# Web & App Cursor Animations

## Stack context

This portfolio is **vanilla HTML / CSS / JavaScript** — no React, bundler, or Tailwind. Custom cursor code lives in:

| File | Role |
|------|------|
| `assets/js/cursor.js` | `CursorLogic` — pointer + label DOM, hover sync, lifecycle |
| `assets/css/cursor.css` | Pointer/label positioning, hide native cursor, mobile guard |
| `assets/css/style.css` | `.comic-speech-bubble`, `.tool-sticker`, `.home-award-preview` |
| `assets/js/components.js` | Calls `CursorLogic.ensure()` / `destroy()` during layout init |
| `assets/img/cursor-sticker.svg` | Sticker pointer graphic |

Do **not** add `cursor-effects` (unpkg) — legacy backup pages only.

## Architecture (portfolio pattern)

```
mousemove → position .cursor-pointer + .cursor-label
         → elementFromPoint(x, y) → syncHoverState()
              ├─ .project-card / .home-spotlight-card__link → label "View", hide pointer
              ├─ .tool-sticker → label from aria-label, keep pointer
              └─ interactive targets → body.hovering (pointer scale)
```

### Lifecycle rules

1. **Init gate:** `window.innerWidth >= 1200` — below that, call `destroy()` and use native cursor.
2. **Entry points:** `CursorLogic.init()` (full setup) or `CursorLogic.ensure()` (init if missing).
3. **Teardown:** `CursorLogic.destroy()` removes DOM nodes, classes, and all listeners.
4. **Layout rebuild:** `PortfolioApp.buildLayout()` calls `destroy()` before re-injecting chrome; `init()` calls `ensure()` after.
5. **BFCache:** `pageshow` with `event.persisted` re-runs `init()`.

### Body / HTML classes

| Class | Set when |
|-------|----------|
| `custom-cursor-active` on `html` + `body` | Custom cursor running |
| `hovering` on `body` | Over interactive or labeled target |
| `cursor-view` on `body` | Label visible with pointer hidden (project cards) |
| `cursor-tool-label` on `body` | Tool-sticker label visible with pointer shown |

### Default hover targets (pointer scale via `body.hovering`)

```text
a, button, input, textarea, .project-card, .filter-btn, .visit-btn,
.theme-toggle, .nav-link, .cursor-hover
```

Add `.cursor-hover` to any element that should trigger the scale effect without being a native control.

## Adding a new hover label

Extend `syncHoverState()` in `cursor.js`:

```javascript
if (el.closest('.my-new-target')) {
    document.body.classList.add('hovering');
    setCursorLabel({
        visible: true,
        text: 'Custom text',
        hidePointer: true,   // true = cursor-view mode
        isTool: false        // true = smaller tool-sticker label padding
    });
    return;
}
```

**Label options (`setCursorLabel`):**

| Option | Default | Effect |
|--------|---------|--------|
| `visible` | `false` | Show/hide label |
| `text` | `'View'` | Label copy |
| `hidePointer` | `false` | Hides sticker, shows bubble only |
| `isTool` | `false` | Applies `.cursor-label--tool` sizing |

Reuse `.comic-speech-bubble` on `.cursor-label` — do not duplicate bubble CSS in `cursor.css`.

## Image preview pattern (separate from CursorLogic)

Award links use a **fixed preview card** that follows the pointer — not the main cursor label. Reference: `PortfolioApp.initAboutAwardPreviews()` in `components.js`.

Checklist for new preview-on-hover features:

- [ ] `pointer-events: none` on preview element
- [ ] `aria-hidden="true"` on decorative preview
- [ ] Gate with `matchMedia('(max-width: 900px)')` and `prefers-reduced-motion: reduce`
- [ ] Position with viewport clamping (flip left if near right edge)
- [ ] Use `data-*` attribute on trigger for preview `src`
- [ ] z-index below modals, above page content (~99998; cursor layers use 100002+)

## CSS rules (do not break)

1. **Hide native cursor** only inside `@media (min-width: 1200px)` when `.custom-cursor-active`.
2. **Pointer elements:** `position: fixed`, `pointer-events: none`, `transition: none !important` on base state (avoid lag).
3. **Mobile:** hide `.cursor-pointer` and `.cursor-label` at `max-width: 1199px`.
4. **Reduced motion:** disable pointer scale transform under `prefers-reduced-motion: reduce`.
5. **Splash / overlays:** `splash.css` also forces `cursor: none` during splash — keep consistent if adding full-screen overlays.

## Wiring a new page

```html
<link rel="stylesheet" href="assets/css/cursor.css">
<!-- before closing body -->
<script src="assets/js/cursor.js"></script>
```

Pages using `PortfolioApp` get cursor init automatically via `CursorLogic.ensure()`. Standalone pages must call `CursorLogic.init()` on `DOMContentLoaded` (see `splash.js`).

## General web guidance (when extending beyond portfolio)

Prefer **DOM overlay + `cursor: none`** over `cursor: url(...)` for animated or labeled pointers — URL cursors cannot show speech bubbles or scale on hover.

| Approach | Use when |
|----------|----------|
| CSS `cursor: url(...)` | Simple static icon, no JS |
| Fixed div + mousemove | Sticker pointer, labels, lerp trails |
| `requestAnimationFrame` lerp | Smooth trailing dot (keep lag ≤ 0.15) |
| Canvas / WebGL | Particle trails, fish-tank-style repulsion (`fish-tank-3d.html`) |

**Performance:** update transform/left/top in `mousemove` or rAF; avoid layout thrashing; use `{ passive: true }` on scroll listeners.

**Accessibility:**

- Custom pointer is decorative → `aria-hidden="true"` on pointer/label nodes
- Never remove focus rings on keyboard targets
- Respect `prefers-reduced-motion`
- Disable custom cursor on touch / narrow viewports
- Ensure `:focus-visible` styles remain visible without relying on pointer hover

## Anti-patterns

- Do not attach cursor listeners before `CursorLogic.destroy()` on layout rebuild (duplicate listeners).
- Do not use `cursor: none` globally without the 1200px gate.
- Do not block clicks — overlay must stay `pointer-events: none`.
- Do not sync hover only on `mouseenter`/`mouseleave` on cards — use `elementFromPoint` + scroll resync (see existing scroll/`pageshow` handlers).
- Do not hardcode theme colors in new cursor CSS — use `var(--text-color)`, `var(--bg-color)` when styling new bubbles or previews.

## Verification checklist

After changes, confirm on desktop (≥1200px width):

- [ ] Sticker follows pointer; native cursor hidden
- [ ] Project card hover shows "View" bubble, pointer hidden
- [ ] Tool stickers show `aria-label` text, pointer visible
- [ ] Interactive elements trigger pointer scale (`body.hovering`)
- [ ] Leaving viewport hides cursor
- [ ] Scroll updates hover state under pointer
- [ ] Mobile/tablet shows native cursor only
- [ ] Reduced-motion disables scale transform

## Additional reference

For file-level API detail and z-index map, see [reference.md](reference.md).
