// Calculate the total amount for a specific transaction type
export const totalByType = (transactions, type) => {
    return transactions
        .filter(transaction => transaction.type === type)
        .reduce((sum, { amount }) => sum + amount, 0);
};


// Create formatted receipt strings
export const createReceipts = (transactions) => {
    return transactions.map(({ customer, amount }) => {
        return `${customer}: ${amount} ETB`;
    });
};


// Update a transaction without changing the original object
export const updateTransaction = (transaction, newAmount) => {
    return {
        ...transaction,
        amount: newAmount
    };
};


// Create the complete report
export const createReport = (transactions) => {
    const credits = totalByType(transactions, "credit");
    const debits = totalByType(transactions, "debit");

    const receipts = createReceipts(transactions);

    const grandTotal = transactions.reduce(
        (sum, { amount }) => sum + amount,
        0
    );

    return {
        credits,
        debits,
        grandTotal,
        receipts
    };
};

