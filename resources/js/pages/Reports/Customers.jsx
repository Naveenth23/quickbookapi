import React, { useState, useEffect } from 'react';
import api from "../../api/axios";


const CustomersReport = () => {
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        const fetchCustomersReport = async () => {
            try {
                const response = await api.get('/reports/customers');
                setReportData(response.data);
            } catch (error) {
                console.error('Failed to fetch customers report', error);
            }
        };

        fetchCustomersReport();
    }, []);

    if (!reportData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800">Customers Report</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Customers Details</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Total Revenue</th>
                                    <th>Invoices</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.customers.map(customer => (
                                    <tr key={customer.id}>
                                        <td>{customer.name}</td>
                                        <td>${customer.invoices.reduce((acc, invoice) => acc + invoice.total, 0)}</td>
                                        <td>{customer.invoices.length}</td>
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

export default CustomersReport;