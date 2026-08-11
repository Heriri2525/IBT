const bill = Number(450);
const partySize = 3;

let tipRate;

if (bill > 300) {
    tipRate = 0.10;
} else {
    tipRate = 0.05;
}

const tip = bill * tipRate;
const total = bill + tip;
const perPerson = total / partySize;

let serviceFee;

const paymentMethod = "TeleBirr";

switch (paymentMethod) {
    case "TeleBirr":
        serviceFee = 5;
        break;

    case "CBE Birr":
        serviceFee = 4;
        break;

    default:
        serviceFee = 0;
}

const finalTotal = total + serviceFee;
const finalPerPerson = finalTotal / partySize;

console.log(
    `Bill: ${bill.toFixed(2)} ETB`
);

console.log(
    `Tip: ${tip.toFixed(2)} ETB`
);

console.log(
    `Service fee: ${serviceFee.toFixed(2)} ETB`
);

console.log(
    `Total: ${finalTotal.toFixed(2)} ETB`
);

console.log(
    `Each person pays: ${finalPerPerson.toFixed(2)} ETB`
);