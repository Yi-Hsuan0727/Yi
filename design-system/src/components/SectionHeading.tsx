import * as React from "react";
import { cx } from "../util";

export interface SectionHeadingProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Small uppercase kicker shown above the title, with an accent bar. */
  kicker?: string;
  /** The heading text. */
  title: string;
  /** `problem` switches the accent bar + title to the red destructive tone. */
  tone?: "default" | "problem";
  /** Heading level for the title element. */
  as?: "h1" | "h2" | "h3";
}

/**
 * Section header: an optional uppercase kicker with a left accent bar above a
 * large bold title. Used to open case-study sections.
 */
export function SectionHeading({
  kicker,
  title,
  tone = "default",
  as = "h2",
  className,
  ...rest
}: SectionHeadingProps) {
  const Title = as;
  return (
    <div
      className={cx(
        "ds-section-heading",
        tone === "problem" && "ds-section-heading--problem",
        className
      )}
      {...rest}
    >
      {kicker && <span className="ds-section-heading__kicker">{kicker}</span>}
      <Title className="ds-section-heading__title">{title}</Title>
    </div>
  );
}
