import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Package, Layers, DollarSign, Check, Tag, AlertCircle } from "lucide-react";

/* ─────────────────────────────────────────────
   Inline "Add Category" — POSTs to /api/categories
───────────────────────────────────────────── */
const AddCategoryInline = ({ onAdd, onCancel }) => {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await axios.post(
        "/api/categories",
        { name: name.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      // Support both { data: { id, name } } and plain { id, name }
      const created = res.data?.data ?? res.data;
      onAdd({ id: created.id, name: created.name });
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        background: "#f0f7ff",
        border: "1px solid #b6d4fe",
        borderRadius: 8,
        padding: "10px 12px",
        marginTop: 8,
      }}
    >
      <div className="d-flex gap-2 align-items-center">
        <Tag size={14} className="text-primary flex-shrink-0" />
        <input
          autoFocus
          className={`form-control form-control-sm ${error ? "is-invalid" : ""}`}
          placeholder="New category name…"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
            if (e.key === "Escape") onCancel();
          }}
        />
        <button
          className="btn btn-sm btn-primary px-2 flex-shrink-0"
          onClick={handleAdd}
          disabled={!name.trim() || saving}
          title="Save category"
        >
          {saving
            ? <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} />
            : <Check size={13} />}
        </button>
        <button
          className="btn btn-sm btn-outline-secondary px-2 flex-shrink-0"
          onClick={onCancel}
          title="Cancel"
        >
          <X size={13} />
        </button>
      </div>
      {error && (
        <div className="d-flex align-items-center gap-1 mt-1" style={{ color: "#dc3545", fontSize: 12 }}>
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Reusable Field Wrapper
───────────────────────────────────────────── */
const FormField = ({ label, required, error, children, fullWidth }) => (
  <div className={fullWidth ? "col-md-12" : "col-md-6"}>
    <label className="form-label fw-semibold small mb-1">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    {children}
    {error && <div className="text-danger" style={{ fontSize: 12, marginTop: 3 }}>{error}</div>}
  </div>
);

/* ─────────────────────────────────────────────
   BASIC TAB
───────────────────────────────────────────── */
const BasicTab = ({
  values, errors, handleChange,
  categories, setCategories, categoriesLoading,
  units, gstOptions,
}) => {
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleCategoryAdded = (newCat) => {
    setCategories((prev) => [...prev, newCat]);
    handleChange("category_id", String(newCat.id));
    setShowAddCategory(false);
  };

  return (
    <div className="row g-3">
      {/* Item Type */}
      <FormField label="Item Type" required>
        <div className="d-flex gap-3 pt-1">
          {["product", "service"].map((type) => (
            <div className="form-check" key={type}>
              <input
                className="form-check-input"
                type="radio"
                id={`type_${type}`}
                checked={values.item_type === type}
                onChange={() => handleChange("item_type", type)}
              />
              <label className="form-check-label text-capitalize" htmlFor={`type_${type}`}>
                {type}
              </label>
            </div>
          ))}
        </div>
      </FormField>

      {/* Category */}
      <div className="col-md-6">
        <label className="form-label fw-semibold small mb-1">Category</label>
        <select
          className="form-select"
          value={values.category_id}
          disabled={categoriesLoading}
          onChange={(e) => {
            if (e.target.value === "__add__") {
              setShowAddCategory(true);
            } else {
              handleChange("category_id", e.target.value);
            }
          }}
        >
          <option value="">
            {categoriesLoading ? "Loading categories…" : "Select Category"}
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
          {!categoriesLoading && (
            <option value="__add__" style={{ color: "#0d6efd", fontWeight: 600 }}>
              ＋ Add New Category
            </option>
          )}
        </select>
        {showAddCategory && (
          <AddCategoryInline
            onAdd={handleCategoryAdded}
            onCancel={() => setShowAddCategory(false)}
          />
        )}
      </div>

      {/* Item Name */}
      <FormField label="Item Name" required error={errors.name}>
        <input
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          placeholder="e.g., Maggie 20gm"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </FormField>

      {/* Sales Price */}
      <FormField label="Sales Price" required error={errors.sales_price}>
        <div className="input-group">
          <span className="input-group-text">₹</span>
          <input
            type="number"
            className={`form-control ${errors.sales_price ? "is-invalid" : ""}`}
            placeholder="e.g., 200"
            value={values.sales_price}
            onChange={(e) => handleChange("sales_price", e.target.value)}
          />
          <select
            className="form-select"
            style={{ maxWidth: 130 }}
            value={values.tax_included}
            onChange={(e) => handleChange("tax_included", e.target.value)}
          >
            <option value="with_tax">With Tax</option>
            <option value="without_tax">Without Tax</option>
          </select>
        </div>
      </FormField>

      {/* GST Rate */}
      <FormField label="GST Tax Rate (%)">
        <select
          className="form-select"
          value={values.gst_rate}
          onChange={(e) => handleChange("gst_rate", e.target.value)}
        >
          {gstOptions.map((rate, idx) => (
            <option key={idx} value={rate}>{rate}%</option>
          ))}
        </select>
      </FormField>

      {/* Unit */}
      <FormField label="Measuring Unit">
        <select
          className="form-select"
          value={values.unit}
          onChange={(e) => handleChange("unit", e.target.value)}
        >
          <option value="">Select Unit</option>
          {units.map((u) => (
            <option key={u.id} value={u.name}>{u.name}</option>
          ))}
        </select>
      </FormField>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STOCK TAB
───────────────────────────────────────────── */
const StockTab = ({ values, handleChange, handleGenerateBarcode, onViewBarcode }) => (
  <div className="row g-3">
    <FormField label="Item Code">
      <div className="input-group">
        <input
          className="form-control"
          placeholder="e.g., ITM12549"
          value={values.item_code}
          onChange={(e) => handleChange("item_code", e.target.value)}
        />
        <button className="btn btn-outline-primary" type="button" onClick={handleGenerateBarcode}>
          {values.item_code ? "Regenerate" : "Generate"}
        </button>
      </div>
      {values.item_code && (
        <button
          className="btn btn-link text-primary ps-0 mt-1 small"
          type="button"
          onClick={onViewBarcode}
        >
          View Barcode
        </button>
      )}
    </FormField>

    <FormField label="HSN Code">
      <input
        className="form-control"
        placeholder="e.g., 4010"
        value={values.hsn_code}
        onChange={(e) => handleChange("hsn_code", e.target.value)}
      />
    </FormField>

    <FormField label="Opening Stock">
      <div className="input-group">
        <input
          type="number"
          className="form-control"
          placeholder="e.g., 150"
          value={values.opening_stock}
          onChange={(e) => handleChange("opening_stock", e.target.value)}
        />
        <span className="input-group-text">PCS</span>
      </div>
    </FormField>

    <FormField label="As of Date">
      <input
        type="date"
        className="form-control"
        value={values.as_of_date}
        onChange={(e) => handleChange("as_of_date", e.target.value)}
      />
    </FormField>

    <div className="col-md-12">
      <div className="form-check mt-1">
        <input
          className="form-check-input"
          type="checkbox"
          id="lowStockToggle"
          checked={values.low_stock_enabled}
          onChange={(e) => handleChange("low_stock_enabled", e.target.checked)}
        />
        <label className="form-check-label fw-semibold small" htmlFor="lowStockToggle">
          Enable Low Stock Quantity Warning
        </label>
      </div>
      {values.low_stock_enabled && (
        <input
          type="number"
          className="form-control mt-2"
          placeholder="Low Stock Qty"
          value={values.low_stock_qty}
          onChange={(e) => handleChange("low_stock_qty", e.target.value)}
        />
      )}
    </div>

    <div className="col-md-12">
      <label className="form-label fw-semibold small mb-1">Description</label>
      <textarea
        className="form-control"
        placeholder="Enter description…"
        rows={3}
        value={values.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   PRICING TAB
───────────────────────────────────────────── */
const PricingTab = ({ values, handleChange, gstOptions }) => (
  <div className="row g-3">
    <FormField label="Purchase Price">
      <div className="input-group">
        <span className="input-group-text">₹</span>
        <input
          type="number"
          className="form-control"
          placeholder="e.g., 150"
          value={values.purchase_price}
          onChange={(e) => handleChange("purchase_price", e.target.value)}
        />
      </div>
    </FormField>

    <FormField label="MRP">
      <div className="input-group">
        <span className="input-group-text">₹</span>
        <input
          type="number"
          className="form-control"
          placeholder="e.g., 250"
          value={values.mrp}
          onChange={(e) => handleChange("mrp", e.target.value)}
        />
      </div>
    </FormField>

    <FormField label="GST Tax Rate (%)">
      <select
        className="form-select"
        value={values.gst_rate}
        onChange={(e) => handleChange("gst_rate", e.target.value)}
      >
        {gstOptions.map((rate, idx) => (
          <option key={idx} value={rate}>{rate}%</option>
        ))}
      </select>
    </FormField>
  </div>
);

/* ─────────────────────────────────────────────
   DEFAULT FORM VALUES
───────────────────────────────────────────── */
const defaultValues = {
  item_type: "product",
  category_id: "",
  name: "",
  sales_price: "",
  purchase_price: "",
  mrp: "",
  tax_included: "with_tax",
  gst_rate: "0",
  unit: "",
  opening_stock: "",
  item_code: "",
  hsn_code: "",
  as_of_date: new Date().toISOString().split("T")[0],
  low_stock_enabled: false,
  low_stock_qty: "",
  description: "",
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT — handles both Create & Edit
   Props:
     show        : boolean
     onClose     : () => void
     onSave      : (values) => void
     initialData : object | null  — pass product object to edit
     units       : array
     gstOptions  : array
     storeName   : string
   Categories are fetched internally from GET /api/categories
───────────────────────────────────────────── */
export default function ItemModal({
  show,
  onClose,
  onSave,
  initialData = null,
  units = [],
  gstOptions = [0, 5, 12, 18, 28],
  storeName = "Poonam General Store",
}) {
  const isEdit = Boolean(initialData);
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic");

  // Categories — fetched from API
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [showBarcode, setShowBarcode] = useState(false);

  /* ── Fetch categories from API each time modal opens ── */
  useEffect(() => {
    if (!show) return;

    setCategoriesLoading(true);

    axios
      .get("/api/categories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setCategories(res.data?.categories ?? []);
      })
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false));
  }, [show]);

  /* ── Populate form when editing ── */
  useEffect(() => {
    if (show) {
      setActiveTab("basic");
      setErrors({});
      if (isEdit && initialData) {
        setValues({
          ...defaultValues,
          ...initialData,
          gst_rate: String(initialData.gst_rate ?? initialData.tax_rate ?? "0"),
          item_code: initialData.item_code ?? initialData.sku ?? "",
          sales_price: initialData.sales_price ?? initialData.sale_price ?? "",
          low_stock_enabled: Boolean(
            initialData.low_stock_enabled ?? initialData.min_stock_level
          ),
          low_stock_qty: initialData.low_stock_qty ?? initialData.min_stock_level ?? "",
        });
      } else {
        setValues(defaultValues);
      }
    }
  }, [show, initialData]);

  const handleChange = (field, val) => {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!values.name?.trim()) e.name = "Item name is required.";
    if (!values.sales_price) e.sales_price = "Sales price is required.";
    else if (isNaN(Number(values.sales_price))) e.sales_price = "Must be a valid number.";
    setErrors(e);
    if (Object.keys(e).length > 0) setActiveTab("basic");
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.(values);
  };

  const handleGenerateBarcode = () => {
    handleChange("item_code", "ITM" + Math.floor(10000 + Math.random() * 90000));
  };

  if (!show) return null;

  const tabs = [
    { key: "basic",   label: "Basic Details",   icon: Package },
    { key: "stock",   label: "Stock Details",   icon: Layers },
    { key: "pricing", label: "Pricing Details", icon: DollarSign },
  ];

  return (
    <>
      <style>{`
        .item-modal-overlay {
          position: fixed; inset: 0; z-index: 1055;
          background: rgba(15, 23, 42, 0.55);
          display: flex; align-items: center; justify-content: center;
          animation: fadeOverlay .18s ease;
        }
        @keyframes fadeOverlay { from { opacity:0 } to { opacity:1 } }
        .item-modal-dialog {
          width: 90%; max-width: 860px; max-height: 92vh;
          background: #fff; border-radius: 14px;
          box-shadow: 0 24px 64px rgba(0,0,0,.22);
          display: flex; flex-direction: column;
          animation: slideUp .22s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
        }
        @keyframes slideUp {
          from { transform: translateY(24px); opacity:0 }
          to   { transform: translateY(0);    opacity:1 }
        }
        .item-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 24px 16px;
          border-bottom: 1px solid #e9ecef;
          background: #f8faff;
        }
        .item-modal-header h5 {
          margin: 0; font-size: 17px; font-weight: 700;
          color: #1a2340;
          display: flex; align-items: center; gap: 8px;
        }
        .item-modal-header .badge-edit {
          font-size: 11px; font-weight: 600; padding: 3px 9px;
          border-radius: 20px; background: #e0edff; color: #1967d2;
        }
        .item-modal-body { display: flex; flex: 1; overflow: hidden; }
        .item-modal-sidebar {
          width: 185px; flex-shrink: 0;
          padding: 20px 12px;
          border-right: 1px solid #e9ecef;
          background: #f8faff;
          display: flex; flex-direction: column; gap: 6px;
        }
        .sidebar-tab-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 9px;
          border: none; background: transparent;
          font-size: 13.5px; font-weight: 500; color: #5a6580;
          cursor: pointer; text-align: left; transition: all .14s;
          width: 100%;
        }
        .sidebar-tab-btn:hover { background: #edf2ff; color: #1967d2; }
        .sidebar-tab-btn.active {
          background: #1967d2; color: #fff;
          box-shadow: 0 3px 10px rgba(25,103,210,.25);
        }
        .sidebar-tab-btn .tab-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: currentColor; opacity: .35; flex-shrink: 0;
        }
        .sidebar-tab-btn.has-error .tab-dot { opacity: 1; background: #dc3545; }
        .item-modal-content { flex: 1; overflow-y: auto; padding: 24px; }
        .item-modal-footer {
          padding: 14px 24px;
          border-top: 1px solid #e9ecef;
          background: #f8faff;
          display: flex; justify-content: flex-end; gap: 10px;
        }
      `}</style>

      <div
        className="item-modal-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="item-modal-dialog">
          {/* Header */}
          <div className="item-modal-header">
            <h5>
              {isEdit ? "Edit Item" : "Create New Item"}
              {isEdit && <span className="badge-edit">Editing</span>}
            </h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="item-modal-body">
            {/* Sidebar */}
            <div className="item-modal-sidebar">
              {tabs.map(({ key, label, icon: Icon }) => {
                const hasError =
                  key === "basic" && (errors.name || errors.sales_price);
                return (
                  <button
                    key={key}
                    className={`sidebar-tab-btn ${activeTab === key ? "active" : ""} ${hasError ? "has-error" : ""}`}
                    onClick={() => setActiveTab(key)}
                  >
                    <Icon size={15} />
                    <span style={{ flex: 1 }}>{label}</span>
                    <span className="tab-dot" />
                  </button>
                );
              })}
            </div>

            {/* Form Content */}
            <div className="item-modal-content">
              {activeTab === "basic" && (
                <BasicTab
                  values={values}
                  errors={errors}
                  handleChange={handleChange}
                  categories={categories}
                  setCategories={setCategories}
                  categoriesLoading={categoriesLoading}
                  units={units}
                  gstOptions={gstOptions}
                />
              )}
              {activeTab === "stock" && (
                <StockTab
                  values={values}
                  handleChange={handleChange}
                  handleGenerateBarcode={handleGenerateBarcode}
                  onViewBarcode={() => setShowBarcode(true)}
                />
              )}
              {activeTab === "pricing" && (
                <PricingTab
                  values={values}
                  handleChange={handleChange}
                  gstOptions={gstOptions}
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="item-modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary px-4 fw-semibold" onClick={handleSave}>
              {isEdit ? "Update Item" : "Save Item"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}