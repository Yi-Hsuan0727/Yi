import { PieChart } from "yi-portfolio-ds";

export const IssueBreakdown = () => (
  <div style={{ maxWidth: 460 }}>
    <PieChart
      title="Usability issues by severity"
      segments={[
        { label: "Minor", value: 31, color: "#e8c840" },
        { label: "Suggestion", value: 21, color: "#4a55e0" },
        { label: "Major", value: 21, color: "#e8924a" },
        { label: "Blocker", value: 20, color: "#7b5cb8" },
        { label: "Strength", value: 7, color: "#2ecc71" },
      ]}
      centerValue="29"
      centerLabel="Findings"
    />
  </div>
);

export const Split = () => (
  <div style={{ maxWidth: 460 }}>
    <PieChart
      title="Research time allocation"
      segments={[
        { label: "Interviews", value: 45, color: "#2ecc71" },
        { label: "Synthesis", value: 30, color: "#4a55e0" },
        { label: "Testing", value: 25, color: "#e8924a" },
      ]}
      centerValue="3 wk"
      centerLabel="Total"
    />
  </div>
);
