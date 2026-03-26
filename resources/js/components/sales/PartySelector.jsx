export default function PartySelector({ selectedParty, onSelect }) {
    return (
        <div
            className="border rounded p-3 text-center"
            style={{ minHeight: 120 }}
        >
            {selectedParty ? (
                <div>
                    <h6 className="mb-1">{selectedParty.name}</h6>
                    <p className="text-muted small mb-0">
                        {selectedParty.address}
                    </p>
                </div>
            ) : (
                <button
                    className="btn btn-outline-primary"
                    onClick={() =>
                        onSelect({
                            name: "Demo Party",
                            address: "Una, Himachal Pradesh",
                        })
                    }
                >
                    + Add Party
                </button>
            )}
        </div>
    );
}
