import * as React from "react";
import { cx } from "../util";

export interface ProblemCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon node shown in the round red badge. */
  icon?: React.ReactNode;
  /** Uppercase eyebrow label (e.g. "Pain point"). */
  label?: string;
  /** Card title. */
  title?: string;
  /** Body copy. */
  children?: React.ReactNode;
}

/**
 * Problem / pain-point callout card — a red-tinted card used in the "problem"
 * sections of case studies to highlight findings and blockers.
 */
export function ProblemCard({
  icon,
  label,
  title,
  className,
  children,
  ...rest
}: ProblemCardProps) {
  return (
    <div className={cx("ds-problem-card", className)} {...rest}>
      {icon && <span className="ds-problem-card__icon">{icon}</span>}
      {label && <span className="ds-problem-card__label">{label}</span>}
      {title && <h4 className="ds-problem-card__title">{title}</h4>}
      {children && <p className="ds-problem-card__body">{children}</p>}
    </div>
  );
}
