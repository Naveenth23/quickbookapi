import React from "react";

export default function Pagination({ meta, onPageChange }) {
    if (!meta) return null;

    const { current_page, last_page, total } = meta;

    const handleChange = (page) => {
        if (page > 0 && page <= last_page) {
            onPageChange(page);
        }
    };

    // Generate page numbers dynamically (smart pagination)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // show 5 numbers around current page
        const start = Math.max(1, current_page - 2);
        const end = Math.min(last_page, start + maxVisible - 1);

        if (start > 1) pages.push(1);
        if (start > 2) pages.push("...");

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < last_page - 1) pages.push("...");
        if (end < last_page) pages.push(last_page);

        return pages;
    };

    return (
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
            <small className="text-muted">
                Page {current_page} of {last_page} — Total: {total}
            </small>

            <nav aria-label="Table Pagination">
                <ul className="pagination pagination-sm mb-0">
                    <li
                        className={`page-item ${
                            current_page === 1 ? "disabled" : ""
                        }`}
                    >
                        <button
                            className="page-link"
                            onClick={() => handleChange(current_page - 1)}
                        >
                            ‹ Prev
                        </button>
                    </li>

                    {getPageNumbers().map((num, i) =>
                        num === "..." ? (
                            <li key={i} className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        ) : (
                            <li
                                key={i}
                                className={`page-item ${
                                    num === current_page ? "active" : ""
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => handleChange(num)}
                                >
                                    {num}
                                </button>
                            </li>
                        )
                    )}

                    <li
                        className={`page-item ${
                            current_page === last_page ? "disabled" : ""
                        }`}
                    >
                        <button
                            className="page-link"
                            onClick={() => handleChange(current_page + 1)}
                        >
                            Next ›
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
