import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
    const { token, role } = useSelector((s) => s.auth);
    if (!token) return <Navigate to="/login" replace />;
    if (roles && role && !roles.includes(role))
        return <Navigate to="/" replace />;
    return children;
}
