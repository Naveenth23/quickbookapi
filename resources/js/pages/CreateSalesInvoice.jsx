import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function CreateSalesInvoice() {
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [invoice, setInvoice] = useState({
        customer_name: "Cash Sale",
        order_date: new Date().toISOString().split("T")[0],
        payment_status: "paid",
        payment_method: "cash",
        subtotal: 0,
        tax_amount: 0,
        discount_amount: 0,
        total_amount: 0,
        notes: "",
        terms_and_conditions:
            "1. Goods once sold will not be taken back or exchanged.\n2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only.",
        auto_round_off: true,
    });

    // Fetch product list for search
    const fetchProducts = async (query = "") => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/products?search=${query}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setProducts(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (search.length > 1) fetchProducts(search);
        else setProducts([]);
    }, [search]);

    const handleAddItem = (product) => {
        const exists = items.find((i) => i.product_id === product.id);
        if (exists) {
            const updated = items.map((i) =>
                i.product_id === product.id
                    ? {
                          ...i,
                          quantity: i.quantity + 1,
                          amount: (i.quantity + 1) * i.rate,
                      }
                    : i
            );
            setItems(updated);
            recalculateTotals(updated);
        } else {
            const newItem = {
                product_id: product.id,
                name: product.name,
                rate: product.sale_price,
                quantity: 1,
                amount: product.sale_price,
            };
            const updated = [...items, newItem];
            setItems(updated);
            recalculateTotals(updated);
        }
        setSearch("");
        setProducts([]);
    };

    const recalculateTotals = (list) => {
        const subtotal = list.reduce((sum, i) => sum + i.amount, 0);
        const total = Math.round(subtotal);
        setInvoice({
            ...invoice,
            subtotal,
            total_amount: total,
        });
    };

    const handleSaveInvoice = async () => {
        if (items.length === 0) {
            alert("Please add at least one item before saving.");
            return;
        }

        try {
            const payload = {
                ...invoice,
                items: items.map((i) => ({
                    product_id: i.product_id,
                    name: i.name,
                    quantity: i.quantity,
                    sp: i.rate,
                    amount: i.amount,
                })),
            };

            const res = await axios.post("/api/orders", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.data.success) {
                alert("✅ Sales Invoice saved successfully!");
                setItems([]);
                setInvoice({ ...invoice, subtotal: 0, total_amount: 0 });
            } else {
                alert("❌ " + res.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error saving invoice.");
        }
    };

    return (
        <div className="container-fluid px-4 py-3 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Create Sales Invoice</h5>
                <div>
                    <button className="btn btn-outline-secondary me-2">
                        <i className="bi bi-gear"></i> Settings
                    </button>
                    <button
                        className="btn btn-primary px-4"
                        onClick={handleSaveInvoice}
                    >
                        Save Sales Invoice
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bi bi-upc-scan"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Scan Barcode or Search Item"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {loading && (
                        <div className="mt-2 text-muted small">Loading...</div>
                    )}

                    {products.length > 0 && (
                        <div className="border mt-2 rounded bg-white position-absolute w-50 z-3">
                            <table className="table table-hover table-sm mb-0">
                                <tbody>
                                    {products.map((p) => (
                                        <tr
                                            key={p.id}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleAddItem(p)}
                                        >
                                            <td>{p.name}</td>
                                            <td>₹{p.sale_price}</td>
                                            <td>
                                                {p.stock_quantity || 0} in stock
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Items Table */}
            <div className="card shadow-sm border-0 mb-3">
                <div className="card-body p-0">
                    <table className="table table-bordered table-striped mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Item</th>
                                <th>Rate (₹)</th>
                                <th>Qty</th>
                                <th>Amount (₹)</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center text-muted py-3"
                                    >
                                        + Add Item
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={item.rate}
                                                onChange={(e) => {
                                                    const val =
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0;
                                                    const updated = [...items];
                                                    updated[i].rate = val;
                                                    updated[i].amount =
                                                        val *
                                                        updated[i].quantity;
                                                    setItems(updated);
                                                    recalculateTotals(updated);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const val =
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0;
                                                    const updated = [...items];
                                                    updated[i].quantity = val;
                                                    updated[i].amount =
                                                        val * updated[i].rate;
                                                    setItems(updated);
                                                    recalculateTotals(updated);
                                                }}
                                            />
                                        </td>
                                        <td>₹ {item.amount}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    const updated =
                                                        items.filter(
                                                            (_, index) =>
                                                                index !== i
                                                        );
                                                    setItems(updated);
                                                    recalculateTotals(updated);
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Totals & Notes */}
            <div className="row">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm mb-3">
                        <div className="card-body">
                            <h6 className="fw-semibold mb-2">+ Add Notes</h6>
                            <textarea
                                className="form-control mb-3"
                                rows="3"
                                value={invoice.notes}
                                onChange={(e) =>
                                    setInvoice({
                                        ...invoice,
                                        notes: e.target.value,
                                    })
                                }
                                placeholder="Enter notes (optional)"
                            ></textarea>

                            <h6 className="fw-semibold mb-2">
                                Terms and Conditions
                            </h6>
                            <textarea
                                className="form-control"
                                rows="4"
                                value={invoice.terms_and_conditions}
                                onChange={(e) =>
                                    setInvoice({
                                        ...invoice,
                                        terms_and_conditions: e.target.value,
                                    })
                                }
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card border-0 shadow-sm mb-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal</span>
                                <strong>₹ {invoice.subtotal}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Taxable Amount</span>
                                <strong>₹ {invoice.subtotal}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Discount</span>
                                <strong>₹ {invoice.discount_amount}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2 border-top pt-2">
                                <span className="fw-semibold">
                                    Total Amount
                                </span>
                                <strong>₹ {invoice.total_amount}</strong>
                            </div>
                            <div className="form-check mt-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={invoice.payment_status === "paid"}
                                    onChange={(e) =>
                                        setInvoice({
                                            ...invoice,
                                            payment_status: e.target.checked
                                                ? "paid"
                                                : "pending",
                                        })
                                    }
                                />
                                <label className="form-check-label">
                                    Mark as fully paid
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
