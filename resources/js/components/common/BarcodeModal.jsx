import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import * as JSPM from "jsprintmanager";
import JsBarcode from "jsbarcode";

export default function BarcodeModal({
    show,
    onClose,
    productName,
    productCode,
}) {
    const [isConnected, setIsConnected] = useState(false);
    const [printers, setPrinters] = useState([]);
    const [rows, setRows] = useState(1);
    const [selectedPrinter, setSelectedPrinter] = useState("");
    const canvasRef = useRef(null);

    // ✅ Initialize JSPrintManager when modal opens
    useEffect(() => {
        if (show) {
            try {
                JSPM.JSPrintManager.auto_reconnect = true;
                JSPM.JSPrintManager.start({
                    websocket_port: 8080,
                    websocket_secure_port: 8443,
                });

                JSPM.JSPrintManager.WS.onOpen = async () => {
                    setIsConnected(true);
                    const list = await JSPM.JSPrintManager.getPrinters();
                    setPrinters(list);
                    if (list.length > 0) setSelectedPrinter(list[0]);
                };

                JSPM.JSPrintManager.WS.onStatusChanged = () => {
                    const status = JSPM.JSPrintManager.websocket_status;
                    setIsConnected(status === JSPM.WSStatus.Open);
                };
            } catch (err) {
                console.warn("JSPM connection failed", err);
            }
        }
    }, [show]);

    // 🔁 Auto-refresh connection (detects when "Allow" clicked)
    useEffect(() => {
        const interval = setInterval(() => {
            const status = JSPM.JSPrintManager.websocket_status;
            if (status === JSPM.WSStatus.Open) {
                setIsConnected(true);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // 🧾 Generate barcode after DOM paints (useLayoutEffect ensures canvas exists)
    useLayoutEffect(() => {
        if (show && canvasRef.current) {
            const code = productCode && productCode.trim() !== "" ? productCode : "123456789012";
            try {
                JsBarcode(canvasRef.current, code, {
                    format: "CODE128",
                    displayValue: true,
                    lineColor: "#000000",
                    background: "#ffffff",
                    width: 2,
                    height: 80,
                    fontSize: 14,
                    textMargin: 5,
                });
                console.log("✅ Barcode rendered:", code);
            } catch (err) {
                console.error("Barcode generation failed:", err);
            }
        }
    }, [show, productCode]);

    // 📥 Download barcode
    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `${productName || "barcode"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    // 🖨️ Print barcode
    const handlePrint = async () => {
        if (!isConnected) {
            alert("JSPrintManager is not connected or allowed. Please allow connection.");
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const base64 = canvas.toDataURL("image/png").split(",")[1];
        const cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = new JSPM.InstalledPrinter(selectedPrinter);
        cpj.printerCommands = base64;
        cpj.formatHexValues = true;
        await cpj.sendToClient();
    };

    // ❌ Close modal and reset state
    const handleClose = () => {
        setIsConnected(false);
        setPrinters([]);
        onClose();
    };

    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.4)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title fw-semibold">Barcode</h5>
                        <button className="btn-close" onClick={handleClose}></button>
                    </div>

                    <div className="modal-body text-center">

                        {/* Always render the canvas */}
                        <div className="border p-3 bg-white mb-3">
                            <h6 className="mb-1 fw-semibold">
                                {productName || "Product"}
                            </h6>
                            <div style={{ minHeight: "100px" }}>
                                <canvas ref={canvasRef} id="barcodeCanvas"></canvas>
                            </div>
                            {!isConnected && (
                                <div className="text-muted small mt-2">
                                    Waiting for JSPrintManager connection...
                                </div>
                            )}
                        </div>

                        {/* 🔄 If not connected yet */}
                        {!isConnected && (
                            <>
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/1055/1055646.png"
                                    alt="printer"
                                    width="100"
                                    className="my-3"
                                />
                                <p className="fw-semibold">
                                    To use barcode printing, install{" "}
                                    <span className="text-primary">
                                        JS Print Manager Software
                                    </span>{" "}
                                    and click <strong>Allow</strong> when prompted.
                                </p>
                                <a
                                    href="https://www.neodynamic.com/downloads/jspm/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline-primary px-4"
                                >
                                    Download Software
                                </a>
                                <div className="mt-3 text-muted small">
                                    Please reopen this window once JS Print Manager is installed and running.
                                </div>
                            </>
                        )}

                        {/* ✅ When connected */}
                        {isConnected && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Number of rows to print per item
                                    </label>
                                    <div className="d-flex justify-content-center align-items-center gap-3">
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() =>
                                                setRows(Math.max(1, rows - 1))
                                            }
                                        >
                                            −
                                        </button>
                                        <span>{rows}</span>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => setRows(rows + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Select Printer
                                    </label>
                                    <select
                                        className="form-select text-center"
                                        value={selectedPrinter}
                                        onChange={(e) =>
                                            setSelectedPrinter(e.target.value)
                                        }
                                    >
                                        {printers.map((p, i) => (
                                            <option key={i} value={p}>
                                                {p}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="alert alert-light py-2 small">
                                    Use page size of{" "}
                                    <strong>101.6mm × 25.2mm</strong> for best results.
                                </div>

                                <div className="d-flex justify-content-center gap-3">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={handleDownload}
                                    >
                                        <i className="bi bi-download me-1"></i> Download Barcode
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={handlePrint}
                                    >
                                        <i className="bi bi-printer me-1"></i> Print Barcode
                                    </button>
                                </div>

                                <div className="mt-3">
                                    <button
                                        className="btn btn-outline-danger w-100"
                                        onClick={handleClose}
                                    >
                                        <i className="bi bi-trash3 me-1"></i> Delete Barcode
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
