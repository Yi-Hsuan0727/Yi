import { Sticker } from "yi-portfolio-ds";

export const ContactStickers = () => (
  <div
    style={{
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
      alignItems: "center",
      padding: "16px 20px 20px",
    }}
  >
    <Sticker tilt={-3} icon={<span aria-hidden>✉</span>} href="#">
      yche1356@asu.edu
    </Sticker>
    <Sticker tilt={2.5} icon={<span aria-hidden>in</span>} href="#">
      LinkedIn
    </Sticker>
    <Sticker tilt={-1.5} icon={<span aria-hidden>↓</span>} href="#">
      Résumé
    </Sticker>
  </div>
);

export const IconOnly = () => (
  <div
    style={{
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
      alignItems: "center",
      padding: "16px 20px 20px",
    }}
  >
    <Sticker iconOnly tilt={-9} icon={<strong>Fig</strong>} />
    <Sticker iconOnly tilt={7} icon={<strong>Ps</strong>} />
    <Sticker iconOnly tilt={-5} icon={<strong>{"</>"}</strong>} />
  </div>
);
