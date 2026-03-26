import { toast } from "react-toastify";

/**
 * Reusable toast notification handler
 *
 * @param {object|string} response - Can be axios response or string message
 * @param {"success"|"error"|"info"|"warning"} [type="success"] - Toast type
 * @param {object} [options={}] - Custom toastify config (optional)
 */
export const showToast = (response, type = "success", options = {}) => {
    let message = "";

    // ✅ If API response object
    if (response?.data) {
        message =
            response.data.message ||
            response.data.msg ||
            response.data.error ||
            "Operation completed.";
    }

    // ✅ If Axios error object
    else if (response?.response?.data) {
        message =
            response.response.data.message ||
            response.response.data.error ||
            "Something went wrong!";
    }

    // ✅ If just a plain string
    else if (typeof response === "string") {
        message = response;
    }

    // ✅ Fallback
    if (!message) message = "Action completed.";

    // ✅ Show toast
    switch (type) {
        case "error":
            toast.error(message, { theme: "colored", ...options });
            break;
        case "info":
            toast.info(message, { theme: "colored", ...options });
            break;
        case "warning":
            toast.warning(message, { theme: "colored", ...options });
            break;
        default:
            toast.success(message, { theme: "colored", ...options });
            break;
    }
};
