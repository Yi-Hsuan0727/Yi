// Emit a self-contained dist/styles.css: remote @imports first, then the
// inlined design tokens, then the component rules. Also ships dist/tokens.css
// as a standalone reference. Keeping tokens inlined means the stylesheet
// resolves with no sibling-file dependency wherever it is copied.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });

const tokens = readFileSync("src/tokens.css", "utf8");
const styles = readFileSync("src/styles.css", "utf8");

const importRe = /^@import[^;]+;\s*$/gm;
const remoteImports = (styles.match(importRe) || []).filter((l) =>
  l.includes("http")
);
const body = styles.replace(importRe, "").replace(/^\s*\n/, "");

const out = `${remoteImports.join("\n")}\n\n${tokens}\n${body}`;

writeFileSync("dist/tokens.css", tokens);
writeFileSync("dist/styles.css", out);
console.log("css: wrote dist/styles.css (self-contained) + dist/tokens.css");
