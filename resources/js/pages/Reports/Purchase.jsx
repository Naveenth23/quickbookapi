import React, { useState, useEffect } from 'react';
import api from "../../api/axios";


const PurchasesReport = () => {
    const [reportData, setReportData] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchPurchasesReport = async () => {
        try {
            const response = await api.get('/reports/purchases', {
                params: { start_date: startDate, end_date: endDate },
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Failed to fetch purchases report', error);
        }
    };

    useEffect(() => {
        fetchPurchasesReport();
    }, []);

    const handleFilter = () => {
        fetchPurchasesReport();
    };

    if (!reportData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800">Purchases Report</h1>

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
                    <h6 className="m-0 font-weight-bold text-primary">Purchases Summary</h6>
                </div>
                <div className="card-body">
                    <p><strong>Total Purchases:</strong> ${reportData.total_purchases}</p>
                </div>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Purchases Details</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Purchase ID</th>
                                    <th>Supplier</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.purchases.map(purchase => (
                                    <tr key={purchase.id}>
                                        <td>{purchase.id}</td>
                                        <td>{purchase.supplier.name}</td>
                                        <td>{new Date(purchase.created_at).toLocaleDateString()}</td>
                                        <td>${purchase.total}</td>
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

export default PurchasesReport;