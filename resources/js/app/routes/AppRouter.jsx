import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "../../components/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";
import POSLayout from "../../layouts/POSLayout";

// ✅ Pages
import Login from "../../pages/Login";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Products from "../../pages/Products";
import Parties from "../../pages/Parties";
import Invoices from "../../pages/Invoices";
import InvoiceBuilder from "../../pages/InvoiceBuilder";
import InvoiceView from "../../pages/InvoiceView";
import SalesInvoice from "../../pages/SalesInvoices";
import CreateSalesInvoice from "../../pages/CreateSalesInvoice";
import Staff from "../../pages/Staff";
import BusinessSettings from "../../pages/BusinessSettings";
import Inventory from "../../pages/Inventory";
import SalesReport from "../../pages/Reports/Sales";
import PurchasesReport from "../../pages/Reports/Purchase";
import StockReport from "../../pages/Reports/Stock";
import CustomersReport from "../../pages/Reports/Customers";
import SuppliersReport from "../../pages/Reports/Suppliers";
import ProductView from "../../pages/ProductView";
import ProductEdit from "../../pages/ProductEdit";
import NotFound from "../../pages/NotFound";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ✅ Public route */}
                <Route path="/login" element={<Login />} />

                {/* ✅ Protected routes inside MainLayout */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="parties" element={<Parties />} />
                    <Route path="invoices" element={<Invoices />} />
                    <Route path="invoices/create" element={<InvoiceBuilder />} />
                    <Route path="invoices/:id" element={<InvoiceView />} />
                    <Route path="/products/:productUuid" element={<ProductView />} />
                    <Route path="/products/:productUuid/edit" element={<ProductEdit />} />
                    <Route path="sales-invoice" element={<SalesInvoice />} />
                    <Route path="create-sales-invoice" element={<CreateSalesInvoice />} />

                    {/* Reports */}
                    <Route path="reports/sales" element={<SalesReport />} />
                    <Route path="reports/purchases" element={<PurchasesReport />} />
                    <Route path="reports/stock" element={<StockReport />} />
                    <Route path="reports/customers" element={<CustomersReport />} />
                    <Route path="reports/suppliers" element={<SuppliersReport />} />

                    {/* Role-specific */}
                    <Route
                        path="staff"
                        element={
                            <ProtectedRoute roles={["owner"]}>
                                <Staff />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="settings/business"
                        element={
                            <ProtectedRoute roles={["owner"]}>
                                <BusinessSettings />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* ✅ POS — Fullscreen Layout */}
                <Route
                    path="/pos"
                    element={
                        <ProtectedRoute>
                            <POSLayout>
                                <POS />
                            </POSLayout>
                        </ProtectedRoute>
                    }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
