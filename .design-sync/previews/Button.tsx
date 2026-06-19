import { Button } from "yi-portfolio-ds";

export const Variants = () => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    <Button variant="primary">View case study</Button>
    <Button variant="accent">Get in touch</Button>
    <Button variant="outline">All work</Button>
    <Button variant="ghost">Back to work</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Button size="md" variant="primary">
      Read more
    </Button>
    <Button size="sm" variant="primary">
      Read more
    </Button>
  </div>
);

export const WithIcon = () => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    <Button variant="accent" icon={<span aria-hidden>✉</span>}>
      Email me
    </Button>
    <Button variant="primary" iconAfter={<span aria-hidden>→</span>}>
      Next project
    </Button>
  </div>
);

export const Disabled = () => (
  <Button variant="primary" disabled>
    Sending…
  </Button>
);
