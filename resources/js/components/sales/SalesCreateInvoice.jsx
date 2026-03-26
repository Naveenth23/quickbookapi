import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import useFormValidation from "../../hooks/useFormValidation";
import {
    UserPlus,
    Search,
    X,
    Building2,
    Phone,
    RefreshCw,
    FileText,
    CalendarDays,
    Clock,
    MapPin,
    Map,
    CheckCircle2,
    Loader2,
} from "lucide-react";

export default function SalesCreateInvoice() {
    const [statesList, setStatesList] = useState([]);
    const [stateSearch, setStateSearch] = useState("");
    const [loadingPincode, setLoadingPincode] = useState(false);
    const [invoice, setInvoice] = useState({
        number: "3",
        date: new Date().toISOString().slice(0, 10),
        paymentTerms: 30,
        dueDate: "",
        items: [],
        notes: "",
        total: 0,
        amountReceived: 0,
    });
    const [showShipToModal, setShowShipToModal] = useState(false);
    const [parties, setParties] = useState([]);
    const [filteredParties, setFilteredParties] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedParty, setSelectedParty] = useState(null);
    const [showPartyDropdown, setShowPartyDropdown] = useState(false);
    const [showPartyModal, setShowPartyModal] = useState(false);
    const [showSignature, setShowSignature] = useState(false);

    const [billToAddress, setBillToAddress] = useState({});
    const [shipToAddress, setShipToAddress] = useState({});

    const rules = {
        name: ["required"],
        phone: ["required", "number"],
        email: ["email"],
        gstin: ["gstin"],
        pan: ["pan"],
    };

    const [editShipForm, setEditShipForm] = useState({
        street: shipToAddress.street || "",
        city: shipToAddress.city || "",
        state: shipToAddress.state || "",
        pincode: shipToAddress.pincode || "",
    });

    const {
        values: newParty,
        errors,
        handleChange,
        validate,
        setValues: setNewParty,
    } = useFormValidation(
        {
            name: "",
            phone: "",
            email: "",
            gstin: "",
            pan: "",
            billing_address: "",
            shipping_address: "",
        },
        rules
    );

    const [billingForm, setBillingForm] = useState({
        street: "",
        state: "",
        city: "",
        pincode: "",
    });

    const [shippingForm, setShippingForm] = useState({
        street: "",
        state: "",
        city: "",
        pincode: "",
    });

    const [sameAsBilling, setSameAsBilling] = useState(true);
    const [bankData, setBankData] = useState({
        account_number: "",
        confirm_account_number: "",
        ifsc_code: "",
        bank_name: "",
        account_holder: "",
        upi_id: "",
    });

    const handleShipEditChange = (e) => {
        const { name, value } = e.target;
        setEditShipForm((prev) => ({ ...prev, [name]: value }));

        if (name === "pincode" && value.length === 6) {
            fetchLocationFromPincode(value);
        }
    };

    // Function to save edited address
    const handleSaveShipTo = () => {
        setShipToAddress(editShipForm);
        setShowShipToModal(false);
        toast.success("Shipping address updated!");
    };

    // ------------------- Fetch Parties -------------------
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/customers");
                setParties(res.data.data || []);
                setFilteredParties(res.data.data || []);
            } catch (err) {
                console.error("Error fetching parties:", err);
            }
        })();
    }, []);

    // ------------------- Search Party -------------------
    useEffect(() => {
        const term = search.toLowerCase();
        setFilteredParties(
            (Array.isArray(parties) ? parties : []).filter((p) => {
                const name = (p.name || "").toLowerCase();
                const phone = (p.phone || "").toLowerCase();
                return name.includes(term) || phone.includes(term);
            })
        );
    }, [search, parties]);

    // ------------------- Due Date Auto Update -------------------
    useEffect(() => {
        const due = new Date(invoice.date);
        due.setDate(due.getDate() + Number(invoice.paymentTerms || 0));
        setInvoice((prev) => ({
            ...prev,
            dueDate: due.toISOString().slice(0, 10),
        }));
    }, [invoice.date, invoice.paymentTerms]);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/states"); // ✅ your endpoint returning [{id, name}]
                setStatesList(res.data.data || res.data || []);
            } catch (err) {
                console.error("Failed to fetch states:", err);
            }
        })();
    }, []);

    // ------------------- Handle Select Party -------------------
    const handleSelectParty = (party) => {
        setSelectedParty(party);
        setShowPartyDropdown(false);

        let billing = {};
        let shipping = {};

        try {
            billing =
                typeof party.billing_address === "string"
                    ? JSON.parse(party.billing_address)
                    : party.billing_address || {};
            shipping =
                typeof party.shipping_address === "string"
                    ? JSON.parse(party.shipping_address)
                    : party.shipping_address || {};
        } catch (e) {
            console.warn("Invalid address JSON", e);
        }

        setBillToAddress({
            street: billing.street || party.address || "",
            city: billing.city || party.city || "",
            state: billing.state || party.state || "",
            pincode: billing.pincode || party.zip_code || "",
        });

        setShipToAddress({
            street: shipping.street || billing.street || party.address || "",
            city: shipping.city || billing.city || party.city || "",
            state: shipping.state || billing.state || party.state || "",
            pincode:
                shipping.pincode || billing.pincode || party.zip_code || "",
        });
    };

    // ------------------- Fetch Location by Pincode -------------------
    const fetchLocationFromPincode = async (pincode, setFormFn) => {
        if (pincode.length !== 6) return;
        setLoadingPincode(true);
        try {
            const res = await axios.get(
                `https://api.postalpincode.in/pincode/${pincode}`
            );
            const data = res.data[0];
            if (data.Status === "Success" && data.PostOffice?.length) {
                const { State, District } = data.PostOffice[0];

                setFormFn((prev) => {
                    const foundState = statesList.find(
                        (s) => s.name.toLowerCase() === State.toLowerCase()
                    );
                    return {
                        ...prev,
                        city: District,
                        state: foundState ? foundState.name : State,
                        state_id: foundState ? foundState.id : "",
                    };
                });
            } else {
                toast.error("❌ Invalid Pincode");
            }
        } catch (err) {
            toast.error("⚠️ Failed to fetch location. Check pincode.");
        } finally {
            setLoadingPincode(false);
        }
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingForm((prev) => ({ ...prev, [name]: value }));
        if (name === "pincode" && value.length === 6)
            fetchLocationFromPincode(value, "billing");
        if (sameAsBilling)
            setShippingForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingForm((prev) => ({ ...prev, [name]: value }));
        if (name === "pincode" && value.length === 6)
            fetchLocationFromPincode(value, "shipping");
    };

    const handleBankChange = (e) => {
        const { name, value } = e.target;
        setBankData((prev) => ({ ...prev, [name]: value }));
    };

    // ------------------- Save New Party -------------------
    const handleSaveParty = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            ...newParty,
            billing_address: JSON.stringify(billingForm),
            shipping_address: JSON.stringify(
                sameAsBilling ? billingForm : shippingForm
            ),
            bank_details: JSON.stringify(bankData),
        };

        try {
            const res = await api.post("/customers", payload);
            const createdParty = res?.data?.data || res?.data;
            setParties((prev) => [...prev, createdParty]);
            setFilteredParties((prev) => [...prev, createdParty]);
            handleSelectParty(createdParty);
            setShowPartyModal(false);
            toast.success(
                `✅ Party "${createdParty.name}" created and selected`
            );
        } catch (err) {
            console.error("Error saving party:", err);
            toast.error("❌ Failed to create party. Please try again.");
        }
    };

    // ------------------- Invoice Items -------------------
    const handleAddItem = () => {
        setInvoice((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                { name: "", hsn: "", qty: 1, price: 0, discount: 0, tax: 0 },
            ],
        }));
    };

    const handleItemChange = (i, key, val) => {
        const updated = [...invoice.items];
        updated[i][key] = val;
        setInvoice({ ...invoice, items: updated });
    };

    const calculateTotal = () =>
        invoice.items.reduce((sum, item) => {
            const subtotal = item.qty * item.price;
            const discount = (item.discount / 100) * subtotal;
            const tax = (item.tax / 100) * (subtotal - discount);
            return sum + subtotal - discount + tax;
        }, 0);

    useEffect(() => {
        setInvoice((prev) => ({ ...prev, total: calculateTotal() }));
    }, [invoice.items]);

    const handleSaveInvoice = () => {
        if (!selectedParty) return alert("Select a party first!");
        if (invoice.items.length === 0) return alert("Add at least one item!");
        alert("Invoice Saved Successfully!");
    };
    return (
        <div className="container-fluid p-4">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Create Sales Invoice</h4>
                <div>
                    <button className="btn btn-outline-secondary me-2">
                        <i className="bi bi-gear"></i> Settings
                    </button>
                    <button
                        className="btn btn-warning text-dark fw-semibold"
                        onClick={handleSaveInvoice}
                    >
                        Save Invoice
                    </button>
                </div>
            </div>

            {/* BILL TO + INVOICE DETAILS */}
            <div className="card mb-4 shadow-sm position-relative">
                <div className="card-body">
                    <div className="row g-3 align-items-start">
                        {/* ===== BILL TO SECTION ===== */}
                        <div className="col-md-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="fw-semibold mb-0">
                                    Bill To
                                </label>
                                {selectedParty && (
                                    <button
                                        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                                        onClick={() => {
                                            setSelectedParty(null);
                                            setSearch("");
                                        }}
                                    >
                                        <RefreshCw size={14} /> Change Party
                                    </button>
                                )}
                            </div>

                            {/* Default Add Party */}
                            {!showPartyDropdown && !selectedParty && (
                                <div
                                    className="d-flex justify-content-center align-items-center border border-primary border-2 rounded-3 text-primary fw-semibold py-5"
                                    style={{
                                        cursor: "pointer",
                                        borderStyle: "dashed",
                                    }}
                                    onClick={() => setShowPartyDropdown(true)}
                                >
                                    <UserPlus className="me-2" size={18} />
                                    Add Party
                                </div>
                            )}

                            {/* Party Search Dropdown */}
                            {showPartyDropdown && (
                                <div className="border rounded bg-white shadow-sm mt-2">
                                    {/* Header */}
                                    <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-light">
                                        <h6 className="mb-0 fw-semibold text-secondary d-flex align-items-center gap-1">
                                            <Search size={14} /> Search Party
                                        </h6>
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => {
                                                setShowPartyDropdown(false);
                                                setSearch("");
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    {/* Search */}
                                    <div className="p-2 border-bottom bg-light">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Search by name or mobile..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            autoFocus
                                        />
                                    </div>

                                    {/* List */}
                                    <div
                                        className="table-responsive"
                                        style={{ maxHeight: "260px" }}
                                    >
                                        {filteredParties?.length > 0 ? (
                                            <table className="table table-hover table-sm mb-0">
                                                <thead className="table-light sticky-top">
                                                    <tr className="small text-muted">
                                                        <th>Party Name</th>
                                                        <th className="text-end">
                                                            Balance
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredParties.map(
                                                        (p) => (
                                                            <tr
                                                                key={p.id}
                                                                onClick={() =>
                                                                    handleSelectParty(
                                                                        p
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                <td>
                                                                    <div className="fw-semibold">
                                                                        {p.name}
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        {p.phone ||
                                                                            "No number"}
                                                                    </small>
                                                                </td>
                                                                <td className="text-end text-muted">
                                                                    ₹{" "}
                                                                    {parseFloat(
                                                                        p.current_balance ||
                                                                            0
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="p-3 text-center text-muted small">
                                                No results found
                                            </div>
                                        )}
                                    </div>

                                    {/* Create Button */}
                                    <div
                                        className="border-top text-center py-2 fw-semibold text-primary bg-light"
                                        role="button"
                                        onClick={() => {
                                            setShowPartyDropdown(false);
                                            setShowPartyModal(true);
                                        }}
                                    >
                                        <UserPlus size={14} className="me-1" />{" "}
                                        Create New Party
                                    </div>
                                </div>
                            )}

                            {/* Selected Party */}
                            {selectedParty && (
                                <div className="border rounded-3 bg-white p-3">
                                    <h6 className="fw-semibold mb-1">
                                        {selectedParty.name}
                                    </h6>
                                    <div className="text-muted small mb-1 d-flex align-items-center gap-1">
                                        <Building2 size={14} />
                                        <span>
                                            <strong>Address:</strong>{" "}
                                            {billToAddress.street
                                                ? `${billToAddress.street}, ${billToAddress.city}, ${billToAddress.state}, ${billToAddress.pincode}`
                                                : "—"}
                                        </span>
                                    </div>
                                    <div className="text-muted small d-flex align-items-center gap-1">
                                        <Phone size={14} />
                                        <span>
                                            <strong>Phone:</strong>{" "}
                                            {selectedParty.phone || "—"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ===== SHIP TO SECTION ===== */}
                        {selectedParty && (
                            <div className="col-md-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="fw-semibold mb-0">
                                        Ship To
                                    </label>
                                    <button
                                        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                                        onClick={() => setShowShipToModal(true)}
                                    >
                                        <RefreshCw size={14} /> Change Shipping
                                        Address
                                    </button>
                                </div>

                                <div className="border rounded-3 bg-white p-3">
                                    <h6 className="fw-semibold mb-1">
                                        {selectedParty.name}
                                    </h6>
                                    <div className="text-muted small mb-1 d-flex align-items-start gap-2">
                                        <Building2 size={14} className="mt-1" />
                                        <span>
                                            <strong>Address:</strong>{" "}
                                            {shipToAddress.street
                                                ? `${shipToAddress.street}, ${shipToAddress.city}, ${shipToAddress.state}, ${shipToAddress.pincode}`
                                                : "—"}
                                        </span>
                                    </div>
                                    <div className="text-muted small d-flex align-items-center gap-1">
                                        <Phone size={14} />
                                        <span>
                                            <strong>Phone:</strong>{" "}
                                            {selectedParty.phone || "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== INVOICE DETAILS SECTION ===== */}
                        <div className="col-md-4">
                            <div className="row g-2 align-items-end">
                                <div className="col-6">
                                    <label className="form-label fw-semibold small d-flex align-items-center gap-1">
                                        <FileText size={14} /> Sales Invoice No:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={invoice.number}
                                        onChange={(e) =>
                                            setInvoice({
                                                ...invoice,
                                                number: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label fw-semibold small d-flex align-items-center gap-1">
                                        <CalendarDays size={14} /> Invoice Date:
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        value={invoice.date}
                                        onChange={(e) =>
                                            setInvoice({
                                                ...invoice,
                                                date: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-6">
                                    <label className="form-label fw-semibold small d-flex align-items-center gap-1">
                                        <Clock size={14} /> Payment Terms:
                                    </label>
                                    <div className="input-group input-group-sm">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={invoice.paymentTerms}
                                            onChange={(e) =>
                                                setInvoice({
                                                    ...invoice,
                                                    paymentTerms:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                        <span className="input-group-text">
                                            days
                                        </span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <label className="form-label fw-semibold small d-flex align-items-center gap-1">
                                        <CalendarDays size={14} /> Due Date:
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        value={invoice.dueDate}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ITEMS TABLE */}
            <div className="table-responsive mb-4">
                <table className="table table-bordered align-middle text-center">
                    <thead className="table-light">
                        <tr>
                            <th>No</th>
                            <th>Item/Service</th>
                            <th>HSN/SAC</th>
                            <th>Qty</th>
                            <th>Price/Item (₹)</th>
                            <th>Discount (%)</th>
                            <th>Tax (%)</th>
                            <th>Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={item.name}
                                        onChange={(e) =>
                                            handleItemChange(
                                                i,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={item.hsn}
                                        onChange={(e) =>
                                            handleItemChange(
                                                i,
                                                "hsn",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control text-center"
                                        value={item.qty}
                                        onChange={(e) =>
                                            handleItemChange(
                                                i,
                                                "qty",
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control text-end"
                                        value={item.price}
                                        onChange={(e) =>
                                            handleItemChange(
                                                i,
                                                "price",
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control text-end"
                                        value={item.discount}
                                        onChange={(e) =>
                                            handleItemChange(
                                                i,
                                                "discount",
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control text-end"
                                        value={item.tax}
                                        onChange={(e) =>
                                            handleItemChange(
                                                i,
                                                "tax",
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </td>
                                <td className="text-end">
                                    {(
                                        item.qty * item.price -
                                        (item.discount / 100) *
                                            item.qty *
                                            item.price +
                                        (item.tax / 100) * item.qty * item.price
                                    ).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td
                                colSpan="8"
                                className="text-center text-primary fw-semibold"
                                style={{ cursor: "pointer" }}
                                onClick={handleAddItem}
                            >
                                + Add Item
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* NOTES + SUMMARY */}
            <div className="row mt-4">
                <div className="col-md-7">
                    <h6 className="fw-semibold text-primary mb-2">
                        + Add Notes
                    </h6>
                    <textarea
                        className="form-control mb-3"
                        rows="3"
                        placeholder="Terms and Conditions"
                        value={invoice.notes}
                        onChange={(e) =>
                            setInvoice({ ...invoice, notes: e.target.value })
                        }
                    ></textarea>
                    <small className="text-muted">
                        1. Goods once sold will not be taken back or exchanged.
                        <br />
                        2. All disputes are subject to [YOUR_CITY_NAME]
                        jurisdiction only.
                    </small>
                </div>

                {/* SUMMARY */}
                <div className="col-md-5">
                    <div className="border rounded p-3">
                        <div className="d-flex justify-content-between mb-1">
                            <span>Taxable Amount</span>
                            <span>₹ {invoice.total.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span>Total Amount</span>
                            <span>₹ {invoice.total.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span>Amount Received</span>
                            <input
                                type="number"
                                className="form-control form-control-sm text-end"
                                value={invoice.amountReceived}
                                onChange={(e) =>
                                    setInvoice({
                                        ...invoice,
                                        amountReceived: Number(e.target.value),
                                    })
                                }
                                style={{ width: "120px" }}
                            />
                        </div>
                        <div className="d-flex justify-content-between fw-semibold text-success">
                            <span>Balance Amount</span>
                            <span>
                                ₹{" "}
                                {(
                                    invoice.total - invoice.amountReceived
                                ).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SIGNATURE */}
            <div className="mt-4 d-flex justify-content-end text-end">
                <div>
                    <small className="text-muted">
                        Authorized signatory for <strong>Company Name</strong>
                    </small>
                    <div
                        className="border border-primary border-dashed p-3 rounded text-primary fw-semibold mt-2"
                        style={{ width: "150px", cursor: "pointer" }}
                        onClick={() => setShowSignature(!showSignature)}
                    >
                        {showSignature
                            ? "🖋 Signature Added"
                            : "+ Add Signature"}
                    </div>
                </div>
            </div>

            {showPartyModal && (
                <>
                    <div
                        className="modal-backdrop fade show"
                        style={{ background: "rgba(0,0,0,0.4)", zIndex: 1040 }}
                    ></div>
                    <div
                        className="modal fade show d-block"
                        style={{
                            zIndex: 1050,
                            position: "fixed",
                            inset: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflowY: "auto",
                        }}
                    >
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="fw-bold">
                                        Create New Party
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowPartyModal(false)}
                                    ></button>
                                </div>

                                {/* Party Form */}
                                <form onSubmit={handleSaveParty}>
                                    <div className="modal-body">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Party Name{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    name="name"
                                                    className={`form-control ${
                                                        errors.name
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    value={newParty.name}
                                                    onChange={handleChange}
                                                />
                                                {errors.name && (
                                                    <div className="invalid-feedback">
                                                        {errors.name}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Mobile Number
                                                </label>
                                                <input
                                                    name="phone"
                                                    className={`form-control ${
                                                        errors.phone
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    value={newParty.phone}
                                                    onChange={handleChange}
                                                />
                                                {errors.phone && (
                                                    <div className="invalid-feedback">
                                                        {errors.phone}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Billing Address */}
                                            <div className="col-12">
                                                <h6 className="fw-semibold text-muted mt-2">
                                                    Billing Address
                                                </h6>
                                            </div>
                                            <div className="col-12">
                                                <textarea
                                                    name="street"
                                                    className="form-control"
                                                    rows="2"
                                                    placeholder="Enter Billing Address"
                                                    value={billingForm.street}
                                                    onChange={
                                                        handleBillingChange
                                                    }
                                                ></textarea>
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold small d-flex align-items-center gap-1">
                                                    <MapPin size={14} /> State
                                                </label>

                                                <div className="dropdown w-100">
                                                    <button
                                                        className="form-select text-start"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        {billingForm.state ||
                                                            "Select State"}
                                                    </button>

                                                    <ul
                                                        className="dropdown-menu w-100 shadow-sm p-0"
                                                        style={{
                                                            maxHeight: "240px",
                                                            overflowY: "auto",
                                                        }}
                                                    >
                                                        <li className="p-2 border-bottom bg-light">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                placeholder="Search state..."
                                                                autoFocus
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                } // prevents dropdown from closing
                                                                onChange={(e) =>
                                                                    setStateSearch(
                                                                        e.target.value.toLowerCase()
                                                                    )
                                                                }
                                                            />
                                                        </li>

                                                        {statesList
                                                            .filter((s) =>
                                                                s.name
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        stateSearch.toLowerCase()
                                                                    )
                                                            )
                                                            .map((s) => (
                                                                <li key={s.id}>
                                                                    <button
                                                                        type="button"
                                                                        className={`dropdown-item ${
                                                                            billingForm.state ===
                                                                            s.name
                                                                                ? "active"
                                                                                : ""
                                                                        }`}
                                                                        onClick={() => {
                                                                            setBillingForm(
                                                                                (
                                                                                    prev
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    state: s.name,
                                                                                    state_id:
                                                                                        s.id,
                                                                                })
                                                                            );
                                                                            setStateSearch(
                                                                                ""
                                                                            ); // reset filter
                                                                        }}
                                                                    >
                                                                        {s.name}
                                                                    </button>
                                                                </li>
                                                            ))}

                                                        {statesList.filter(
                                                            (s) =>
                                                                s.name
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        stateSearch.toLowerCase()
                                                                    )
                                                        ).length === 0 && (
                                                            <li>
                                                                <div className="dropdown-item text-muted small text-center py-2">
                                                                    No results
                                                                    found
                                                                </div>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold small">
                                                    Pincode
                                                </label>
                                                <div className="input-group input-group-sm">
                                                    <input
                                                        name="pincode"
                                                        className="form-control"
                                                        placeholder="Enter Pincode"
                                                        value={
                                                            billingForm.pincode
                                                        }
                                                        onChange={(e) => {
                                                            const val =
                                                                e.target.value;
                                                            setBillingForm(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    pincode:
                                                                        val,
                                                                })
                                                            );
                                                            if (
                                                                val.length === 6
                                                            )
                                                                fetchLocationFromPincode(
                                                                    val,
                                                                    setBillingForm
                                                                );
                                                        }}
                                                    />
                                                    {loadingPincode && (
                                                        <span className="input-group-text bg-white border-start-0">
                                                            <Loader2
                                                                className="animate-spin text-primary"
                                                                size={16}
                                                            />
                                                        </span>
                                                    )}
                                                </div>
                                                <small className="text-muted">
                                                    Auto-fills City & State when
                                                    valid 6-digit pincode
                                                    entered.
                                                </small>
                                            </div>
                                            <div className="col-md-4">
                                                <input
                                                    name="city"
                                                    className="form-control"
                                                    placeholder="Enter City"
                                                    value={billingForm.city}
                                                    onChange={
                                                        handleBillingChange
                                                    }
                                                />
                                            </div>

                                            {/* Shipping Address */}
                                            <div className="col-12 form-check mt-2">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={sameAsBilling}
                                                    onChange={() =>
                                                        setSameAsBilling(
                                                            !sameAsBilling
                                                        )
                                                    }
                                                />
                                                <label className="form-check-label ms-2">
                                                    Shipping same as billing
                                                </label>
                                            </div>

                                            {!sameAsBilling && (
                                                <>
                                                    <div className="col-12 mt-3">
                                                        <h6 className="fw-semibold text-muted">
                                                            Shipping Address
                                                        </h6>
                                                    </div>
                                                    <div className="col-12">
                                                        <textarea
                                                            name="street"
                                                            className="form-control"
                                                            rows="2"
                                                            value={
                                                                shippingForm.street
                                                            }
                                                            onChange={
                                                                handleShippingChange
                                                            }
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <input
                                                            name="state"
                                                            className="form-control"
                                                            placeholder="Enter State"
                                                            value={
                                                                shippingForm.state
                                                            }
                                                            onChange={
                                                                handleShippingChange
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <input
                                                            name="pincode"
                                                            className="form-control"
                                                            placeholder="Enter Pincode"
                                                            value={
                                                                shippingForm.pincode
                                                            }
                                                            onChange={
                                                                handleShippingChange
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <input
                                                            name="city"
                                                            className="form-control"
                                                            placeholder="Enter City"
                                                            value={
                                                                shippingForm.city
                                                            }
                                                            onChange={
                                                                handleShippingChange
                                                            }
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* GSTIN + Bank */}
                                            <div className="col-12 mt-3">
                                                <h6 className="fw-semibold text-muted">
                                                    GSTIN (Optional)
                                                </h6>
                                                <input
                                                    name="gstin"
                                                    className={`form-control ${
                                                        errors.gstin
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    placeholder="ex: 29XXXXX9438X1XX"
                                                    value={newParty.gstin}
                                                    onChange={handleChange}
                                                />
                                                {errors.gstin && (
                                                    <div className="invalid-feedback">
                                                        {errors.gstin}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-12 mt-3">
                                                <h6 className="fw-semibold text-muted">
                                                    Bank Details
                                                </h6>
                                                <div className="row g-2">
                                                    {[
                                                        [
                                                            "account_number",
                                                            "Account Number",
                                                        ],
                                                        [
                                                            "confirm_account_number",
                                                            "Confirm Account",
                                                        ],
                                                        [
                                                            "ifsc_code",
                                                            "IFSC Code",
                                                        ],
                                                        [
                                                            "bank_name",
                                                            "Bank Name",
                                                        ],
                                                        [
                                                            "account_holder",
                                                            "Account Holder",
                                                        ],
                                                        ["upi_id", "UPI ID"],
                                                    ].map(
                                                        ([
                                                            name,
                                                            placeholder,
                                                        ]) => (
                                                            <div
                                                                className="col-md-6"
                                                                key={name}
                                                            >
                                                                <input
                                                                    name={name}
                                                                    className="form-control"
                                                                    placeholder={
                                                                        placeholder
                                                                    }
                                                                    value={
                                                                        bankData[
                                                                            name
                                                                        ]
                                                                    }
                                                                    onChange={
                                                                        handleBankChange
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                setShowPartyModal(false)
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-warning text-dark fw-semibold"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showShipToModal && (
                <>
                    <div
                        className="modal-backdrop fade show"
                        style={{ zIndex: 1040 }}
                    ></div>
                    <div
                        className="modal fade show d-block"
                        style={{
                            zIndex: 1050,
                            position: "fixed",
                            inset: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflowY: "auto",
                        }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content shadow-lg">
                                <div className="modal-header bg-light">
                                    <h5 className="modal-title d-flex align-items-center gap-2 fw-bold">
                                        <MapPin size={18} /> Edit Shipping
                                        Address
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() =>
                                            setShowShipToModal(false)
                                        }
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label fw-semibold small d-flex align-items-center gap-1">
                                                <Building2 size={14} /> Street /
                                                Address
                                            </label>
                                            <textarea
                                                name="street"
                                                className="form-control"
                                                rows="2"
                                                value={editShipForm.street}
                                                onChange={handleShipEditChange}
                                                placeholder="Enter street address"
                                            ></textarea>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold small d-flex align-items-center gap-1">
                                                <Map size={14} /> City
                                            </label>
                                            <input
                                                name="city"
                                                className="form-control"
                                                value={editShipForm.city}
                                                onChange={handleShipEditChange}
                                                placeholder="Enter city"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold small d-flex align-items-center gap-1">
                                                <MapPin size={14} /> State
                                            </label>

                                            <div className="dropdown w-100">
                                                <button
                                                    className="form-select text-start"
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    {editShipForm.state ||
                                                        "Select State"}
                                                </button>

                                                <ul
                                                    className="dropdown-menu w-100 shadow-sm p-0"
                                                    style={{
                                                        maxHeight: "240px",
                                                        overflowY: "auto",
                                                    }}
                                                >
                                                    {/* Search input inside dropdown */}
                                                    <li className="p-2 border-bottom bg-light">
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            placeholder="Search state..."
                                                            autoFocus
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            } // prevents closing
                                                            onChange={(e) =>
                                                                setStateSearch(
                                                                    e.target.value.toLowerCase()
                                                                )
                                                            }
                                                        />
                                                    </li>

                                                    {/* Filtered state list */}
                                                    {statesList
                                                        .filter((s) =>
                                                            s.name
                                                                .toLowerCase()
                                                                .includes(
                                                                    stateSearch.toLowerCase()
                                                                )
                                                        )
                                                        .map((s) => (
                                                            <li key={s.id}>
                                                                <button
                                                                    type="button"
                                                                    className={`dropdown-item ${
                                                                        editShipForm.state ===
                                                                        s.name
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                    onClick={() => {
                                                                        setEditShipForm(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                state: s.name,
                                                                                state_id:
                                                                                    s.id,
                                                                            })
                                                                        );
                                                                        setStateSearch(
                                                                            ""
                                                                        );
                                                                    }}
                                                                >
                                                                    {s.name}
                                                                </button>
                                                            </li>
                                                        ))}

                                                    {/* If no results found */}
                                                    {statesList.filter((s) =>
                                                        s.name
                                                            .toLowerCase()
                                                            .includes(
                                                                stateSearch.toLowerCase()
                                                            )
                                                    ).length === 0 && (
                                                        <li>
                                                            <div className="dropdown-item text-muted small text-center py-2">
                                                                No results found
                                                            </div>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold small">
                                                Pincode
                                            </label>
                                            <div className="input-group input-group-sm">
                                                <input
                                                    name="pincode"
                                                    className="form-control"
                                                    value={editShipForm.pincode}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target.value;
                                                        setEditShipForm(
                                                            (prev) => ({
                                                                ...prev,
                                                                pincode: val,
                                                            })
                                                        );
                                                        if (val.length === 6)
                                                            fetchLocationFromPincode(
                                                                val,
                                                                setEditShipForm
                                                            );
                                                    }}
                                                    placeholder="Enter pincode"
                                                />
                                                {loadingPincode && (
                                                    <span className="input-group-text bg-white border-start-0">
                                                        <Loader2
                                                            className="animate-spin text-primary"
                                                            size={16}
                                                        />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer bg-light d-flex justify-content-between">
                                    <button
                                        className="btn btn-secondary d-flex align-items-center gap-1"
                                        onClick={() =>
                                            setShowShipToModal(false)
                                        }
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                    <button
                                        className="btn btn-success text-white fw-semibold d-flex align-items-center gap-1"
                                        onClick={handleSaveShipTo}
                                    >
                                        <CheckCircle2 size={16} /> Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
