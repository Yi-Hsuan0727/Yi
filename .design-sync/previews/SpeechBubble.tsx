import { SpeechBubble } from "yi-portfolio-ds";

export const Default = () => (
  <div style={{ padding: "8px 16px 24px" }}>
    <SpeechBubble tail="down">Let's build something delightful 👋</SpeechBubble>
  </div>
);

export const Tails = () => (
  <div
    style={{
      display: "flex",
      gap: 32,
      flexWrap: "wrap",
      alignItems: "center",
      padding: "24px 28px",
    }}
  >
    <SpeechBubble tail="up">Tail up</SpeechBubble>
    <SpeechBubble tail="down">Tail down</SpeechBubble>
    <SpeechBubble tail="right">Tail right</SpeechBubble>
  </div>
);

export const Tilted = () => (
  <div style={{ padding: "16px 24px 28px" }}>
    <SpeechBubble tail="down" tilt={-2.5}>
      Thanks for scrolling all the way down!
    </SpeechBubble>
  </div>
);
