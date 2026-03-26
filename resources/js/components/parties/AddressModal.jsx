import React from "react";

/**
 * Reusable modal for adding/editing addresses
 * Used for both Billing and Shipping addresses
 */
export default function AddressModal({
    title,
    show,
    form,
    setForm,
    onSave,
    onClose,
    requiredFields = ["street"],
}) {
    if (!show) return null; // Do not render if hidden

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation for required fields
        for (const field of requiredFields) {
            if (!form[field]?.trim()) {
                alert(
                    `${
                        field.charAt(0).toUpperCase() + field.slice(1)
                    } is required.`
                );
                return;
            }
        }

        onSave(); // Save action from parent
    };

    return (
        <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Optional Name (for shipping form) */}
                            {"name" in form && (
                                <div className="mb-3">
                                    <label className="form-label">
                                        Name{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Name"
                                        required
                                    />
                                </div>
                            )}

                            {/* Street */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Street Address{" "}
                                    <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    name="street"
                                    value={form.street}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter Street Address"
                                    required
                                />
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter State"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Pincode"
                                    />
                                </div>
                            </div>

                            <div className="mt-3">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter City"
                                />
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
