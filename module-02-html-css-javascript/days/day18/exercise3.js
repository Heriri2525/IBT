// exercise3.js

const customer = {
  name: "Hermela",
  city: "Addis Ababa",
  balance: 1500
};

const { name, city } = customer;

console.log("Name:", name);
console.log("City:", city);

function greet({ name }) {
  console.log(`Hello, ${name}!`);
}

greet(customer);