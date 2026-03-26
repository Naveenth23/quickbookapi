import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

export default function InvoiceBuilder() {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [discount, setDiscount] = useState({ type: "%", value: 0 });
    const [shipping, setShipping] = useState(0);

    const [customer, setCustomer] = useState(null);
    const [items, setItems] = useState([]);

    const [saving, setSaving] = useState(false);
    const [showCustModal, setShowCustModal] = useState(false);
    const suggestionsRef = useRef(null);

    // Totals
    const subtotal = items.reduce((sum, r) => sum + r.qty * r.price, 0);

    const baseSubtotal = items.reduce((sum, r) => sum + r.qty * r.price, 0);

    const discountAmount =
        discount.type === "%"
            ? (baseSubtotal * discount.value) / 100
            : discount.value;

    const taxable = baseSubtotal - discountAmount;

    const taxTotal = items.reduce(
        (sum, r) =>
            sum +
            ((r.qty * r.price - discountAmount / items.length) * r.tax_rate) /
                100,
        0
    );

    const cgst = taxTotal / 2;
    const sgst = taxTotal / 2;

    const payable = taxable + taxTotal + Number(shipping);

    useEffect(() => {
        loadData();
        document.addEventListener("click", closeDropdowns);
        return () => document.removeEventListener("click", closeDropdowns);
    }, []);

    const closeDropdowns = (e) => {
        if (!suggestionsRef.current?.contains(e.target)) {
            setItems((prev) => prev.map((i) => ({ ...i, showList: false })));
        }
    };

    const loadData = async () => {
        let c = await api.get("/parties?type=customer");
        let p = await api.get("/products");

        setCustomers(c.data.data || c.data);
        setProducts(p.data.data || p.data);
    };

    const addRow = () => {
        setItems([
            ...items,
            {
                product_id: "",
                name: "",
                qty: 1,
                price: 0,
                tax_rate: 0,
                showList: false,
            },
        ]);
    };

    const updateRow = (i, field, val) => {
        const rows = [...items];
        rows[i][field] = val;

        if (field === "search") {
            rows[i].showList = true;
        }

        if (field === "product_id") {
            const prod = products.find((p) => p.id == val);
            if (prod) {
                rows[i].name = prod.name;
                rows[i].price = prod.sale_price;
                rows[i].tax_rate = prod.tax_rate;
                rows[i].stock = prod.quantity;
            }
            rows[i].showList = false;
        }

        setItems(rows);
    };

    const removeRow = (i) => {
        setItems(items.filter((_, index) => index !== i));
    };

    const saveInvoice = async () => {
        if (!customer) return toast("Select a Customer");

        if (items.some((i) => !i.product_id)) {
            return toast("Select product in all rows");
        }

        setSaving(true);
        try {
            await api.post("/invoices", {
                customer_id: customer.id,
                items: items.map((i) => ({
                    product_id: i.product_id,
                    qty: i.qty,
                })),
            });
            toast("Invoice Created ✅", "success");
            setItems([]);
            setCustomer(null);
        } catch (err) {
            toast(err.response?.data?.error || "Failed ❌", "error");
        }
        setSaving(false);
    };

    const toast = (msg, type = "warning") => alert(msg);

    return (
        <div className="card shadow-sm p-4">
            {/* Customer Select */}
            <div className="mb-4">
                <label className="fw-semibold">Select Customer</label>
                <div className="d-flex gap-2">
                    <select
                        className="form-select"
                        value={customer?.id || ""}
                        onChange={(e) =>
                            setCustomer(
                                customers.find((c) => c.id == e.target.value)
                            )
                        }
                    >
                        <option>Select customer</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} — {c.phone}
                            </option>
                        ))}
                    </select>

                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setShowCustModal(true)}
                    >
                        + New
                    </button>
                </div>
            </div>

            {/* Items */}
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Product</th>
                            <th width="80">Qty</th>
                            <th width="100">Price</th>
                            <th width="80">CGST</th>
                            <th width="80">SGST</th>
                            <th width="120">Total</th>
                            <th width="50"></th>
                        </tr>
                    </thead>

                    <tbody ref={suggestionsRef}>
                        {items.map((r, i) => {
                            const line =
                                r.qty * r.price +
                                (r.qty * r.price * r.tax_rate) / 100;

                            const filtered = products.filter((p) =>
                                r.search
                                    ? p.name
                                          .toLowerCase()
                                          .includes(r.search.toLowerCase())
                                    : true
                            );

                            return (
                                <tr key={i}>
                                    {/* Product Search Column — stays same */}
                                    <td className="position-relative w-50">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search product"
                                            value={r.search || r.name || ""}
                                            onChange={(e) =>
                                                updateRow(
                                                    i,
                                                    "search",
                                                    e.target.value
                                                )
                                            }
                                            onFocus={() =>
                                                updateRow(i, "showList", true)
                                            }
                                        />

                                        {r.showList && r.search && (
                                            <ul
                                                className="dropdown-menu show w-100"
                                                style={{
                                                    maxHeight: "220px",
                                                    overflowY: "auto",
                                                    zIndex: 9999,
                                                }}
                                            >
                                                {products
                                                    .filter((p) =>
                                                        p.name
                                                            .toLowerCase()
                                                            .includes(
                                                                r.search.toLowerCase()
                                                            )
                                                    )
                                                    .slice(0, 6)
                                                    .map((p) => (
                                                        <li
                                                            key={p.id}
                                                            className="dropdown-item"
                                                            role="button"
                                                            onClick={() => {
                                                                updateRow(
                                                                    i,
                                                                    "product_id",
                                                                    p.id
                                                                );
                                                                updateRow(
                                                                    i,
                                                                    "search",
                                                                    p.name
                                                                );
                                                            }}
                                                        >
                                                            <div>{p.name}</div>
                                                            <small className="text-muted">
                                                                ₹{p.sale_price}{" "}
                                                                • GST{" "}
                                                                {p.tax_rate}% •
                                                                Stock{" "}
                                                                {p.quantity}
                                                            </small>
                                                        </li>
                                                    ))}
                                            </ul>
                                        )}
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control text-center"
                                            value={r.qty}
                                            onChange={(e) =>
                                                updateRow(
                                                    i,
                                                    "qty",
                                                    +e.target.value
                                                )
                                            }
                                        />
                                    </td>

                                    <td>₹{r.price}</td>

                                    {/* ✅ CGST + SGST */}
                                    <td className="text-center">
                                        {r.tax_rate / 2}%<br />
                                        <small className="text-muted">
                                            (CGST)
                                        </small>
                                    </td>
                                    <td className="text-center">
                                        {r.tax_rate / 2}%<br />
                                        <small className="text-muted">
                                            (SGST)
                                        </small>
                                    </td>

                                    {/* ✅ Line total updated */}
                                    <td className="fw-bold">
                                        ₹
                                        {(
                                            r.qty * r.price +
                                            (r.qty * r.price * r.tax_rate) / 100
                                        ).toFixed(2)}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-link text-danger p-0"
                                            onClick={() => removeRow(i)}
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* ✅ Add Item Button placed below table */}
                <div className="mb-4">
                    <button
                        className="btn btn-outline-primary"
                        onClick={addRow}
                    >
                        + Add Item
                    </button>
                </div>
            </div>

            <div className="row mt-3 justify-content-end">
                <div className="col-md-4 d-flex gap-2">
                    <label className="fw-semibold pt-1">Discount</label>

                    <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        value={discount.value}
                        onChange={(e) =>
                            setDiscount({ ...discount, value: +e.target.value })
                        }
                    />

                    <select
                        className="form-select"
                        value={discount.type}
                        onChange={(e) =>
                            setDiscount({ ...discount, type: e.target.value })
                        }
                    >
                        <option value="%">%</option>
                        <option value="₹">₹</option>
                    </select>
                </div>
            </div>

            {/* Shipping */}
            <div className="row mt-3 justify-content-end">
                <div className="col-md-4 d-flex gap-2">
                    <label className="fw-semibold pt-1">Shipping</label>

                    <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        value={shipping}
                        onChange={(e) => setShipping(+e.target.value)}
                    />
                </div>
            </div>
            {/* Totals */}
            <div className="text-end mt-4">
                <h6 className="text-muted">
                    Subtotal: ₹{baseSubtotal.toFixed(2)}
                </h6>

                {discountAmount > 0 && (
                    <h6 className="text-success">
                        Discount: -₹{discountAmount.toFixed(2)} (
                        {discount.type === "%" ? discount.value + "%" : "₹"})
                    </h6>
                )}

                <h6>Taxable: ₹{taxable.toFixed(2)}</h6>
                <h6>CGST: ₹{cgst.toFixed(2)}</h6>
                <h6>SGST: ₹{sgst.toFixed(2)}</h6>

                {shipping > 0 && <h6>Shipping: ₹{shipping}</h6>}

                <h4 className="fw-bold text-primary mt-2">
                    Total Payable: ₹{payable.toFixed(2)}
                </h4>
            </div>

            <div className="text-end mt-3">
                <button
                    className="btn btn-success px-4"
                    disabled={saving}
                    onClick={saveInvoice}
                >
                    {saving ? "Saving..." : "Save Invoice ✅"}
                </button>
            </div>

            {/* Add Customer Modal */}
            {showCustModal && (
                <CustomerModal
                    close={() => setShowCustModal(false)}
                    onSaved={(c) => {
                        setCustomer(c);
                        loadData();
                    }}
                />
            )}
        </div>
    );
}

// ✅ Extract Customer Modal as standalone component
function CustomerModal({ close, onSaved }) {
    const [form, setForm] = useState({ name: "", phone: "", type: "customer" });
    const [saving, setSaving] = useState(false);

    const save = async () => {
        if (!form.name || !form.phone) return alert("Name & Phone required");

        setSaving(true);
        try {
            const res = await api.post("/parties", form);
            alert("Customer Added ✅");
            onSaved(res.data.data);
            close();
        } catch (err) {
            alert("Failed");
        }
        setSaving(false);
    };

    return (
        <div
            className="modal fade show d-block"
            style={{ background: "#00000060" }}
        >
            <div className="modal-dialog">
                <div className="modal-content shadow">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">New Customer</h5>
                        <button className="btn-close" onClick={close}></button>
                    </div>

                    <div className="modal-body">
                        <input
                            className="form-control mb-3"
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                        <input
                            className="form-control mb-3"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                        />
                        <input
                            className="form-control"
                            placeholder="GST Number (optional)"
                            value={form.gst_number}
                            onChange={(e) =>
                                setForm({ ...form, gst_number: e.target.value })
                            }
                        />
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={close}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-success"
                            disabled={saving}
                            onClick={save}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
