const form = document.querySelector("#add-form");
const nameInput = document.querySelector("#name");
const priceInput = document.querySelector("#price");
const list = document.querySelector("#list");
const totalEl = document.querySelector("#total");


function updateTotal() {

    const items = list.querySelectorAll("li");

    let total = 0;

    items.forEach(item => {
        total += Number(item.dataset.price);
    });

    totalEl.textContent = `${total.toFixed(2)} ETB`;
}


function addRow(name, price) {

    const li = document.createElement("li");

    li.dataset.price = price;

    const itemName = document.createElement("span");

    itemName.textContent = `${name} - ${price.toFixed(2)} ETB`;

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.classList.add("delete");

    li.append(itemName, deleteButton);

    list.append(li);
}


form.addEventListener("submit", (event) => {

    event.preventDefault();

    const name = nameInput.value.trim();

    const price = Number(priceInput.value);

    if (!name || !price || price <= 0) {
        return;
    }

    addRow(name, price);

    form.reset();

    updateTotal();
});


list.addEventListener("click", (event) => {

    if (event.target.matches(".delete")) {

        event.target.closest("li").remove();

        updateTotal();

    } else if (event.target.closest("li")) {

        event.target.closest("li").classList.toggle("bought");

    }

});