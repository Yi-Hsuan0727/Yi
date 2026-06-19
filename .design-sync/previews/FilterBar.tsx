import { useState } from "react";
import { FilterBar } from "yi-portfolio-ds";

const items = [
  { label: "All", value: "all" },
  { label: "Product", value: "product" },
  { label: "Research", value: "research" },
  { label: "Branding", value: "branding" },
];

export const Interactive = () => {
  const [value, setValue] = useState("product");
  return <FilterBar items={items} value={value} onChange={setValue} />;
};

export const FirstSelected = () => (
  <FilterBar items={items} value="all" onChange={() => {}} />
);
