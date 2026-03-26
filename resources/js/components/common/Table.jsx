import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import AdjustStockModal from "./AdjustStockModal";

/* ─── Table-specific styles, injected once ─── */
const TABLE_STYLES = `
  .tbl-delete-bar {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 16px;
    background: #fff8e1; border-bottom: 1px solid #ffc107;
    font-size: 13.5px; font-weight: 500;
    animation: barSlide 0.15s ease;
  }
  @keyframes barSlide {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .tbl-row-click {
    cursor: pointer; transition: background 0.1s;
  }
  .tbl-row-click:hover    { background: #f0f6ff !important; }
  .tbl-row-click.is-sel   { background: #eff6ff !important; }
  .adj-icon-btn {
    border: none; background: transparent;
    padding: 5px 7px; border-radius: 7px;
    cursor: pointer; transition: background 0.12s;
    color: #6c757d; line-height: 1;
  }
  .adj-icon-btn:hover { background: #e9ecef; color: #1967d2; }
`;

if (typeof document !== "undefined" && !document.getElementById("__tbl-styles__")) {
  const s = document.createElement("style");
  s.id = "__tbl-styles__";
  s.textContent = TABLE_STYLES;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────
   Table
   Props:
     columns          – { key, label, render? }[]
     data             – row objects[]
     loading          – boolean
     emptyText        – string
     onRowClick       – (row) => void   optional override
     rowClickPath     – (row) => string optional path builder
     showAdjustStock  – boolean  (default false)
     onStockAdjusted  – () => void  called after stock save
     onDeleteSelected – (ids[]) => void
     selectable       – boolean (default true)
───────────────────────────────────────────── */
export default function Table({
  columns,
  data,
  loading = false,
  emptyText = "No records found.",
  onRowClick,
  rowClickPath,
  showAdjustStock = false,
  onStockAdjusted,
  onDeleteSelected,
  selectable = true,
}) {
  const navigate = useNavigate();
  const rows = Array.isArray(data) ? data : [];

  const [selected, setSelected]           = useState([]);
  const [adjustProduct, setAdjustProduct] = useState(null);

  // Clear selection when data refreshes
  useEffect(() => { setSelected([]); }, [data]);

  const allChecked  = rows.length > 0 && selected.length === rows.length;
  const someChecked = selected.length > 0 && !allChecked;

  const toggleAll = () =>
    setSelected(allChecked ? [] : rows.map((r) => r.id ?? r.uuid));

  const toggleRow = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleRowClick = (row) => {
    if (onRowClick) { onRowClick(row); return; }
    const path = rowClickPath ? rowClickPath(row) : `/products/${row.uuid}`;
    if (path) navigate(path);
  };

  // Drop any legacy "checkbox" column callers may still pass
  const cols      = columns.filter((c) => c.key !== "checkbox");
  const totalCols = cols.length + (selectable ? 1 : 0) + (showAdjustStock ? 1 : 0);

  return (
    <>
      <div>
        {/* ── Selection / delete bar ── */}
        {selectable && selected.length > 0 && (
          <div className="tbl-delete-bar">
            <span>
              {selected.length} item{selected.length > 1 ? "s" : ""} selected
            </span>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDeleteSelected?.(selected)}
            >
              Delete Selected
            </button>
            <button
              className="btn btn-sm btn-outline-secondary ms-auto"
              onClick={() => setSelected([])}
            >
              Clear
            </button>
          </div>
        )}

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                {selectable && (
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={allChecked}
                      ref={(el) => { if (el) el.indeterminate = someChecked; }}
                      onChange={toggleAll}
                    />
                  </th>
                )}
                {cols.map((col) => (
                  <th key={col.key} className="text-nowrap">{col.label}</th>
                ))}
                {showAdjustStock && (
                  <th style={{ width: 48 }} title="Adjust Stock" />
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={totalCols} className="text-center py-5">
                    <span className="spinner-border spinner-border-sm me-2 text-primary" />
                    <span className="text-muted">Loading…</span>
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((row, i) => {
                  const rowId      = row.id ?? row.uuid ?? i;
                  const isSelected = selected.includes(rowId);
                  return (
                    <tr
                      key={rowId}
                      className={`tbl-row-click${isSelected ? " is-sel" : ""}`}
                      onClick={() => handleRowClick(row)}
                    >
                      {/* Checkbox */}
                      {selectable && (
                        <td style={{ width: 40 }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => toggleRow(rowId)}
                          />
                        </td>
                      )}

                      {/* Data cells */}
                      {cols.map((col) => (
                        <td key={col.key}>
                          {col.render
                            ? col.render(row[col.key], row)
                            : (row[col.key] ?? "-")}
                        </td>
                      ))}

                      {/* Adjust stock icon */}
                      {showAdjustStock && (
                        <td
                          style={{ width: 48, textAlign: "center" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="adj-icon-btn"
                            title="Adjust Stock"
                            onClick={() => setAdjustProduct(row)}
                          >
                            <Package size={17} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={totalCols} className="text-center text-muted py-5">
                    {emptyText}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal rendered via React Portal — outside all table DOM */}
      {adjustProduct && (
        <AdjustStockModal
          product={adjustProduct}
          onClose={() => setAdjustProduct(null)}
          onSaved={() => {
            setAdjustProduct(null);
            onStockAdjusted?.();
          }}
        />
      )}
    </>
  );
}