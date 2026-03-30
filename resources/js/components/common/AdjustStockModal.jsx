import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "../../api/axios"; // your existing axios instance
import { X, Plus, Minus, TrendingUp, TrendingDown, Package } from "lucide-react";

/* ─── Inject styles once ─── */
const MODAL_STYLES = `
  .adj-overlay {
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(15, 23, 42, 0.55);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: adjFadeIn 0.18s ease;
  }
  @keyframes adjFadeIn { from{opacity:0} to{opacity:1} }

  .adj-dialog {
    background: #fff; border-radius: 16px;
    width: 100%; max-width: 720px;
    max-height: calc(100vh - 32px);
    box-shadow: 0 32px 80px rgba(0,0,0,.22);
    animation: adjUp 0.2s cubic-bezier(.4,0,.2,1);
    display: flex; flex-direction: column;
    overflow: hidden;
  }
  @keyframes adjUp {
    from{transform:translateY(24px);opacity:0}
    to{transform:translateY(0);opacity:1}
  }

  .adj-header {
    display:flex; align-items:center; justify-content:space-between;
    padding: 18px 24px; flex-shrink:0;
    border-bottom: 1px solid #e9ecef;
    background: #f8faff;
  }
  .adj-body {
    display: flex; flex: 1; overflow: hidden;
  }
  .adj-left {
    flex:1; padding: 24px; overflow-y: auto;
    border-right: 1px solid #e9ecef;
  }
  .adj-right {
    width: 240px; flex-shrink: 0;
    padding: 24px; background: #f8faff;
    overflow-y: auto;
  }
  .adj-footer {
    display:flex; justify-content:flex-end; gap:10px;
    padding: 14px 24px; flex-shrink: 0;
    border-top: 1px solid #e9ecef; background: #f8faff;
  }

  .stype-btn {
    flex:1; padding: 11px 0; border-radius: 9px;
    border: 1.5px solid #dee2e6; background: #fff;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    color: #6c757d; transition: all 0.15s;
  }
  .stype-btn:hover:not(.active) { background: #f1f5f9; }
  .stype-btn.add.active    { border-color: #198754; background: #d1fae5; color: #166534; }
  .stype-btn.reduce.active { border-color: #dc3545; background: #fee2e2; color: #991b1b; }

  .calc-row {
    display:flex; justify-content:space-between; align-items:center;
    padding: 10px 14px; border-radius: 9px; margin-bottom: 6px;
    font-size: 13px;
  }

  .adj-history { margin-top: 16px; }
  .adj-history-item {
    display:flex; justify-content:space-between; align-items:center;
    padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 12.5px;
  }
  .adj-history-item:last-child { border-bottom: none; }
  .badge-add    { background: #d1fae5; color: #166534; padding: 2px 8px; border-radius: 12px; font-size:11px; font-weight:600; }
  .badge-reduce { background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-size:11px; font-weight:600; }

  @media (max-width: 580px) {
    .adj-body { flex-direction: column; }
    .adj-left { border-right: none; border-bottom: 1px solid #e9ecef; }
    .adj-right { width: 100%; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("__adj-modal-styles__")) {
  const s = document.createElement("style");
  s.id = "__adj-modal-styles__";
  s.textContent = MODAL_STYLES;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────
   AdjustStockModal
   Props:
     product  – { uuid, name, stock_quantity, unit? }
     onClose  – () => void
     onSaved  – () => void  (called after successful save)
───────────────────────────────────────────── */
export default function AdjustStockModal({ product, onClose, onSaved }) {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate]         = useState(today);
  const [type, setType]         = useState("add");
  const [qty, setQty]           = useState("");
  const [remarks, setRemarks]   = useState("");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [history, setHistory]   = useState([]);
  const [histLoading, setHistLoading] = useState(false);

  const unit         = product?.unit || "PCS";
  const currentStock = Number(product?.stock_quantity ?? 0);
  const adjustedQty  = Math.max(0, Number(qty) || 0);
  const newStock     = type === "add"
    ? currentStock + adjustedQty
    : currentStock - adjustedQty;

  /* Lock body scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* Escape key */
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  /* Fetch stock adjustment history for this product */
  useEffect(() => {
    if (!product?.uuid) return;
    setHistLoading(true);
    api.get(`/products/${product.uuid}/stock-history`)
      .then((res) => {
        // Accept { data: [...] } or plain array
        const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setHistory(list);
      })
      .catch(() => setHistory([]))   // gracefully handle if route doesn't exist yet
      .finally(() => setHistLoading(false));
  }, [product?.uuid]);

  const handleSave = async () => {
    if (adjustedQty <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }
    if (type === "reduce" && adjustedQty > currentStock) {
      setError(`Cannot reduce more than current stock (${currentStock} ${unit}).`);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.post(`/products/${product.uuid}/adjust-stock`, {
        type,
        quantity: adjustedQty,
        date,
        remarks: remarks.trim() || null,
      });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to adjust stock. Please try again.");
      setSaving(false);
    }
  };

  const modal = (
    <div
      className="adj-overlay"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="adj-dialog" role="dialog" aria-modal="true" aria-label="Adjust Stock Quantity">

        {/* ── Header ── */}
        <div className="adj-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "#e0edff", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Package size={17} color="#1967d2" />
            </div>
            <div>
              <h6 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1a2340" }}>
                Adjust Stock Quantity
              </h6>
              <span style={{ fontSize: 12, color: "#888" }}>{product?.name}</span>
            </div>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="adj-body">

          {/* Left — form */}
          <div className="adj-left">

            {/* Date */}
            <div className="mb-3">
              <label className="form-label fw-semibold small mb-1">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Add / Reduce toggle */}
            <div className="mb-3">
              <label className="form-label fw-semibold small mb-1">
                Add or Reduce Stock
              </label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`stype-btn add ${type === "add" ? "active" : ""}`}
                  onClick={() => { setType("add"); setError(""); }}
                >
                  <TrendingUp size={15} /> Add (+)
                </button>
                <button
                  type="button"
                  className={`stype-btn reduce ${type === "reduce" ? "active" : ""}`}
                  onClick={() => { setType("reduce"); setError(""); }}
                >
                  <TrendingDown size={15} /> Reduce (-)
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-3">
              <label className="form-label fw-semibold small mb-1">Adjust Quantity</label>
              <div className="input-group">
                <input
                  type="number"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  min={1}
                  placeholder="Enter quantity"
                  value={qty}
                  autoFocus
                  onChange={(e) => { setQty(e.target.value); setError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                />
                <span className="input-group-text">{unit}</span>
              </div>
            </div>

            {/* Remarks */}
            <div className="mb-3">
              <label className="form-label fw-semibold small mb-1">
                Remarks <span style={{ color: "#aaa", fontWeight: 400 }}>(Optional)</span>
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="e.g. Received from supplier, Damaged goods removed…"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-danger py-2 px-3 small mb-0">
                {error}
              </div>
            )}

            {/* History */}
            <div className="adj-history">
              <p className="fw-semibold small mb-2" style={{ color: "#555" }}>
                Recent Adjustments
              </p>
              {histLoading ? (
                <p className="text-muted small">Loading history…</p>
              ) : history.length === 0 ? (
                <p className="text-muted small">No adjustments recorded yet.</p>
              ) : (
                history.slice(0, 5).map((h, i) => (
                  <div key={i} className="adj-history-item">
                    <div>
                      <span className={h.type === "add" ? "badge-add" : "badge-reduce"}>
                        {h.type === "add" ? "+" : "-"}{h.quantity} {unit}
                      </span>
                      {h.remarks && (
                        <span style={{ color: "#888", marginLeft: 6 }}>{h.remarks}</span>
                      )}
                    </div>
                    <span style={{ color: "#aaa" }}>
                      {h.date ? new Date(h.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right — live calculation */}
          <div className="adj-right">
            <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>
              Item Name
            </p>
            <p style={{ fontWeight: 600, fontSize: 14, color: "#1a2340", marginBottom: 20 }}>
              {product?.name}
            </p>

            <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>
              Stock Calculation
            </p>

            <div className="calc-row" style={{ background: "#f1f5f9" }}>
              <span style={{ color: "#555" }}>Current Stock</span>
              <strong>{currentStock} {unit}</strong>
            </div>

            <div
              className="calc-row"
              style={{ background: type === "add" ? "#d1fae5" : "#fee2e2" }}
            >
              <span style={{ color: "#555" }}>
                {type === "add" ? "Adding" : "Reducing"}
              </span>
              <strong style={{ color: type === "add" ? "#166534" : "#991b1b" }}>
                {adjustedQty > 0 ? (type === "add" ? "+" : "-") : ""}{adjustedQty} {unit}
              </strong>
            </div>

            <div className="calc-row" style={{ background: "#e0edff" }}>
              <span style={{ color: "#1967d2", fontWeight: 600 }}>New Stock</span>
              <span style={{
                fontSize: 24, fontWeight: 800, lineHeight: 1,
                color: newStock < 0 ? "#dc3545" : "#1967d2",
              }}>
                {newStock < 0 ? 0 : newStock}
              </span>
            </div>

            {newStock < 0 && (
              <p className="small text-danger mt-2 mb-0">
                ⚠ Cannot reduce below 0
              </p>
            )}

            {/* Divider */}
            <hr style={{ margin: "20px 0 14px", borderColor: "#e9ecef" }} />

            {/* Quick summary */}
            <div style={{ fontSize: 12, color: "#777", lineHeight: 1.7 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Action</span>
                <span style={{ fontWeight: 600, color: type === "add" ? "#198754" : "#dc3545" }}>
                  {type === "add" ? "Stock In" : "Stock Out"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Date</span>
                <span style={{ fontWeight: 600, color: "#444" }}>
                  {date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="adj-footer">
          <button className="btn btn-outline-secondary" onClick={onClose} disabled={saving}>
            Close
          </button>
          <button
            className="btn btn-primary px-4 fw-semibold"
            onClick={handleSave}
            disabled={saving || newStock < 0 || adjustedQty <= 0}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" style={{ width: 14, height: 14 }} />
                Saving…
              </>
            ) : "Save"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}