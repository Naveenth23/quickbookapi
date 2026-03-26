import React from "react";
import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";

/**
 * 🌐 OverlayLoader
 * Displays a full-page semi-transparent overlay with a blurred background.
 * Perfect for global data loading, form submissions, or blocking UI actions.
 */
const OverlayLoader = ({ message = "Loading...", show = false }) => {
    if (!show) return null;

    return (
        <div
            className="overlay-loader position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
            style={{
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(4px)",
                zIndex: 2000,
            }}
        >
            <Loader2
                className="spin text-primary mb-3"
                size={40}
                strokeWidth={2.5}
            />
            <p className="fw-semibold text-dark mb-0">{message}</p>
        </div>
    );
};

OverlayLoader.propTypes = {
    message: PropTypes.string,
    show: PropTypes.bool.isRequired,
};

export default OverlayLoader;
