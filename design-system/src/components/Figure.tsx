import * as React from "react";
import { cx } from "../util";

export interface FigureProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Image URL. Omit and pass `children` to frame custom content instead. */
  src?: string;
  /** Alt text for the image. */
  alt?: string;
  /** Caption shown beneath the frame. */
  caption?: string;
  /** `readable` uses a white frame and `object-fit: contain` for screenshots/diagrams. */
  readable?: boolean;
  /** Custom framed content (used instead of `src`). */
  children?: React.ReactNode;
}

/**
 * Captioned figure — a bordered media frame with an optional caption. Use
 * `readable` for UI screenshots and diagrams that must not be cropped.
 */
export function Figure({
  src,
  alt = "",
  caption,
  readable = false,
  className,
  children,
  ...rest
}: FigureProps) {
  return (
    <figure
      className={cx("ds-figure", readable && "ds-figure--readable", className)}
      {...rest}
    >
      <div className="ds-figure__frame">
        {src ? <img src={src} alt={alt} /> : children}
      </div>
      {caption && <figcaption className="ds-figure__caption">{caption}</figcaption>}
    </figure>
  );
}
