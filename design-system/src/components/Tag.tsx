import * as React from "react";
import { cx } from "../util";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color treatment. `accent` is brand green, `neutral` is subtle, `problem` is red. */
  tone?: "accent" | "neutral" | "problem";
  /** Pill density. */
  size?: "sm" | "md";
  /** Uppercase the label with tracking — used for skill/category tags. */
  uppercase?: boolean;
  children?: React.ReactNode;
}

/**
 * Small pill tag / chip for skills, categories, and metadata labels.
 */
export function Tag({
  tone = "accent",
  size = "md",
  uppercase = false,
  className,
  children,
  ...rest
}: TagProps) {
  return (
    <span
      className={cx(
        "ds-tag",
        `ds-tag--${tone}`,
        `ds-tag--${size}`,
        uppercase && "ds-tag--uppercase",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
