import { TextField } from "yi-portfolio-ds";

export const Input = () => (
  <div style={{ maxWidth: 360 }}>
    <TextField label="Your name" name="name" placeholder="Jane Doe" required />
  </div>
);

export const Textarea = () => (
  <div style={{ maxWidth: 360 }}>
    <TextField
      label="Message"
      name="message"
      multiline
      placeholder="Tell me about your project…"
      helpText="A sentence or two is plenty."
    />
  </div>
);

export const Form = () => (
  <div style={{ display: "grid", gap: 14, maxWidth: 360 }}>
    <TextField label="Name" name="name" placeholder="Jane Doe" required />
    <TextField
      label="Email"
      name="email"
      type="email"
      placeholder="jane@studio.com"
      required
    />
  </div>
);
