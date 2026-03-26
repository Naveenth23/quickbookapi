import { useState } from "react";

export default function useFormValidation(initialValues = {}, rules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // ✅ Flexible handleChange: supports both (e) and (name, value)
  const handleChange = (eOrName, maybeValue) => {
    if (typeof eOrName === "string") {
      const name = eOrName;
      const value = maybeValue;
      setValues((prev) => ({ ...prev, [name]: value }));
    } else if (eOrName?.target) {
      const { name, value, type, checked } = eOrName.target;
      setValues((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      console.warn("Invalid handleChange input:", eOrName);
    }
  };

  // ✅ Validation function
  const validate = () => {
    const newErrors = {};
    for (const field in rules) {
      const value = values[field];
      const fieldRules = rules[field];

      for (const rule of fieldRules) {
        if (rule === "required" && !value) {
          newErrors[field] = "This field is required.";
          break;
        }

        if (rule === "number" && value && isNaN(Number(value))) {
          newErrors[field] = "Please enter a valid number.";
          break;
        }

        if (rule === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
          newErrors[field] = "Invalid email address.";
          break;
        }

        if (rule === "gstin" && value) {
          const gstRegex =
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
          if (!gstRegex.test(value)) {
            newErrors[field] = "Please enter a valid GSTIN number.";
          }
        }

        if (rule === "pan" && value) {
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
          if (!panRegex.test(value)) {
            newErrors[field] = "Invalid PAN format.";
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    values,
    errors,
    handleChange,
    validate,
    setValues,
    setErrors,
  };
}
