let cart = load();

const cartList = document.querySelector("#cartList");
const cartCount = document.querySelector("#cartCount");

const addDoroButton = document.querySelector("#addDoro");
const addTibsButton = document.querySelector("#addTibs");
const clearCartButton = document.querySelector("#clearCart");

// Add Doro Wat
addDoroButton.addEventListener("click", () => {
    cart.push("Doro Wat");

    save(cart);
    displayCart();
});

// Add Tibs
addTibsButton.addEventListener("click", () => {
    cart.push("Tibs");

    save(cart);
    displayCart();
});

// Clear cart
clearCartButton.addEventListener("click", () => {
    cart = [];

    save(cart);
    displayCart();
});

// Save array to localStorage
function save(data) {
    localStorage.setItem("cart", JSON.stringify(data));
}

// Load array from localStorage
function load() {
    try {
        const raw = localStorage.getItem("cart");

        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        return [];
    }
}

// Display cart
function displayCart() {
    cartList.textContent = "";

    cart.forEach((item) => {
        const li = document.createElement("li");

        li.textContent = item;

        cartList.appendChild(li);
    });

    cartCount.textContent = `Items in cart: ${cart.length}`;
}

// Display saved cart when page loads
displayCart();