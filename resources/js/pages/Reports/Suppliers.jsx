import React, { useState, useEffect } from 'react';
import api from "../../api/axios";


const SuppliersReport = () => {
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        const fetchSuppliersReport = async () => {
            try {
                const response = await api.get('/reports/suppliers');
                setReportData(response.data);
            } catch (error) {
                console.error('Failed to fetch suppliers report', error);
            }
        };

        fetchSuppliersReport();
    }, []);

    if (!reportData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800">Suppliers Report</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Suppliers Details</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Supplier</th>
                                    <th>Total Spent</th>
                                    <th>Purchases</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.suppliers.map(supplier => (
                                    <tr key={supplier.id}>
                                        <td>{supplier.name}</td>
                                        <td>${supplier.purchases.reduce((acc, purchase) => acc + purchase.total, 0)}</td>
                                        <td>{supplier.purchases.length}</td>
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

export default SuppliersReport;