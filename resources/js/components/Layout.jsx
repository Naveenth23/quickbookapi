import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import OverlayLoader from "../components/common/OverlayLoader";

export default function Layout() {
    const [loading, setLoading] = useState(false);
    const [sidebarState, setSidebarState] = useState({
        collapsed: false,
        mobileOpen: false,
    });

    const handleToggleSidebar = () =>
        setSidebarState((prev) => ({
            ...prev,
            collapsed: !prev.collapsed,
        }));

    const handleMobileSidebar = () =>
        setSidebarState((prev) => ({
            ...prev,
            mobileOpen: !prev.mobileOpen,
        }));

    const sidebarWidth = sidebarState.collapsed ? 80 : 260;

    return (
        <div className="app-layout d-flex">
            <OverlayLoader show={loading} message="Fetching Business Data..." />
            {/* ===== Sidebar ===== */}
            <Sidebar
                collapsed={sidebarState.collapsed}
                mobileOpen={sidebarState.mobileOpen}
                onToggle={handleToggleSidebar}
                onMobileToggle={handleMobileSidebar}
            />

            {/* ===== Content Area ===== */}
            <div
                className="content-wrapper flex-grow-1 bg-light min-vh-100"
                style={{
                    marginLeft: sidebarWidth,
                    transition: "margin-left 0.3s ease-in-out",
                }}
            >
                <Topbar onSidebarToggle={handleToggleSidebar} />
                <main className="page-wrapper p-3">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
