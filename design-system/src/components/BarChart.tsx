import * as React from "react";
import { cx } from "../util";

export interface BarChartRow {
  /** Row label. */
  label: string;
  /** Bar fill as a percentage 0–100. */
  value: number;
  /** Value text shown at the end of the row (defaults to `value%`). */
  display?: string;
  /** Highlight this bar in the brand green (the "goal" / target bar). */
  goal?: boolean;
}

export interface BarChartStat {
  /** Large emphasized number. */
  num: string;
  /** Caption beneath the number. */
  label: string;
}

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small uppercase chart title. */
  title?: string;
  /** Optional description line above the bars. */
  description?: string;
  /** The bar rows. */
  rows: BarChartRow[];
  /** Optional 3-up summary stats below the bars. */
  stats?: BarChartStat[];
  /** Optional source/footnote line. */
  source?: string;
}

/**
 * Horizontal bar chart — the research infographic used across case studies.
 * Each row is a labelled track with a fill; mark a row `goal` to highlight it.
 * Renders fully filled (no scroll animation) so it reads correctly anywhere.
 */
export function BarChart({
  title,
  description,
  rows,
  stats,
  source,
  className,
  ...rest
}: BarChartProps) {
  return (
    <div className={cx("ds-bar-chart", className)} {...rest}>
      {title && <p className="ds-bar-chart__title">{title}</p>}
      {description && <p className="ds-bar-chart__desc">{description}</p>}
      <div className="ds-bar-chart__bars">
        {rows.map((row, i) => (
          <div className="ds-bar-chart__row" key={i}>
            <span className="ds-bar-chart__label">{row.label}</span>
            <span className="ds-bar-chart__track">
              <span
                className={cx(
                  "ds-bar-chart__bar",
                  row.goal && "ds-bar-chart__bar--goal"
                )}
                style={{ width: `${Math.max(0, Math.min(100, row.value))}%` }}
              />
            </span>
            <span
              className={cx(
                "ds-bar-chart__value",
                row.goal && "ds-bar-chart__value--goal"
              )}
            >
              {row.display ?? `${row.value}%`}
            </span>
          </div>
        ))}
      </div>
      {stats && stats.length > 0 && (
        <div className="ds-bar-chart__stats">
          {stats.map((stat, i) => (
            <div className="ds-bar-chart__stat" key={i}>
              <span className="ds-bar-chart__stat-num">{stat.num}</span>
              <span className="ds-bar-chart__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
      {source && <p className="ds-bar-chart__source">{source}</p>}
    </div>
  );
}
