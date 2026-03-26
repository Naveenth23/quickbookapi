/**
 * ✅ Centralized form validation helpers
 * Reusable across multiple forms
 */

export const validateField = (name, value, rules = []) => {
    for (const rule of rules) {
        switch (rule) {
            case "required":
                if (!value?.trim()) return `${formatName(name)} is required.`;
                break;

            case "email":
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    return "Invalid email format.";
                break;

            case "number":
                if (value && isNaN(value))
                    return `${formatName(name)} must be a number.`;
                break;

            case "gstin":
                if (
                    value &&
                    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/i.test(
                        value
                    )
                ) {
                    return "Please enter a valid GST number.";
                }
                break;

            case "pan":
                if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(value))
                    return "Invalid PAN format.";
                break;
            case "ifsc":
                // Format: 4 letters + 0 + 6 digits (example: SBIN0000123)
                if (value && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(value))
                    return "Invalid IFSC code.";
                break;
            case "pincode":
                if (value && !/^[1-9][0-9]{5}$/.test(value))
                    return "Invalid Pincode format.";
                break;

            default:
                break;
        }
    }
    return null;
};

// ✅ Validate entire form at once
export const validateForm = (data, rulesConfig) => {
    const errors = {};

    for (const field in rulesConfig) {
        const error = validateField(field, data[field], rulesConfig[field]);
        if (error) errors[field] = error;
    }

    return errors;
};

// Helper to prettify field names
const formatName = (name) =>
    name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
