# Cursor animations — reference

## CursorLogic API

```javascript
CursorLogic.init()     // destroy + create pointer/label + bind listeners (no-op if width < 1200)
CursorLogic.ensure()   // init if .cursor-pointer missing; destroy if width < 1200
CursorLogic.destroy()  // remove DOM, classes, listeners
```

### Internal listener map (`_listeners`)

| Event | Target | Purpose |
|-------|--------|---------|
| `mousemove` | `window` | Position + hover sync |
| `mouseleave` | `document` | Hide cursor |
| `mouseenter` | `document` | Re-show if user has moved |
| `scroll` | `window`, `#scroll-container` | Re-sync hover under fixed pointer coords |
| `pageshow` | `window` | BFCache restore / hover reset |
| `mouseleave` | `.project-grid`, `.home-toolbox-stickers` | rAF resync after leaving nested targets |

### Label offset defaults

- Pointer: `left/top` = `clientX/clientY`
- Label: `left = x + 24`, `top = y + 18`

### Pointer asset

- SVG: `assets/img/cursor-sticker.svg`
- Render size: 36×44px, `transform-origin: 2px 2px`
- Hover scale: `1.06` when `body.hovering:not(.cursor-view)`

## Z-index stack

| Layer | z-index |
|-------|---------|
| `.home-award-preview` | 99998 |
| `.cursor-pointer` | 100002 |
| `.cursor-label` | 100003 |

Keep new cursor-adjacent UI within this range or below modals defined in `style.css`.

## Comic speech bubble variants

Defined in `style.css` — shared by cursor labels, monster chat, contact form, home sections.

| Modifier | Tail direction |
|----------|----------------|
| `.comic-speech-bubble--tail-down` | Below bubble |
| `.comic-speech-bubble--tail-up` | Above bubble |
| `.comic-speech-bubble--tail-right` | Right side |

Cursor labels use the base bubble without tail modifiers.

## Tool sticker integration

Built in `LayoutComponents.buildToolSticker()`:

```html
<a class="tool-sticker tool-sticker--{modifier}" href="..." aria-label="Tool name" ...>
```

`syncHoverState` reads `aria-label` for the cursor label text. Always set a meaningful `aria-label` on new stickers.

## Award preview integration

Trigger markup:

```html
<a class="home-about-award-link" href="..." data-award-preview="assets/img/...">
```

Initialized only on `.home-about-copy` section, desktop, motion allowed.

## Related motion (not CursorLogic)

| Feature | File | Behavior |
|---------|------|----------|
| Monster eyes follow pointer | `assets/js/monster.js` | Separate from custom cursor |
| Fish avoid cursor in 3D tank | `fish-tank-3d.html` | Raycast mouse into scene |
| Carousel grab cursor | `assets/js/carousel.js` | Native `cursor: grab/grabbing` |

These can coexist with `CursorLogic` — use native `cursor` only where custom cursor is disabled (mobile) or for drag affordances inside scroll containers if needed.

## Dark mode

Cursor sticker and comic bubbles use fixed light-theme colors (`#ffffff` fill, `#111111` border). If adding dark-aware cursor styling, mirror `[data-theme="dark"]` token overrides from `style.css` rather than hardcoding new hex values.
