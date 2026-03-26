import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md ${
        isActive
            ? "bg-indigo-100 text-indigo-700"
            : "text-gray-700 hover:bg-gray-100"
    }`;

export default function Sidebar() {
    return (
        <div
            className="bg-dark text-white vh-100 p-3"
            style={{ width: "250px" }}
        >
            <h4 className="mb-4">BillingBook</h4>
            <ul className="nav nav-pills flex-column gap-2">
                <li>
                    <NavLink className="nav-link text-white" to="/">
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink className="nav-link text-white" to="/products">
                        Products
                    </NavLink>
                </li>
                <li>
                    <NavLink className="nav-link text-white" to="/parties">
                        Parties
                    </NavLink>
                </li>
                <li>
                    <NavLink className="nav-link text-white" to="/invoices">
                        Invoices
                    </NavLink>
                </li>
                <li>
                    <NavLink className="nav-link text-white" to="/staff">
                        Staff
                    </NavLink>
                </li>
                <li className="menu-label">Items</li>

                <li className="submenu">
                    <a href="#">Items</a>
                    <ul>
                        <li>
                            <NavLink to="/inventory" className="nav-link text-white">Inventory</NavLink>
                        </li>
                        <li>
                            <NavLink to="/categories" className="nav-link text-white">Categories</NavLink>
                        </li>
                    </ul>
                </li>
                <li>
                    <NavLink to="/pos" className="nav-link text-white">
                        POS Billing
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className="nav-link text-white"
                        to="/settings/business"
                    >
                        Business Settings
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}
