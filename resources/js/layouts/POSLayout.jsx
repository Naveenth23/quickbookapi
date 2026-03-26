export default function POSLayout({ children }) {
    return (
        <div
            className="pos-fullscreen"
            style={{ background: "#f8f9fa", minHeight: "100vh" }}
        >
            {children}
        </div>
    );
}
