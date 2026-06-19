import { PhaseBlock, Figure } from "yi-portfolio-ds";

const shot = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="520" height="360"><rect width="520" height="360" fill="#eef2f7"/><rect x="28" y="28" width="464" height="44" rx="8" fill="#2ecc71" opacity="0.85"/><rect x="28" y="96" width="320" height="18" rx="4" fill="#9aa7b4"/><rect x="28" y="128" width="240" height="18" rx="4" fill="#bcc6d1"/></svg>'
)}`;

export const WithMedia = () => (
  <PhaseBlock
    kicker="Phase 02 · Research"
    title="Listening before designing"
    result="Three pain points surfaced in every session"
    media={<Figure src={shot} caption="Affinity map from 12 interviews." />}
  >
    <p>
      I ran twelve moderated sessions and clustered the findings. The same three
      blockers — hidden costs, forced account creation, and a noisy form —
      appeared again and again.
    </p>
  </PhaseBlock>
);

export const SingleColumn = () => (
  <PhaseBlock
    kicker="Phase 04 · Outcome"
    title="What shipped"
  >
    <p>
      The redesigned checkout launched in Q1. Abandonment dropped from{" "}
      <strong>68% to 24%</strong>, and average time-to-purchase fell by half.
    </p>
  </PhaseBlock>
);
