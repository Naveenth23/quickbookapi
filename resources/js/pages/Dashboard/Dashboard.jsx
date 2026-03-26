import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Reusable Stat Card Component
const StatCard = ({ title, value, color }) => (
  <div className={`col-xl-4 col-md-6 mb-4`}>
    <div className={`card border-left-${color} shadow h-100 py-2`}>
      <div className="card-body">
        <div className="row no-gutters align-items-center">
          <div className="col mr-2">
            <div
              className={`text-xs font-weight-bold text-${color} text-uppercase mb-1`}
            >
              {title}
            </div>
            <div className="h5 mb-0 font-weight-bold text-gray-800">
              ${value?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ✅ Reusable Chart Card Component
const ChartCard = ({ title, children }) => (
  <div className="card shadow mb-4">
    <div className="card-header py-3">
      <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
    </div>
    <div className="card-body">{children}</div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setError("Unable to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  if (!data) {
    return <div className="text-center mt-5">No data available.</div>;
  }

  // ✅ Chart Data Config
  const salesChartData = {
    labels: data.sales_over_time?.map((d) => d.date),
    datasets: [
      {
        label: "Sales ($)",
        data: data.sales_over_time?.map((d) => d.sales),
        borderColor: "rgba(75, 192, 192, 0.8)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const expenseChartData = {
    labels: data.expense_breakdown?.map((d) => d.category),
    datasets: [
      {
        label: "Expenses ($)",
        data: data.expense_breakdown?.map((d) => d.total),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Dashboard</h1>

      {/* ✅ Stat Cards */}
      <div className="row">
        <StatCard title="Total Revenue" value={data.total_revenue} color="primary" />
        <StatCard title="Total Expenses" value={data.total_expenses} color="danger" />
        <StatCard title="Net Profit" value={data.net_profit} color="success" />
      </div>

      {/* ✅ Charts */}
      <div className="row">
        <div className="col-lg-7">
          <ChartCard title="Sales Over Time">
            <Line data={salesChartData} options={chartOptions} />
          </ChartCard>
        </div>

        <div className="col-lg-5">
          <ChartCard title="Expense Breakdown">
            <Bar data={expenseChartData} options={chartOptions} />
          </ChartCard>
        </div>
      </div>

      {/* ✅ Low Stock Table */}
      <ChartCard title="Low Stock Products">
        <div className="table-responsive">
          <table className="table table-bordered table-striped" width="100%" cellSpacing="0">
            <thead className="thead-light">
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Reorder Level</th>
              </tr>
            </thead>
            <tbody>
              {data.low_stock_products?.length > 0 ? (
                data.low_stock_products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td>{product.reorder_level}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-3">
                    All products are sufficiently stocked 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

export default Dashboard;
