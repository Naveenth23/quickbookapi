export default function InvoiceSummary({ invoice, updateInvoice }) {
    const subtotal = invoice.items.reduce((sum, item) => {
        const amount =
            item.qty * item.price -
            item.discount +
            (item.tax / 100) * (item.qty * item.price);
        return sum + amount;
    }, 0);

    const balance = subtotal - invoice.amountReceived;

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                    <span>Taxable Amount</span>
                    <span>₹ {subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span>Total Amount</span>
                    <strong>₹ {subtotal.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span>Amount Received</span>
                    <input
                        type="number"
                        className="form-control form-control-sm w-50"
                        value={invoice.amountReceived}
                        onChange={(e) =>
                            updateInvoice("amountReceived", e.target.value)
                        }
                    />
                </div>
                <div className="d-flex justify-content-between">
                    <span className="text-success">Balance Amount</span>
                    <span className="text-success fw-bold">
                        ₹ {balance.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
