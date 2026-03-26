import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ItemModal from "../components/common/CreateItemModal";
import AdjustStockModal from "../components/common/AdjustStockModal";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowLeft, Barcode, PackagePlus, Pencil, Trash2,
  Calendar, Download, Printer, ChevronDown, LayoutGrid,
  Package, FileText, Tag, ExternalLink, FileSpreadsheet,
  FileDown, CheckCircle2,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Date range presets
───────────────────────────────────────────── */
const DATE_PRESETS = [
  { label: "Last 30 Days",  days: 30  },
  { label: "Last 90 Days",  days: 90  },
  { label: "Last 365 Days", days: 365 },
  { label: "This Month",    days: null, mode: "thisMonth" },
  { label: "This Year",     days: null, mode: "thisYear"  },
  { label: "All Time",      days: null, mode: "all"       },
];

function getRangeFromPreset(preset) {
  const today = new Date();
  const fmt   = (d) => d.toISOString().split("T")[0];
  if (preset.days) {
    const from = new Date(today);
    from.setDate(from.getDate() - preset.days);
    return { from: fmt(from), to: fmt(today) };
  }
  if (preset.mode === "thisMonth")
    return { from: fmt(new Date(today.getFullYear(), today.getMonth(), 1)), to: fmt(today) };
  if (preset.mode === "thisYear")
    return { from: fmt(new Date(today.getFullYear(), 0, 1)), to: fmt(today) };
  return { from: "", to: "" };
}

/* ─────────────────────────────────────────────
   Skeleton row — shimmer loader
───────────────────────────────────────────── */
function SkeletonRow({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <div
            className="skel-pulse"
            style={{ height: 14, borderRadius: 6, width: i === 0 ? "80px" : i === 1 ? "120px" : "70px" }}
          />
        </td>
      ))}
    </tr>
  );
}

