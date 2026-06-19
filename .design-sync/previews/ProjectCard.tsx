import { ProjectCard } from "yi-portfolio-ds";

const cover = (a: string, b: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/></svg>`
  )}`;

export const Default = () => (
  <ProjectCard
    title="Pic2Split"
    tag="Product"
    imageSrc={cover("#2ecc71", "#4a55e0")}
  />
);

export const Deck = () => (
  <div style={{ display: "flex", gap: 18, alignItems: "flex-end", padding: "24px 8px" }}>
    <ProjectCard title="Magnate" tilt={-6} imageSrc={cover("#4a55e0", "#7b5cb8")} />
    <ProjectCard
      title="QuickBite"
      tilt={0}
      active
      imageSrc={cover("#e8924a", "#2ecc71")}
    />
    <ProjectCard title="UNESCO" tilt={5} imageSrc={cover("#0077c8", "#2ecc71")} />
  </div>
);

export const WithTag = () => (
  <ProjectCard
    title="QuickBite ordering"
    tag="UX/UI"
    imageSrc={cover("#e8c840", "#e8924a")}
  />
);
