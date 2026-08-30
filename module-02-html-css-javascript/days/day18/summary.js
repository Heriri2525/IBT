import { withVat, format, total } from "./pricing.js";
import { orders } from "./orders.js";

const ordersWithTotals = orders.map(order => ({
  ...order,
  total: total(order.items)
}));

const largeOrders = ordersWithTotals.filter(order => order.total > 500);

const grandTotal = ordersWithTotals.reduce(
  (sum, { total }) => sum + total,
  0
);

console.log(" Addis Market Order Summary ");

ordersWithTotals.forEach(({ id, customer, total }) => {
  console.log(`Order #${id} - ${customer}: ${format(total)}`);
});

console.log("\nOrders over 500 ETB:");

largeOrders.forEach(({ id, customer, total }) => {
  console.log(`Order #${id} - ${customer}: ${format(total)}`);
});

console.log(`\nGrand Total: ${format(grandTotal)}`);