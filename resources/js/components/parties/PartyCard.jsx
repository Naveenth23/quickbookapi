import React from "react";

export default function PartyCard({ title, count, amount, icon, color, onClick, active }) {
    const styles = active
        ? { borderColor: `var(--bs-${color})`, boxShadow: "0 0 0 0.15rem rgba(13,110,253,0.25)" }
        : { borderColor: "#dee2e6" };

    return (
        <div
            className={`card border-2 shadow-sm hover-shadow-sm`}
            style={{ cursor: "pointer", ...styles }}
            onClick={onClick}
        >
            <div className="card-body text-center">
                <h6 className="fw-semibold text-secondary mb-1">{title}</h6>
                {typeof count !== "undefined" ? (
                    <h4 className={`fw-bold text-${color}`}>{count}</h4>
                ) : (
                    <h5 className={`fw-bold text-${color}`}>
                        {icon} {amount}
                    </h5>
                )}
            </div>
        </div>
    );
}
