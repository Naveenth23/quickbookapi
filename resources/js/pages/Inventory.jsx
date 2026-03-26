import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import InfoCard from "../common/InfoCard";
import SearchBar from "../common/SearchBar";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import CreateItemModal from "../components/CreateItemModal";
import {
    Package,
    Layers,
    BarChart3,
    AlertTriangle,
    Plus,
    ChevronDown,
} from "lucide-react";

export default function Inventory() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [showLowStock, setShowLowStock] = useState(false);

    const [stockValue, setStockValue] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const gstOptions = [
        "None",
        "GST @0.25%",
        "GST @3%",
        "GST @5%",
        "GST @12%",
        "GST @18%",
        "GST @28%",
    ];

    // 🔹 Fetch Products
    const loadInventory = async () => {
        try {
            setLoading(true);
            const res = await api.get("/inventory", {
                params: {
                    search,
                    category_id: category !== "all" ? category : "",
                    low_stock: showLowStock,
                    page,
                },
            });
            const { products = [], stock_value = 0, low_stock = 0, meta } =
                res.data;

            setProducts(products);
            setStockValue(stock_value);
            setLowStockCount(low_stock);
            setMeta(meta || null);
        } catch (err) {
            console.error("Inventory fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Fetch Categories
    const loadCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data.categories || []);
        } catch (err) {
            console.error("Category fetch error:", err);
        }
    };

    // 🔹 Fetch Units
    const loadUnits = async () => {
        try {
            const res = await api.get("/units");
            setUnits(res.data.units || []);
        } catch (err) {
            console.error("Units fetch error:", err);
        }
    };

    // 🔹 Save New Item
    const handleSave = async (formData) => {
        try {
            await api.post("/products", formData);
            setShowModal(false);
            loadInventory();
        } catch (err) {
            console.error("Item creation failed:", err);
        }
    };

    // 🔹 Effects
    useEffect(() => {
        loadCategories();
        loadUnits();
        loadInventory();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            loadInventory();
        }, 400);
        return () => clearTimeout(delay);
    }, [search, category, showLowStock, page]);

    // 🔹 Table Columns
    const columns = [
        {
            label: "",
            key: "checkbox",
            render: () => <input type="checkbox" />,
        },
        { label: "Item Name", key: "name" },
        { label: "Item Code", key: "sku", render: (v) => v || "-" },
        {
            label: "Stock QTY",
            key: "stock_quantity",
            render: (v) => `${v || 0} PCS`,
        },
        {
            label: "Selling Price",
            key: "sale_price",
            render: (v) => (v ? `₹ ${v}` : "-"),
        },
        {
            label: "Purchase Price",
            key: "purchase_price",
            render: (v) => (v ? `₹ ${v}` : "-"),
        },
        {
            label: "",
            key: "actions",
            render: () => <Package size={18} className="text-secondary" />,
        },
    ];

    // 🔹 Category Options
    const categoryOptions = [
        { key: "all", label: "All Categories" },
        ...categories.map((c) => ({ key: c.id, label: c.name })),
    ];

    return (
        <div className="page-wrapper">
            {/* ===== Header ===== */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">Items</h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary d-flex align-items-center gap-1">
                        <BarChart3 size={16} /> Reports
                    </button>
                    <button
                        className="btn btn-primary d-flex align-items-center gap-1"
                        onClick={() => setShowModal(true)}
                    >
                        <Plus size={16} /> Create Item
                    </button>
                </div>
            </div>

            {/* ===== Summary Cards ===== */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <InfoCard
                        title="Stock Value"
                        value={stockValue}
                        icon={Layers}
                        color="primary"
                    />
                </div>
                <div className="col-md-6">
                    <InfoCard
                        title="Low Stock"
                        value={lowStockCount}
                        icon={AlertTriangle}
                        color="warning"
                    />
                </div>
            </div>

            {/* ===== Filters ===== */}
            <SearchBar
                search={search}
                setSearch={setSearch}
                placeholder="Search Item"
                category={category}
                setCategory={setCategory}
                categoryOptions={categoryOptions}
                extraActions={
                    <>
                        <button
                            className={`btn d-flex align-items-center gap-1 ${
                                showLowStock
                                    ? "btn-warning"
                                    : "btn-outline-secondary"
                            }`}
                            onClick={() => setShowLowStock(!showLowStock)}
                        >
                            <Package size={16} />{" "}
                            {showLowStock ? "Showing Low Stock" : "Show Low Stock"}
                        </button>

                        <div className="dropdown">
                            <button
                                className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
                                data-bs-toggle="dropdown"
                            >
                                <Layers size={16} /> Bulk Actions
                                <ChevronDown size={14} />
                            </button>
                            <ul className="dropdown-menu shadow-sm">
                                <li>
                                    <button className="dropdown-item">
                                        Update Stock
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item">
                                        Export to Excel
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                }
            />

            {/* ===== Table ===== */}
            <div className="card shadow-sm border-0">
                <Table
                    columns={columns}
                    data={products}
                    loading={loading}
                    emptyText="No items found."
                />
            </div>

            {/* ===== Pagination ===== */}
            {meta && <Pagination meta={meta} onPageChange={setPage} />}

            {/* ===== Modal ===== */}
            <CreateItemModal
                show={showModal}
                onClose={() => setShowModal(false)}
                categories={categories}
                units={units}
                gstOptions={gstOptions}
                onSave={handleSave}
            />
        </div>
    );
}
