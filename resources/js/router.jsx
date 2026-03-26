import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Parties from "./components/parties/PartiesList";
import AddParty from "./pages/Parties";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Invoices from "./pages/Invoices";
import Inventory from "./components/inventory/Inventory";
import InvoiceBuilder from "./pages/InvoiceBuilder";
import InvoiceView from "./pages/InvoiceView";
import Staff from "./pages/Staff";
import SalesInvoice from "./components/sales/SalesInvoices";
import SalesInvoiceView from "./components/sales/SalesInvoiceView";

import BusinessSettings from "./pages/BusinessSettings";
import POS from "./pages/POS";
import POSLayout from "./layouts/POSLayout";
import SalesReport from "./pages/Reports/Sales";
import PurchasesReport from "./pages/Reports/Purchase";
import StockReport from "./pages/Reports/Stock";
import CustomersReport from "./pages/Reports/Customers";
import SuppliersReport from "./pages/Reports/Suppliers";
import CreateSalesInvoice from "./components/sales/SalesCreateInvoice";
import ProductView from "./pages/ProductView";
import ProductEdit from "./pages/ProductEdit";

const router = createBrowserRouter([
    { path: "/login", element: <Login /> },

    // ✅ Dashboard routes with Sidebar + Topbar
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "parties", element: <Parties /> },
            { path: "add-party", element: <AddParty /> },

            // ✅ Invoice CRUD pages
            { path: "invoices", element: <Invoices /> },
            { path: "invoices/create", element: <InvoiceBuilder /> },
            { path: "products/:productUuid", element: <ProductView /> },
            { path: "products/:productUuid/edit", element: <ProductEdit /> },
            { path: "invoices/:id", element: <InvoiceView /> },
            { path: "sales-invoice", element: <SalesInvoice /> },
            { path: "/sales-invoices/:invoiceId", element: <SalesInvoiceView /> },
            { path: "/create-sales-invoice", element: <CreateSalesInvoice /> },

            {
                path: "staff",
                element: (
                    <ProtectedRoute roles={["owner"]}>
                        <Staff />
                    </ProtectedRoute>
                ),
            },
            {
                path: "settings/business",
                element: (
                    <ProtectedRoute roles={["owner"]}>
                        <BusinessSettings />
                    </ProtectedRoute>
                ),
            },
            { path: "inventory", element: <Inventory /> },
            { path: "reports/sales", element: <SalesReport /> },
            { path: "reports/purchases", element: <PurchasesReport /> },
            { path: "reports/stock", element: <StockReport /> },
            { path: "reports/customers", element: <CustomersReport /> },
            { path: "reports/suppliers", element: <SuppliersReport /> },
        ],
    },

    // ✅ POS route OUTSIDE layout → FULL SCREEN
    {
        path: "/pos",
        element: (
            <ProtectedRoute>
                <POSLayout>
                    <POS />
                </POSLayout>
            </ProtectedRoute>
        ),
    },

    { path: "*", element: <NotFound /> },
]);

export default router;
