export const calculateTotals = (invoices = []) => {
    const parseAmount = (val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
    };

    let total = 0, paid = 0, unpaid = 0;

    for (const inv of invoices) {
        const amt = parseAmount(inv.total_amount);
        total += amt;
        if (inv.payment_status?.toLowerCase() === "paid") paid += amt;
        else unpaid += amt;
    }

    return { total, paid, unpaid };
};
