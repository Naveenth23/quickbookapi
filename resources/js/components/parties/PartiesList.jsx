import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import InfoCard from "../common/InfoCard";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import SearchBar from "../common/SearchBar";
import {
    Plus,
    Share2,
    FileText,
    ChevronDown,
    Users,
    Download,
    Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PartiesList() {
    const navigate = useNavigate();

    const [parties, setParties] = useState([]);
    const [meta, setMeta] = useState(null);
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("name");
    const [category, setCategory] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [page, setPage] = useState(1);

    const [stats, setStats] = useState({
        all: 0,
        toCollect: 0,
        toPay: 0,
    });

    const fetchParties = async () => {
        try {
            const res = await api.get("customers", {
                params: {
                    search,
                    search_type: searchType,
                    party_category: category,
                    page,
                    per_page: 50,
                },
            });

            const list = Array.isArray(res.data.data)
                ? res.data.data
                : Array.isArray(res.data)
                ? res.data
                : [];

            setParties(list);
            setMeta(res.data.meta || null);

            const toCollect = list
                .filter((p) => p.balance_type === "To Collect")
                .reduce((sum, p) => sum + Number(p.opening_balance || 0), 0);
            const toPay = list
                .filter((p) => p.balance_type === "To Pay")
                .reduce((sum, p) => sum + Number(p.opening_balance || 0), 0);

            setStats({
                all: res.data.meta?.total || list.length,
                toCollect,
                toPay,
            });
        } catch (e) {
            console.error("Error fetching parties", e);
        }
    };

    useEffect(() => {
        fetchParties();
    }, [page, search, category, activeFilter]);

    const columns = [
        { label: "Party Name", key: "name" },
        { label: "Category", key: "category", render: (v) => v || "-" },
        { label: "Mobile Number", key: "phone" },
        { label: "Party type", key: "customer_type" },
        {
            label: "Balance",
            key: "opening_balance",
            render: (v, row) => `₹${v || 0} ${row.balance_type || ""}`,
        },
    ];

    const categoryOptions = [
        { key: "", label: "Select Categories" },
        { key: "Retail", label: "Retail" },
        { key: "Wholesale", label: "Wholesale" },
    ];

    return (
        <div className="page-wrapper">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">Parties</h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary d-flex align-items-center gap-1">
                        <Share2 size={16} /> Share Party Portal
                    </button>
                    <button className="btn btn-outline-secondary d-flex align-items-center gap-1">
                        <FileText size={16} /> Reports
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <InfoCard
                        title="All Parties"
                        value={stats.all}
                        icon={Users}
                        color={activeFilter === "all" ? "primary" : "secondary"}
                        active={activeFilter === "all"}
                        onClick={() => setActiveFilter("all")}
                        currency={false}
                    />
                </div>
                <div className="col-md-4">
                    <InfoCard
                        title="To Collect"
                        value={stats.toCollect}
                        icon={Download}
                        color={
                            activeFilter === "collect" ? "success" : "secondary"
                        }
                        active={activeFilter === "collect"}
                        onClick={() => setActiveFilter("collect")}
                    />
                </div>
                <div className="col-md-4">
                    <InfoCard
                        title="To Pay"
                        value={stats.toPay}
                        icon={Upload}
                        color={activeFilter === "pay" ? "danger" : "secondary"}
                        active={activeFilter === "pay"}
                        onClick={() => setActiveFilter("pay")}
                    />
                </div>
            </div>

            {/* Search & Filters */}
            <SearchBar
                search={search}
                setSearch={setSearch}
                searchType={searchType}
                setSearchType={setSearchType}
                searchTypes={[
                    { key: "name", label: "Party Name" },
                    { key: "phone", label: "Mobile Number" },
                ]}
                category={category}
                setCategory={setCategory}
                categoryOptions={categoryOptions}
                placeholder="Search Party"
                extraActions={
                    <>
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                Bulk Action <ChevronDown size={14} />
                            </button>
                        </div>

                        <button
                            className="btn btn-primary d-flex align-items-center gap-1"
                            onClick={() => navigate("/add-party")}
                        >
                            <Plus size={16} /> Create Party
                        </button>
                    </>
                }
            />

            {/* Table */}
            <div className="card shadow-sm">
                <Table columns={columns} data={parties} />
            </div>

            {/* Pagination */}
            <Pagination meta={meta} onPageChange={(p) => setPage(p)} />
        </div>
    );
}
