import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { store } from "./app/store";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "../css/app.css";
import { BusinessProvider } from "./context/BusinessContext";

// ✅ Custom wrapper that applies BusinessProvider only to authenticated routes
function BusinessAwareRouter() {
    return (
        <BusinessProvider>
            <RouterProvider router={router} />
            <ToastContainer
                position="top-right"
                autoClose={2200}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />
        </BusinessProvider>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <BusinessAwareRouter />
        </Provider>
    </React.StrictMode>
);
