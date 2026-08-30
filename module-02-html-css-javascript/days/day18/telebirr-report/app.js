import { transactions } from "./transactions.js";

import {
    totalByType,
    createReceipts,
    updateTransaction,
    createReport
} from "./report.js";


// Calculate credit and debit totals
const totalCredits = totalByType(transactions, "credit");
const totalDebits = totalByType(transactions, "debit");


// Find transactions over 500 ETB
const largeTransactions = transactions.filter(
    ({ amount }) => amount > 500
);


// Create receipt strings
const receipts = createReceipts(transactions);


// Create an updated copy of the first transaction
const originalTransaction = transactions[0];

const updatedTransaction = updateTransaction(
    originalTransaction,
    300
);


// Create complete report
const report = createReport(transactions);


// Print report
console.log("===== TeleBirr Transaction Report =====");

console.log(`Total Credits: ${totalCredits} ETB`);
console.log(`Total Debits: ${totalDebits} ETB`);
console.log(`Grand Total: ${report.grandTotal} ETB`);

console.log("\n--- Transactions Over 500 ETB ---");

largeTransactions.forEach(transaction => {
    console.log(
        `${transaction.customer}: ${transaction.amount} ETB`
    );
});

console.log("\n--- Receipts ---");

receipts.forEach(receipt => {
    console.log(receipt);
});


// Demonstrate spread without mutation
console.log("\n--- Updated Transaction ---");

console.log("Original:");
console.log(originalTransaction);

console.log("Updated copy:");
console.log(updatedTransaction);
