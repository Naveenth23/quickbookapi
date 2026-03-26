import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const login = createAsyncThunk(
    "auth/login",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/login", payload);

            // Adjusted to match your Laravel response
            const token = data?.data?.token;
            const user = data?.data?.user;
            const role =
                user?.roles?.[0]?.slug ||
                user?.roles?.[0]?.name ||
                user?.businesses?.[0]?.pivot?.role_id ||
                null;

            // Store token in localStorage
            if (token) localStorage.setItem("token", token);

            return { token, user, role };
        } catch (e) {
            return rejectWithValue(
                e.response?.data || { message: "Login failed" }
            );
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    try {
        await api.post("/logout");
    } catch {}
    localStorage.removeItem("token");
});

const initialToken = localStorage.getItem("token");

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: initialToken || null,
        user: null,
        role: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.token = payload.token;
                state.user = payload.user;
                state.role = payload.role;
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload?.message || "Login failed";
            })
            .addCase(logout.fulfilled, (state) => {
                state.token = null;
                state.user = null;
                state.role = null;
            });
    },
});

export default authSlice.reducer;
