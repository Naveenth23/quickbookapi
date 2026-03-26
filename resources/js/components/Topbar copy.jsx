import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Topbar() {
    const dispatch = useDispatch();
    return (
        <nav className="navbar navbar-light bg-white border-bottom px-3">
            <span className="navbar-brand mb-0 h4">Dashboard</span>
            <button
                className="btn btn-sm btn-danger"
                onClick={() => dispatch(logout())}
            >
                Logout
            </button>
        </nav>
    );
}
