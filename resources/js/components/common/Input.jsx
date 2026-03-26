import React from "react";

export default function Input({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    required = false,
    error = "",
}) {
    return (
        <div className="mb-3">
            {label && (
                <label htmlFor={name} className="form-label fw-semibold">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
            )}
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`form-control ${error ? "is-invalid" : ""}`}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}
