import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import CreateItemModal from "../components/common/CreateItemModal";

/* ─── axios ─── */
const api = () => axios.create({
    baseURL: "/api",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

/* ─── inject styles once ─── */
if (typeof document !== "undefined" && !document.getElementById("__pos-st__")) {
    const s = document.createElement("style");
    s.id = "__pos-st__";
    s.textContent = `
    /* search drop */
    .psd { position:absolute;top:100%;left:0;right:0;z-index:9999;background:#fff;
      border:1px solid #dee2e6;border-top:none;border-radius:0 0 10px 10px;
      box-shadow:0 8px 28px rgba(0,0,0,.13);max-height:320px;overflow-y:auto; }
    .psd table { margin:0; }
    .psr { cursor:pointer; }
    .psr td { padding:9px 12px!important;font-size:13.5px;transition:background .07s; }
    .psr:hover td { background:#f0f6ff; }
    .psr.hi td { background:#1967d2!important;color:#fff!important; }
    .psr.hi span,.psr.hi small { color:rgba(255,255,255,.85)!important; }
    .psd-new { display:flex;align-items:center;gap:8px;padding:10px 14px;
      cursor:pointer;border-top:1px solid #eee;color:#1967d2;font-size:13px;
      font-weight:600; }
    .psd-new:hover { background:#f0f6ff; }
    /* cart rows */
    .pcr { cursor:pointer; }
    .pcr td { padding:9px 10px!important;vertical-align:middle; }
    .pcr:hover td { background:#f8f9fa; }
    .pcr.sel td { background:#fff8e1;border-top:2px solid #ffc107!important;
      border-bottom:2px solid #ffc107!important; }
    /* inline inputs always visible on selected row */
    .pin { border:2px solid #ff9800!important;background:#fffde7!important;
      border-radius:6px;font-weight:700;text-align:center; }
    .pin:focus { outline:none;box-shadow:0 0 0 3px rgba(255,152,0,.22)!important; }
    /* steppers */
    .pst { width:26px;height:26px;border:1px solid #ccc;border-radius:5px;background:#fff;
      cursor:pointer;font-size:15px;display:inline-flex;align-items:center;
      justify-content:center;user-select:none; }
    .pst:hover { background:#e9ecef; }
    /* shimmer */
    @keyframes psh { 0%{background-position:-400px 0}100%{background-position:400px 0} }
    .psm { height:36px;border-radius:4px;margin:5px 8px;
      background:linear-gradient(90deg,#f0f0f0 25%,#e6e6e6 50%,#f0f0f0 75%);
      background-size:400px 100%;animation:psh 1.2s infinite; }
    /* tab */
    .ptab { display:inline-flex;align-items:center;gap:6px;padding:6px 14px;
      border-radius:8px;border:1px solid #dee2e6;cursor:pointer;font-size:13px;
      user-select:none;transition:all .12s; }
    .ptab.on { background:#fff8e1;border-color:#ffc107;font-weight:600; }
    .ptab:not(.on) { background:#f8f9fa;color:#666; }
    .ptab:not(.on):hover { background:#e9ecef; }
    /* kbd chip */
    .kc { display:inline-block;padding:1px 6px;border-radius:4px;background:#e9ecef;
      color:#555;font-size:11px;font-weight:600;margin-left:4px; }
    .kc.b { background:#dbeafe;color:#1d4ed8; }
    `;
    document.head.appendChild(s);
}

/* ════════════════════════ helper ════════════════════════ */
const emptyBill = (id, name) => ({
    id, name,
    items: [], subTotal: 0, taxTotal: 0, finalTotal: 0,
    discount: { type: "after_tax", percent: 0, amount: 0 },
    extraCharges: [],
});

function recalc(bill) {
    const sub = bill.items.reduce((s, i) => s + i.amount, 0);
    const tax = 0;
    const total = sub + tax;
    let disc = 0;
    if (bill.discount.percent > 0) disc = (total * bill.discount.percent) / 100;
    else if (bill.discount.amount > 0) disc = bill.discount.amount;
    const afterDisc = bill.discount.type === "before_tax" ? sub - disc + tax : total - disc;
    const charges = bill.extraCharges.reduce((s, c) => s + Number(c.amount || 0), 0);
    return { ...bill, subTotal: sub, taxTotal: tax, finalTotal: Math.max(afterDisc + charges, 0) };
}

/* ════════════════════════ COMPONENT ════════════════════════ */
export default function POSBilling() {

    /* bills */
    const [bills, setBills]           = useState([emptyBill(1, "Billing Screen 1")]);
    const [activeId, setActiveId]     = useState(1);

    /* search */
    const [query,    setQuery]        = useState("");
    const [results,  setResults]      = useState([]);
    const [hiIdx,    setHiIdx]        = useState(-1);
    const [dropOpen, setDropOpen]     = useState(false);
    const [loading,  setLoading]      = useState(false);
    const [defaults, setDefaults]     = useState([]);

    /* cart selection — ONE selected row, always shows inline inputs */
    const [selId,    setSelId]        = useState(null);

    /* customer — selectedCustomer = full object from DB, or null = Cash Sale */
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    // legacy quick-entry (used inside create-new form inside modal)
    const [custName, setCustName]     = useState("Cash Sale");
    const [custMob,  setCustMob]      = useState("");
    // customer search inside modal
    const [custSearch,      setCustSearch]      = useState("");
    const [custResults,     setCustResults]     = useState([]);
    const [custSearchLoading, setCustSearchLoading] = useState(false);
    const custDebounce = useRef(null);
    // new customer create form inside modal
    const [showCreateCust,  setShowCreateCust]  = useState(false);
    const [newCust,         setNewCust]         = useState({ name:"", phone:"", email:"", gstin:"", billing_address:"", city:"", customer_type:"regular" });

    /* payment */
    const [received, setReceived]     = useState("");
    const [method,   setMethod]       = useState("cash");

    /* charge modal form */
    const [cName,    setCName]        = useState("");
    const [cAmt,     setCAmtVal]      = useState("");

    /* modals */
    const [mItem,    setMItem]        = useState(false);
    const [mCust,    setMCust]        = useState(false);
    const [mDisc,    setMDisc]        = useState(false);
    const [mCharge,  setMCharge]      = useState(false);
    const [mExit,    setMExit]        = useState(false);

    /* misc */
    const [cats,     setCats]         = useState([]);
    const [units,    setUnits]        = useState([]);

    /* refs */
    const searchRef   = useRef(null);
    const rcvRef      = useRef(null);
    const qtyRefs     = useRef({});   // itemId → input el
    const priceRefs   = useRef({});   // itemId → input el
    const debounce    = useRef(null);
    const barcBuf     = useRef("");
    const barcTimer   = useRef(null);
    const dropRef     = useRef(null); // for scroll

    /* derived */
    const bill         = bills.find(b => b.id === activeId) || bills[0];
    const items        = bill.items;
    const selItem      = items.find(i => i.id === selId) || null;
    const anyModal     = mItem || mCust || mDisc || mCharge || mExit;
    const custLabel    = selectedCustomer ? selectedCustomer.name : (custName && custName !== "Cash Sale" ? custName : "Cash Sale");
    const custSublabel = selectedCustomer ? (selectedCustomer.phone || selectedCustomer.email || "") : custMob;
    const gstOptions   = ["None","GST @0.25%","GST @3%","GST @5%","GST @12%","GST @18%","GST @28%"];
    const change       = parseFloat(received) > bill.finalTotal ? parseFloat(received) - bill.finalTotal : 0;

    /* ─── patch one bill ─── */
    const patchBill = useCallback((id, fn) => {
        setBills(prev => prev.map(b => b.id === id ? recalc(fn(b)) : b));
    }, []);

    /* ─── patch items of active bill ─── */
    const setItems = useCallback((fn) => {
        setBills(prev => prev.map(b => {
            if (b.id !== activeId) return b;
            const updated = { ...b, items: typeof fn === "function" ? fn(b.items) : fn };
            return recalc(updated);
        }));
    }, [activeId]);

    /* ─── update single item field, keep selection ─── */
    const patchItem = useCallback((itemId, patch) => {
        setItems(prev => prev.map(i => {
            if (i.id !== itemId) return i;
            const next = { ...i, ...patch };
            next.amount = next.sp * next.quantity;
            return next;
        }));
    }, [setItems]);

    /* ════════════ SEARCH ════════════ */
    const loadDefaults = useCallback(async () => {
        if (defaults.length > 0) { setResults(defaults); return; }
        setLoading(true);
        try {
            const r = await axios.get("/api/products?per_page=60", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const list = r.data.data || [];
            setDefaults(list);
            setResults(list);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    }, [defaults]);

    const doSearch = useCallback((q) => {
        setQuery(q);
        setHiIdx(-1);
        clearTimeout(debounce.current);
        if (!q.trim()) { setResults(defaults); setDropOpen(true); return; }
        debounce.current = setTimeout(async () => {
            setLoading(true);
            try {
                const r = await axios.get(`/api/products?search=${encodeURIComponent(q)}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setResults(r.data.data || []);
                setDropOpen(true);
            } catch { /* ignore */ }
            finally { setLoading(false); }
        }, 200);
    }, [defaults]);

    const onSearchFocus = () => {
        loadDefaults();
        setDropOpen(true);
        if (!query.trim()) setResults(defaults);
    };

    const onSearchBlur = () => {
        setTimeout(() => { setDropOpen(false); setHiIdx(-1); }, 180);
    };

    /* scroll highlighted item into view */
    useEffect(() => {
        if (dropRef.current && hiIdx >= 0) {
            const rows = dropRef.current.querySelectorAll(".psr");
            rows[hiIdx]?.scrollIntoView({ block: "nearest" });
        }
    }, [hiIdx]);

    /* ════════════ ADD ITEM ════════════ */
    const addProduct = useCallback((product) => {
        const stock = Number(product.stock_quantity ?? product.stock_qty ?? 0);
        if (stock <= 0) { toast.error(`"${product.name}" is out of stock`); return; }

        let addedId;
        setItems(prev => {
            const idx = prev.findIndex(i => i.product_id === product.id);
            if (idx !== -1) {
                addedId = prev[idx].id;
                return prev.map((i, x) => x !== idx ? i : {
                    ...i, quantity: i.quantity + 1,
                    amount: (i.quantity + 1) * i.sp,
                });
            }
            const ni = {
                id: Date.now(),
                product_id: product.id,
                name: product.name,
                code: product.sku || product.item_code || "-",
                mrp: Number(product.mrp || 0),
                sp: Number(product.sale_price || product.sales_price || 0),
                quantity: 1,
                amount: Number(product.sale_price || product.sales_price || 0),
                unit: product.unit?.name || product.unit || "PCS",
            };
            addedId = ni.id;
            return [...prev, ni];
        });

        // After state settles — select the row and focus search again
        setTimeout(() => {
            setSelId(addedId);
            setQuery("");
            setResults(defaults);
            setDropOpen(false);
            setHiIdx(-1);
            searchRef.current?.focus();
        }, 30);
    }, [setItems, defaults]);

    /* ════════════ BARCODE ════════════ */
    useEffect(() => {
        const h = (e) => {
            if (document.activeElement === searchRef.current) return;
            if (e.key === "Enter") {
                if (barcBuf.current.length > 3) {
                    const bc = barcBuf.current;
                    barcBuf.current = "";
                    axios.get(`/api/products?barcode=${bc}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    }).then(r => {
                        const p = r.data.data?.[0];
                        if (p) addProduct(p); else toast.error(`No product: ${bc}`);
                    }).catch(() => toast.error("Scan error"));
                }
                return;
            }
            if (/^[a-zA-Z0-9]$/.test(e.key)) {
                barcBuf.current += e.key;
                clearTimeout(barcTimer.current);
                barcTimer.current = setTimeout(() => { barcBuf.current = ""; }, 500);
            }
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [addProduct]);

    /* ════════════ BILL ACTIONS ════════════ */
    const holdBill = () => {
        if (bills.length >= 5) { toast.warning("Max 5 screens"); return; }
        const nb = emptyBill(Date.now(), "");
        const updated = [...bills, nb].map((b, i) => ({ ...b, name: `Billing Screen ${i + 1}` }));
        setBills(updated);
        setActiveId(nb.id);
        setSelId(null);
        setTimeout(() => searchRef.current?.focus(), 50);
    };

    const closeBill = (id) => {
        if (bills.length === 1) { toast.warning("Need at least one screen"); return; }
        const filtered = bills.filter(b => b.id !== id).map((b, i) => ({ ...b, name: `Billing Screen ${i + 1}` }));
        setBills(filtered);
        if (activeId === id) { setActiveId(filtered[0].id); setSelId(null); }
    };

    const deleteItem = useCallback(() => {
        if (!selId) { toast.warning("Select a row first"); return; }
        setItems(prev => {
            const idx = prev.findIndex(i => i.id === selId);
            const next = prev.filter(i => i.id !== selId);
            // select adjacent row
            setTimeout(() => {
                if (next.length > 0) setSelId(next[Math.min(idx, next.length - 1)].id);
                else { setSelId(null); searchRef.current?.focus(); }
            }, 20);
            return next;
        });
    }, [selId, setItems]);

    const saveBill = useCallback(async () => {
        if (items.length === 0) { toast.error("Add items first"); return; }
        try {
            const payload = {
                items: items.map(i => ({ product_id: i.product_id || null, name: i.name, code: i.code, quantity: i.quantity, sp: i.sp, amount: i.amount, unit: i.unit || "PCS" })),
                sub_total: bill.subTotal, tax: bill.taxTotal, total: bill.finalTotal,
                discount_amount: bill.discount.amount || 0,
                extra_charges: bill.extraCharges,
                payment_method: method,
                received_amount: parseFloat(received) || bill.finalTotal,
                // customer — send id if selected from DB, else name+mobile for walkin
                ...(selectedCustomer
                    ? { customer_id: selectedCustomer.id }
                    : (custLabel !== "Cash Sale"
                        ? { customer: { name: custLabel, mobile: custSublabel } }
                        : {}
                    )
                ),
            };
            const res = await axios.post("/api/orders", payload, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (res.data.success !== false) {
                toast.success("Bill saved!");
                setBills(prev => prev.map(b => b.id === activeId ? emptyBill(b.id, b.name) : b));
                setSelId(null); setReceived("");
                // reset customer for next bill
                setSelectedCustomer(null); setCustName("Cash Sale"); setCustMob("");
                setTimeout(() => searchRef.current?.focus(), 80);
            } else toast.error(res.data.message || "Save failed");
        } catch { toast.error("Error saving bill"); }
    }, [items, bill, custLabel, custSublabel, selectedCustomer, method, received, activeId]);

    const handleCreateItem = async (formData) => {
        try {
            const res = await api().post("/products", formData);
            setMItem(false);
            setDefaults([]); // refresh next time
            const prod = res.data.data ?? res.data;
            if (prod?.id) addProduct(prod);
            else toast.success("Item created! Search to add it.");
        } catch { toast.error("Create failed"); }
    };

    /* ════════════ CUSTOMER SEARCH & CREATE ════════════ */
    const searchCustomers = useCallback((q) => {
        setCustSearch(q);
        clearTimeout(custDebounce.current);
        if (!q.trim()) { setCustResults([]); return; }
        setCustSearchLoading(true);
        custDebounce.current = setTimeout(async () => {
            try {
                const r = await axios.get(`/api/customers?search=${encodeURIComponent(q)}&per_page=10`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setCustResults(r.data.data || []);
            } catch { /* ignore */ }
            finally { setCustSearchLoading(false); }
        }, 200);
    }, []);

    const createCustomer = async () => {
        if (!newCust.name.trim()) { toast.warning("Name is required"); return; }
        try {
            const res = await axios.post("/api/customers", newCust, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const cust = res.data.data;
            setSelectedCustomer(cust);
            setShowCreateCust(false); setMCust(false);
            toast.success(`Customer "${cust.name}" created!`);
        } catch { toast.error("Failed to create customer"); }
    };

    useEffect(() => {
        api().get("/categories").then(r => setCats(r.data.categories || r.data.data || [])).catch(() => {});
        api().get("/units").then(r => setUnits(r.data.units || r.data.data || [])).catch(() => {});
    }, []);

    /* ════════════ GLOBAL KEYBOARD ════════════
       Simple priority:
         anyModal open → ignore (modals handle own keys)
         search focused → onKeyDown on input handles arrows/enter/esc
         otherwise → F-keys, arrows(cart nav), Q/P/Enter/Del
    ════════════════════════════════════════ */
    useEffect(() => {
        const h = (e) => {
            const ae     = document.activeElement;
            const inSrch = ae === searchRef.current;
            const inInp  = ["INPUT","TEXTAREA","SELECT"].includes(ae?.tagName);

            /* F-keys fire always (even inside inputs) */
            if (e.key === "F1") { e.preventDefault(); searchRef.current?.focus(); searchRef.current?.select(); return; }
            if (e.key === "F2") { e.preventDefault(); if (!anyModal) setMDisc(true); return; }
            if (e.key === "F3") { e.preventDefault(); if (!anyModal) setMCharge(true); return; }
            if (e.key === "F4") { e.preventDefault(); setTimeout(() => { rcvRef.current?.focus(); rcvRef.current?.select(); }, 30); return; }
            if (e.key === "F5") { e.preventDefault(); if (!anyModal) setMCust(true); return; }
            if (e.key === "F7") { e.preventDefault(); saveBill(); return; }

            if (e.ctrlKey && e.key.toLowerCase() === "b") { e.preventDefault(); holdBill(); return; }
            if (e.ctrlKey && e.key.toLowerCase() === "i") { e.preventDefault(); setMItem(true); return; }

            /* Escape */
            if (e.key === "Escape") {
                e.preventDefault();
                if (anyModal) return;          // modal handles its own close btn
                if (inSrch) {                  // esc in search → blur, stay in cart
                    setDropOpen(false); setHiIdx(-1);
                    searchRef.current?.blur();
                    return;
                }
                if (inInp) {                   // esc in qty/price → back to search
                    searchRef.current?.focus();
                    return;
                }
                setMExit(true);
                return;
            }

            if (anyModal) return;
            if (inSrch) return;   // search onKeyDown handles arrows/enter

            /* inside qty or price input: Enter → back to search */
            if (inInp) {
                if (e.key === "Enter") { e.preventDefault(); searchRef.current?.focus(); }
                return;
            }

            /* global cart nav (no input focused) */
            if (items.length === 0) return;

            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                const idx  = items.findIndex(i => i.id === selId);
                const next = e.key === "ArrowDown"
                    ? (idx < items.length - 1 ? idx + 1 : 0)
                    : (idx > 0 ? idx - 1 : items.length - 1);
                setSelId(items[next].id);
                return;
            }

            /* Enter → focus qty of selected */
            if (e.key === "Enter" && selId) {
                e.preventDefault();
                qtyRefs.current[selId]?.focus();
                qtyRefs.current[selId]?.select();
                return;
            }

            /* Q → focus qty */
            if (e.key.toLowerCase() === "q" && selId) {
                e.preventDefault();
                qtyRefs.current[selId]?.focus();
                qtyRefs.current[selId]?.select();
                return;
            }

            /* P → focus price */
            if (e.key.toLowerCase() === "p" && selId) {
                e.preventDefault();
                priceRefs.current[selId]?.focus();
                priceRefs.current[selId]?.select();
                return;
            }

            /* Delete → remove selected */
            if (e.key === "Delete") { e.preventDefault(); deleteItem(); return; }
        };

        window.addEventListener("keydown", h, true);
        return () => window.removeEventListener("keydown", h, true);
    }, [anyModal, items, selId, saveBill, deleteItem]);

    /* ════════════ RENDER ════════════ */
    return (
        <div className="container-fluid py-3" style={{ maxWidth: 1400 }}>

            {/* ── header ── */}
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setMExit(true)}>
                        ← Exit POS
                    </button>
                    <h5 className="fw-bold mb-0">🧾 POS Billing</h5>
                </div>
                <div className="d-flex gap-3 align-items-center" style={{ fontSize: 12, color: "#888" }}>
                    {[["F1","Search"],["↑↓","Navigate"],["Enter / Q","Edit Qty"],["P","Edit Price"],["Del","Remove"],["F7","Save Bill"]].map(([k,v]) => (
                        <span key={k}><span className="kc b">{k}</span> {v}</span>
                    ))}
                </div>
            </div>

            <div className="row g-3">

                {/* ══ LEFT ══ */}
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body">

                            {/* tabs */}
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                                {bills.map(b => (
                                    <div key={b.id} className={`ptab ${b.id === activeId ? "on" : ""}`}
                                        onClick={() => { setActiveId(b.id); setSelId(null); }}>
                                        {b.name}
                                        <button className="btn-close" style={{ fontSize: "0.52rem" }}
                                            onClick={e => { e.stopPropagation(); closeBill(b.id); }} />
                                    </div>
                                ))}
                                <button className="btn btn-link text-decoration-none small p-0 ms-1 fw-semibold" onClick={holdBill}>
                                    + Hold &amp; New <span className="kc">Ctrl+B</span>
                                </button>
                            </div>

                            {/* action bar */}
                            <div className="d-flex gap-2 mb-3">
                                <button className="btn btn-primary btn-sm" onClick={() => setMItem(true)}>
                                    + New Item <span className="kc">Ctrl+I</span>
                                </button>
                                <button className="btn btn-outline-danger btn-sm" onClick={deleteItem}>
                                    Delete <span className="kc">Del</span>
                                </button>
                                {selItem && (
                                    <div className="ms-auto d-flex gap-2">
                                        <button className="btn btn-outline-warning btn-sm" onClick={() => { priceRefs.current[selId]?.focus(); priceRefs.current[selId]?.select(); }}>
                                            Change Price <span className="kc">P</span>
                                        </button>
                                        <button className="btn btn-outline-success btn-sm" onClick={() => { qtyRefs.current[selId]?.focus(); qtyRefs.current[selId]?.select(); }}>
                                            Change Qty <span className="kc">Q</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* ── SEARCH ── */}
                            <div className="position-relative mb-3">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        {loading ? <span className="spinner-border spinner-border-sm text-primary" /> : <i className="bi bi-search text-muted" />}
                                    </span>
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Search by name / code or scan barcode… [F1]"
                                        value={query}
                                        autoFocus
                                        autoComplete="off"
                                        onChange={e => doSearch(e.target.value)}
                                        onFocus={onSearchFocus}
                                        onBlur={onSearchBlur}
                                        onKeyDown={e => {
                                            if (e.key === "ArrowDown") { e.preventDefault(); setHiIdx(p => Math.min(p + 1, results.length - 1)); return; }
                                            if (e.key === "ArrowUp")   { e.preventDefault(); setHiIdx(p => Math.max(p - 1, 0)); return; }
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                const picked = hiIdx >= 0 ? results[hiIdx] : results[0];
                                                if (picked) addProduct(picked);
                                                return;
                                            }
                                            if (e.key === "Escape") {
                                                e.preventDefault();
                                                setDropOpen(false); setHiIdx(-1);
                                                searchRef.current?.blur();
                                            }
                                        }}
                                    />
                                </div>

                                {/* dropdown */}
                                {dropOpen && (
                                    <div className="psd" ref={dropRef}>
                                        {loading ? (
                                            [1,2,3].map(n => <div key={n} className="psm" />)
                                        ) : results.length > 0 ? (
                                            <table className="table table-sm mb-0">
                                                <thead className="table-light sticky-top" style={{ fontSize: 12 }}>
                                                    <tr>
                                                        <th>Item Name</th>
                                                        <th style={{ width: 70 }}>Stock</th>
                                                        <th style={{ width: 95 }}>Sale Price</th>
                                                        <th style={{ width: 80 }}>MRP</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {results.map((p, i) => {
                                                        const stk = Number(p.stock_quantity ?? p.stock_qty ?? 0);
                                                        return (
                                                            <tr key={p.id}
                                                                className={`psr ${i === hiIdx ? "hi" : ""}`}
                                                                onMouseEnter={() => setHiIdx(i)}
                                                                onMouseDown={ev => { ev.preventDefault(); addProduct(p); }}
                                                            >
                                                                <td>
                                                                    <span className="fw-semibold">{p.name}</span>
                                                                    {p.sku && <small className="text-muted ms-2">{p.sku}</small>}
                                                                </td>
                                                                <td><span className={stk <= 0 ? "text-danger fw-bold" : "text-success fw-bold"}>{stk}</span></td>
                                                                <td>₹{Number(p.sale_price || 0).toFixed(2)}</td>
                                                                <td><small className="text-muted">{p.mrp ? `₹${p.mrp}` : "–"}</small></td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div style={{ padding: "18px", textAlign: "center", color: "#aaa", fontSize: 13 }}>
                                                No products found for "{query}"
                                            </div>
                                        )}
                                        {/* create new */}
                                        <div className="psd-new" onMouseDown={e => { e.preventDefault(); setDropOpen(false); setMItem(true); }}>
                                            <i className="bi bi-plus-circle-fill" />
                                            {query.trim() ? `Create "${query}" as new item` : "Create New Item"}
                                            <span className="kc ms-auto">Ctrl+I</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── CART TABLE ── */}
                            <div className="table-responsive">
                                <table className="table table-bordered align-middle mb-0" style={{ fontSize: 13.5 }}>
                                    <thead className="table-light">
                                        <tr className="text-center">
                                            <th style={{ width: 36 }}>#</th>
                                            <th className="text-start">Item</th>
                                            <th style={{ width: 80 }}>Code</th>
                                            <th style={{ width: 70 }}>MRP</th>
                                            <th style={{ width: 130 }}>
                                                Sale Price <span className="kc b">P</span>
                                            </th>
                                            <th style={{ width: 170 }}>
                                                Quantity <span className="kc b">Q / Enter</span>
                                            </th>
                                            <th style={{ width: 105 }}>Amount</th>
                                            <th style={{ width: 44 }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center py-5 text-muted">
                                                    <i className="bi bi-cart3 d-block" style={{ fontSize: 38, opacity: .2 }} />
                                                    <div className="mt-2">Search or scan a product to begin</div>
                                                </td>
                                            </tr>
                                        ) : items.map((item, idx) => {
                                            const isSel = item.id === selId;
                                            return (
                                                <tr key={item.id}
                                                    className={`pcr ${isSel ? "sel" : ""}`}
                                                    onClick={() => setSelId(item.id)}
                                                >
                                                    <td className="text-center text-muted small">{idx + 1}</td>
                                                    <td>
                                                        <div className="fw-semibold">{item.name}</div>
                                                        {isSel && (
                                                            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                                                                <span className="kc b">Enter/Q</span> qty &nbsp;
                                                                <span className="kc b">P</span> price &nbsp;
                                                                <span className="kc b">Del</span> remove
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="text-center text-muted small">{item.code}</td>
                                                    <td className="text-center text-muted small">₹{item.mrp}</td>

                                                    {/* ── PRICE — always an input when row is selected ── */}
                                                    <td className="text-center" onClick={e => e.stopPropagation()}>
                                                        {isSel ? (
                                                            <input
                                                                ref={el => priceRefs.current[item.id] = el}
                                                                type="number"
                                                                className="form-control form-control-sm pin"
                                                                style={{ width: 90, margin: "0 auto" }}
                                                                value={item.sp}
                                                                onChange={e => {
                                                                    const v = parseFloat(e.target.value) || 0;
                                                                    patchItem(item.id, { sp: v });
                                                                }}
                                                                onFocus={e => e.target.select()}
                                                                onKeyDown={e => {
                                                                    if (e.key === "Tab")   { e.preventDefault(); qtyRefs.current[item.id]?.focus(); qtyRefs.current[item.id]?.select(); }
                                                                    if (e.key === "Enter") { e.preventDefault(); searchRef.current?.focus(); }
                                                                    if (e.key === "Escape"){ e.preventDefault(); searchRef.current?.focus(); }
                                                                }}
                                                            />
                                                        ) : (
                                                            <span>₹{item.sp}</span>
                                                        )}
                                                    </td>

                                                    {/* ── QTY — always an input when row is selected ── */}
                                                    <td className="text-center" onClick={e => e.stopPropagation()}>
                                                        {isSel ? (
                                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                                                <span className="pst"
                                                                    onClick={() => patchItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}>
                                                                    −
                                                                </span>
                                                                <input
                                                                    ref={el => qtyRefs.current[item.id] = el}
                                                                    type="number"
                                                                    className="form-control form-control-sm pin"
                                                                    style={{ width: 65, textAlign: "center" }}
                                                                    value={item.quantity}
                                                                    onChange={e => {
                                                                        const v = parseFloat(e.target.value) || 1;
                                                                        patchItem(item.id, { quantity: Math.max(1, v) });
                                                                    }}
                                                                    onFocus={e => e.target.select()}
                                                                    onKeyDown={e => {
                                                                        if (e.key === "Tab")   { e.preventDefault(); priceRefs.current[item.id]?.focus(); priceRefs.current[item.id]?.select(); }
                                                                        if (e.key === "Enter") { e.preventDefault(); searchRef.current?.focus(); }
                                                                        if (e.key === "Escape"){ e.preventDefault(); searchRef.current?.focus(); }
                                                                    }}
                                                                />
                                                                <span className="pst"
                                                                    onClick={() => patchItem(item.id, { quantity: item.quantity + 1 })}>
                                                                    +
                                                                </span>
                                                                <span style={{ fontSize: 11, color: "#888" }}>{item.unit}</span>
                                                            </div>
                                                        ) : (
                                                            <span>{item.quantity} <small className="text-muted">{item.unit}</small></span>
                                                        )}
                                                    </td>

                                                    <td className="text-center fw-semibold">₹{item.amount.toFixed(2)}</td>

                                                    {/* remove btn */}
                                                    <td className="text-center" onClick={e => e.stopPropagation()}>
                                                        <button className="btn btn-sm btn-outline-danger px-1 py-0"
                                                            style={{ fontSize: 13 }}
                                                            onClick={() => {
                                                                setItems(prev => prev.filter(i => i.id !== item.id));
                                                                if (selId === item.id) setSelId(null);
                                                            }}>
                                                            ×
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {items.length > 0 && (
                                <div className="d-flex justify-content-between align-items-center pt-2 mt-1 border-top">
                                    <span className="text-muted small">{items.length} item{items.length > 1 ? "s" : ""}</span>
                                    <button className="btn btn-sm btn-outline-danger"
                                        onClick={() => { if (window.confirm("Clear all items?")) { setItems([]); setSelId(null); } }}>
                                        Clear All
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ══ RIGHT — summary ══ */}
                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body">

                            <div className="d-flex gap-2 mb-3">
                                <button className="btn btn-outline-secondary w-100 btn-sm" onClick={() => setMDisc(true)}>Discount <span className="kc">F2</span></button>
                                <button className="btn btn-outline-secondary w-100 btn-sm" onClick={() => setMCharge(true)}>+ Charge <span className="kc">F3</span></button>
                            </div>

                            <h6 className="fw-semibold mb-2">Bill Details</h6>
                            <Row label="Sub Total" val={`₹${bill.subTotal.toFixed(2)}`} />
                            <Row label="Tax" val={`₹${bill.taxTotal.toFixed(2)}`} />
                            {(bill.discount.amount > 0 || bill.discount.percent > 0) && (
                                <Row label={`Discount${bill.discount.percent > 0 ? ` (${bill.discount.percent}%)` : ""}`}
                                    val={`- ₹${(bill.discount.amount > 0 ? bill.discount.amount : (bill.subTotal * bill.discount.percent) / 100).toFixed(2)}`}
                                    cls="text-danger" />
                            )}
                            {bill.extraCharges.map((c, i) => <Row key={i} label={c.name} val={`₹${Number(c.amount).toFixed(2)}`} />)}

                            <div className="mt-3 p-3 rounded bg-success-subtle d-flex justify-content-between align-items-center">
                                <span className="fw-bold fs-6">Total</span>
                                <span className="fw-bold fs-5 text-success">₹{bill.finalTotal.toFixed(2)}</span>
                            </div>

                            {/* received */}
                            <div className="mt-3">
                                <label className="form-label fw-semibold small mb-1">Received <span className="kc">F4</span></label>
                                <div className="d-flex gap-2">
                                    <input ref={rcvRef} type="text" inputMode="decimal" className="form-control fw-semibold"
                                        value={received} placeholder={bill.finalTotal.toFixed(2)}
                                        onFocus={e => e.target.select()}
                                        onChange={e => setReceived(e.target.value.replace(/[^0-9.]/g, ""))} />
                                    <select className="form-select" style={{ maxWidth: 105 }} value={method} onChange={e => setMethod(e.target.value)}>
                                        <option value="cash">Cash</option>
                                        <option value="upi">UPI</option>
                                        <option value="card">Card</option>
                                    </select>
                                </div>
                                {change > 0 && (
                                    <div className="mt-2 p-2 bg-info-subtle rounded d-flex justify-content-between">
                                        <span className="small fw-semibold">Return</span>
                                        <span className="fw-bold text-info">₹{change.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* customer */}
                            <div className="mt-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="small fw-semibold">Customer <span className="kc">F5</span></span>
                                    <button className="btn btn-sm btn-outline-secondary py-0" onClick={() => { setCustSearch(""); setCustResults([]); setShowCreateCust(false); setMCust(true); }}>
                                        <i className="bi bi-pencil" />
                                    </button>
                                </div>
                                <div className="border rounded p-2 bg-light small" style={{ cursor: "pointer" }}
                                    onClick={() => { setCustSearch(""); setCustResults([]); setShowCreateCust(false); setMCust(true); }}>
                                    {custLabel === "Cash Sale" ? (
                                        <span className="text-muted">
                                            <i className="bi bi-person-circle me-1" />Cash Sale
                                            <span className="ms-2 text-primary small">(click to add customer)</span>
                                        </span>
                                    ) : (
                                        <>
                                            <div className="fw-semibold">
                                                <i className="bi bi-person-check-fill text-success me-1" />
                                                {custLabel}
                                                {selectedCustomer && <span className="ms-2 kc" style={{ fontSize: 10 }}>{selectedCustomer.customer_type || "regular"}</span>}
                                            </div>
                                            {custSublabel && <div className="text-muted">{custSublabel}</div>}
                                            {selectedCustomer?.current_balance > 0 && (
                                                <div className="text-danger small mt-1">
                                                    <i className="bi bi-exclamation-circle me-1" />
                                                    Balance due: ₹{Number(selectedCustomer.current_balance).toFixed(2)}
                                                </div>
                                            )}
                                            <button className="btn btn-link p-0 text-danger small mt-1"
                                                onClick={e => { e.stopPropagation(); setSelectedCustomer(null); setCustName("Cash Sale"); setCustMob(""); }}>
                                                × Remove
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button className="btn btn-success w-100 mt-3 fw-semibold" onClick={saveBill}>
                                Save Bill <span className="kc">F7</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════ MODALS ════ */}
            <CreateItemModal show={mItem} onClose={() => setMItem(false)}
                categories={cats} units={units} gstOptions={gstOptions} onSave={handleCreateItem} />

            {/* Exit */}
            {mExit && createPortal(
                <Modal onClose={() => setMExit(false)} title="Leave POS?" titleCls="text-danger">
                    <p className="text-muted text-center mb-3">Unsaved items will be lost.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <button className="btn btn-outline-secondary" onClick={() => setMExit(false)}>Stay</button>
                        <button className="btn btn-danger" onClick={() => { setMExit(false); window.history.back(); }}>Leave</button>
                    </div>
                </Modal>, document.body
            )}

            {/* Discount */}
            {mDisc && createPortal(
                <Modal onClose={() => setMDisc(false)} title="Add Discount">
                    <label className="form-label fw-semibold small mb-2">Applies</label>
                    <div className="d-flex gap-3 mb-3">
                        {["before_tax","after_tax"].map(t => (
                            <label key={t} className={`border rounded px-3 py-2 w-100 ${bill.discount.type === t ? "border-primary bg-primary-subtle" : ""}`}>
                                <input type="radio" className="form-check-input me-2" checked={bill.discount.type === t}
                                    onChange={() => patchBill(activeId, b => ({ ...b, discount: { ...b.discount, type: t } }))} />
                                {t === "before_tax" ? "Before Tax" : "After Tax"}
                            </label>
                        ))}
                    </div>
                    <div className="row g-3">
                        <div className="col-6">
                            <label className="form-label small fw-semibold">Percentage (%)</label>
                            <input type="number" className="form-control" value={bill.discount.percent} onFocus={e => e.target.select()}
                                onChange={e => {
                                    const pct = parseFloat(e.target.value) || 0;
                                    const amt = bill.subTotal > 0 ? parseFloat(((bill.subTotal * pct) / 100).toFixed(2)) : 0;
                                    patchBill(activeId, b => ({ ...b, discount: { ...b.discount, percent: pct, amount: amt } }));
                                }} />
                        </div>
                        <div className="col-6">
                            <label className="form-label small fw-semibold">Flat Amount (₹)</label>
                            <input type="number" className="form-control" value={bill.discount.amount} onFocus={e => e.target.select()}
                                onChange={e => {
                                    const amt = parseFloat(e.target.value) || 0;
                                    const pct = bill.subTotal > 0 ? parseFloat(((amt / bill.subTotal) * 100).toFixed(2)) : 0;
                                    patchBill(activeId, b => ({ ...b, discount: { ...b.discount, amount: amt, percent: pct } }));
                                }} />
                        </div>
                    </div>
                    <div className="alert alert-light small mt-3 mb-0">% and ₹ auto-sync.</div>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <button className="btn btn-outline-secondary" onClick={() => setMDisc(false)}>Cancel</button>
                        <button className="btn btn-warning fw-semibold px-4" onClick={() => setMDisc(false)}>Done</button>
                    </div>
                </Modal>, document.body
            )}

            {/* Customer Modal — search existing OR create new */}
            {mCust && createPortal(
                <Modal onClose={() => { setMCust(false); setShowCreateCust(false); setCustSearch(""); setCustResults([]); }} title="Select Customer">
                    {!showCreateCust ? (
                        <>
                            {/* Search bar */}
                            <div className="position-relative mb-3">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        {custSearchLoading
                                            ? <span className="spinner-border spinner-border-sm text-primary" />
                                            : <i className="bi bi-search text-muted" />}
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Search by name, phone or email…"
                                        autoFocus
                                        value={custSearch}
                                        onChange={e => searchCustomers(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Results list */}
                            {custResults.length > 0 && (
                                <div className="border rounded mb-3" style={{ maxHeight: 260, overflowY: "auto" }}>
                                    {custResults.map(c => (
                                        <div key={c.id}
                                            className="d-flex align-items-start gap-2 px-3 py-2 border-bottom"
                                            style={{ cursor: "pointer", transition: "background .08s" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#f0f6ff"}
                                            onMouseLeave={e => e.currentTarget.style.background = ""}
                                            onClick={() => {
                                                setSelectedCustomer(c);
                                                setCustName(c.name); setCustMob(c.phone || "");
                                                setMCust(false); setCustSearch(""); setCustResults([]);
                                            }}
                                        >
                                            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                                                style={{ width: 36, height: 36, fontSize: 14 }}>
                                                {c.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold small">{c.name}
                                                    <span className="ms-2 kc" style={{ fontSize: 10 }}>{c.customer_type}</span>
                                                </div>
                                                <div className="text-muted" style={{ fontSize: 12 }}>
                                                    {c.phone && <span className="me-2"><i className="bi bi-phone" /> {c.phone}</span>}
                                                    {c.email && <span><i className="bi bi-envelope" /> {c.email}</span>}
                                                </div>
                                                {c.city && <div className="text-muted" style={{ fontSize: 11 }}><i className="bi bi-geo-alt" /> {c.city}</div>}
                                            </div>
                                            <div className="text-end flex-shrink-0" style={{ fontSize: 11 }}>
                                                {c.total_orders > 0 && <div className="text-muted">{c.total_orders} orders</div>}
                                                {c.current_balance > 0 && <div className="text-danger fw-semibold">₹{Number(c.current_balance).toFixed(0)} due</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Empty state */}
                            {custSearch && !custSearchLoading && custResults.length === 0 && (
                                <div className="text-center text-muted py-3 mb-3 border rounded" style={{ fontSize: 13 }}>
                                    <i className="bi bi-person-x d-block fs-3 mb-1 opacity-25" />
                                    No customer found for "{custSearch}"
                                </div>
                            )}

                            {/* Cash sale option */}
                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-secondary w-100 btn-sm"
                                    onClick={() => { setSelectedCustomer(null); setCustName("Cash Sale"); setCustMob(""); setMCust(false); setCustSearch(""); setCustResults([]); }}>
                                    <i className="bi bi-cash me-1" /> Cash Sale (No Customer)
                                </button>
                                <button className="btn btn-primary btn-sm"
                                    onClick={() => { setShowCreateCust(true); setNewCust({ name: custSearch, phone:"", email:"", gstin:"", billing_address:"", city:"", customer_type:"regular" }); }}>
                                    <i className="bi bi-person-plus me-1" /> New Customer
                                </button>
                            </div>
                        </>
                    ) : (
                        /* ── Create New Customer form ── */
                        <>
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <button className="btn btn-sm btn-link p-0" onClick={() => setShowCreateCust(false)}>
                                    ← Back
                                </button>
                                <span className="fw-semibold">Create New Customer</span>
                            </div>
                            <div className="row g-2">
                                <div className="col-12">
                                    <label className="form-label small fw-semibold mb-1">Name *</label>
                                    <input type="text" className="form-control form-control-sm" placeholder="Full name"
                                        value={newCust.name} onChange={e => setNewCust(p => ({ ...p, name: e.target.value }))} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-semibold mb-1">Phone</label>
                                    <input type="text" className="form-control form-control-sm" placeholder="Mobile number"
                                        value={newCust.phone} onChange={e => setNewCust(p => ({ ...p, phone: e.target.value }))} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-semibold mb-1">Email</label>
                                    <input type="email" className="form-control form-control-sm" placeholder="Email address"
                                        value={newCust.email} onChange={e => setNewCust(p => ({ ...p, email: e.target.value }))} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-semibold mb-1">GSTIN</label>
                                    <input type="text" className="form-control form-control-sm" placeholder="GST number"
                                        value={newCust.gstin} onChange={e => setNewCust(p => ({ ...p, gstin: e.target.value }))} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-semibold mb-1">City</label>
                                    <input type="text" className="form-control form-control-sm" placeholder="City"
                                        value={newCust.city} onChange={e => setNewCust(p => ({ ...p, city: e.target.value }))} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-semibold mb-1">Type</label>
                                    <select className="form-select form-select-sm"
                                        value={newCust.customer_type} onChange={e => setNewCust(p => ({ ...p, customer_type: e.target.value }))}>
                                        <option value="regular">Regular</option>
                                        <option value="walkin">Walk-in</option>
                                        <option value="wholesale">Wholesale</option>
                                        <option value="retail">Retail</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-semibold mb-1">Billing Address</label>
                                    <input type="text" className="form-control form-control-sm" placeholder="Address"
                                        value={newCust.billing_address} onChange={e => setNewCust(p => ({ ...p, billing_address: e.target.value }))} />
                                </div>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowCreateCust(false)}>Cancel</button>
                                <button className="btn btn-primary btn-sm" onClick={createCustomer}>
                                    <i className="bi bi-check2 me-1" /> Save Customer
                                </button>
                            </div>
                        </>
                    )}
                </Modal>, document.body
            )}

            {/* Extra Charge */}
            {mCharge && createPortal(
                <Modal onClose={() => setMCharge(false)} title="Add Charge">
                    <div className="mb-3"><label className="form-label fw-semibold">Name</label>
                        <input className="form-control" placeholder="e.g. Carry Bag" value={cName} onChange={e => setCName(e.target.value)} /></div>
                    <div className="mb-3"><label className="form-label fw-semibold">Amount (₹)</label>
                        <input type="number" className="form-control" value={cAmt} onFocus={e => e.target.select()} onChange={e => setCAmtVal(e.target.value)} /></div>
                    <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-outline-secondary" onClick={() => setMCharge(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={() => {
                            if (!cName || !cAmt) return;
                            patchBill(activeId, b => ({ ...b, extraCharges: [...b.extraCharges, { name: cName, amount: Number(cAmt) }] }));
                            setCName(""); setCAmtVal(""); setMCharge(false);
                        }}>Save</button>
                    </div>
                </Modal>, document.body
            )}
        </div>
    );
}

/* ── tiny helpers ── */
function Row({ label, val, cls = "" }) {
    return (
        <div className={`d-flex justify-content-between mb-1 ${cls}`}>
            <span className="text-muted small">{label}</span>
            <span className="small">{val}</span>
        </div>
    );
}

function Modal({ children, onClose, title, titleCls = "" }) {
    return (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.45)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-3">
                    <div className="modal-header border-bottom">
                        <h5 className={`modal-title fw-semibold ${titleCls}`}>{title}</h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>
                    <div className="modal-body px-4 py-3">{children}</div>
                </div>
            </div>
        </div>
    );
}