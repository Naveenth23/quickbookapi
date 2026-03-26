import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Party Dropdown + Create Party Modal
 * Features:
 * ✅ Fetch party list from API
 * ✅ Search by name or mobile
 * ✅ Click + Create Party → opens modal
 * ✅ Modal form with billing + shipping + GSTIN
 */
export default function PartyDropdown({ onSelect }) {
  const [parties, setParties] = useState([]);
  const [filteredParties, setFilteredParties] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    billingAddress: "",
    state: "",
    pincode: "",
    city: "",
    gstin: "",
    sameShipping: true,
  });

  // ✅ Fetch parties from API
  const fetchParties = async () => {
    try {
      const res = await axios.get("/api/customers"); // ← your endpoint
      setParties(res.data);
      setFilteredParties(res.data);
    } catch (err) {
      console.error("Error fetching parties:", err);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    const term = search.toLowerCase();
    if (!term) setFilteredParties(parties);
    else {
      const filtered = parties.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.phone?.toLowerCase().includes(term)
      );
      setFilteredParties(filtered);
    }
  }, [search, parties]);

  // 🧾 Save new party
  const handleSaveParty = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Party name is required");
    try {
      const res = await axios.post("/api/customers", form);
      setParties((prev) => [...prev, res.data]);
      setFilteredParties((prev) => [...prev, res.data]);
      setShowModal(false);
      setForm({
        name: "",
        phone: "",
        billingAddress: "",
        state: "",
        pincode: "",
        city: "",
        gstin: "",
        sameShipping: true,
      });
    } catch (err) {
      console.error("Error saving party:", err);
      alert("Failed to create party.");
    }
  };

  return (
    <div className="position-relative" style={{ width: "100%" }}>
      {/* Dropdown Field */}
      <label className="form-label fw-semibold">Bill To</label>
      <div
        className="form-control d-flex justify-content-between align-items-center"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ cursor: "pointer" }}
      >
        <span className="text-muted">Search party by name or number</span>
        <i className="bi bi-chevron-down"></i>
      </div>

      {/* Dropdown List */}
      {showDropdown && (
        <div
          className="border position-absolute bg-white shadow-sm mt-1 rounded w-100"
          style={{ zIndex: 1050 }}
        >
          <div className="p-2 border-bottom">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr className="text-muted small">
                  <th>Party Name</th>
                  <th className="text-end">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredParties.length > 0 ? (
                  filteredParties.map((party, i) => (
                    <tr
                      key={i}
                      onClick={() => {
                        onSelect(party);
                        setShowDropdown(false);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{party.name}</td>
                      <td className="text-end">{party.balance ?? "0.00"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center text-muted">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            className="border-top text-center py-2 text-primary fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowDropdown(false);
              setShowModal(true);
            }}
          >
            + Create Party
          </div>
        </div>
      )}

      {/* CREATE PARTY MODAL */}
      {showModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040, background: "rgba(0,0,0,0.4)" }}
          ></div>

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              zIndex: 1050,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflowY: "auto",
            }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Create New Party</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <form onSubmit={handleSaveParty}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Party Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter name"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Mobile Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Mobile Number"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-12 mt-2">
                        <h6 className="fw-semibold text-muted">
                          Address (Optional)
                        </h6>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Billing Address</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="Enter billing address"
                          value={form.billingAddress}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              billingAddress: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter State"
                          value={form.state}
                          onChange={(e) =>
                            setForm({ ...form, state: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Pincode</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Pincode"
                          value={form.pincode}
                          onChange={(e) =>
                            setForm({ ...form, pincode: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter City"
                          value={form.city}
                          onChange={(e) =>
                            setForm({ ...form, city: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-12 form-check mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={form.sameShipping}
                          onChange={(e) =>
                            setForm({ ...form, sameShipping: e.target.checked })
                          }
                        />
                        <label className="form-check-label ms-2">
                          Shipping address same as billing address
                        </label>
                      </div>

                      <div className="col-12 mt-3">
                        <h6 className="fw-semibold text-muted">
                          GSTIN (Optional)
                        </h6>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ex: 29XXXXX9438X1XX"
                          value={form.gstin}
                          onChange={(e) =>
                            setForm({ ...form, gstin: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-0">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-warning text-dark">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
