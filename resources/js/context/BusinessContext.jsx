// src/context/BusinessContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBusiness = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setBusiness(null);
            return;
        }

        try {
            setLoading(true);
            const { data } = await api.get("/business", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setBusiness(data.data);
                setError(null);
            } else {
                setBusiness(null);
                toast.warn(data.message || "No active business found.");
            }
        } catch (err) {
            if (err.response?.status === 401) {
                console.warn("⚠ Unauthorized — user must login again.");
                setBusiness(null);
            } else {
                console.error("Error fetching business:", err);
                setError(err);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch once on app load if token exists
    useEffect(() => {
        fetchBusiness();
    }, []);

    return (
        <BusinessContext.Provider
            value={{
                business,
                loading,
                error,
                refetchBusiness: fetchBusiness, // 👈 expose function for login
            }}
        >
            {children}
        </BusinessContext.Provider>
    );
};

export const useBusiness = () => useContext(BusinessContext);
