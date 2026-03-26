import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSelector } from "react-redux";

export default function Staff() {
    const { role } = useSelector((s) => s.auth);

    const [staff, setStaff] = useState([]);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await api.get("/staff");
            setStaff(res.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const inviteUser = async () => {
        if (!email) return alert("Enter Email");
        try {
            const res = await api.post("/staff/invite", { email });
            alert(`Invite Sent:\n${res.data.invite_link}`);
            setEmail("");
            fetchStaff();
        } catch (e) {
            alert(e.response?.data?.message || "Failed to invite");
        }
    };

    const removeStaff = async (id) => {
        if (!confirm("Remove staff member?")) return;
        try {
            await api.delete(`/staff/${id}`);
            fetchStaff();
        } catch {
            alert("Only Owner can delete users");
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="m-0">Staff Members</h5>

                {role === "owner" && (
                    <div className="input-group" style={{ width: "280px" }}>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Invite email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={inviteUser}
                        >
                            Invite
                        </button>
                    </div>
                )}
            </div>

            <div className="card-body">
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : staff.length === 0 ? (
                    <p className="text-center text-muted">
                        No staff users found
                    </p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    {role === "owner" && (
                                        <th style={{ width: "120px" }}>
                                            Action
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || "-"}</td>
                                        <td>
                                            <span className="badge bg-secondary text-uppercase">
                                                {user.role}
                                            </span>
                                        </td>

                                        {role === "owner" && (
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        removeStaff(user.id)
                                                    }
                                                    disabled={
                                                        user.role !== "staff"
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
