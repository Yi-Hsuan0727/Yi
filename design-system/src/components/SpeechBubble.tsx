import * as React from "react";
import { cx } from "../util";

export interface SpeechBubbleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Which edge the comic tail points from. `none` hides the tail. */
  tail?: "down" | "up" | "right" | "none";
  /** Playful rotation in degrees (the portfolio tilts bubbles ~-2°). */
  tilt?: number;
  children?: React.ReactNode;
}

/**
 * Comic-style speech bubble — a signature playful element of the portfolio.
 * White rounded card with a hard black outline, offset shadow, and an optional tail.
 */
export function SpeechBubble({
  tail = "down",
  tilt,
  className,
  style,
  children,
  ...rest
}: SpeechBubbleProps) {
  return (
    <div
      className={cx(
        "ds-bubble",
        tail !== "none" && `ds-bubble--tail-${tail}`,
        className
      )}
      style={tilt != null ? { transform: `rotate(${tilt}deg)`, ...style } : style}
      {...rest}
    >
      {children}
    </div>
  );
}
