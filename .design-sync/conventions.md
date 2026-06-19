# Yi Portfolio Design System — how to build with it

A small, opinionated React kit ported from Yi-Hsuan Chen's portfolio. The look is
clean and editorial with a **playful, sticker/comic** streak: a green brand accent,
the Montserrat typeface, pill-shaped controls, hard-outlined speech bubbles, and
tilted cards with offset shadows. Every component is pre-styled — you compose them
with **props**, never by hand-writing their markup or CSS.

## Setup & wrapping

- **No provider is required.** Components render correctly on their own.
- The stylesheet (`styles.css`) defines the design tokens on `:root` and ships the
  Montserrat web font via an `@import`, so the brand font and colors apply globally
  with nothing to wire up.
- **Dark mode:** set `data-theme="dark"` on a wrapping element. Tokens flip
  automatically (`--bg-color`, `--text-color`, `--secondary-text`, `--border-color`).
- To guarantee the brand font + base color on a container you control, add the
  `ds-root` class to it. It only sets `font-family`, color, and background from tokens.

## The styling idiom — props + tokens, not utility classes

There is **no utility-class system** in this kit, and components do not accept a
`className` you should restyle through. Two rules:

1. **Style components through their props.** e.g. `<Button variant="accent" size="sm">`,
   `<Tag tone="problem">`, `<CaseSection tone="alt">`, `<SpeechBubble tail="up">`.
   Read each component's `<Name>.prompt.md` and `<Name>.d.ts` for its prop API.
2. **For your own layout glue (wrappers, grids, spacing), use the design tokens** —
   they are CSS custom properties, so reference them as `var(--token)`:

   | Group | Tokens (real names) |
   |---|---|
   | Color | `--accent-color` (#2ecc71), `--accent-hover`, `--accent-blue` (#4a55e0), `--accent-yellow`, `--text-color`, `--secondary-text`, `--bg-color`, `--border-color`, `--surface-alt`, `--problem-color` (#e74c3c) |
   | Spacing | `--space-1` (4px) … `--space-18` (72px) |
   | Radius | `--radius-xs`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill` |
   | Type | `--font-sans` (Montserrat), `--fs-display`, `--fs-section`, `--fs-body`, `--fs-body-sm`, `--fs-label` |

   Example glue: `<div style={{ display: "grid", gap: "var(--space-11)" }}>`.

## Components (import from `yi-portfolio-ds`)

- **Actions & labels:** `Button` (primary / accent / outline / ghost pills), `Tag`
  (accent / neutral / problem chips), `FilterBar` (project filter chips).
- **Brand flavor:** `SpeechBubble` (comic bubble, `tail` up/down/right), `Sticker`
  (tilted card; `iconOnly` for logo tiles).
- **Page furniture:** `SectionHeading` (kicker + title, `tone="problem"`), `Footer`
  (`variant="green"`), `TextField` (labelled input/textarea), `Modal` (project dialog),
  `ProjectCard` (tilted cover card).
- **Case-study kit:** `CaseSection`, `PhaseBlock`, `ProblemCard`, `Figure`,
  `StatStrip`, `BarChart`, `PieChart`.

## Where the truth lives

- `styles.css` + `tokens.css` — the full token set and every component's styles.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage + examples.
- `components/<group>/<Name>/<Name>.d.ts` — the exact prop contract.

## One idiomatic snippet

```tsx
import {
  CaseSection,
  StatStrip,
  Button,
} from "yi-portfolio-ds";

export function CaseIntro() {
  return (
    <CaseSection kicker="01 · Overview" title="Designing a faster checkout">
      <p>Discovery interviews showed shoppers stalling at payment.</p>
      <div style={{ margin: "var(--space-11) 0" }}>
        <StatStrip
          stats={[
            { value: "68% → 24%", label: "Checkout abandonment" },
            { value: "+41%", label: "Task completion" },
          ]}
        />
      </div>
      <Button variant="accent" iconAfter={<span aria-hidden>→</span>}>
        Read the full study
      </Button>
    </CaseSection>
  );
}
```