/* ─────────────────────────────────────────────
   Toast notification
───────────────────────────────────────────── */
function Toast({ msg, type = "success", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`dl-toast dl-toast-${type}`}>
      {type === "success" ? <CheckCircle2 size={15} /> : <FileDown size={15} />}
      {msg}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab icons
───────────────────────────────────────────── */
const TAB_ICONS = { details: LayoutGrid, stock: Package, party: FileText, prices: Tag };

/* ─────────────────────────────────────────────
   Global styles
───────────────────────────────────────────── */
const STYLES = `
  /* ── Tabs ── */
  .pv-tab-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 16px; border: none; background: transparent;
    font-size: 13.5px; font-weight: 500; color: #6c757d;
    border-bottom: 2.5px solid transparent;
    cursor: pointer; transition: all .14s; white-space: nowrap;
  }
  .pv-tab-btn:hover  { color: #1967d2; }
  .pv-tab-btn.active { color: #1967d2; border-bottom-color: #1967d2; font-weight: 700; }

  /* ── Header buttons ── */
  .pv-header-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px; font-size: 13px;
    font-weight: 500; cursor: pointer; transition: all .13s; white-space: nowrap;
  }

  /* ── Stock table ── */
  .stock-table { border-collapse: separate; border-spacing: 0; width: 100%; }
  .stock-table thead th {
    background: #f8f9fa; padding: 12px 16px;
    font-size: 13px; font-weight: 600; color: #495057;
    border-bottom: 1.5px solid #dee2e6; white-space: nowrap;
  }
  .stock-table tbody td {
    padding: 13px 16px; font-size: 13.5px;
    border-bottom: 1px solid #f0f0f0; color: #333; vertical-align: middle;
  }
  .stock-table tbody tr:last-child td { border-bottom: none; }
  .stock-table tbody tr:hover td { background: #f8faff; }

  /* ── Transaction type badges ── */
  .txn-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
  }
  .txn-badge.add      { background: #d1fae5; color: #166534; }
  .txn-badge.reduce   { background: #fee2e2; color: #991b1b; }
  .txn-badge.sale     { background: #fef9c3; color: #854d0e; }
  .txn-badge.purchase { background: #e0edff; color: #1967d2; }
  .txn-badge.opening  { background: #f1f5f9; color: #475569; }

  .qty-pos { color: #166534; font-weight: 600; }
  .qty-neg { color: #dc3545; font-weight: 600; }

  /* ── Skeleton shimmer ── */
  @keyframes skelShimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .skel-pulse {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 600px 100%;
    animation: skelShimmer 1.4s infinite linear;
  }

  /* ── Date dropdown ── */
  .date-dropdown {
    position: absolute; top: calc(100% + 6px); left: 0;
    background: #fff; border: 1px solid #e2e8f0;
    border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.1);
    z-index: 300; min-width: 180px; overflow: hidden;
    animation: ddFade .12s ease;
  }
  @keyframes ddFade { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
  .date-dropdown button {
    display: block; width: 100%; text-align: left;
    padding: 9px 14px; border: none; background: transparent;
    font-size: 13px; color: #374151; cursor: pointer;
  }
  .date-dropdown button:hover  { background: #f0f6ff; color: #1967d2; }
  .date-dropdown button.active { background: #e0edff; color: #1967d2; font-weight: 600; }

  /* ── Download dropdown ── */
  .dl-dropdown {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: #fff; border: 1px solid #e2e8f0;
    border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.1);
    z-index: 300; min-width: 200px; overflow: hidden;
    animation: ddFade .12s ease;
  }
  .dl-dropdown button {
    display: flex; align-items: center; gap: 10px;
    width: 100%; text-align: left;
    padding: 10px 14px; border: none; background: transparent;
    font-size: 13px; color: #374151; cursor: pointer;
  }
  .dl-dropdown button:hover { background: #f0f6ff; color: #1967d2; }
  .dl-dropdown .dl-divider { height: 1px; background: #f0f0f0; margin: 4px 0; }

  /* ── Download progress bar ── */
  .dl-progress-wrap {
    height: 3px; background: #e9ecef; border-radius: 2px; overflow: hidden; margin-top: 8px;
  }
  .dl-progress-bar {
    height: 100%; background: linear-gradient(90deg, #1967d2, #38bdf8);
    border-radius: 2px; transition: width 0.2s ease;
  }

  /* ── Toast ── */
  .dl-toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 99999;
    display: flex; align-items: center; gap: 10px;
    padding: 12px 18px; border-radius: 10px;
    font-size: 13.5px; font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,.15);
    animation: toastIn .2s ease;
  }
  @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .dl-toast-success { background: #d1fae5; color: #166534; border: 1px solid #a7f3d0; }
  .dl-toast-info    { background: #e0edff; color: #1967d2; border: 1px solid #bfdbfe; }

  /* ── Detail cards ── */
  .detail-card { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 24px; }
  .detail-row  { display:flex; justify-content:space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size:14px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-row .lbl { color: #888; }
  .detail-row .val { font-weight: 600; color: #1a2340; }

  /* ── Chunk load sentinel ── */
  .load-more-sentinel { height: 1px; }
`;

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function ProductView() {
  const { productUuid } = useParams();
  const navigate        = useNavigate();

  const [product,       setProduct]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [activeTab,     setActiveTab]     = useState("details");

  /* stock history — chunked */
  const [stockHistory,  setStockHistory]  = useState([]);
  const [stockLoading,  setStockLoading]  = useState(false);
  const [page,          setPage]          = useState(1);
  const [hasMore,       setHasMore]       = useState(false);
  const [loadingMore,   setLoadingMore]   = useState(false);
  const [preset,        setPreset]        = useState(DATE_PRESETS[2]);
  const [showDateDd,    setShowDateDd]    = useState(false);
  const [showDlDd,      setShowDlDd]      = useState(false);

  /* export */
  const [exporting,     setExporting]     = useState(false);   // true while generating file
  const [exportProgress,setExportProgress]= useState(0);       // 0–100
  const [toast,         setToast]         = useState(null);    // { msg, type }

  /* modals */
  const [showEditModal,   setShowEditModal]   = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  const sentinelRef  = useRef(null);
  const PAGE_SIZE    = 15;
  const units        = [];
  const gstOptions   = [0, 5, 12, 18, 28];

  /* ── fetch product ── */
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${productUuid}`);
      setProduct(res.data.data ?? res.data);
    } catch {
      navigate("/not-found");
    } finally {
      setLoading(false);
    }
  };

  /* ── fetch stock history page ── */
  const fetchStockPage = useCallback(async (pageNum = 1, replace = false) => {
    if (!productUuid) return;
    pageNum === 1 ? setStockLoading(true) : setLoadingMore(true);
    try {
      const range  = getRangeFromPreset(preset);
      const params = {
        page:     pageNum,
        per_page: PAGE_SIZE,
        ...(range.from ? { from: range.from, to: range.to } : {}),
      };
      const res  = await api.get(`/products/${productUuid}/stock-history`, { params });
      const body = res.data;

      // Support: { data: [], meta: { last_page } } OR plain array
      const rows     = Array.isArray(body) ? body : (body.data ?? []);
      const lastPage = body.meta?.last_page ?? body.last_page ?? 1;

      setStockHistory((prev) => (replace || pageNum === 1) ? rows : [...prev, ...rows]);
      setHasMore(pageNum < lastPage);
      setPage(pageNum);
    } catch {
      if (pageNum === 1) setStockHistory([]);
    } finally {
      setStockLoading(false);
      setLoadingMore(false);
    }
  }, [productUuid, preset]);

  /* ── Infinite scroll via IntersectionObserver ── */
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !stockLoading) {
          fetchStockPage(page + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, stockLoading, page, fetchStockPage]);

  useEffect(() => { fetchProduct(); }, [productUuid]);

  useEffect(() => {
    if (activeTab === "stock") {
      setStockHistory([]);
      setPage(1);
      setHasMore(false);
      fetchStockPage(1, true);
    }
  }, [activeTab, preset]);

  /* ── helpers ── */
  const fmtDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    }).replace(/\//g, "-");
  };

  const txnMeta = (row) => {
    const t = (row.type ?? row.transaction_type ?? "").toLowerCase();
    if (t.includes("sale"))     return { label: "Sales Invoice",  cls: "sale",     sign: "-" };
    if (t.includes("purchase")) return { label: "Purchase",       cls: "purchase", sign: "+" };
    if (t.includes("add"))      return { label: "Add Stock",      cls: "add",      sign: "+" };
    if (t.includes("reduce"))   return { label: "Reduce Stock",   cls: "reduce",   sign: "-" };
    if (t.includes("opening"))  return { label: "Opening Stock",  cls: "opening",  sign: ""  };
    return                             { label: t || "Adjustment",cls: "opening",  sign: ""  };
  };

  /* ── fetch ALL rows for export (no pagination) ── */
  const fetchAllForExport = async () => {
    const range  = getRangeFromPreset(preset);
    const params = {
      per_page: 9999,
      page: 1,
      ...(range.from ? { from: range.from, to: range.to } : {}),
    };
    const res  = await api.get(`/products/${productUuid}/stock-history`, { params });
    const body = res.data;
    return Array.isArray(body) ? body : (body.data ?? []);
  };

  /* ── build table rows for export ── */
  const buildExportRows = (rows) =>
    rows.map((row) => {
      const meta = txnMeta(row);
      return {
        Date:               fmtDate(row.date),
        "Transaction Type": meta.label,
        Quantity:           `${meta.sign}${Number(row.quantity ?? 0)} PCS`,
        "Invoice Number":   row.invoice_number || "-",
        "Closing Stock":    `${row.stock_after ?? row.closing_stock ?? "-"} PCS`,
        Remarks:            row.remarks || "-",
      };
    });

  /* ── animated progress helper ── */
  const animateProgress = (target, cb) => {
    let cur = 0;
    const step = () => {
      cur = Math.min(cur + Math.random() * 15 + 5, target);
      setExportProgress(Math.round(cur));
      if (cur < target) requestAnimationFrame(step);
      else cb?.();
    };
    requestAnimationFrame(step);
  };

  /* ── Export Excel ── */
  const handleExportExcel = async () => {
    setShowDlDd(false);
    setExporting(true);
    setExportProgress(0);
    try {
      animateProgress(60, null);
      const rows = await fetchAllForExport();
      animateProgress(90, null);

      const exportRows = buildExportRows(rows);
      const ws = XLSX.utils.json_to_sheet(exportRows);

      /* Column widths */
      ws["!cols"] = [
        { wch: 14 }, { wch: 20 }, { wch: 14 },
        { wch: 18 }, { wch: 16 }, { wch: 28 },
      ];

      /* Header style (bold + blue fill) */
      const headerRange = XLSX.utils.decode_range(ws["!ref"]);
      for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
        const cellAddr = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddr]) continue;
        ws[cellAddr].s = {
          font:      { bold: true, color: { rgb: "FFFFFF" } },
          fill:      { fgColor: { rgb: "1967D2" } },
          alignment: { horizontal: "center" },
          border: {
            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
          },
        };
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Stock History");

      /* Summary sheet */
      const summary = [
        ["Product Name", product?.name ?? ""],
        ["Item Code",    product?.sku  ?? "-"],
        ["Report Range", preset.label],
        ["Generated On", new Date().toLocaleString("en-IN")],
        ["Total Records", exportRows.length],
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summary);
      wsSummary["!cols"] = [{ wch: 20 }, { wch: 32 }];
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

      setExportProgress(100);
      XLSX.writeFile(wb, `stock-history-${product?.sku ?? productUuid}-${preset.label.replace(/\s/g,"-")}.xlsx`);
      setToast({ msg: "Excel file downloaded successfully!", type: "success" });
    } catch (e) {
      console.error(e);
      setToast({ msg: "Export failed. Please try again.", type: "info" });
    } finally {
      setTimeout(() => { setExporting(false); setExportProgress(0); }, 600);
    }
  };

  /* ── Export PDF ── */
  const handleExportPDF = async () => {
    setShowDlDd(false);
    setExporting(true);
    setExportProgress(0);
    try {
      animateProgress(50, null);
      const rows = await fetchAllForExport();
      animateProgress(80, null);

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      /* Header */
      doc.setFillColor(25, 103, 210);
      doc.rect(0, 0, 297, 22, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Stock History Report", 14, 14);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`${product?.name ?? ""} | ${preset.label} | Generated: ${new Date().toLocaleDateString("en-IN")}`, 14, 20);

      /* Reset color */
      doc.setTextColor(0, 0, 0);

      /* Info row */
      doc.setFontSize(9);
      doc.text(`Item Code: ${product?.sku ?? "-"}   Current Stock: ${product?.stock_quantity ?? 0} PCS`, 14, 30);

      /* Table */
      const exportRows = buildExportRows(rows);
      autoTable(doc, {
        startY: 35,
        head: [["Date", "Transaction Type", "Quantity", "Invoice Number", "Closing Stock", "Remarks"]],
        body: exportRows.map((r) => Object.values(r)),
        styles: {
          fontSize: 9,
          cellPadding: 4,
          lineColor: [230, 230, 230],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: [25, 103, 210],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: { fillColor: [248, 250, 255] },
        columnStyles: {
          0: { cellWidth: 28, halign: "center" },
          1: { cellWidth: 38 },
          2: { cellWidth: 25, halign: "center" },
          3: { cellWidth: 35, halign: "center" },
          4: { cellWidth: 30, halign: "center" },
          5: { cellWidth: "auto" },
        },
        didParseCell: (data) => {
          /* Color quantity column */
          if (data.column.index === 2 && data.section === "body") {
            const val = String(data.cell.raw ?? "");
            data.cell.styles.textColor = val.startsWith("-") ? [220, 53, 69] : [22, 101, 52];
            data.cell.styles.fontStyle = "bold";
          }
        },
        /* Page numbers */
        didDrawPage: (data) => {
          const pCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(
            `Page ${data.pageNumber} of ${pCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 6
          );
        },
      });

      setExportProgress(100);
      doc.save(`stock-history-${product?.sku ?? productUuid}-${preset.label.replace(/\s/g,"-")}.pdf`);
      setToast({ msg: "PDF file downloaded successfully!", type: "success" });
    } catch (e) {
      console.error(e);
      setToast({ msg: "PDF export failed. Please try again.", type: "info" });
    } finally {
      setTimeout(() => { setExporting(false); setExportProgress(0); }, 600);
    }
  };

  /* ── edit initial data ── */
  const editInitialData = product ? {
    item_type:        product.item_type       ?? "product",
    category_id:      product.category_id     ?? "",
    name:             product.name            ?? "",
    sales_price:      product.sale_price      ?? "",
    purchase_price:   product.purchase_price  ?? "",
    mrp:              product.mrp             ?? "",
    tax_included:     product.tax_included    ?? "with_tax",
    gst_rate:         product.tax_rate        ?? "0",
    unit:             product.unit            ?? "",
    opening_stock:    product.stock_quantity  ?? "",
    item_code:        product.sku             ?? "",
    hsn_code:         product.hsn_code        ?? "",
    as_of_date:       new Date().toISOString().split("T")[0],
    low_stock_enabled: Boolean(product.min_stock_level),
    low_stock_qty:    product.min_stock_level  ?? "",
    description:      product.description     ?? "",
  } : null;

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: 300 }}>
      <span className="spinner-border text-primary me-2" />
      <span className="text-muted">Loading…</span>
    </div>
  );
  if (!product) return null;

  const inStock = Number(product.stock_quantity) > 0;

  return (
    <>
      <style>{STYLES}</style>

      <div className="container-fluid py-4" style={{ maxWidth: 1100 }}>

        {/* ══ HEADER ══ */}
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light" onClick={() => navigate(-1)} style={{ borderRadius: 8 }}>
              <ArrowLeft size={16} />
            </button>
            <h5 className="fw-bold mb-0" style={{ color: "#1a2340" }}>{product.name}</h5>
            <span className="badge" style={{
              background: inStock ? "#d1fae5" : "#fee2e2",
              color:      inStock ? "#166534" : "#991b1b",
              fontWeight: 600, fontSize: 12, padding: "4px 12px", borderRadius: 20,
            }}>
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button className="pv-header-btn btn btn-outline-secondary">
              <Barcode size={15} /> View Barcode
            </button>
            <button className="pv-header-btn btn btn-outline-secondary" onClick={() => setShowAdjustModal(true)}>
              <PackagePlus size={15} /> Adjust Stock
            </button>
            <button className="pv-header-btn btn btn-outline-primary" onClick={() => setShowEditModal(true)}>
              <Pencil size={15} /> Edit
            </button>
            <button className="pv-header-btn btn btn-outline-danger">
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* ══ TABS ══ */}
        <div className="d-flex border-bottom mb-4" style={{ overflowX: "auto" }}>
          {[
            { key: "details", label: "Item Details"      },
            { key: "stock",   label: "Stock Details"     },
            { key: "party",   label: "Party Wise Report" },
            { key: "prices",  label: "Party Wise Prices" },
          ].map(({ key, label }) => {
            const Icon = TAB_ICONS[key];
            return (
              <button
                key={key}
                className={`pv-tab-btn ${activeTab === key ? "active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                <Icon size={14} /> {label}
              </button>
            );
          })}
        </div>

        {/* ══ ITEM DETAILS TAB ══ */}
        {activeTab === "details" && (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="detail-card">
                <h6 className="fw-bold mb-3" style={{ color: "#1a2340" }}>General Details</h6>
                {[
                  ["Item Name",       product.name],
                  ["Item Code",       product.sku],
                  ["HSN Code",        product.hsn_code],
                  ["Category",        product.category?.name],
                  ["Unit",            product.unit],
                  ["Current Stock",   `${product.stock_quantity ?? 0} PCS`],
                  ["Low Stock Level", product.min_stock_level],
                  ["Description",     product.description],
                ].map(([lbl, val]) => (
                  <div className="detail-row" key={lbl}>
                    <span className="lbl">{lbl}</span>
                    <span className="val">{val || "-"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-card">
                <h6 className="fw-bold mb-3" style={{ color: "#1a2340" }}>Pricing Details</h6>
                {[
                  ["Sales Price",    product.sale_price    ? `₹ ${product.sale_price}`    : "-"],
                  ["Purchase Price", product.purchase_price ? `₹ ${product.purchase_price}` : "-"],
                  ["MRP",            product.mrp           ? `₹ ${product.mrp}`           : "-"],
                  ["GST Tax Rate",   product.tax_rate      ? `${product.tax_rate}%`       : "-"],
                  ["Tax Included",   product.tax_included],
                ].map(([lbl, val]) => (
                  <div className="detail-row" key={lbl}>
                    <span className="lbl">{lbl}</span>
                    <span className="val">{val || "-"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ STOCK DETAILS TAB ══ */}
        {activeTab === "stock" && (
          <div>
            {/* ── Toolbar ── */}
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">

              {/* Date preset picker */}
              <div style={{ position: "relative" }}>
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  style={{ borderRadius: 8, fontSize: 13, fontWeight: 500 }}
                  onClick={() => setShowDateDd((v) => !v)}
                >
                  <Calendar size={14} /> {preset.label} <ChevronDown size={13} style={{ opacity: .6 }} />
                </button>
                {showDateDd && (
                  <>
                    <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setShowDateDd(false)} />
                    <div className="date-dropdown">
                      {DATE_PRESETS.map((p) => (
                        <button
                          key={p.label}
                          className={preset.label === p.label ? "active" : ""}
                          onClick={() => { setPreset(p); setShowDateDd(false); }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Right actions */}
              <div className="d-flex gap-2 align-items-center">
                {/* Export progress bar (shows while exporting) */}
                {exporting && (
                  <div style={{ width: 140 }}>
                    <div style={{ fontSize: 11, color: "#1967d2", marginBottom: 3, fontWeight: 500 }}>
                      Generating… {exportProgress}%
                    </div>
                    <div className="dl-progress-wrap">
                      <div className="dl-progress-bar" style={{ width: `${exportProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Download dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                    style={{ borderRadius: 8, fontSize: 13 }}
                    onClick={() => setShowDlDd((v) => !v)}
                    disabled={exporting}
                  >
                    <Download size={14} /> Download <ChevronDown size={12} />
                  </button>
                  {showDlDd && (
                    <>
                      <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setShowDlDd(false)} />
                      <div className="dl-dropdown">
                        <button onClick={handleExportExcel} disabled={exporting}>
                          <FileSpreadsheet size={15} color="#166534" />
                          <span>Download Excel (.xlsx)</span>
                        </button>
                        <div className="dl-divider" />
                        <button onClick={handleExportPDF} disabled={exporting}>
                          <FileDown size={15} color="#dc3545" />
                          <span>Download PDF</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  style={{ borderRadius: 8, fontSize: 13 }}
                  onClick={() => window.print()}
                >
                  <Printer size={14} /> Print PDF
                </button>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12, overflow: "hidden" }}>
              <div className="table-responsive">
                <table className="stock-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Transaction Type</th>
                      <th>Quantity</th>
                      <th>Invoice Number</th>
                      <th>Closing Stock</th>
                      <th style={{ width: 32 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {/* ── Initial skeleton (first load) ── */}
                    {stockLoading && stockHistory.length === 0 &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonRow key={i} cols={6} />
                      ))
                    }

                    {/* ── Actual rows ── */}
                    {!stockLoading && stockHistory.length === 0 ? (
                      /* No data fallback — show opening stock row */
                      <tr>
                        <td style={{ color: "#555" }}>{fmtDate(product.created_at)}</td>
                        <td><span className="txn-badge opening">Opening Stock</span></td>
                        <td className="qty-pos">{product.stock_quantity ?? 0} PCS</td>
                        <td style={{ color: "#aaa" }}>-</td>
                        <td style={{ fontWeight: 600 }}>{product.stock_quantity ?? 0} PCS</td>
                        <td />
                      </tr>
                    ) : (
                      stockHistory.map((row, i) => {
                        const meta = txnMeta(row);
                        const isNeg = meta.sign === "-";
                        return (
                          <tr key={i}>
                            <td style={{ color: "#555" }}>{fmtDate(row.date)}</td>
                            <td><span className={`txn-badge ${meta.cls}`}>{meta.label}</span></td>
                            <td className={isNeg ? "qty-neg" : "qty-pos"}>
                              {meta.sign}{Number(row.quantity ?? 0)} PCS
                            </td>
                            <td>
                              {row.invoice_number ? (
                                <span
                                  style={{ color: "#1967d2", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                                  onClick={() => row.invoice_uuid && navigate(`/invoices/${row.invoice_uuid}`)}
                                >
                                  {row.invoice_number}
                                  {row.invoice_uuid && <ExternalLink size={11} />}
                                </span>
                              ) : <span style={{ color: "#aaa" }}>-</span>}
                            </td>
                            <td style={{ fontWeight: 600 }}>
                              {row.stock_after ?? row.closing_stock ?? "-"} PCS
                            </td>
                            <td />
                          </tr>
                        );
                      })
                    )}

                    {/* ── "Load more" skeleton rows (infinite scroll) ── */}
                    {loadingMore &&
                      Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonRow key={`more-${i}`} cols={6} />
                      ))
                    }
                  </tbody>
                </table>
              </div>

              {/* IntersectionObserver sentinel */}
              <div ref={sentinelRef} className="load-more-sentinel" />

              {/* End of list */}
              {!hasMore && stockHistory.length > 0 && !stockLoading && (
                <div className="text-center text-muted py-3" style={{ fontSize: 12 }}>
                  All {stockHistory.length} record{stockHistory.length !== 1 ? "s" : ""} loaded
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ PARTY WISE REPORT TAB ══ */}
        {activeTab === "party" && (
          <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: 12 }}>
            <FileText size={36} className="mx-auto mb-3 text-muted" />
            <h6 className="fw-bold">Party Wise Report</h6>
            <p className="text-muted mb-0">No details found for the selected time period</p>
          </div>
        )}

        {/* ══ PARTY WISE PRICES TAB ══ */}
        {activeTab === "prices" && (
          <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: 12 }}>
            <Tag size={36} className="mx-auto mb-3 text-muted" />
            <h6 className="fw-bold">Party Wise Prices</h6>
            <p className="text-muted mb-0">No special pricing configured</p>
          </div>
        )}
      </div>

      {/* ══ EDIT MODAL ══ */}
      <ItemModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={async (values) => {
          try {
            await api.put(`/products/${productUuid}`, values);
            setShowEditModal(false);
            fetchProduct();
          } catch (err) { console.error(err); }
        }}
        initialData={editInitialData}
        units={units}
        gstOptions={gstOptions}
        storeName={product.name}
      />

      {/* ══ ADJUST STOCK MODAL ══ */}
      {showAdjustModal && (
        <AdjustStockModal
          product={product}
          onClose={() => setShowAdjustModal(false)}
          onSaved={() => {
            setShowAdjustModal(false);
            fetchProduct();
            if (activeTab === "stock") {
              setStockHistory([]);
              fetchStockPage(1, true);
            }
          }}
        />
      )}

      {/* ══ TOAST ══ */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </>
  );
}