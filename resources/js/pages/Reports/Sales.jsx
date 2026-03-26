import React, { useState, useEffect } from 'react';
import api from "../../api/axios";



const SalesReport = () => {
    const [reportData, setReportData] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchSalesReport = async () => {
        try {
            const response = await api.get('/reports/sales', {
                params: { start_date: startDate, end_date: endDate },
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Failed to fetch sales report', error);
        }
    };

    useEffect(() => {
        fetchSalesReport();
    }, []);

    const handleFilter = () => {
        fetchSalesReport();
    };

    if (!reportData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800">Sales Report</h1>

            <div className="row mb-4">
                <div className="col-md-4">
                    <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="col-md-4">
                    <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="col-md-4">
                    <button className="btn btn-primary" onClick={handleFilter}>Filter</button>
                </div>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Sales Summary</h6>
                </div>
                <div className="card-body">
                    <p><strong>Total Revenue:</strong> ${reportData.total_revenue}</p>
                    <p><strong>Total Tax:</strong> ${reportData.total_tax}</p>
                </div>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Sales Details</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Tax</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.sales.map(sale => (
                                    <tr key={sale.id}>
                                        <td>{sale.id}</td>
                                        <td>{sale.party.name}</td>
                                        <td>{new Date(sale.created_at).toLocaleDateString()}</td>
                                        <td>${sale.total}</td>
                                        <td>${sale.tax_total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesReport;