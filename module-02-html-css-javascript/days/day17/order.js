function subtotal(...prices) {
    return prices.reduce((total, price) => total + price, 0);
}

function discountBy(rate) {
    return (amount) => amount * (1 - rate);
}

function withVat(amount, rate = 0.15) {
    return amount * (1 + rate);
}

function toETB(amount) {
    return `${amount.toFixed(2)} ETB`;
}

function makeReceiptMaker() {
    let orderNumber = 0;

    return function makeReceipt(amount) {
        orderNumber++;

        return `#${orderNumber}: ${toETB(amount)}`;
    };
}

module.exports = {
    subtotal,
    discountBy,
    withVat,
    toETB,
    makeReceiptMaker
};