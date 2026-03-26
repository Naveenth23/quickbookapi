export default function InvoiceNotes({ notes, onChange }) {
    return (
        <div>
            <button className="btn btn-link p-0 mb-2">+ Add Notes</button>
            <textarea
                className="form-control mb-3"
                rows="4"
                value={notes}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Terms and Conditions"
            />
            <small className="text-muted">
                1. Goods once sold will not be taken back or exchanged
                <br />
                2. All disputes are subject to [ENTER_YOUR_CITY_NAME]
                jurisdiction only
            </small>
        </div>
    );
}
