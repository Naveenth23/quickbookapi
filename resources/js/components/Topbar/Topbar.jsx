import React from "react";
import "./Topbar.css";
import { BiMenu, BiBell, BiGift, BiCalendar, BiBook } from "react-icons/bi";

export default function Topbar({ setIsOpen }) {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <button
                    className="menu-btn"
                    onClick={() => setIsOpen((p) => !p)}
                >
                    <BiMenu />
                </button>
                <h4>Dashboard</h4>
            </div>
            <div className="topbar-actions">
                <BiBell />
                <BiGift />
                <BiCalendar />
                <button className="btn-demo">
                    <BiBook /> Book Demo
                </button>
            </div>
        </header>
    );
}
