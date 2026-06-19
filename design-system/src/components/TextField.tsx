import * as React from "react";
import { cx } from "../util";

export interface TextFieldProps {
  /** Field label rendered above the control (uppercase). */
  label: string;
  /** Input `name`. */
  name?: string;
  /** Input type (ignored when `multiline`). */
  type?: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Mark the field required (adds a `*` to the label). */
  required?: boolean;
  /** Render a multiline `<textarea>` instead of an `<input>`. */
  multiline?: boolean;
  /** Helper text shown below the control. */
  helpText?: string;
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Change handler. */
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  className?: string;
}

/**
 * Labelled text field — the contact-form input/textarea with its uppercase
 * label, soft fill, and accent focus ring.
 */
export function TextField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  multiline = false,
  helpText,
  value,
  defaultValue,
  onChange,
  className,
}: TextFieldProps) {
  const id = name || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className={cx("ds-field", className)} htmlFor={id}>
      <span className="ds-field__label">
        {label}
        {required && <span className="ds-field__required"> *</span>}
      </span>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          className="ds-field__control"
          placeholder={placeholder}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          className="ds-field__control"
          placeholder={placeholder}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        />
      )}
      {helpText && <span className="ds-field__help">{helpText}</span>}
    </label>
  );
}
