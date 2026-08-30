const API = "https://open.er-api.com/v6/latest/ETB";



const state = {
    base: "ETB",
    rates: {},
    watchlist: [],
    amount: 100,
    currency: "USD"
};



const status = document.querySelector("#status");
const select = document.querySelector("#currency");
const form = document.querySelector("#convert-form");
const amountInput = document.querySelector("#amount");
const result = document.querySelector("#result");
const watchButton = document.querySelector("#watch");
const watchUl = document.querySelector("#watchlist");



const KEY = "birrwatch";


// Save user data
function save() {

    localStorage.setItem(
        KEY,
        JSON.stringify({
            watchlist: state.watchlist,
            currency: state.currency,
            amount: state.amount
        })
    );
}


function load() {

    const saved = localStorage.getItem(KEY);

    if (!saved) {
        return;
    }

    try {

        const data = JSON.parse(saved);

        if (Array.isArray(data.watchlist)) {
            state.watchlist = data.watchlist;
        }

        if (typeof data.currency === "string") {
            state.currency = data.currency;
        }

        if (typeof data.amount === "number") {
            state.amount = data.amount;
        }

    } catch (error) {

        console.error("Could not load saved data:", error);

        localStorage.removeItem(KEY);
    }
}



async function loadRates() {

    status.textContent = "Loading rates...";

    try {

        const res = await fetch(API);

        if (!res.ok) {
            throw new Error("HTTP " + res.status);
        }

        const data = await res.json();

        if (data.result !== "success") {
            throw new Error("API request failed");
        }

        state.rates = data.rates;

        status.textContent = "";

        render();

    } catch (error) {

        console.error("Error loading rates:", error);

        status.textContent = "Could not load rates.";
    }
}



function render() {

    renderCurrencies();

    renderWatchlist();
}



function renderCurrencies() {

    const codes = Object.keys(state.rates);

    select.innerHTML = codes
        .map(currency => {
            return `<option value="${currency}">${currency}</option>`;
        })
        .join("");

    if (state.rates[state.currency]) {

        select.value = state.currency;

    } else {

        state.currency = codes[0];

        select.value = state.currency;
    }
}



form.addEventListener("submit", function (event) {

    event.preventDefault();

    const amt = Number(amountInput.value);

    if (!amt || amt <= 0 || Number.isNaN(amt)) {

        result.textContent = "Enter a valid amount.";

        return;
    }

    state.amount = amt;

    state.currency = select.value;

    const rate = state.rates[state.currency];

    if (rate === undefined) {

        result.textContent = "Currency rate is not available.";

        return;
    }

    const convertedAmount = (amt * rate).toFixed(2);

    result.textContent =
        `${amt} ETB = ${convertedAmount} ${state.currency}`;

    save();

    render();
});



watchButton.addEventListener("click", function () {

    const currency = select.value;

    if (!currency) {
        return;
    }

    if (state.watchlist.includes(currency)) {

        return;
    }

    state.watchlist.push(currency);

    save();

    renderWatchlist();
});



function renderWatchlist() {

    if (state.watchlist.length === 0) {

        watchUl.innerHTML = "<li>No currencies yet</li>";

        return;
    }

    watchUl.innerHTML = state.watchlist
        .map(currency => {

            const rate = state.rates[currency];

            // If API doesn't contain the saved currency
            if (rate === undefined) {

                return `
                    <li data-c="${currency}">
                        ${currency}
                        <button class="rm" type="button">×</button>
                    </li>
                `;
            }

            return `
                <li data-c="${currency}">
                    <span>
                        1 ETB = ${rate} ${currency}
                    </span>

                    <button
                        class="rm"
                        type="button"
                    >
                        ×
                    </button>
                </li>
            `;
        })
        .join("");
}



watchUl.addEventListener("click", function (event) {

    // Make sure the clicked element is a remove button
    if (!event.target.matches(".rm")) {

        return;
    }

    const listItem = event.target.closest("li");

    const currency = listItem.dataset.c;

    state.watchlist = state.watchlist.filter(
        item => item !== currency
    );

    // Save
    save();

    // Render
    renderWatchlist();
});



select.addEventListener("change", function () {

    state.currency = select.value;

    save();
});



async function init() {

    // Load saved state first
    load();

    // Fetch live rates
    await loadRates();

    // Render everything
    render();

    // Put saved amount back into input
    amountInput.value = state.amount;
}


init();