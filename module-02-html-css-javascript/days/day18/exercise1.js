const prices = [100, 250, 500, 800, 1200];

const pricesWithVat = prices.map(price => price * 1.15);

const pricesUnder1000 = pricesWithVat.filter(price => price < 1000);

const grandTotal = pricesUnder1000.reduce(
  (total, price) => total + price,
  0
);

console.log("Prices with VAT:", pricesWithVat);
console.log("Prices under 1000 ETB:", pricesUnder1000);
console.log("Grand Total:", grandTotal, "ETB");