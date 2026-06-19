import * as React from "react";
import { cx } from "../util";

export interface FilterOption {
  /** Visible label. */
  label: string;
  /** Stable value passed to `onChange`. */
  value: string;
}

export interface FilterBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The filter chips to render. */
  items: FilterOption[];
  /** Currently active value. */
  value?: string;
  /** Fired with the option value when a chip is clicked. */
  onChange?: (value: string) => void;
}

/**
 * Horizontal row of filter chips — the "works" project filter bar.
 * The active chip is outlined in the brand green.
 */
export function FilterBar({
  items,
  value,
  onChange,
  className,
  ...rest
}: FilterBarProps) {
  return (
    <div className={cx("ds-filter-bar", className)} role="group" {...rest}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={cx("ds-filter-btn", item.value === value && "is-active")}
          aria-pressed={item.value === value}
          onClick={() => onChange?.(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
