import * as React from "react";
import { cx } from "../util";

export interface ProjectCardProps {
  /** Project title shown in the card footer. */
  title: string;
  /** Cover image URL. */
  imageSrc?: string;
  /** Optional category tag shown beside the title. */
  tag?: string;
  /** Slight tilt in degrees for the scattered-deck look. */
  tilt?: number;
  /** Render the raised/active state. */
  active?: boolean;
  /** Link URL — renders an `<a>`; otherwise a `<button>`. */
  href?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Project card — a white, slightly tilted card with a square cover image that
 * lifts on hover. The building block of the "more work" deck and grids.
 */
export function ProjectCard({
  title,
  imageSrc,
  tag,
  tilt = 0,
  active = false,
  href,
  onClick,
  className,
}: ProjectCardProps) {
  const classes = cx("ds-project-card", active && "is-active", className);
  const style = { ["--ds-card-tilt" as string]: `${tilt}deg` } as React.CSSProperties;
  const inner = (
    <>
      <span className="ds-project-card__visual">
        {imageSrc && <img src={imageSrc} alt="" />}
      </span>
      <span className="ds-project-card__footer">
        <span className="ds-project-card__title">{title}</span>
        {tag && (
          <span className="ds-tag ds-tag--accent ds-tag--sm ds-tag--uppercase">
            {tag}
          </span>
        )}
      </span>
    </>
  );
  if (href) {
    return (
      <a className={classes} style={style} href={href}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={classes} style={style} onClick={onClick}>
      {inner}
    </button>
  );
}
