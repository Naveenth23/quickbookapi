import React, { useRef, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import useFormValidation from "../hooks/useFormValidation";
import {
    Upload,
    PenTool,
    X,
    ChevronDown,
    MessageCircle,
    CalendarPlus,
} from "lucide-react";
import SavingIndicator from "../components/common/SavingIndicator";

export default function BusinessSettings() {
    const [industryOptions, setIndustryOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingIndustries, setLoadingIndustries] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const [isGSTRegistered, setIsGSTRegistered] = useState(false);
    const [enableEInvoice, setEnableEInvoice] = useState(false);
    const logoRef = useRef();
    const signRef = useRef();

    const rules = {
        name: ["required"],
        phone: ["required", "number"],
        email: ["email"],
        pincode: ["number"],
    };

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
            address: "",
            city: "",
            state: "",
            pincode: "",
            business_type: [],
            industry_type:"",
            registrationType: "Private Limited Company",
            industry_type: "",
            gstin: "", // ✅ Added
            pan: "",
        },
        rules
    );

    const businessTypeOptions = [
        "Retailer",
        "Wholesaler",
        "Distributor",
        "Manufacturer",
        "Service Provider",
    ];

    const handleFileUpload = (e, setter) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/"))
            return toast.error("Please upload an image file");
        const reader = new FileReader();
        reader.onloadend = () => setter(reader.result);
        reader.readAsDataURL(file);
    };

    const removePreview = (setter) => setter(null);

    const toggleBusinessType = (type) =>
        setFormData((prev) => {
            const selected = prev.business_type.includes(type)
                ? prev.business_type.filter((b) => b !== type)
                : [...prev.business_type, type];
            return { ...prev, business_type: selected };
        });

    const fetchBusiness = async () => {
        try {
            const { data } = await api.get("/business");
            if (data.success) {
                const biz = data.data;
                setFormData({
                    name: biz.name || "",
                    email: biz.email || "",
                    phone: biz.phone || "",
                    address: biz.address || "",
                    city: biz.city || "",
                    state: biz.state || "",
                    pincode: biz.zip_code || "",
                    business_type: biz.business_type
                        ? typeof biz.business_type === "string"
                            ? biz.business_type.split(",")
                            : biz.business_type
                        : [],
                    registrationType:
                        biz.registrationType || "Private Limited Company",
                    industry_type: biz.industry_type || "",
                    gstin: biz.gstin || "", // ✅ Added
                    pan: biz.pan || "", // ✅ Added
                });
                setIsGSTRegistered(!!biz.is_gst_registered);
                setEnableEInvoice(!!biz.enable_e_invoice);

                // ✅ FIXED — Always use full URL for image previews
                const logoUrl = biz.logo_url
                    ? biz.logo_url
                    : biz.logo
                    ? `/storage/${biz.logo}`
                    : null;

                const signatureUrl = biz.signature_url
                    ? biz.signature_url
                    : biz.signature
                    ? `/storage/${biz.signature}`
                    : null;

                setLogoPreview(logoUrl);
                setSignaturePreview(signatureUrl);
            } else toast.warn(data.message || "No active business found.");
        } catch (err) {
            toast.error("Failed to load business data.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return toast.error("Please correct highlighted errors.");

        try {
            setSaving(true);
            setSaved(false);

            const fd = new FormData();
            Object.entries(formData).forEach(([k, v]) =>
                fd.append(k, Array.isArray(v) ? v.join(",") : v ?? "")
            );
            if (logoRef.current?.files[0])
                fd.append("logo", logoRef.current.files[0]);
            if (signRef.current?.files[0])
                fd.append("signature", signRef.current.files[0]);

            fd.append("is_gst_registered", isGSTRegistered ? 1 : 0);
            fd.append("enable_e_invoice", enableEInvoice ? 1 : 0);
            const res = await api.post("/business?_method=PUT", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                toast.success("Business updated successfully!");
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            } else toast.warn(res.data.message || "Something went wrong.");
        } catch (err) {
            toast.error("Failed to update business settings.");
        } finally {
            setSaving(false);
        }
    };

    const filteredIndustries = industryOptions.filter((opt) =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch industries from backend
    const fetchIndustries = async () => {
        try {
            setLoadingIndustries(true);
            const { data } = await api.get("/industry-types");
            if (data.success && Array.isArray(data.data)) {
                setIndustryOptions(data.data);
            }
        } catch (error) {
            toast.error("Failed to load industry types");
        } finally {
            setLoadingIndustries(false);
        }
    };

    useEffect(() => {
        fetchBusiness();
        fetchIndustries();
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="container-fluid py-3 px-4 bg-white rounded-3 shadow-sm">
            {/* ===== HEADER ===== */}

            <div
                className={`position-sticky top-0 bg-white py-2 mb-4 border-bottom transition-shadow ${
                    isScrolled ? "shadow-sm" : ""
                }`}
                style={{ zIndex: 1050 }}
            >
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="fw-semibold mb-0">Business Settings</h5>
                        <small className="text-muted">
                            Edit Your Company Settings And Information
                        </small>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {/* <button className="btn btn-warning d-flex align-items-center gap-1">
                            <CalendarPlus size={16} /> Create new business
                        </button> */}
                        <button className="btn btn-outline-secondary d-flex align-items-center gap-1">
                            <MessageCircle size={16} /> Chat Support
                        </button>
                        <button className="btn btn-outline-primary">
                            Close Financial Year
                        </button>
                        {/* <button className="btn btn-light">Cancel</button> */}
                        <SavingIndicator
                            saving={saving}
                            success={saved}
                            label="Save Changes"
                            onClick={() =>
                                document
                                    .getElementById("businessForm")
                                    .requestSubmit()
                            }
                        />
                    </div>
                </div>
            </div>

            {/* ===== FORM ===== */}
            <form onSubmit={handleSubmit} id="businessForm">
                <div className="row g-4">
                    {/* === LEFT COLUMN === */}
                    <div className="col-lg-4 col-md-5 border-end pe-4">
                        {/* Logo Upload */}
                        <UploadBox
                            label="Upload Logo"
                            fileRef={logoRef}
                            preview={logoPreview}
                            onUpload={(e) =>
                                handleFileUpload(e, setLogoPreview)
                            }
                            onRemove={() => removePreview(setLogoPreview)}
                        />

                        <FormInput
                            label="Company Phone Number"
                            name="phone"
                            value={formData.phone}
                            error={errors.phone}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Company E-Mail"
                            name="email"
                            type="email"
                            value={formData.email}
                            error={errors.email}
                            onChange={handleChange}
                        />

                        <div className="mt-3">
                            <label className="form-label">
                                Billing Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="form-control"
                                rows={2}
                                placeholder="Enter Billing Address"
                            />
                        </div>

                        <div className="row mt-3 g-2">
                            <div className="col-md-6">
                                <FormSelect
                                    label="State"
                                    name="state"
                                    value={formData.state}
                                    options={[
                                        "Himachal Pradesh",
                                        "Punjab",
                                        "Haryana",
                                    ]}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <FormInput
                                    label="Pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    error={errors.pincode}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-12">
                                <FormInput
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-12 mt-3">
                                <label className="form-label d-block">
                                    Are you GST Registered?
                                </label>
                                <div className="d-flex gap-3">
                                    <div
                                        className={`border rounded-2 px-3 py-2 cursor-pointer d-flex align-items-center ${
                                            isGSTRegistered
                                                ? "border-primary text-primary"
                                                : "border-light"
                                        }`}
                                        style={{ minWidth: 80 }}
                                        onClick={() => setIsGSTRegistered(true)}
                                    >
                                        <input
                                            type="radio"
                                            name="gst_registered"
                                            checked={isGSTRegistered}
                                            readOnly
                                            className="form-check-input me-2"
                                        />
                                        Yes
                                    </div>
                                    <div
                                        className={`border rounded-2 px-3 py-2 cursor-pointer d-flex align-items-center ${
                                            !isGSTRegistered
                                                ? "border-primary text-primary"
                                                : "border-light"
                                        }`}
                                        style={{ minWidth: 80 }}
                                        onClick={() =>
                                            setIsGSTRegistered(false)
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name="gst_registered"
                                            checked={!isGSTRegistered}
                                            readOnly
                                            className="form-check-input me-2"
                                        />
                                        No
                                    </div>
                                </div>
                            </div>

                            {/* ===== GSTIN INPUT ===== */}
                            {isGSTRegistered && (
                                <div className="col-md-12 mt-3">
                                    <label className="form-label">
                                        GSTIN{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="gstin"
                                        value={formData.gstin || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter your GST Number"
                                    />
                                </div>
                            )}

                            {/* ===== ENABLE E-INVOICING ===== */}
                            <div className="col-md-12 mt-3">
                                <div
                                    className="border rounded-3 px-3 py-2 d-flex justify-content-between align-items-center"
                                    style={{ borderColor: "#5A32EA" }}
                                >
                                    <span className="text-primary fw-semibold">
                                        Enable e-Invoicing
                                    </span>
                                    <div className="d-flex align-items-center gap-2">
                                        <div
                                            className="form-check form-switch m-0"
                                            style={{ transform: "scale(1.2)" }}
                                        >
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={enableEInvoice}
                                                onChange={() =>
                                                    setEnableEInvoice(
                                                        !enableEInvoice
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ===== PAN NUMBER ===== */}
                            <div className="col-md-12 mt-3">
                                <label className="form-label">PAN Number</label>
                                <input
                                    type="text"
                                    name="pan"
                                    value={formData.pan || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter your PAN Number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* === RIGHT COLUMN === */}
                    <div className="col-lg-8 col-md-7">
                        <FormInput
                            label="Business Name *"
                            name="name"
                            value={formData.name}
                            error={errors.name}
                            onChange={handleChange}
                        />

                        <div className="row">
                            <div className="col-md-6">
                                <DropdownMultiSelect
                                    label="Business Type"
                                    subLabel="(Select multiple, if applicable)"
                                    options={businessTypeOptions}
                                    selected={formData.business_type}
                                    onToggle={toggleBusinessType}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">
                                    Industry Type
                                </label>

                                <div className="dropdown w-100">
                                    <button
                                        className="btn btn-outline-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                    >
                                        {formData.industry_type ||
                                            "Search or select industry"}
                                        <ChevronDown size={16} />
                                    </button>

                                    <div
                                        className="dropdown-menu w-100 p-2 shadow-sm"
                                        style={{
                                            maxHeight: "250px",
                                            overflowY: "auto",
                                            zIndex: 1050,
                                        }}
                                    >
                                        {/* 🔍 Search Input */}
                                        <input
                                            type="text"
                                            className="form-control form-control-sm mb-2"
                                            placeholder="Search industry..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />

                                        {/* 🔄 Filtered List */}
                                        {loadingIndustries ? (
                                            <div className="text-center py-2 small text-muted">
                                                Loading...
                                            </div>
                                        ) : filteredIndustries.length > 0 ? (
                                            filteredIndustries.map(
                                                (industry) => (
                                                    <button
                                                        key={industry.id}
                                                        className={`dropdown-item text-truncate ${
                                                            formData.industry_type ===
                                                            industry.name
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                        type="button"
                                                        onClick={() =>
                                                            handleChange({
                                                                target: {
                                                                    name: "industry_type",
                                                                    value: industry.name,
                                                                },
                                                            })
                                                        }
                                                    >
                                                        {industry.name}
                                                    </button>
                                                )
                                            )
                                        ) : (
                                            <div className="text-center text-muted small py-2">
                                                No results found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <FormSelect
                            label="Business Registration Type"
                            name="registrationType"
                            value={formData.registrationType}
                            options={[
                                "Private Limited Company",
                                "Proprietorship",
                                "Partnership",
                            ]}
                            onChange={handleChange}
                        />

                        <div className="alert alert-light border mt-3 small mb-3">
                            <b>Note:</b> Terms & Conditions and Signature added
                            below will be shown on your Invoices
                        </div>

                        <div className="mt-3">
                            <label className="form-label">Signature</label>
                            <UploadBox
                                label="+ Add Signature"
                                icon={
                                    <PenTool
                                        size={18}
                                        className="text-primary mb-2"
                                    />
                                }
                                fileRef={signRef}
                                preview={signaturePreview}
                                onUpload={(e) =>
                                    handleFileUpload(e, setSignaturePreview)
                                }
                                onRemove={() =>
                                    removePreview(setSignaturePreview)
                                }
                                small
                            />
                        </div>

                        <div className="mt-4 border rounded-3 p-3">
                            <h6 className="fw-semibold mb-2">
                                Add Business Details
                            </h6>
                            <small className="text-muted d-block mb-3">
                                Add additional business information such as MSME
                                number, Website etc.
                            </small>
                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Website"
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="www.website.com"
                                />
                                <button className="btn btn-primary px-4">
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

/* 🔹 REUSABLE INPUTS & COMPONENTS */

const FormInput = ({ label, name, value, onChange, type = "text", error }) => (
    <div className="mb-3">
        <label className="form-label">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder={`Enter ${label}`}
        />
        {error && <div className="invalid-feedback">{error}</div>}
    </div>
);

const FormSelect = ({ label, name, value, options = [], onChange }) => (
    <div className="mb-3">
        <label className="form-label">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="form-select"
        >
            <option value="">Select {label}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

const DropdownMultiSelect = ({
    label,
    subLabel,
    options,
    selected,
    onToggle,
}) => (
    <div className="mb-3">
        <label className="form-label">
            {label} <small className="text-muted">{subLabel}</small>
        </label>
        <div className="dropdown w-100">
            <button
                className="btn btn-outline-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center"
                type="button"
                data-bs-toggle="dropdown"
            >
                {selected.length ? selected.join(", ") : "Select"}
                <ChevronDown size={16} />
            </button>
            <ul
                className="dropdown-menu w-100 shadow-sm p-2"
                style={{ maxHeight: 200, overflowY: "auto" }}
            >
                {options.map((opt) => (
                    <li
                        key={opt}
                        className="dropdown-item d-flex align-items-center gap-2"
                        onClick={() => onToggle(opt)}
                    >
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selected.includes(opt)}
                            readOnly
                        />
                        <label className="form-check-label flex-grow-1">
                            {opt}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const UploadBox = ({
    label,
    fileRef,
    preview,
    onUpload,
    onRemove,
    icon,
    small = false,
}) => (
    <div className="text-center mb-3">
        {preview ? (
            <div className="position-relative d-inline-block">
                <img
                    src={preview}
                    alt={label}
                    className="rounded-3 border shadow-sm"
                    style={{
                        width: small ? 200 : 140,
                        height: small ? 80 : 140,
                        objectFit: "cover",
                    }}
                />
                <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                    onClick={onRemove}
                    style={{ width: 24, height: 24, padding: 0 }}
                >
                    <X size={14} />
                </button>
            </div>
        ) : (
            <div
                className="border border-2 border-dashed rounded-3 p-4 text-center cursor-pointer"
                onClick={() => fileRef.current.click()}
                style={{
                    height: small ? 100 : 180,
                    borderColor: "#d6d6f5",
                    background: "#f8f9ff",
                }}
            >
                {icon || <Upload size={22} className="text-primary mb-2" />}
                <p className="fw-semibold text-primary mb-1">{label}</p>
                <small className="text-muted d-block">PNG/JPG, max 5 MB.</small>
            </div>
        )}
        <input
            type="file"
            ref={fileRef}
            onChange={onUpload}
            accept="image/*"
            className="d-none"
        />
    </div>
);
