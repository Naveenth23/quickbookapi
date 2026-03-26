import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import InfoCard from "../components/common/InfoCard";
// import InvoiceFilterBar from "./InvoiceFilterBar";
import Pagination from "../components/common/Pagination";
import Table from "../components/common/Table";

export default function SalesInvoices() {
    const navigate = useNavigate();

    const [invoices, setInvoices] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("Last 365 Days");
    const [page, setPage] = useState(1);

    // ✅ Fetch invoices
    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await api.get("orders", {
                params: {
                    type: "sale",
                    search,
                    date_filter: dateFilter,
                    page,
                    per_page: 10,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const list = Array.isArray(res.data.data)
                ? res.data.data
                : Array.isArray(res.data)
                ? res.data
                : [];

            setInvoices(list);
            setMeta(res.data.meta || null);
        } catch (err) {
            console.error("Error fetching invoices:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [page, search, dateFilter]);

    // ✅ Summary Calculations
    const totalSales = invoices.reduce((sum, i) => sum + (i.total_amount || 0), 0);
    const paidSales = invoices
        .filter((i) => i.payment_status === "paid")
        .reduce((sum, i) => sum + (i.total_amount || 0), 0);
    const unpaidSales = invoices
        .filter((i) => i.payment_status !== "paid")
        .reduce((sum, i) => sum + (i.total_amount || 0), 0);

    // ✅ Table Column Definitions
    const columns = [
        {
            label: "Date",
            key: "order_date",
            render: (value) =>
                new Date(value).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
        },
        { label: "Invoice Number", key: "invoice_number" },
        { label: "Party Name", key: "customer_name", render: (v) => v || "Cash Sale" },
        { label: "Due In", key: "due_in", render: () => "-" },
        {
            label: "Amount",
            key: "total_amount",
            render: (v) => `₹ ${Number(v || 0).toLocaleString()}`,
        },
        {
            label: "Status",
            key: "payment_status",
            render: (v) => (
                <span
                    className={`badge ${
                        v === "paid" ? "badge-success" : "badge-warning"
                    }`}
                >
                    {v}
                </span>
            ),
        },
        {
            label: "",
            key: "actions",
            render: () => (
                <div className="dropdown">
                    <button className="btn-icon">
                        <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li>Edit</li>
                        <li>View History</li>
                        <li>Duplicate</li>
                        <li>Issue Credit Note</li>
                        <hr />
                        <li className="text-danger">Delete</li>
                    </ul>
                </div>
            ),
        },
    ];

    return (
        <div className="page-wrapper">
            {/* ===== Header ===== */}
            <div className="page-header">
                <h2 className="page-title">Sales Invoices</h2>
                <div className="page-actions">
                    <button className="btn-outline icon-left">
                        <i className="bi bi-bar-chart"></i> Reports
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => navigate("/create-sales-invoice")}
                    >
                        + Create Sales Invoice
                    </button>
                </div>
            </div>

            {/* ===== Summary Cards ===== */}
            <div className="card-row">
                
            </div>

            {/* ===== Filters ===== */}
            {/* <InvoiceFilterBar
                search={search}
                setSearch={setSearch}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                onPrint={() => console.log("Print invoices")}
                onDownload={() => console.log("Download invoices")}
            /> */}

            {/* ===== Invoices Table ===== */}
            <Table columns={columns} data={invoices} loading={loading} />

            {/* ===== Pagination ===== */}
            <Pagination meta={meta} onPageChange={setPage} />
        </div>
    );
}
