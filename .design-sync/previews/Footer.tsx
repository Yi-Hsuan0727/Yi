import { Footer } from "yi-portfolio-ds";

const links = [
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "#" },
  { label: "Résumé", href: "#" },
];

export const Default = () => (
  <Footer copyright="© 2026 Yi-Hsuan Chen" links={links} />
);

export const Green = () => (
  <Footer copyright="© 2026 Yi-Hsuan Chen" links={links} variant="green" />
);
