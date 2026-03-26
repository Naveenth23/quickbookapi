import React, { useEffect, useState } from "react";
import Input from "../common/Input";
import useFormValidation from "../../hooks/useFormValidation";

export default function BankModal({ show, onClose, onSubmit }) {
    if (!show) return null;
    const [fetching, setFetching] = useState(false);
    const [ifscError, setIfscError] = useState("");
    // ✅ Validation Rules
    const rules = {
        account_number: ["required", "number"],
        confirm_account_number: ["required", "number"],
        ifsc_code: ["required", "ifsc"],
        bank_name: ["required"],
        account_holder: ["required"],
    };

    // ✅ Initialize form + validation
    const {
        values: bankData,
        errors,
        handleChange,
        validate,
        reset,
    } = useFormValidation(
        {
            account_number: "",
            confirm_account_number: "",
            ifsc_code: "",
            bank_name: "",
            account_holder: "",
            upi_id: "",
        },
        rules
    );

    useEffect(() => {
        const ifsc = bankData.ifsc_code?.trim().toUpperCase();
        if (ifsc && /^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifsc)) {
            setFetching(true);
            setIfscError("");

            fetch(`https://ifsc.razorpay.com/${ifsc}`)
                .then(async (res) => {
                    if (!res.ok) throw new Error("Invalid IFSC code");
                    const data = await res.json();

                    setBankData((prev) => ({
                        ...prev,
                        bank_name: data.BANK || prev.bank_name,
                        branch: data.BRANCH || "",
                        address: data.ADDRESS || "",
                    }));
                })
                .catch(() => {
                    setIfscError("Invalid or unrecognized IFSC code.");
                    setBankData((prev) => ({
                        ...prev,
                        bank_name: "",
                        branch: "",
                        address: "",
                    }));
                })
                .finally(() => setFetching(false));
        }
    }, [bankData.ifsc_code]);

    // ✅ Form submit handler
    const handleSubmit = (e) => {
        e.preventDefault();

        // Run validation
        if (!validate()) return;

        // Match check
        if (bankData.account_number !== bankData.confirm_account_number) {
            alert("Account numbers do not match!");
            return;
        }

        // Pass validated data to parent
        onSubmit(bankData);

        // Reset + close
        reset();
        onClose();
    };

    return (
        <div
            className="modal show fade d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Bank Account</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <Input
                                        label="Account Number"
                                        name="account_number"
                                        value={bankData.account_number}
                                        onChange={handleChange}
                                        error={errors.account_number}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Input
                                        label="Confirm Account Number"
                                        name="confirm_account_number"
                                        value={bankData.confirm_account_number}
                                        onChange={handleChange}
                                        error={errors.confirm_account_number}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <Input
                                        label="IFSC Code"
                                        name="ifsc_code"
                                        value={bankData.ifsc_code}
                                        onChange={handleChange}
                                        error={errors.ifsc_code}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <Input
                                        label="Bank & Branch Name"
                                        name="bank_name"
                                        value={bankData.bank_name}
                                        onChange={handleChange}
                                        error={errors.bank_name}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <Input
                                        label="Account Holder’s Name"
                                        name="account_holder"
                                        value={bankData.account_holder}
                                        onChange={handleChange}
                                        error={errors.account_holder}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <Input
                                        label="UPI ID (Optional)"
                                        name="upi_id"
                                        value={bankData.upi_id}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
