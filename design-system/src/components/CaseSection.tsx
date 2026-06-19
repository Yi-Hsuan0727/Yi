import * as React from "react";
import { cx } from "../util";
import { SectionHeading } from "./SectionHeading";

export interface CaseSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Optional uppercase kicker for the section header. */
  kicker?: string;
  /** Optional section title. */
  title?: string;
  /** `alt` gives the muted grey background; `problem` tints the heading red. */
  tone?: "default" | "alt" | "problem";
  children?: React.ReactNode;
}

/**
 * Case-study section wrapper — constrains content to a readable column with an
 * optional heading. The `alt` tone provides the alternating grey background.
 */
export function CaseSection({
  kicker,
  title,
  tone = "default",
  className,
  children,
  ...rest
}: CaseSectionProps) {
  return (
    <section
      className={cx(
        "ds-case-section",
        tone === "alt" && "ds-case-section--alt",
        className
      )}
      {...rest}
    >
      <div className="ds-case-section__inner">
        {(kicker || title) && (
          <header className="ds-case-section__header">
            <SectionHeading
              kicker={kicker}
              title={title ?? ""}
              tone={tone === "problem" ? "problem" : "default"}
            />
          </header>
        )}
        <div className="ds-case-section__body">{children}</div>
      </div>
    </section>
  );
}
