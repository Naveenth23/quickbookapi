import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowLeft, Download, Printer, Share2, ChevronDown,
  TruckIcon, FileText, Clock, CheckCircle2, AlertCircle,
  MoreVertical, IndianRupee, Zap,
} from "lucide-react";

/* ─── number to words (Indian) ─── */
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
               "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen",
               "Seventeen","Eighteen","Nineteen"];
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

function numToWords(n) {
  n = Math.round(n);
  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " "+ones[n%10] : "");
  if (n < 1000) return ones[Math.floor(n/100)]+" Hundred"+(n%100 ? " "+numToWords(n%100) : "");
  if (n < 100000) return numToWords(Math.floor(n/1000))+" Thousand"+(n%1000 ? " "+numToWords(n%1000) : "");
  if (n < 10000000) return numToWords(Math.floor(n/100000))+" Lakh"+(n%100000 ? " "+numToWords(n%100000) : "");
  return numToWords(Math.floor(n/10000000))+" Crore"+(n%10000000 ? " "+numToWords(n%10000000) : "");
}

const fmtMoney = (v) => `₹ ${Number(v||0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"2-digit", year:"numeric" }) : "-";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  .inv-page { font-family: 'DM Sans', sans-serif; background: #f0f2f5; min-height: 100vh; }

  /* ── Top action bar ── */
  .inv-topbar {
    background: #fff; border-bottom: 1px solid #e9ecef;
    padding: 12px 24px; display: flex; align-items: center; gap: 12px;
    position: sticky; top: 0; z-index: 100; flex-wrap: wrap;
  }
  .inv-topbar-left  { display: flex; align-items: center; gap: 12px; flex: 1; }
  .inv-topbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  .topbar-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: 1px solid #dee2e6; background: #fff;
    color: #374151; transition: all .13s; white-space: nowrap;
  }
  .topbar-btn:hover { background: #f8f9fa; border-color: #adb5bd; }
  .topbar-btn.primary { background: #1967d2; color: #fff; border-color: #1967d2; }
  .topbar-btn.primary:hover { background: #1558b0; }
  .topbar-btn.green { background: #16a34a; color: #fff; border-color: #16a34a; }
  .topbar-btn.green:hover { background: #15803d; }

  .topbar-split { display: inline-flex; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; }
  .topbar-split .main { padding: 7px 14px; font-size: 13px; font-weight: 500; background: #fff; border: none; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: background .12s; }
  .topbar-split .main:hover { background: #f8f9fa; }
  .topbar-split .arr  { padding: 7px 10px; font-size: 13px; background: #fff; border: none; border-left: 1px solid #dee2e6; cursor: pointer; display: flex; align-items: center; transition: background .12s; }
  .topbar-split .arr:hover { background: #f8f9fa; }

  .pay-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 20px; font-size: 12.5px; font-weight: 700;
  }
  .pay-chip.paid     { background: #d1fae5; color: #166534; }
  .pay-chip.pending  { background: #fef9c3; color: #854d0e; }
  .pay-chip.partial  { background: #dbeafe; color: #1d4ed8; }
  .pay-chip.overdue  { background: #fee2e2; color: #991b1b; }

  /* ── Layout ── */
  .inv-layout {
    display: flex; gap: 16px; padding: 20px 24px; max-width: 1200px; margin: 0 auto;
    align-items: flex-start;
  }

  /* ── Invoice paper ── */
  .inv-paper {
    flex: 1; background: #fff; border-radius: 12px;
    box-shadow: 0 2px 16px rgba(0,0,0,.07); overflow: hidden;
  }
  .inv-print-area { padding: 36px 40px; }

  /* ── Store header ── */
  .inv-store-name  { font-size: 26px; font-weight: 800; color: #1a2340; line-height: 1.1; }
  .inv-store-sub   { font-size: 13px; color: #555; margin-top: 3px; }

  /* ── Invoice meta bar ── */
  .inv-meta-bar {
    display: flex; justify-content: space-between; align-items: center;
    background: #f1f4f8; padding: 12px 16px; border-radius: 8px; margin: 20px 0 16px;
  }
  .inv-meta-bar .lbl { font-size: 12px; color: #888; }
  .inv-meta-bar .val { font-size: 14px; font-weight: 700; color: #1a2340; }

  /* ── Bill to ── */
  .inv-bill-lbl { font-size: 11px; font-weight: 700; color: #999; letter-spacing: .07em; text-transform: uppercase; margin-bottom: 4px; }
  .inv-bill-name { font-size: 15px; font-weight: 700; color: #1a2340; }
  .inv-bill-sub  { font-size: 13px; color: #666; margin-top: 2px; }

  /* ── Divider ── */
  .inv-divider { height: 2px; background: #1a2340; margin: 20px 0 0; border-radius: 2px; }
  .inv-divider-thin { height: 1px; background: #e9ecef; margin: 8px 0; }

  /* ── Items table ── */
  .inv-items-table { width: 100%; border-collapse: collapse; margin-top: 0; }
  .inv-items-table th {
    padding: 10px 8px; text-align: left; font-size: 12px; font-weight: 700;
    color: #888; border-bottom: 1px solid #e9ecef; text-transform: uppercase; letter-spacing: .05em;
  }
  .inv-items-table td {
    padding: 12px 8px; font-size: 13.5px; color: #333; border-bottom: 1px solid #f5f5f5;
    vertical-align: top;
  }
  .inv-items-table tr:last-child td { border-bottom: none; }
  .inv-items-table .num { text-align: right; }
  .inv-items-table .ctr { text-align: center; }

  /* ── Subtotal bar ── */
  .inv-subtotal-bar {
    display: flex; align-items: center; justify-content: space-between;
    background: #f8f9fa; padding: 10px 8px; border-top: 1.5px solid #dee2e6;
    font-size: 13px; font-weight: 600; color: #1a2340;
  }

  /* ── Summary grid ── */
  .inv-summary-grid { display: flex; gap: 24px; margin-top: 24px; align-items: flex-start; }
  .inv-terms { flex: 1; font-size: 12.5px; color: #666; }
  .inv-terms .lbl { font-weight: 700; font-size: 12px; color: #1a2340; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .05em; }
  .inv-totals { min-width: 240px; }
  .inv-total-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; color: #555; }
  .inv-total-row.bold { font-weight: 700; color: #1a2340; font-size: 14px; }
  .inv-total-row.balance { font-weight: 800; color: #1a2340; font-size: 15px; border-top: 2px solid #1a2340; padding-top: 8px; margin-top: 4px; }
  .inv-total-divider { height: 1px; background: #e9ecef; margin: 4px 0; }

  .inv-words { margin-top: 12px; font-size: 12px; color: #666; font-style: italic; }
  .inv-words strong { color: #1a2340; font-style: normal; }

  /* ── Right sidebar ── */
  .inv-sidebar { width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 12px; }
  .inv-side-card {
    background: #fff; border: 1px solid #e9ecef; border-radius: 10px;
    overflow: hidden;
  }
  .inv-side-card-hdr {
    padding: 10px 14px; background: #f8f9fa; border-bottom: 1px solid #e9ecef;
    font-size: 12px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: .05em;
    display: flex; align-items: center; gap: 7px;
  }
  .inv-side-card-body { padding: 12px 14px; }
  .inv-side-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12.5px; }
  .inv-side-row .sl { color: #888; }
  .inv-side-row .sv { font-weight: 600; color: #1a2340; }

  .pay-hist-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 6px 0; border-bottom: 1px solid #f5f5f5; font-size: 12.5px;
  }
  .pay-hist-item:last-child { border-bottom: none; }

  /* ── Skeleton ── */
  @keyframes skelShimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .skel {
    background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);
    background-size: 600px 100%;
    animation: skelShimmer 1.4s infinite linear;
    border-radius: 6px; display: inline-block;
  }

  /* ── Print ── */
  @media print {
    .inv-topbar, .inv-sidebar { display: none !important; }
    .inv-layout { padding: 0; }
    .inv-paper { box-shadow: none; border-radius: 0; }
  }
`;

