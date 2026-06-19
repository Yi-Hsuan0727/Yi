import { Tag } from "yi-portfolio-ds";

export const Tones = () => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
    <Tag tone="accent">UX Research</Tag>
    <Tag tone="neutral">Prototyping</Tag>
    <Tag tone="problem">Usability issue</Tag>
  </div>
);

export const SkillChips = () => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
    <Tag tone="accent" size="sm" uppercase>
      Figma
    </Tag>
    <Tag tone="accent" size="sm" uppercase>
      Design Systems
    </Tag>
    <Tag tone="accent" size="sm" uppercase>
      User Testing
    </Tag>
  </div>
);
