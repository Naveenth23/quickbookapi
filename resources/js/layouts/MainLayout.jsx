import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import "./Layout.css";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    // Load persisted states from localStorage
    const [sidebarOpen, setSidebarOpen] = useState(
        localStorage.getItem("sidebarOpen") === "true"
    );
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    // Persist theme and sidebar state
    useEffect(() => {
        localStorage.setItem("sidebarOpen", sidebarOpen);
    }, [sidebarOpen]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <div className={`layout-container ${theme}`}>
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                theme={theme}
                setTheme={setTheme}
            />

            <div className="layout-main">
                <Topbar
                    setIsOpen={setSidebarOpen}
                    theme={theme}
                    setTheme={setTheme}
                />
                <div className="layout-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