/* ── Skeleton loader ── */
function InvoiceSkeleton() {
  return (
    <div className="inv-print-area">
      <div className="skel" style={{ width: 200, height: 28, marginBottom: 8 }} />
      <div className="skel" style={{ width: 140, height: 14 }} />
      <div className="inv-meta-bar" style={{ marginTop: 24 }}>
        <div><div className="skel" style={{ width: 80, height: 12 }} /><div className="skel" style={{ width: 60, height: 18, marginTop: 4 }} /></div>
        <div><div className="skel" style={{ width: 80, height: 12 }} /><div className="skel" style={{ width: 90, height: 18, marginTop: 4 }} /></div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div className="skel" style={{ width: 60, height: 11, marginBottom: 6 }} />
        <div className="skel" style={{ width: 150, height: 18 }} />
        <div className="skel" style={{ width: 120, height: 14, marginTop: 4 }} />
      </div>
      <div className="inv-divider" />
      {[1,2,3].map((i) => (
        <div key={i} style={{ display:"flex", gap:12, padding:"14px 0", borderBottom:"1px solid #f5f5f5" }}>
          <div className="skel" style={{ flex:2, height:14 }} />
          <div className="skel" style={{ width:50, height:14 }} />
          <div className="skel" style={{ width:50, height:14 }} />
          <div className="skel" style={{ width:60, height:14 }} />
          <div className="skel" style={{ width:50, height:14 }} />
          <div className="skel" style={{ width:60, height:14 }} />
        </div>
      ))}
    </div>
  );
}

