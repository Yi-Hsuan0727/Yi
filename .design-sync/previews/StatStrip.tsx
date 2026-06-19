import { StatStrip } from "yi-portfolio-ds";

export const ThreeStats = () => (
  <StatStrip
    stats={[
      { value: "68% → 24%", label: "Checkout abandonment after redesign" },
      { value: "+41%", label: "Task completion in usability tests" },
      { value: "12", label: "Participants across two research rounds" },
    ]}
  />
);

export const TwoStats = () => (
  <StatStrip
    stats={[
      { value: "4.6 / 5", label: "Average post-launch satisfaction score" },
      { value: "−3 taps", label: "Fewer steps to publish a listing" },
    ]}
  />
);
