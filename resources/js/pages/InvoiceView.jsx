import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function InvoiceView() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    const currency = (v) =>
        "₹" +
        Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

    const calc = {
        cgst: (qty, price, rate) => (qty * price * rate) / 100 / 2,
        sgst: (qty, price, rate) => (qty * price * rate) / 100 / 2,
    };

    useEffect(() => {
        api.get(`/invoices/${id}`).then(({ data }) => {
            setInvoice(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="card p-4">Loading...</div>;
    if (!invoice) return <div className="card p-4">Not found</div>;

    const business = invoice.business || {};
    const customer = invoice.customer || {};
    const items = invoice.items || [];

    const downloadPdf = async () => {
        try {
            const response = await api.get(`/invoices/${id}/download`, {
                responseType: "blob",
                headers: { Accept: "application/pdf" },
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `Invoice-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
            alert("Unable to download PDF");
        }
    };

    const printInvoice = async () => {
        try {
            const response = await api.get(`/invoices/${id}/print`, {
                responseType: "blob",
                headers: { Accept: "application/pdf" },
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const iframe = document.createElement("iframe");
            iframe.style.position = "fixed";
            iframe.style.right = "0";
            iframe.style.bottom = "0";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.src = url;

            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                // cleanup after printing
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    document.body.removeChild(iframe);
                }, 2000);
            };
        } catch (error) {
            alert("Unable to print PDF");
            console.error(error);
        }
    };
    return (
        <div className="container my-4">
            {/* ACTION BUTTONS */}
            <div className="d-flex justify-content-end gap-2 mb-3 no-print">
                <Link
                    to="/invoices"
                    className="btn btn-outline-secondary btn-sm"
                >
                    ← Back
                </Link>

                {/* Download Button */}
                <button
                    className="btn btn-sm btn-primary ms-2"
                    onClick={downloadPdf}
                >
                    Download PDF
                </button>

                {/* Print Button */}
                <button
                    className="btn btn-sm btn-outline-primary ms-2"
                    onClick={printInvoice}
                >
                    Print Invoice
                </button>
            </div>

            <div className="p-4 border rounded bg-white">
                {/* HEADER */}
                <table className="w-100">
                    <tbody>
                        <tr>
                            <td style={{ width: "60%" }}>
                                {business.logo && (
                                    <img
                                        src={`/storage/${business.logo}`}
                                        alt="Logo"
                                        height="60"
                                    />
                                )}
                                <h3 className="mt-2">{business.name}</h3>
                                <div>{business.address}</div>
                                {business.phone && (
                                    <div>Phone: {business.phone}</div>
                                )}
                                {business.gst_number && (
                                    <div>GSTIN: {business.gst_number}</div>
                                )}
                            </td>
                            <td className="text-end align-top">
                                <div className="bg-primary text-white p-2 fw-bold">
                                    TAX INVOICE
                                </div>
                                <div className="mt-2">
                                    <strong>Invoice No:</strong>{" "}
                                    {invoice.invoice_number}
                                </div>
                                <div>
                                    <strong>Date:</strong>{" "}
                                    {invoice.invoice_date}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* CUSTOMER INFO */}
                <table className="table mt-4">
                    <tbody>
                        <tr>
                            <td style={{ width: "60%" }}>
                                <strong>Bill To:</strong>
                                <br />
                                {customer.name} <br />
                                {customer.phone && (
                                    <>
                                        Phone: {customer.phone}
                                        <br />
                                    </>
                                )}
                                {customer.gst_number && (
                                    <>GSTIN: {customer.gst_number}</>
                                )}
                            </td>
                            <td>
                                <strong>Place of Supply:</strong>
                                <br />
                                {business.place_of_supply || "Same State"}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ITEMS */}
                <table className="table table-bordered text-center">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th>HSN/SAC</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Taxable</th>
                            <th>CGST</th>
                            <th>SGST</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((row, i) => {
                            const base = row.qty * row.price;
                            const cgst = calc.cgst(
                                row.qty,
                                row.price,
                                row.tax_rate
                            );
                            const sgst = calc.sgst(
                                row.qty,
                                row.price,
                                row.tax_rate
                            );
                            const lineTotal = base + cgst + sgst;

                            return (
                                <tr key={row.id || i}>
                                    <td>{i + 1}</td>
                                    <td>{row.product?.name}</td>
                                    <td>{row.product?.hsn_code || ""}</td>
                                    <td>{row.qty}</td>
                                    <td>{currency(row.price)}</td>
                                    <td>{currency(base)}</td>
                                    <td>{currency(cgst)}</td>
                                    <td>{currency(sgst)}</td>
                                    <td>{currency(lineTotal)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* SUMMARY */}
                <table className="table mt-3">
                    <tbody>
                        <tr>
                            <td className="text-end fw-bold">Subtotal:</td>
                            <td className="text-end">
                                {currency(invoice.total_amount)}
                            </td>
                        </tr>

                        {Number(invoice.discount_amount) > 0 && (
                            <tr>
                                <td className="text-end fw-bold">Discount:</td>
                                <td className="text-end">
                                    -{currency(invoice.discount_amount)}
                                </td>
                            </tr>
                        )}

                        <tr>
                            <td className="text-end fw-bold">Taxable Value:</td>
                            <td className="text-end">
                                {currency(invoice.taxable_amount)}
                            </td>
                        </tr>

                        <tr>
                            <td className="text-end fw-bold">CGST + SGST:</td>
                            <td className="text-end">
                                {currency(invoice.tax_amount)}
                            </td>
                        </tr>

                        {Number(invoice.shipping_charge) > 0 && (
                            <tr>
                                <td className="text-end fw-bold">Shipping:</td>
                                <td className="text-end">
                                    {currency(invoice.shipping_charge)}
                                </td>
                            </tr>
                        )}

                        <tr>
                            <td className="text-end fw-bold">Round Off:</td>
                            <td className="text-end">
                                {currency(invoice.round_off)}
                            </td>
                        </tr>

                        <tr className="table-secondary">
                            <td className="text-end fw-bold fs-5">
                                Grand Total:
                            </td>
                            <td className="text-end fw-bold fs-5">
                                {currency(invoice.payable_amount)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* FOOTER */}
                <p className="mt-3 fw-bold">Terms & Conditions:</p>
                <ul className="small">
                    <li>Goods once sold will not be taken back.</li>
                    <li>Subject to jurisdiction of India.</li>
                </ul>

                <div className="text-end mt-4">
                    <strong>For {business.name}</strong>
                    <br />
                    <br />
                    <br />
                    Authorized Signature
                </div>
            </div>

            <style>
                {`
          @media print {
            .no-print { display: none !important; }
            aside, nav { display: none !important; }
            body { background: #fff; }
            main, .container {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
            }
          }
        `}
            </style>
        </div>
    );
}
