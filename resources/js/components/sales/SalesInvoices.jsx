import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Pagination from "../../components/common/Pagination";
import Table from "../../components/common/Table";
import {
  BarChart3, Plus, Search, Calendar,
  ChevronDown, TrendingUp, IndianRupee, Clock,
} from "lucide-react";

/* ── date presets ── */
const DATE_OPTIONS = [
  "Today", "This Week", "This Month",
  "Last 30 Days", "Last 90 Days", "Last 365 Days", "All Time",
];

const STYLES = `
  .si-stat-card {
    background: #fff; border: 1px solid #e9ecef; border-radius: 14px;
    padding: 20px 24px; display: flex; align-items: center; gap: 16px;
    transition: box-shadow .15s;
  }
  .si-stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.08); }
  .si-stat-icon {
    width: 46px; height: 46px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .si-stat-label { font-size: 12px; color: #888; font-weight: 500; margin-bottom: 3px; }
  .si-stat-val   { font-size: 20px; font-weight: 800; color: #1a2340; line-height: 1; }

  .si-filter-bar {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    padding: 14px 0 10px;
  }
  .si-search-wrap {
    position: relative; flex: 1; min-width: 200px;
  }
  .si-search-wrap input {
    width: 100%; padding: 8px 12px 8px 36px;
    border: 1px solid #dee2e6; border-radius: 9px;
    font-size: 13.5px; outline: none; transition: border .15s;
  }
  .si-search-wrap input:focus { border-color: #1967d2; }
  .si-search-icon {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    color: #aaa; pointer-events: none;
  }

  .si-date-dropdown {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 300;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,.1); min-width: 170px; overflow: hidden;
    animation: ddFade .12s ease;
  }
  @keyframes ddFade { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
  .si-date-dropdown button {
    display: block; width: 100%; text-align: left; padding: 9px 14px;
    border: none; background: transparent; font-size: 13px; color: #374151; cursor: pointer;
  }
  .si-date-dropdown button:hover  { background: #f0f6ff; color: #1967d2; }
  .si-date-dropdown button.active { background: #e0edff; color: #1967d2; font-weight: 600; }

  .pay-badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11.5px; font-weight: 600; text-transform: capitalize;
  }
  .pay-badge.paid     { background: #d1fae5; color: #166534; }
  .pay-badge.pending  { background: #fef9c3; color: #854d0e; }
  .pay-badge.partial  { background: #dbeafe; color: #1d4ed8; }
  .pay-badge.overdue  { background: #fee2e2; color: #991b1b; }
  .pay-badge.refunded { background: #f3e8ff; color: #6b21a8; }
`;

export default function SalesInvoices() {
  const navigate = useNavigate();

  const [invoices,    setInvoices]    = useState([]);
  const [meta,        setMeta]        = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [search,      setSearch]      = useState("");
  const [dateFilter,  setDateFilter]  = useState("Last 365 Days");
  const [showDateDd,  setShowDateDd]  = useState(false);
  const [page,        setPage]        = useState(1);

  /* ── summary totals (from API meta or computed) ── */
  const [summary, setSummary] = useState({ total: 0, paid: 0, unpaid: 0 });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get("orders", {
        params: { type: "sale", search, date_filter: dateFilter, page, per_page: 10 },
      });
      const list = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data) ? res.data : [];

      setInvoices(list);
      setMeta(res.data.meta || null);

      /* summary from API or compute from page */
      if (res.data.summary) {
        setSummary(res.data.summary);
      } else {
        const total  = list.reduce((s, i) => s + Number(i.total_amount || 0), 0);
        const paid   = list.filter((i) => i.payment_status === "paid")
                           .reduce((s, i) => s + Number(i.total_amount || 0), 0);
        setSummary({ total, paid, unpaid: total - paid });
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, [page, search, dateFilter]);

  const fmt = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

  /* ── columns ── */
  const columns = [
    {
      label: "Date", key: "order_date",
      render: (v) => v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-",
    },
    { label: "Invoice #", key: "invoice_number", render: (v) => v || "-" },
    { label: "Party Name", key: "customer_name",  render: (v) => v || "Cash Sale" },
    { label: "Due In",     key: "due_date",
      render: (v) => {
        if (!v) return <span style={{ color: "#aaa" }}>-</span>;
        const days = Math.ceil((new Date(v) - new Date()) / 86400000);
        if (days < 0) return <span style={{ color: "#dc3545", fontWeight: 600 }}>{Math.abs(days)}d overdue</span>;
        return <span style={{ color: days <= 7 ? "#f59e0b" : "#555" }}>{days}d</span>;
      },
    },
    {
      label: "Amount", key: "total_amount",
      render: (v) => <span style={{ fontWeight: 600 }}>{fmt(v)}</span>,
    },
    {
      label: "Status", key: "payment_status",
      render: (v) => <span className={`pay-badge ${v || "pending"}`}>{v || "pending"}</span>,
    },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="page-wrapper">

        {/* ── Header ── */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h4 className="fw-bold mb-0" style={{ color: "#1a2340" }}>Sales Invoices</h4>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <BarChart3 size={15} /> Reports
            </button>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/create-sales-invoice")}
            >
              <Plus size={15} /> Create Sales Invoice
            </button>
          </div>
        </div>

        {/* ── Summary cards ── */}
        <div className="row g-3 mb-4">
          {[
            { label: "Total Sales",   val: fmt(summary.total),  icon: TrendingUp,   bg: "#e0edff", color: "#1967d2" },
            { label: "Paid",          val: fmt(summary.paid),   icon: IndianRupee,  bg: "#d1fae5", color: "#166534" },
            { label: "Unpaid / Due",  val: fmt(summary.unpaid), icon: Clock,        bg: "#fef9c3", color: "#854d0e" },
          ].map(({ label, val, icon: Icon, bg, color }) => (
            <div className="col-md-4" key={label}>
              <div className="si-stat-card">
                <div className="si-stat-icon" style={{ background: bg }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <div className="si-stat-label">{label}</div>
                  <div className="si-stat-val">{val}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter bar ── */}
        <div className="si-filter-bar">
          {/* Search */}
          <div className="si-search-wrap">
            <Search size={14} className="si-search-icon" />
            <input
              type="text"
              placeholder="Search by invoice #, party name…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Date filter */}
          <div style={{ position: "relative" }}>
            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              style={{ borderRadius: 9, fontSize: 13 }}
              onClick={() => setShowDateDd((v) => !v)}
            >
              <Calendar size={14} /> {dateFilter} <ChevronDown size={12} />
            </button>
            {showDateDd && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setShowDateDd(false)} />
                <div className="si-date-dropdown">
                  {DATE_OPTIONS.map((d) => (
                    <button
                      key={d}
                      className={dateFilter === d ? "active" : ""}
                      onClick={() => { setDateFilter(d); setShowDateDd(false); setPage(1); }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="card shadow-sm border-0 mt-2" style={{ borderRadius: 12, overflow: "hidden" }}>
          <Table
            columns={columns}
            data={invoices}
            loading={loading}
            emptyText="No sales invoices found."
            selectable={true}
            onDeleteSelected={(ids) => console.log("Delete", ids)}
            /* Row click → invoice view */
            rowClickPath={(row) => `/sales-invoices/${row.uuid ?? row.id}`}
          />
        </div>

        {/* ── Pagination ── */}
        {meta && <Pagination meta={meta} onPageChange={setPage} />}
      </div>
    </>
  );
}