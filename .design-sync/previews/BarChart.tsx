import { BarChart } from "yi-portfolio-ds";

export const Research = () => (
  <div style={{ maxWidth: 460 }}>
    <BarChart
      title="Where shoppers drop off"
      rows={[
        { label: "Cart", value: 92, display: "92%" },
        { label: "Shipping", value: 71, display: "71%" },
        { label: "Payment", value: 32, display: "32%" },
        { label: "After redesign", value: 76, display: "76%", goal: true },
      ]}
      stats={[
        { num: "−44pt", label: "Drop in abandonment" },
        { num: "2 steps", label: "Down from five" },
        { num: "12", label: "Interviews" },
      ]}
      source="Source: funnel analytics + moderated usability sessions, n=12."
    />
  </div>
);

export const Simple = () => (
  <div style={{ maxWidth: 460 }}>
    <BarChart
      title="Time on task (lower is better)"
      rows={[
        { label: "Before", value: 88, display: "2m 40s" },
        { label: "After", value: 41, display: "1m 14s", goal: true },
      ]}
    />
  </div>
);
