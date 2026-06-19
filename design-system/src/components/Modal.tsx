import * as React from "react";
import { cx } from "../util";

export interface ModalMetaRow {
  label: string;
  value: string;
}

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls visibility. Defaults to `true` so the open state renders. */
  open?: boolean;
  /** Dialog title. */
  title: string;
  /** Optional hero image at the top of the dialog. */
  imageSrc?: string;
  /** Definition-list metadata rows (Role, Year, Tools…). */
  meta?: ModalMetaRow[];
  /** Summary paragraph. */
  summary?: string;
  /** Primary link URL. */
  linkHref?: string;
  /** Primary link label. */
  linkLabel?: string;
  /** Close handler (renders the round close button when provided). */
  onClose?: () => void;
}

/**
 * Project detail modal — a tilted comic-outlined dialog over a dimmed backdrop,
 * with an optional hero image, metadata rows, summary, and a primary link.
 */
export function Modal({
  open = true,
  title,
  imageSrc,
  meta = [],
  summary,
  linkHref,
  linkLabel = "View project",
  onClose,
  className,
  ...rest
}: ModalProps) {
  if (!open) return null;
  return (
    <div className={cx("ds-modal", className)} role="dialog" aria-modal="true" {...rest}>
      <div className="ds-modal__backdrop" onClick={onClose} />
      <div className="ds-modal__dialog">
        {onClose && (
          <button
            type="button"
            className="ds-modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        )}
        {imageSrc && (
          <div className="ds-modal__hero">
            <img src={imageSrc} alt="" />
          </div>
        )}
        <div className="ds-modal__body">
          <h2 className="ds-modal__title">{title}</h2>
          {meta.length > 0 && (
            <dl className="ds-modal__meta">
              {meta.map((row) => (
                <div className="ds-modal__meta-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {summary && <p className="ds-modal__summary">{summary}</p>}
          {linkHref && (
            <a className="ds-modal__link" href={linkHref}>
              {linkLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
