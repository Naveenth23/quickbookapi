import React from "react";

/**
 * Enhanced InfoCard — Clean, modern, MyBillBook-style
 */
export default function InfoCard({
    title,
    value,
    icon: Icon,
    color = "primary",
    active = false,
    onClick,
    currency = true,
}) {
    const formatValue = (val) => {
        if (val === null || val === undefined || val === "") return "-";

        if (currency && typeof val === "number") {
            return `₹ ${val.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
            })}`;
        }

        if (currency && typeof val === "string" && !isNaN(Number(val))) {
            return `₹ ${Number(val).toLocaleString("en-IN", {
                maximumFractionDigits: 2,
            })}`;
        }

        return val;
    };

    const styles = {
        borderWidth: "2px",
        borderColor: active
            ? `var(--bs-${color})`
            : "var(--bs-border-color-translucent)",
        boxShadow: active
            ? `0 0 0 0.2rem rgba(var(--bs-${color}-rgb), 0.15)`
            : "0 2px 8px rgba(0,0,0,0.05)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease-in-out",
    };

    return (
        <div
            className={`card border-2 text-center rounded-3 hover-shadow`}
            style={styles}
            onClick={onClick}
            onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = `0 4px 14px rgba(var(--bs-${color}-rgb), 0.25)`)
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = active
                    ? `0 0 0 0.2rem rgba(var(--bs-${color}-rgb), 0.15)`
                    : "0 2px 8px rgba(0,0,0,0.05)")
            }
        >
            <div className="card-body py-3">
                <div className="d-flex flex-column align-items-center gap-2">
                    <h6
                        className="fw-semibold text-muted text-uppercase mb-0"
                        style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}
                    >
                        {title}
                    </h6>

                    <h4 className={`fw-bold text-${color} mb-0`}>
                        {formatValue(value)}
                    </h4>

                    {Icon && (
                        <div
                            className={`p-2 rounded-circle bg-${color}-subtle d-flex align-items-center justify-content-center`}
                            style={{
                                width: "36px",
                                height: "36px",
                            }}
                        >
                            <Icon
                                size={20}
                                strokeWidth={2}
                                className={`text-${color}`}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
