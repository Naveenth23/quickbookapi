import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Package,
    FileText,
    ShoppingCart,
    Settings,
    ChevronDown,
    ChevronUp,
    Crown,
    Plus,
    Search,
    Warehouse,
    BarChart3,
    X,
    Menu,
} from "lucide-react";
import { useBusiness } from "../context/BusinessContext";
export default function Sidebar() {
    const { business } = useBusiness();
    const [openMenus, setOpenMenus] = useState({});
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    // Detect screen resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleMenu = (label) =>
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

    const toggleSidebar = () => setCollapsed(!collapsed);
    const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

    const menu = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/" },
        { label: "Parties", icon: Users, path: "/parties" },
        {
            label: "Items",
            icon: Package,
            children: [
                { label: "Inventory", path: "/inventory" },
                // { label: "Godown (Warehouse)", path: "/warehouse" },
            ],
        },
        {
            label: "Sales",
            icon: FileText,
            children: [
                { label: "Sales Invoice", path: "/sales-invoice" },
                { label: "Estimates", path: "/sales-estimates" },
            ],
        },
        {
            label: "Purchases",
            icon: ShoppingCart,
            children: [
                { label: "Purchase Bill", path: "/purchase-bill" },
                { label: "Expenses", path: "/expenses" },
            ],
        },
        { label: "POS Billing", icon: ShoppingCart, path: "/pos" },
        {
            label: "Reports",
            icon: BarChart3,
            path: "/reports",
        },
        { label: "Settings", icon: Settings, path: "/settings/business" },
    ];

    const linkClass = ({ isActive }) =>
        `d-flex align-items-center gap-2 text-decoration-none px-3 py-2 rounded-3 ${
            isActive
                ? "bg-primary text-white shadow-sm"
                : "text-light sidebar-link"
        }`;

    // Auto-close sidebar on mobile route change
    useEffect(() => {
        if (mobileOpen && isMobile) setMobileOpen(false);
    }, [window.location.pathname]);

    return (
        <>
            {/* ===== Toggle Button (for Mobile) ===== */}
            {isMobile && (
                <button
                    className="btn btn-dark position-fixed top-0 start-0 m-3 z-3 shadow-sm"
                    onClick={toggleMobileSidebar}
                >
                    <Menu size={20} />
                </button>
            )}

            {/* ===== Sidebar ===== */}
            <div
                className={`d-flex flex-column vh-100 text-white shadow-lg transition-all position-fixed top-0 ${
                    mobileOpen
                        ? "start-0"
                        : isMobile
                        ? "start-[-260px]"
                        : collapsed
                        ? "start-0 sidebar-collapsed"
                        : "start-0 sidebar-expanded"
                }`}
                style={{
                    width: collapsed ? "80px" : "260px",
                    background:
                        "linear-gradient(180deg, #0a0d1a 0%, #12182b 100%)",
                    borderRight: "1px solid rgba(255,255,255,0.1)",
                    zIndex: 1040,
                    transition: "all 0.3s ease-in-out",
                }}
            >
                {/* ===== Header ===== */}
                <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary">
                    {!collapsed && (
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="bg-primary rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                                style={{ width: 40, height: 40 }}
                            >
                                {business?.name
                                    ? business.name.charAt(0).toUpperCase()
                                    : "?"}
                            </div>
                            <div>
                                <div className="fw-semibold small text-white">
                                    {business?.name ? business.name : "?"}
                                </div>
                                <div className="text-secondary small">
                                    {business?.phone || "No phone"}
                                </div>
                            </div>
                        </div>
                    )}
                    {isMobile ? (
                        <button
                            className="btn btn-sm btn-outline-light border-0"
                            onClick={toggleMobileSidebar}
                        >
                            <X size={18} />
                        </button>
                    ) : (
                        <button
                            className="btn btn-sm btn-outline-light border-0"
                            onClick={toggleSidebar}
                        >
                            {collapsed ? "»" : "«"}
                        </button>
                    )}
                </div>

                {/* ===== Quick Actions ===== */}
                {!collapsed && (
                    <div className="p-3 border-bottom border-secondary">
                        <button className="btn btn-primary w-100 d-flex justify-content-between align-items-center mb-2 shadow-sm">
                            <span className="d-flex align-items-center gap-2">
                                <Plus size={16} /> Create Sales Invoice
                            </span>
                            <ChevronDown size={14} />
                        </button>

                        {/* <div className="bg-warning text-dark rounded py-2 px-3 d-flex justify-content-between align-items-center fw-medium shadow-sm">
              <span className="d-flex align-items-center gap-2">
                <Crown size={14} /> Buy Premium
              </span>
              <span className="badge bg-danger">11 Days Left</span>
            </div> */}
                    </div>
                )}

                {/* ===== Menu ===== */}
                <div
                    className="flex-grow-1 overflow-auto px-2 py-3"
                    style={{ scrollbarWidth: "thin" }}
                >
                    {menu.map((item, idx) => (
                        <div key={idx} className="mb-1">
                            {item.children ? (
                                <>
                                    <button
                                        className="btn btn-sm w-100 text-start text-light d-flex justify-content-between align-items-center px-3 py-2 border-0 sidebar-parent"
                                        onClick={() => toggleMenu(item.label)}
                                    >
                                        <span className="d-flex align-items-center gap-2">
                                            <item.icon size={18} />
                                            {!collapsed && item.label}
                                        </span>
                                        {!collapsed &&
                                            (openMenus[item.label] ? (
                                                <ChevronUp size={14} />
                                            ) : (
                                                <ChevronDown size={14} />
                                            ))}
                                    </button>

                                    <div
                                        className={`collapse ${
                                            openMenus[item.label] ? "show" : ""
                                        }`}
                                    >
                                        <ul className="list-unstyled ps-4 mb-0">
                                            {item.children.map(
                                                (child, subIdx) => (
                                                    <li key={subIdx}>
                                                        <NavLink
                                                            to={child.path}
                                                            className={
                                                                linkClass
                                                            }
                                                        >
                                                            {!collapsed &&
                                                                child.label}
                                                        </NavLink>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <NavLink to={item.path} className={linkClass}>
                                    <item.icon size={18} />{" "}
                                    {!collapsed && item.label}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </div>

                {/* ===== Footer ===== */}
                {!collapsed && (
                    <div className="border-top border-secondary p-3">
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text bg-transparent border-0 text-muted">
                                <Search size={14} />
                            </span>
                            <input
                                type="text"
                                className="form-control bg-transparent text-light border-0"
                                placeholder="Search 'Create Party'"
                            />
                        </div>

                        <div className="text-muted small d-flex justify-content-between">
                            <span>100% Secure</span>
                            <span>ISO Certified</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ===== Overlay (Mobile Only) ===== */}
            {isMobile && mobileOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                    style={{ zIndex: 1030 }}
                    onClick={toggleMobileSidebar}
                ></div>
            )}
        </>
    );
}
