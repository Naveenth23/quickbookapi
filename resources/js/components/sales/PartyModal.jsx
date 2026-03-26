import React, { useState } from "react";
import axios from "axios";

export default function PartyModal({ show, onClose, onSave }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        state: "",
        pincode: "",
        city: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            alert("Party name is mandatory");
            return;
        }

        try {
            const res = await axios.post("/api/parties", form); // 👈 Laravel store route
            onSave(res.data);
            setForm({
                name: "",
                phone: "",
                address: "",
                state: "",
                pincode: "",
                city: "",
            });
        } catch (err) {
            console.error("Error saving party", err);
            alert("Unable to save party");
        }
    };

    if (!show) return null;

    return (
        <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create New Party</h5>
                        <button
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Party Name{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter name"
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Mobile Number"
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">
                                        Billing Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="2"
                                        placeholder="Enter billing address"
                                    ></textarea>
                                </div>

                                <div className="col-md-4">
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

                                <div className="col-md-4">
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

                                <div className="col-md-4">
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
