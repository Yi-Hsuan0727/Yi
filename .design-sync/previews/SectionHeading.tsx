import { SectionHeading } from "yi-portfolio-ds";

export const Default = () => (
  <SectionHeading kicker="02 · Discovery" title="Understanding the problem" />
);

export const Problem = () => (
  <SectionHeading
    kicker="The challenge"
    title="Users abandoned checkout at 68%"
    tone="problem"
  />
);

export const TitleOnly = () => <SectionHeading title="Selected work" />;
