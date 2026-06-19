import * as React from "react";
import { cx } from "../util";

export interface PieSegment {
  /** Legend label. */
  label: string;
  /** Share as a percentage 0–100. Segments should sum to ~100. */
  value: number;
  /** Segment / swatch color (any CSS color). */
  color: string;
}

export interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small uppercase chart title. */
  title?: string;
  /** The chart segments. */
  segments: PieSegment[];
  /** Big number shown in the donut hole. */
  centerValue?: string;
  /** Label beneath the donut-hole number. */
  centerLabel?: string;
}

function conicGradient(segments: PieSegment[]): string {
  let acc = 0;
  const stops = segments.map((s) => {
    const start = acc;
    acc += s.value;
    return `${s.color} ${start}% ${acc}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

/**
 * Donut / pie chart — the usability-issue breakdown. A conic-gradient ring with
 * a labelled center hole and a value legend, built from `segments`.
 */
export function PieChart({
  title,
  segments,
  centerValue,
  centerLabel,
  className,
  ...rest
}: PieChartProps) {
  return (
    <div className={cx("ds-pie-chart", className)} {...rest}>
      {title && <p className="ds-pie-chart__title">{title}</p>}
      <div className="ds-pie-chart__body">
        <div className="ds-pie-chart__visual">
          <div
            className="ds-pie-chart__ring"
            style={{ background: conicGradient(segments) }}
          />
          {(centerValue || centerLabel) && (
            <div className="ds-pie-chart__hole">
              {centerValue && (
                <span className="ds-pie-chart__hole-num">{centerValue}</span>
              )}
              {centerLabel && (
                <span className="ds-pie-chart__hole-label">{centerLabel}</span>
              )}
            </div>
          )}
        </div>
        <ul className="ds-pie-chart__legend">
          {segments.map((seg, i) => (
            <li className="ds-pie-chart__legend-item" key={i}>
              <span
                className="ds-pie-chart__swatch"
                style={{ background: seg.color }}
              />
              <span className="ds-pie-chart__legend-label">{seg.label}</span>
              <span className="ds-pie-chart__legend-value">{seg.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
