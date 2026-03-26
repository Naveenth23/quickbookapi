import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Input from "../common/Input";
import AddressModal from "./AddressModal";
import BankModal from "./BankModal";
import useFormValidation from "../../hooks/useFormValidation";

export default function PartiesForm() {
    // ✅ Validation Rules
    const rules = {
        name: ["required"],
        phone: ["required", "number"],
        email: ["email"],
        gstin: ["gstin"],
        pan: ["pan"],
    };

    // ✅ Initialize validation hook
    const {
        values: formData,
        errors,
        handleChange,
        validate,
        setValues: setFormData,
    } = useFormValidation(
        {
            name: "",
            phone: "",
            email: "",
            gstin: "",
            pan: "",
            opening_balance: "",
            balance_type: "To Collect",
            party_type: "",
            party_category: "",
            billing_address: "",
            shipping_address: "",
            credit_period: 30,
            credit_limit: 0,
        },
        rules
    );

    // 🏠 Address and Bank State
    const [billingForm, setBillingForm] = useState({
        street: "",
        state: "",
        pincode: "",
        city: "",
    });

    const [shippingForm, setShippingForm] = useState({
        name: "",
        street: "",
        state: "",
        pincode: "",
        city: "",
    });

    const [bankData, setBankData] = useState({
        account_number: "",
        confirm_account_number: "",
        ifsc_code: "",
        bank_name: "",
        account_holder: "",
        upi_id: "",
    });

    const [bankAccounts, setBankAccounts] = useState([]);
    const [sameAsBilling, setSameAsBilling] = useState(true);

    const [modals, setModals] = useState({
        billing: false,
        shipping: false,
        bank: false,
    });

    // 🏦 Save Billing Address
    const handleSaveBilling = () => {
        const formatted = `${billingForm.street}, ${billingForm.city}, ${billingForm.state}, ${billingForm.pincode}`;
        setFormData((prev) => ({ ...prev, billing_address: formatted }));
        setModals((prev) => ({ ...prev, billing: false }));
    };

    // 🚚 Save Shipping Address
    const handleSaveShipping = () => {
        const formatted = `${shippingForm.name}, ${shippingForm.street}, ${shippingForm.city}, ${shippingForm.state}, ${shippingForm.pincode}`;
        setFormData((prev) => ({ ...prev, shipping_address: formatted }));
        setModals((prev) => ({ ...prev, shipping: false }));
    };

    // 💳 Save Bank Account
    const handleSaveBank = () => {
        setBankAccounts([...bankAccounts, bankData]);
        setBankData({
            account_number: "",
            confirm_account_number: "",
            ifsc_code: "",
            bank_name: "",
            account_holder: "",
            upi_id: "",
        });
        setModals((prev) => ({ ...prev, bank: false }));
    };

    // 💾 Submit Form with Validation
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            alert("Please correct the highlighted errors.");
            return;
        }

        try {
            const payload = { ...formData, bank_accounts: bankAccounts };
            await api.post("customers", payload);
            alert("Party saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Error saving party.");
        }
    };

    // 🔁 Auto-copy Billing → Shipping
    useEffect(() => {
        if (sameAsBilling) {
            setFormData((prev) => ({
                ...prev,
                shipping_address: prev.billing_address,
            }));
        }
    }, [sameAsBilling, formData.billing_address]);

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Create Party</h4>
                    <button type="button" className="btn btn-outline-secondary">
                        Party Settings
                    </button>
                </div>

                {/* General Details */}
                <div className="card mb-4">
                    <div className="card-header fw-bold">General Details</div>
                    <div className="card-body row g-3">
                        <div className="col-md-4">
                            <Input
                                label="Party Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <Input
                                label="Mobile Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                            />
                        </div>
                        <div className="col-md-4">
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                        </div>

                        <div className="col-md-6 d-flex gap-2">
                            <Input
                                label="GSTIN"
                                name="gstin"
                                value={formData.gstin}
                                onChange={handleChange}
                                error={errors.gstin}
                            />
                            <button type="button" className="btn btn-secondary">
                                Get Details
                            </button>
                        </div>

                        <div className="col-md-6">
                            <Input
                                label="PAN Number"
                                name="pan"
                                value={formData.pan}
                                onChange={handleChange}
                                error={errors.pan}
                            />
                        </div>

                        <div className="col-md-6 d-flex gap-2">
                            <Input
                                label="Opening Balance"
                                type="number"
                                name="opening_balance"
                                value={formData.opening_balance}
                                onChange={handleChange}
                            />
                            <select
                                name="balance_type"
                                className="form-select mt-auto"
                                value={formData.balance_type}
                                onChange={handleChange}
                            >
                                <option>To Collect</option>
                                <option>To Pay</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <select
                                name="party_type"
                                className="form-select"
                                value={formData.party_type}
                                onChange={handleChange}
                            >
                                <option value="">Party Type</option>
                                <option value="Customer">Customer</option>
                                <option value="Supplier">Supplier</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <select
                                name="party_category"
                                className="form-select"
                                value={formData.party_category}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                <option value="Retail">Retail</option>
                                <option value="Wholesale">Wholesale</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="card mb-4">
                    <div className="card-header fw-bold">Address</div>
                    <div className="card-body row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Billing Address
                            </label>
                            <textarea
                                name="billing_address"
                                className="form-control"
                                rows="3"
                                value={formData.billing_address}
                                onChange={handleChange}
                                placeholder="Enter Billing Address"
                            />
                            <button
                                type="button"
                                className="btn btn-link p-0 mt-2"
                                onClick={() =>
                                    setModals({ ...modals, billing: true })
                                }
                            >
                                + Add Billing Address
                            </button>
                        </div>

                        <div className="col-md-6">
                            <div className="d-flex justify-content-between">
                                <label className="form-label fw-semibold">
                                    Shipping Address
                                </label>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={sameAsBilling}
                                        onChange={() =>
                                            setSameAsBilling(!sameAsBilling)
                                        }
                                    />
                                    <label className="form-check-label">
                                        Same as Billing
                                    </label>
                                </div>
                            </div>
                            <textarea
                                name="shipping_address"
                                className="form-control"
                                rows="3"
                                value={formData.shipping_address}
                                readOnly={sameAsBilling}
                                placeholder="Enter Shipping Address"
                            />
                            <button
                                type="button"
                                className="btn btn-link p-0 mt-2"
                                onClick={() =>
                                    setModals({ ...modals, shipping: true })
                                }
                            >
                                + Add Shipping Address
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bank Section */}
                <div className="card mb-4 text-center">
                    <div className="card-body">
                        <p className="text-muted">
                            Add party bank information to manage transactions
                        </p>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => setModals({ ...modals, bank: true })}
                        >
                            Add Bank Account
                        </button>

                        {bankAccounts.length > 0 && (
                            <ul className="list-group mt-3 text-start">
                                {bankAccounts.map((b, i) => (
                                    <li key={i} className="list-group-item">
                                        {b.account_holder} — {b.bank_name} (
                                        {b.ifsc_code})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="text-end mb-5">
                    <button type="submit" className="btn btn-success px-4">
                        Save
                    </button>
                </div>
            </form>

            {/* Modals */}
            <AddressModal
                title="Add Billing Address"
                show={modals.billing}
                form={billingForm}
                setForm={setBillingForm}
                onSave={handleSaveBilling}
                onClose={() => setModals({ ...modals, billing: false })}
            />

            <AddressModal
                title="Add Shipping Address"
                show={modals.shipping}
                form={shippingForm}
                setForm={setShippingForm}
                onSave={handleSaveShipping}
                onClose={() => setModals({ ...modals, shipping: false })}
            />

            <BankModal
                show={modals.bank}
                onClose={() => setModals({ ...modals, bank: false })}
                onSubmit={(data) => {
                    setBankAccounts((prev) => [...prev, data]);
                    alert("Bank account added successfully!");
                }}
            />
        </div>
    );
}
