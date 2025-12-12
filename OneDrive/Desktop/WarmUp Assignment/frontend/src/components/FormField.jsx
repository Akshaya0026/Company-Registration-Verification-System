import React from "react";

export default function FormField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error,
  required = false,
  ...rest
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        className={`input ${error ? "border-red-400 ring-1 ring-red-200" : ""}`}
        {...rest}
      />
      {error && (
        <p id={`${name}-err`} role="alert" className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
