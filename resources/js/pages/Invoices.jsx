import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
});

const badgeFor = (status) => {
    const map = { unpaid: "secondary", partial: "warning", paid: "success" };
    return `badge text-bg-${map[status] || "secondary"}`;
};

export default function Invoices() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(""); // unpaid | partial | paid | ''

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", page);
            if (search) params.set("search", search);
            if (status) params.set("status", status);

            // if your backend doesn't support search/status yet:
            // you can start with just page param
            const { data } = await api.get(`/invoices?${params.toString()}`);
            setRows(data.data || data); // works for both paginated/raw
            setPage(data.current_page || 1);
            setLastPage(data.last_page || 1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, status]);
    // Debounced search
    useEffect(() => {
        const t = setTimeout(() => {
            setPage(1);
            fetchData();
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const hasRows = useMemo(() => (rows?.length || 0) > 0, [rows]);

    return (
        <div className="card p-3">
            <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center mb-3">
                <h4 className="mb-0">Invoices</h4>
                <div className="d-flex gap-2">
                    <input
                        className="form-control"
                        style={{ minWidth: 220 }}
                        placeholder="Search by number or customer"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="form-select"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        style={{ minWidth: 160 }}
                    >
                        <option value="">All statuses</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                    </select>
                    <Link className="btn btn-primary" to="/invoices/new">
                        + Create Invoice
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">Loading...</div>
            ) : hasRows ? (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th className="text-end">Amount</th>
                                    <th className="text-center">Status</th>
                                    <th width="110"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((inv) => (
                                    <tr key={inv.id}>
                                        <td>{inv.invoice_number}</td>
                                        <td>{inv.customer?.name || "-"}</td>
                                        <td>{inv.invoice_date}</td>
                                        <td className="text-end">
                                            {currency.format(
                                                Number(inv.payable_amount || 0)
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <span
                                                className={badgeFor(
                                                    inv.payment_status
                                                )}
                                            >
                                                {inv.payment_status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <Link
                                                to={`/invoices/${inv.id}`}
                                                className="btn btn-sm btn-outline-secondary"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center gap-2">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            ‹ Prev
                        </button>
                        <span className="align-self-center small">
                            Page {page} / {lastPage}
                        </span>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page >= lastPage}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next ›
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-5 text-muted">
                    No invoices found.
                </div>
            )}
        </div>
    );
}