/* ── Payment status chip ── */
function PayChip({ status }) {
  const Icon = status === "paid" ? CheckCircle2
             : status === "overdue" ? AlertCircle
             : Clock;
  return (
    <span className={`pay-chip ${status || "pending"}`}>
      <Icon size={12} /> {status || "pending"}
    </span>
  );
}

export default function SalesInvoiceView() {
  const { invoiceId } = useParams();
  const navigate      = useNavigate();

  const [invoice,  setInvoice]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [dlLoading,setDlLoading]= useState(false);
  const printRef               = useRef(null);

  useEffect(() => { fetchInvoice(); }, [invoiceId]);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/${invoiceId}`);
      setInvoice(res.data.data ?? res.data);
    } catch {
      navigate("/sales-invoices");
    } finally {
      setLoading(false);
    }
  };

  /* ── PDF download ── */
  const handleDownloadPDF = async () => {
    if (!invoice) return;
    setDlLoading(true);
    try {
      const inv  = invoice;
      const biz  = inv.business ?? {};
      const doc  = new jsPDF({ unit: "mm", format: "a4" });
      const W    = 210;
      const M    = 14;

      /* Header */
      doc.setFillColor(26, 35, 64);
      doc.rect(0, 0, W, 28, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16); doc.setFont("helvetica", "bold");
      doc.text(biz.name ?? "Business Name", M, 13);
      doc.setFontSize(9);  doc.setFont("helvetica", "normal");
      const bizSub = [biz.mobile, biz.email, biz.address].filter(Boolean).join("  |  ");
      if (bizSub) doc.text(bizSub, M, 20);
      doc.setTextColor(0, 0, 0);

      /* Invoice meta */
      doc.setFontSize(9);
      doc.setFillColor(241, 244, 248);
      doc.roundedRect(M, 32, W - 2*M, 14, 2, 2, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(10);
      doc.text(`Invoice No: ${inv.invoice_number ?? "-"}`, M+4, 40);
      doc.text(`Date: ${fmtDate(inv.order_date)}`, W - M - 50, 40);

      /* Bill to */
      doc.setFont("helvetica","bold"); doc.setFontSize(9);
      doc.setTextColor(150,150,150); doc.text("BILL TO", M, 54);
      doc.setTextColor(0,0,0);
      doc.setFont("helvetica","bold"); doc.setFontSize(11);
      doc.text(inv.customer_name ?? "Cash Sale", M, 61);
      if (inv.customer_phone) {
        doc.setFont("helvetica","normal"); doc.setFontSize(9);
        doc.text(`Mobile: ${inv.customer_phone}`, M, 67);
      }

      /* Divider */
      doc.setDrawColor(26,35,64); doc.setLineWidth(1);
      doc.line(M, 73, W-M, 73);

      /* Items table */
      const itemRows = (inv.items ?? []).map((it) => [
        it.name,
        it.hsn_code ?? "-",
        `${Number(it.quantity)} ${it.unit ?? "PCS"}`,
        fmtMoney(it.unit_price),
        it.tax_amount > 0
          ? `${fmtMoney(it.tax_amount)}\n(${Number(it.cgst_rate)+Number(it.sgst_rate)}%)`
          : "-",
        fmtMoney(it.total),
      ]);

      autoTable(doc, {
        startY: 76,
        head: [["ITEMS","HSN","QTY.","RATE","TAX","AMOUNT"]],
        body: itemRows,
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [248,249,250], textColor: [100,100,100], fontStyle:"bold", lineWidth:.3, lineColor:[220,220,220] },
        columnStyles: {
          0:{cellWidth:"auto"}, 1:{cellWidth:20,halign:"center"},
          2:{cellWidth:25,halign:"center"}, 3:{cellWidth:25,halign:"right"},
          4:{cellWidth:25,halign:"right"}, 5:{cellWidth:28,halign:"right"},
        },
        alternateRowStyles:{ fillColor:[255,255,255] },
      });

      let y = doc.lastAutoTable.finalY + 6;

      /* Subtotal row */
      doc.setFillColor(248,249,250);
      doc.rect(M, y, W-2*M, 10, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(9);
      doc.setTextColor(26,35,64);
      doc.text("SUBTOTAL", M+4, y+6.5);
      doc.text(fmtMoney(inv.subtotal), W-M-4, y+6.5, { align:"right" });
      y += 16;

      /* Tax + totals */
      const totals = [
        ["Taxable Amount", fmtMoney(inv.taxable_amount)],
        inv.cgst_amount > 0 ? [`CGST @${inv.items?.[0]?.cgst_rate ?? 0}%`, fmtMoney(inv.cgst_amount)] : null,
        inv.sgst_amount > 0 ? [`SGST @${inv.items?.[0]?.sgst_rate ?? 0}%`, fmtMoney(inv.sgst_amount)] : null,
        inv.igst_amount > 0 ? [`IGST`, fmtMoney(inv.igst_amount)] : null,
        ["Total Amount", fmtMoney(inv.total_amount)],
        ["Received Amount", fmtMoney(inv.paid_amount)],
        ["Balance", fmtMoney(inv.balance_amount)],
      ].filter(Boolean);

      const totX = W - M - 80;
      doc.setFont("helvetica","normal"); doc.setFontSize(9);
      totals.forEach((row, i) => {
        const isBold = row[0] === "Total Amount" || row[0] === "Balance";
        if (isBold) { doc.setFont("helvetica","bold"); doc.setFontSize(10); }
        else        { doc.setFont("helvetica","normal"); doc.setFontSize(9); }
        doc.setTextColor(isBold ? 26 : 100, isBold ? 35 : 100, isBold ? 64 : 100);
        doc.text(row[0], totX, y);
        doc.text(row[1], W-M, y, { align:"right" });
        y += 7;
        if (row[0] === "Total Amount") { doc.setDrawColor(220); doc.setLineWidth(.3); doc.line(totX, y-3, W-M, y-3); }
      });

      /* Terms */
      if (inv.terms_and_conditions) {
        y += 4;
        doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(26,35,64);
        doc.text("TERMS AND CONDITIONS", M, y); y += 5;
        doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(100,100,100);
        const lines = doc.splitTextToSize(inv.terms_and_conditions, 100);
        doc.text(lines, M, y);
      }

      /* Total in words */
      const totalY = doc.internal.pageSize.height - 20;
      doc.setFont("helvetica","italic"); doc.setFontSize(9); doc.setTextColor(100);
      doc.text(`Total Amount (in words): ${numToWords(Math.round(inv.total_amount))} Rupees Only`, M, totalY);

      doc.save(`Invoice-${inv.invoice_number ?? invoiceId}.pdf`);
    } finally {
      setDlLoading(false);
    }
  };

  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="inv-page">
        <div className="inv-topbar">
          <div className="inv-topbar-left">
            <button className="topbar-btn" onClick={() => navigate(-1)}><ArrowLeft size={15}/></button>
            <div className="skel" style={{ width:160, height:20 }} />
          </div>
        </div>
        <div className="inv-layout">
          <div className="inv-paper"><InvoiceSkeleton /></div>
        </div>
      </div>
    </>
  );

  if (!invoice) return null;

  const inv = invoice;
  const biz = inv.business ?? {};

  return (
    <>
      <style>{STYLES}</style>
      <div className="inv-page">

        {/* ══ TOP ACTION BAR ══ */}
        <div className="inv-topbar">
          <div className="inv-topbar-left">
            <button className="topbar-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={15} />
            </button>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1a2340" }}>
              Sales Invoice #{inv.invoice_number}
            </span>
            <PayChip status={inv.payment_status} />
          </div>

          <div className="inv-topbar-right">
            {/* Download PDF */}
            <div className="topbar-split">
              <button className="main" onClick={handleDownloadPDF} disabled={dlLoading}>
                <Download size={14} />
                {dlLoading ? "Generating…" : "Download PDF"}
              </button>
              <button className="arr"><ChevronDown size={13}/></button>
            </div>

            {/* Print */}
            <div className="topbar-split">
              <button className="main" onClick={() => window.print()}>
                <Printer size={14}/> Print PDF
              </button>
              <button className="arr"><ChevronDown size={13}/></button>
            </div>

            {/* Info / history */}
            <button className="topbar-btn" title="Invoice history">
              <Clock size={14}/>
            </button>

            {/* Share */}
            <div className="topbar-split">
              <button className="main"><Share2 size={14}/> Share</button>
              <button className="arr"><ChevronDown size={13}/></button>
            </div>

            {/* More */}
            <button className="topbar-btn"><MoreVertical size={14}/></button>

            {/* E-way bill */}
            <button className="topbar-btn primary">
              <TruckIcon size={14}/> Generate E-way Bill
            </button>

            {/* e-Invoice */}
            <button className="topbar-btn green">
              <Zap size={14}/> Generate e-Invoice
            </button>
          </div>
        </div>

        {/* ══ LAYOUT ══ */}
        <div className="inv-layout">

          {/* ── Invoice Paper ── */}
          <div className="inv-paper">
            <div className="inv-print-area" ref={printRef}>

              {/* Store name */}
              <div className="inv-store-name">{biz.name ?? "Your Business"}</div>
              <div className="inv-store-sub">
                {[biz.mobile && `Mobile: ${biz.mobile}`, biz.email, biz.address].filter(Boolean).join("  ·  ")}
              </div>

              {/* Invoice meta */}
              <div className="inv-meta-bar">
                <div>
                  <div className="lbl">Invoice No.</div>
                  <div className="val">{inv.invoice_number ?? "-"}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div className="lbl">Invoice Date</div>
                  <div className="val">{fmtDate(inv.order_date)}</div>
                </div>
              </div>

              {/* Bill to */}
              <div style={{ marginBottom: 20 }}>
                <div className="inv-bill-lbl">Bill To</div>
                <div className="inv-bill-name">{inv.customer_name ?? "Cash Sale"}</div>
                {inv.customer_phone && (
                  <div className="inv-bill-sub">Mobile: {inv.customer_phone}</div>
                )}
                {inv.customer_gstin && (
                  <div className="inv-bill-sub">GSTIN: {inv.customer_gstin}</div>
                )}
                {inv.billing_address && (
                  <div className="inv-bill-sub">{inv.billing_address}</div>
                )}
              </div>

              {/* Divider */}
              <div className="inv-divider" />

              {/* Items table */}
              <table className="inv-items-table">
                <thead>
                  <tr>
                    <th style={{ width:"35%" }}>Items</th>
                    <th className="ctr">HSN</th>
                    <th className="ctr">Qty.</th>
                    <th className="num">Rate</th>
                    <th className="num">Tax</th>
                    <th className="num">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(inv.items ?? []).map((item, i) => {
                    const taxRate = Number(item.cgst_rate||0) + Number(item.sgst_rate||0) + Number(item.igst_rate||0);
                    return (
                      <tr key={i}>
                        <td>
                          <div style={{ fontWeight: 600, color:"#1a2340" }}>
                            {item.name}
                          </div>
                          {item.description && (
                            <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{item.description}</div>
                          )}
                        </td>
                        <td className="ctr" style={{ color:"#666" }}>{item.hsn_code ?? "-"}</td>
                        <td className="ctr">
                          {Number(item.quantity)} {item.unit ?? "PCS"}
                        </td>
                        <td className="num">{fmtMoney(item.unit_price)}</td>
                        <td className="num">
                          {item.tax_amount > 0 ? (
                            <>
                              <div>{fmtMoney(item.tax_amount)}</div>
                              <div style={{ fontSize:11, color:"#888" }}>({taxRate}%)</div>
                            </>
                          ) : "-"}
                        </td>
                        <td className="num" style={{ fontWeight:600 }}>{fmtMoney(item.total)}</td>
                      </tr>
                    );
                  })}

                  {/* Empty rows for short invoices */}
                  {(inv.items ?? []).length < 4 &&
                    Array.from({ length: 4 - (inv.items??[]).length }).map((_, i) => (
                      <tr key={`empty-${i}`}>
                        <td colSpan={6} style={{ height:36, borderBottom:"1px solid #f5f5f5" }} />
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              {/* Subtotal bar */}
              <div className="inv-subtotal-bar">
                <span>SUBTOTAL</span>
                <span style={{ display:"flex", gap:80 }}>
                  <span>{(inv.items??[]).reduce((s,i) => s + Number(i.quantity||0), 0)}</span>
                  <span>{fmtMoney(inv.tax_amount)}</span>
                  <span>{fmtMoney(inv.subtotal)}</span>
                </span>
              </div>

              {/* Summary grid */}
              <div className="inv-summary-grid">
                {/* Terms */}
                <div className="inv-terms">
                  {inv.terms_and_conditions && (
                    <>
                      <div className="lbl">Terms and Conditions</div>
                      <p style={{ whiteSpace:"pre-line", margin:0 }}>{inv.terms_and_conditions}</p>
                    </>
                  )}
                  {inv.notes && (
                    <p style={{ marginTop:10, fontStyle:"italic", color:"#888" }}>{inv.notes}</p>
                  )}
                  <div className="inv-words">
                    <strong>Total Amount (in words):</strong><br />
                    {numToWords(Math.round(inv.total_amount))} Rupees Only
                  </div>
                </div>

                {/* Totals */}
                <div className="inv-totals">
                  {[
                    { lbl: "Taxable Amount",  val: fmtMoney(inv.taxable_amount) },
                    inv.cgst_amount > 0 && { lbl: `CGST @${inv.items?.[0]?.cgst_rate ?? 0}%`, val: fmtMoney(inv.cgst_amount) },
                    inv.sgst_amount > 0 && { lbl: `SGST @${inv.items?.[0]?.sgst_rate ?? 0}%`, val: fmtMoney(inv.sgst_amount) },
                    inv.igst_amount > 0 && { lbl: "IGST",                                     val: fmtMoney(inv.igst_amount) },
                    inv.cess_amount > 0 && { lbl: "Cess",                                     val: fmtMoney(inv.cess_amount) },
                    inv.discount_amount > 0 && { lbl: "Discount",                             val: `- ${fmtMoney(inv.discount_amount)}` },
                    inv.round_off !== 0 && { lbl: "Round Off",                                val: fmtMoney(inv.round_off) },
                  ].filter(Boolean).map(({ lbl, val }) => (
                    <div className="inv-total-row" key={lbl}>
                      <span>{lbl}</span><span>{val}</span>
                    </div>
                  ))}

                  <div className="inv-total-divider" />
                  <div className="inv-total-row bold">
                    <span>Total Amount</span>
                    <span>{fmtMoney(inv.total_amount)}</span>
                  </div>
                  <div className="inv-total-row" style={{ color:"#555" }}>
                    <span>Received Amount</span>
                    <span>{fmtMoney(inv.paid_amount)}</span>
                  </div>
                  <div className="inv-total-row balance">
                    <span>Balance</span>
                    <span style={{ color: inv.balance_amount > 0 ? "#dc3545" : "#166534" }}>
                      {fmtMoney(inv.balance_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="inv-sidebar">

            {/* Profit details button */}
            <button className="topbar-btn" style={{ width:"100%", justifyContent:"center" }}>
              <IndianRupee size={14}/> Profit Details
            </button>

            {/* Payment History */}
            <div className="inv-side-card">
              <div className="inv-side-card-hdr">
                <Clock size={13}/> Payment History
              </div>
              <div className="inv-side-card-body">
                {(inv.payments ?? []).length === 0 ? (
                  <p style={{ fontSize:12.5, color:"#aaa", margin:0, textAlign:"center", padding:"8px 0" }}>
                    No payments recorded
                  </p>
                ) : (
                  (inv.payments ?? []).map((p, i) => (
                    <div className="pay-hist-item" key={i}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:12.5, color:"#1a2340" }}>{fmtMoney(p.amount)}</div>
                        <div style={{ fontSize:11, color:"#888" }}>{fmtDate(p.date)}</div>
                      </div>
                      <span style={{ fontSize:11, color:"#888", textTransform:"capitalize" }}>{p.method}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Invoice details */}
            <div className="inv-side-card">
              <div className="inv-side-card-hdr">
                <FileText size={13}/> Invoice Info
              </div>
              <div className="inv-side-card-body">
                {[
                  ["Order #",   inv.order_number],
                  ["Type",      inv.order_type],
                  ["Status",    inv.status],
                  ["Payment",   inv.payment_method],
                  ["Due Date",  fmtDate(inv.due_date)],
                  inv.ewaybill_number && ["E-way Bill", inv.ewaybill_number],
                ].filter(Boolean).map(([lbl, val]) => (
                  <div className="inv-side-row" key={lbl}>
                    <span className="sl">{lbl}</span>
                    <span className="sv" style={{ textTransform:"capitalize" }}>{val || "-"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}