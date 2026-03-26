import React, { useState, useEffect } from 'react';
import api from "../../api/axios";


const StockReport = () => {
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        const fetchStockReport = async () => {
            try {
                const response = await api.get('/reports/stock');
                setReportData(response.data);
            } catch (error) {
                console.error('Failed to fetch stock report', error);
            }
        };

        fetchStockReport();
    }, []);

    if (!reportData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800">Stock Report</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Stock Details</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Reorder Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.category ? product.category.name : 'N/A'}</td>
                                        <td>{product.stock}</td>
                                        <td>{product.reorder_level}</td>
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

export default StockReport;