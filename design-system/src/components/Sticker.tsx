import * as React from "react";
import { cx } from "../util";

export interface StickerProps extends React.HTMLAttributes<HTMLElement> {
  /** Tilt angle in degrees — stickers are scattered at slight rotations. */
  tilt?: number;
  /** Leading icon node (e.g. a Font Awesome `<i>` or an `<img>` logo). */
  icon?: React.ReactNode;
  /** Render as a link when set. */
  href?: string;
  /** Square icon-only sticker (no label) — used for the tool/logo wall. */
  iconOnly?: boolean;
  children?: React.ReactNode;
}

/**
 * Playful tilted "sticker" — a white card with a layered drop shadow that
 * lifts on hover. The portfolio uses these for contact links and the tool wall.
 */
export function Sticker({
  tilt = -2,
  icon,
  href,
  iconOnly = false,
  className,
  style,
  children,
  ...rest
}: StickerProps) {
  const classes = cx("ds-sticker", iconOnly && "ds-sticker--icon-only", className);
  const mergedStyle = {
    ["--ds-sticker-tilt" as string]: `${tilt}deg`,
    ...style,
  } as React.CSSProperties;
  const content = (
    <>
      {icon}
      {!iconOnly && children}
    </>
  );
  if (href) {
    return (
      <a
        className={classes}
        href={href}
        style={mergedStyle}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }
  return (
    <span className={classes} style={mergedStyle} {...rest}>
      {content}
    </span>
  );
}
