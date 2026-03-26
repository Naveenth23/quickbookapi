import React, { useState } from "react";

export default function InvoiceItemTable({ items, onUpdate }) {
    const [localItems, setLocalItems] = useState(items || []);

    const addItem = () => {
        const newItem = {
            id: Date.now(),
            name: "",
            hsn: "",
            qty: 1,
            price: 0,
            discount: 0,
            tax: 0,
        };
        const updated = [...localItems, newItem];
        setLocalItems(updated);
        onUpdate(updated);
    };

    const handleChange = (id, field, value) => {
        const updated = localItems.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setLocalItems(updated);
        onUpdate(updated);
    };

    return (
        <div className="table-responsive border rounded">
            <table className="table align-middle table-bordered mb-0">
                <thead className="table-light">
                    <tr>
                        <th>No</th>
                        <th>Item/Service</th>
                        <th>HSN/SAC</th>
                        <th>Qty</th>
                        <th>Price/Item (₹)</th>
                        <th>Discount</th>
                        <th>Tax</th>
                        <th>Amount (₹)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {localItems.map((item, index) => {
                        const amount =
                            item.qty * item.price -
                            item.discount +
                            (item.tax / 100) * (item.qty * item.price);
                        return (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Add Item"
                                        value={item.name}
                                        onChange={(e) =>
                                            handleChange(
                                                item.id,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={item.hsn}
                                        onChange={(e) =>
                                            handleChange(
                                                item.id,
                                                "hsn",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={item.qty}
                                        onChange={(e) =>
                                            handleChange(
                                                item.id,
                                                "qty",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={item.price}
                                        onChange={(e) =>
                                            handleChange(
                                                item.id,
                                                "price",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={item.discount}
                                        onChange={(e) =>
                                            handleChange(
                                                item.id,
                                                "discount",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={item.tax}
                                        onChange={(e) =>
                                            handleChange(
                                                item.id,
                                                "tax",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>{amount.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                            const filtered = localItems.filter(
                                                (i) => i.id !== item.id
                                            );
                                            setLocalItems(filtered);
                                            onUpdate(filtered);
                                        }}
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td colSpan="9" className="text-center">
                            <button
                                className="btn btn-outline-primary"
                                onClick={addItem}
                            >
                                + Add Item
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
