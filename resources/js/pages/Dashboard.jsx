import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Dashboard() {
    const [stats, setStats] = useState({
        toCollect: 0,
        toPay: 0,
        totalBalance: 0,
    });
    const [transactions, setTransactions] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], totals: [] });
    const [lastUpdated, setLastUpdated] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/dashboard", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const { stats, transactions, chart, last_updated } = res.data;

            setStats(stats);
            setTransactions(transactions);
            setChartData(chart);
            setLastUpdated(last_updated);
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: "Sales Amount (₹)",
                data: chartData.totals,
                borderColor: "#007bff",
                backgroundColor: "rgba(0,123,255,0.1)",
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (val) => `₹${val}`,
                },
            },
        },
    };

    return (
        <div className="container-fluid bg-light min-vh-100 py-3 px-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">Dashboard</h4>
                <button className="btn btn-primary">Book Demo</button>
            </div>

            {/* Promo Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-bold mb-2">Book Free Demo</h6>
                                <p className="text-muted small mb-2">
                                    Get a personalised tour from our solution expert
                                </p>
                                <button className="btn btn-outline-primary btn-sm">
                                    Book Demo Now →
                                </button>
                            </div>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png"
                                alt="demo"
                                width={80}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-bold mb-2">Style Invoice with AI</h6>
                                <p className="text-muted small mb-2">
                                    Level up your invoice styles with AI prompts
                                </p>
                                <button className="btn btn-outline-danger btn-sm">
                                    Let's Style Invoices →
                                </button>
                            </div>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/2981/2981297.png"
                                alt="invoice"
                                width={80}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Business Overview */}
            <h6 className="fw-bold mb-3">Business Overview</h6>
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <h6 className="text-success fw-semibold mb-1">To Collect</h6>
                            <h4 className="fw-bold">₹ {stats.toCollect.toLocaleString()}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <h6 className="text-danger fw-semibold mb-1">To Pay</h6>
                            <h4 className="fw-bold">₹ {stats.toPay.toLocaleString()}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <h6 className="text-primary fw-semibold mb-1">
                                Total Cash + Bank Balance
                            </h6>
                            <h4 className="fw-bold">₹ {stats.totalBalance.toLocaleString()}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart.js Sales Report */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white fw-semibold">Sales Report (Last 7 Days)</div>
                <div className="card-body">
                    {chartData.labels.length > 0 ? (
                        <Line data={data} options={options} height={80} />
                    ) : (
                        <div className="text-center text-muted py-4">
                            No sales data available.
                        </div>
                    )}
                </div>
            </div>

            {/* Latest Transactions */}
            <div className="row g-3">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white fw-semibold">
                            Latest Transactions
                        </div>
                        <div className="card-body p-0">
                            <table className="table table-striped align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Txn No</th>
                                        <th>Party Name</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : transactions.length > 0 ? (
                                        transactions.map((txn, i) => (
                                            <tr key={i}>
                                                <td>{new Date(txn.date).toLocaleDateString("en-IN")}</td>
                                                <td>{txn.type}</td>
                                                <td>{txn.txn_no}</td>
                                                <td>{txn.party_name}</td>
                                                <td>₹ {txn.amount}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-4">
                                                No transactions yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white fw-semibold">
                            Today's Checklist
                        </div>
                        <div className="card-body text-center">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                                alt="coming soon"
                                width={80}
                                className="mb-3"
                            />
                            <h6 className="fw-bold mb-2">Coming Soon...</h6>
                            <p className="text-muted small">
                                Smarter daily checklist for overdue and follow-ups
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-end text-muted small mt-3">
                Last Update: {lastUpdated || new Date().toLocaleString("en-IN")}
            </div>
        </div>
    );
}
