import { CaseSection } from "yi-portfolio-ds";

export const Default = () => (
  <CaseSection kicker="01 · Overview" title="Designing a faster checkout">
    <p>
      The team needed to understand why nearly seven in ten shoppers dropped off
      at payment. I led discovery interviews, mapped the funnel, and prototyped a
      single-screen checkout that cut the flow from five steps to two.
    </p>
  </CaseSection>
);

export const Alt = () => (
  <CaseSection tone="alt" kicker="03 · Approach" title="From insight to interface">
    <p>
      Each research finding became a design principle. The alternating grey
      sections give long case studies a readable rhythm.
    </p>
  </CaseSection>
);

export const Problem = () => (
  <CaseSection tone="problem" kicker="The challenge" title="68% abandoned at payment">
    <p>
      Shoppers hit a wall of optional fields before they could pay. The problem
      tone tints the heading red to flag pain points.
    </p>
  </CaseSection>
);
