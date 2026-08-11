const {
    subtotal,
    discountBy,
    withVat,
    makeReceiptMaker
} = require("./order");

const memberDiscount = discountBy(0.10);

const makeReceipt = makeReceiptMaker();

function createReceipt(prices, isMember = false) {
    const subTotal = subtotal(...prices);

    const discountedTotal = isMember
        ? memberDiscount(subTotal)
        : subTotal;

    const totalWithVat = withVat(discountedTotal);

    return makeReceipt(totalWithVat);
}

console.log(
    createReceipt([200, 150, 100])
);

console.log(
    createReceipt([300, 250], true)
);

console.log(
    createReceipt([500, 200, 150])
);