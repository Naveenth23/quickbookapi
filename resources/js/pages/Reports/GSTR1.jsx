import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function GSTR1Report() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchGSTR1Data = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            
            const res = await api.get(`/reports/gstr1?${params}`);
            setData(res.data);
        } catch (error) {
            console.error("Error fetching GSTR-1 data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGSTR1Data();
    }, [startDate, endDate]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>GSTR-1 Report</h2>
                <button className="btn btn-outline-primary" onClick={handlePrint}>
                    Print Report
                </button>
            </div>

            {/* Date Filter */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button className="btn btn-primary" onClick={fetchGSTR1Data}>
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="card bg-primary text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Total Taxable Value</h5>
                                    <h3>₹{data?.total_taxable_value?.toFixed(2) || '0.00'}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-success text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Total Tax Amount</h5>
                                    <h3>₹{data?.total_tax_amount?.toFixed(2) || '0.00'}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-info text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Total Invoices</h5>
                                    <h3>{data?.invoices?.length || 0}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tax Summary Table */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Tax Summary by Rate</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Tax Rate (%)</th>
                                            <th>Taxable Value (₹)</th>
                                            <th>Tax Amount (₹)</th>
                                            <th>Total Value (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.tax_summary?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.tax_rate}%</td>
                                                <td>{item.taxable_value.toFixed(2)}</td>
                                                <td>{item.tax_amount.toFixed(2)}</td>
                                                <td>{(item.taxable_value + item.tax_amount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        {(!data?.tax_summary || data.tax_summary.length === 0) && (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted">
                                                    No tax data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Invoice Details</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Invoice No</th>
                                            <th>Date</th>
                                            <th>Customer</th>
                                            <th>Total Value (₹)</th>
                                            <th>Tax Amount (₹)</th>
                                            <th>Grand Total (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.invoices?.map((invoice) => (
                                            <tr key={invoice.id}>
                                                <td>{invoice.invoice_number}</td>
                                                <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
                                                <td>{invoice.party?.name || 'N/A'}</td>
                                                <td>{(invoice.total - invoice.tax_total).toFixed(2)}</td>
                                                <td>{invoice.tax_total.toFixed(2)}</td>
                                                <td>{invoice.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        {(!data?.invoices || data.invoices.length === 0) && (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted">
                                                    No invoices found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}