import { ProblemCard } from "yi-portfolio-ds";

export const Default = () => (
  <div style={{ maxWidth: 360 }}>
    <ProblemCard
      icon={<span aria-hidden>!</span>}
      label="Pain point"
      title="Hidden costs at the last step"
    >
      Shipping and fees only appeared on the final screen, so shoppers felt
      ambushed and bailed.
    </ProblemCard>
  </div>
);

export const Grid = () => (
  <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr", maxWidth: 640 }}>
    <ProblemCard icon={<span aria-hidden>!</span>} label="Blocker" title="Forced account creation">
      62% of testers expected to check out as a guest.
    </ProblemCard>
    <ProblemCard icon={<span aria-hidden>!</span>} label="Friction" title="Too many form fields">
      The form asked for 14 fields; only 6 were required.
    </ProblemCard>
  </div>
);
