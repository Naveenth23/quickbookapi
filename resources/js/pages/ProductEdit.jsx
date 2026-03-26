import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductEdit() {
  const { productUuid } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productUuid]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${productUuid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setForm(res.data.data);
    } catch (err) {
      navigate("/not-found");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);

      await axios.put(
        `/api/products/${productUuid}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate(`/products/${productUuid}`);
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!form) return null;

  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-light me-3"
            onClick={() => navigate(-1)}
          >
            ←
          </button>
          <h4 className="fw-bold mb-0">Edit Product</h4>
        </div>

        <button
          className="btn btn-primary px-4"
          onClick={handleUpdate}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="row g-4">
        {/* GENERAL DETAILS */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h6 className="fw-bold mb-3">General Details</h6>

            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                value={form.name || ""}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">SKU</label>
              <input
                type="text"
                className="form-control"
                value={form.sku || ""}
                onChange={(e) =>
                  handleChange("sku", e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">HSN Code</label>
              <input
                type="text"
                className="form-control"
                value={form.hsn_code || ""}
                onChange={(e) =>
                  handleChange("hsn_code", e.target.value)
                }
              />
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={form.description || ""}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* PRICING & STOCK */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h6 className="fw-bold mb-3">Pricing & Stock</h6>

            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label">Sale Price</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.sale_price || ""}
                  onChange={(e) =>
                    handleChange("sale_price", e.target.value)
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label">Purchase Price</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.purchase_price || ""}
                  onChange={(e) =>
                    handleChange("purchase_price", e.target.value)
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label">MRP</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.mrp || ""}
                  onChange={(e) =>
                    handleChange("mrp", e.target.value)
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label">GST Rate (%)</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.tax_rate || ""}
                  onChange={(e) =>
                    handleChange("tax_rate", e.target.value)
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.stock_quantity || ""}
                  onChange={(e) =>
                    handleChange("stock_quantity", e.target.value)
                  }
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label">Min Stock Level</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.min_stock_level || ""}
                  onChange={(e) =>
                    handleChange("min_stock_level", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}