import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const dispatch = useDispatch();
    const { token, loading, error } = useSelector((s) => s.auth);
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    if (token) return <Navigate to="/" replace />;

    const submit = (e) => {
        e.preventDefault();
        dispatch(login(form));
    };

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center position-relative overflow-hidden bg-light">
            {/* Background decorative elements */}
            <div className="position-absolute top-0 start-0 w-100 h-100">
                <div className="position-absolute bg-primary rounded-circle opacity-25"
                    style={{ width: "300px", height: "300px", top: "-100px", left: "-100px" }}>
                </div>
                <div className="position-absolute bg-info rounded-circle opacity-25"
                    style={{ width: "200px", height: "200px", bottom: "-80px", right: "-80px" }}>
                </div>
                <div className="position-absolute bg-warning rounded-circle opacity-25"
                    style={{ width: "100px", height: "100px", bottom: "50px", left: "60px" }}>
                </div>
            </div>

            {/* Card */}
            <div className="card shadow-lg p-4" style={{ width: "380px", zIndex: 2 }}>
                <div className="text-center mb-4">
                    <img
                        src="/logo.png"
                        alt="BillingBook Logo"
                        style={{ width: "150px"}}
                    />
                    <h4 className="fw-bold text-primary">Welcome to BillingBook</h4>
                    <p className="text-muted small">Sign in to manage your business easily</p>
                </div>

                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-3 position-relative">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <span
                            className="position-absolute top-50 end-0 translate-middle-y pe-3"
                            style={{ cursor: "pointer", color: "#6c757d" }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 mb-3 text-center small">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <small className="text-muted">
                        Don’t have an account?{" "}
                        <a href="/register" className="text-primary fw-semibold">
                            Register
                        </a>
                    </small>
                </div>
            </div>
        </div>
    );
}
