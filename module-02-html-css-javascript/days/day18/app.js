import { addVat, VAT } from "./money.js";

const price = 500;

console.log("VAT:", VAT * 100 + "%");
console.log("Original price:", price, "ETB");
console.log("Price with VAT:", addVat(price), "ETB");