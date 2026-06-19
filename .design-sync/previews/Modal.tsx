import { Modal } from "yi-portfolio-ds";

const hero = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2ecc71"/><stop offset="1" stop-color="#4a55e0"/></linearGradient></defs><rect width="640" height="320" fill="url(#g)"/></svg>'
)}`;

export const Open = () => (
  <div style={{ minHeight: 460, display: "flex", padding: 8 }}>
    <Modal
      title="Pic2Split"
      imageSrc={hero}
      meta={[
        { label: "Role", value: "Product Designer" },
        { label: "Year", value: "2025" },
        { label: "Tools", value: "Figma, React" },
      ]}
      summary="A mobile tool that splits a single photo into clean, shareable panels — reducing a five-step manual crop into one tap."
      linkHref="#"
      linkLabel="View case study"
      onClose={() => {}}
    />
  </div>
);

export const NoImage = () => (
  <div style={{ minHeight: 360, display: "flex", padding: 8 }}>
    <Modal
      title="QuickBite"
      meta={[
        { label: "Role", value: "UX/UI Designer" },
        { label: "Year", value: "2024" },
      ]}
      summary="Reworking the food-ordering flow to cut three taps from every order."
      linkHref="#"
    />
  </div>
);
