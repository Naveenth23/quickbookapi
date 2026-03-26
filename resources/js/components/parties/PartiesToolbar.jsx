import React from "react";

export default function PartiesToolbar({
    search,
    setSearch,
    category,
    setCategory,
    onAdd,
}) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                        
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control border-start-0"
                        placeholder="Search Parties..."
                    />
                </div>

                <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Select Categories</option>
                    <option value="Retail">Retail</option>
                    <option value="Wholesale">Wholesale</option>
                </select>
            </div>

            <div className="d-flex align-items-center gap-2">
                <div className="dropdown">
                    <button
                        className="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        Bulk Action
                    </button>
                </div>

                <button
                    className="btn btn-primary d-flex align-items-center gap-1"
                    onClick={onAdd}
                >
                    Create Party
                </button>
            </div>
        </div>
    );
}
