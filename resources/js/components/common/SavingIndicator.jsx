import React from "react";

export default function SavingIndicator({
  saving,
  success,
  label = "Save",
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className={`btn btn-primary d-flex align-items-center gap-2 px-4 ${
        saving ? "opacity-75" : ""
      }`}
      style={{ minWidth: 140 }}
    >
      {saving ? (
        <>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
          ></span>
          <span>Saving...</span>
        </>
      ) : success ? (
        <>
          <i className="bi bi-check-circle-fill text-success"></i>
          <span>Saved!</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}
