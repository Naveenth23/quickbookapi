import React from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default function StatusBadge({ status = "" }) {
    const normalized = status.toLowerCase();

    const config = {
        paid: {
            className: "bg-success",
            icon: CheckCircle2,
            label: "Paid",
        },
        unpaid: {
            className: "bg-warning text-dark",
            icon: Clock,
            label: "Unpaid",
        },
        cancelled: {
            className: "bg-danger",
            icon: XCircle,
            label: "Cancelled",
        },
    };

    const item = config[normalized] || {
        className: "bg-secondary",
        icon: Clock,
        label: status,
    };

    const Icon = item.icon;

    return (
        <span
            className={`badge d-inline-flex align-items-center gap-1 px-2 py-1 ${item.className}`}
        >
            <Icon size={14} strokeWidth={1.8} />
            <span className="text-capitalize">{item.label}</span>
        </span>
    );
}
