import * as React from "react";
import { cx } from "../util";

export interface PhaseBlockProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Uppercase kicker above the title (e.g. "Phase 01 · Research"). */
  kicker: string;
  /** Phase title. */
  title: string;
  /** Optional result headline rendered with a left accent bar inside the copy. */
  result?: string;
  /** Body copy (left column). */
  children?: React.ReactNode;
  /** Media node (right column) — an image, Figure, or chart. */
  media?: React.ReactNode;
}

/**
 * Bordered design-process phase block — a tinted header (kicker + title) over a
 * two-column body pairing narrative copy with a media/figure column. Drops to a
 * single column when no `media` is provided.
 */
export function PhaseBlock({
  kicker,
  title,
  result,
  media,
  className,
  children,
  ...rest
}: PhaseBlockProps) {
  return (
    <div
      className={cx("ds-phase-block", !media && "ds-phase-block--single", className)}
      {...rest}
    >
      <div className="ds-phase-block__header">
        <span className="ds-phase-block__kicker">{kicker}</span>
        <h3 className="ds-phase-block__title">{title}</h3>
      </div>
      <div className="ds-phase-block__inner">
        <div className="ds-phase-block__copy">
          {result && <p className="ds-phase-block__result">{result}</p>}
          {children}
        </div>
        {media && <div className="ds-phase-block__media">{media}</div>}
      </div>
    </div>
  );
}
