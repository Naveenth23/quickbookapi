import React from "react";
import { Search, ChevronDown } from "lucide-react";

export default function SearchBar({
    search,
    setSearch,
    searchType,
    setSearchType,
    searchTypes = [],
    category,
    setCategory,
    categoryOptions = [],
    extraActions,
    placeholder = "Search",
}) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            {/* 🔍 Left Section: Search + Dropdowns */}
            <div className="d-flex align-items-center gap-2 flex-grow-1 flex-wrap">
                {/* Search Input */}
                <div className="input-group" style={{ maxWidth: 300 }}>
                    <span className="input-group-text bg-white border-end-0">
                        <Search size={16} className="text-muted" />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control border-start-0"
                        placeholder={`${placeholder} by ${
                            searchTypes.find((s) => s.key === searchType)
                                ?.label || "Name"
                        }`}
                        style={{ height: "38px" }}
                    />
                </div>

                {/* Search Type Dropdown */}
                {searchTypes.length > 0 && (
                    <div className="dropdown">
                        <button
                            className="btn btn-outline-light border text-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            style={{ height: "38px", minWidth: 140 }}
                        >
                            {
                                searchTypes.find((s) => s.key === searchType)
                                    ?.label
                            }{" "}
                            <ChevronDown size={14} />
                        </button>
                        <ul className="dropdown-menu shadow-sm">
                            {searchTypes.map((s) => (
                                <li key={s.key}>
                                    <button
                                        className={`dropdown-item ${
                                            searchType === s.key ? "active" : ""
                                        }`}
                                        onClick={() => setSearchType(s.key)}
                                    >
                                        {s.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Category Dropdown */}
                {categoryOptions.length > 0 && (
                    <select
                        className="form-select"
                        style={{
                            maxWidth: 180,
                            height: "38px",
                        }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categoryOptions.map((c) => (
                            <option key={c.key} value={c.key}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* ➕ Right Actions */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
                {extraActions}
            </div>
        </div>
    );
}
