import { Figure } from "yi-portfolio-ds";

const shot = (w: number, h: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef2f7"/><stop offset="1" stop-color="#d9e2ec"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><rect x="24" y="24" width="${w - 48}" height="40" rx="8" fill="#2ecc71" opacity="0.85"/><rect x="24" y="84" width="${(w - 48) * 0.7}" height="16" rx="4" fill="#9aa7b4"/><rect x="24" y="112" width="${(w - 48) * 0.5}" height="16" rx="4" fill="#bcc6d1"/></svg>`
  )}`;

export const Default = () => (
  <div style={{ maxWidth: 420 }}>
    <Figure
      src={shot(640, 360)}
      caption="Fig 3 — The redesigned dashboard surfaces the three most-used actions first."
    />
  </div>
);

export const Readable = () => (
  <div style={{ maxWidth: 420 }}>
    <Figure
      src={shot(640, 420)}
      readable
      caption="Annotated flow from onboarding to first publish."
    />
  </div>
);
