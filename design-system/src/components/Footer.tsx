import * as React from "react";
import { cx } from "../util";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Copyright / left-hand text. */
  copyright: string;
  /** Social / utility links shown on the right. */
  links?: FooterLink[];
  /** `green` is the brand-green footer variant used on home/playground. */
  variant?: "default" | "green";
}

/**
 * Site footer: copyright on the left, social links on the right.
 * Supports the default bordered look and the brand-green variant.
 */
export function Footer({
  copyright,
  links = [],
  variant = "default",
  className,
  ...rest
}: FooterProps) {
  return (
    <footer
      className={cx("ds-footer", variant === "green" && "ds-footer--green", className)}
      {...rest}
    >
      <span className="ds-footer__copyright">{copyright}</span>
      {links.length > 0 && (
        <nav className="ds-footer__socials">
          {links.map((link) => (
            <a key={link.href} className="ds-footer__link" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </footer>
  );
}
