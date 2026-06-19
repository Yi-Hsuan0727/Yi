import * as React from "react";
import { cx } from "../util";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` is the solid black pill; `accent` is the brand green; `outline`/`ghost` are bordered. */
  variant?: "primary" | "accent" | "outline" | "ghost";
  /** Control height/density. */
  size?: "sm" | "md";
  /** Render as an anchor (`<a href>`) instead of a `<button>`. */
  href?: string;
  /** Icon node placed before the label (e.g. a Font Awesome `<i>`). */
  icon?: React.ReactNode;
  /** Icon node placed after the label. */
  iconAfter?: React.ReactNode;
  /** Stretch to fill the container width. */
  block?: boolean;
  children?: React.ReactNode;
}

/**
 * Pill-shaped call-to-action button — the portfolio's primary action control.
 * Renders a `<button>` by default, or an `<a>` when `href` is set.
 */
export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  iconAfter,
  block,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cx(
    "ds-btn",
    `ds-btn--${variant}`,
    `ds-btn--${size}`,
    block && "ds-btn--block",
    className
  );
  const content = (
    <>
      {icon}
      {children}
      {iconAfter}
    </>
  );
  if (href) {
    const { type, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement> &
      typeof rest;
    return (
      <a className={classes} href={href} {...(anchorRest as object)}>
        {content}
      </a>
    );
  }
  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
