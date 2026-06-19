import * as React from "react";
import { cx } from "../util";

export interface Stat {
  /** Large value (e.g. "73%", "1.2k"). */
  value: string;
  /** Supporting label beneath the value. */
  label: string;
}

export interface StatStripProps extends React.HTMLAttributes<HTMLUListElement> {
  /** The stats to display. Auto-fits into a responsive grid. */
  stats: Stat[];
}

/**
 * Compact stat strip — a responsive grid of value/label cards, each topped with
 * a blue accent rule. Used to surface key metrics in case studies.
 */
export function StatStrip({ stats, className, ...rest }: StatStripProps) {
  return (
    <ul className={cx("ds-stat-strip", className)} {...rest}>
      {stats.map((stat, i) => (
        <li className="ds-stat" key={i}>
          <span className="ds-stat__value">{stat.value}</span>
          <span className="ds-stat__label">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
