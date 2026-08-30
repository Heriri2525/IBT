const form = document.querySelector("#search-form");
const countryInput = document.querySelector("#country");
const facts = document.querySelector("#facts");

function renderFact(container, label, value) {
    const p = document.createElement("p");
    p.classList.add("fact");

    const strong = document.createElement("strong");
    strong.textContent = `${label}:`;

    const text = document.createTextNode(` ${value}`);

    p.append(strong, text);

    container.append(p);
}

async function showCountry(name) {
    facts.innerHTML = "";

    const loading = document.createElement("p");
    loading.textContent = "Loading...";

    facts.append(loading);

    try {
        const countryName = encodeURIComponent(name.trim());

        const res = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}`
        );

        if (!res.ok) {
            throw new Error("Country not found");
        }

        const countries = await res.json();

        if (!countries.length) {
            throw new Error("Country not found");
        }

        const country = countries[0];

        facts.innerHTML = "";

        const card = document.createElement("div");
        card.classList.add("country-card");

        const title = document.createElement("h2");
        title.textContent = country.name.common;

        card.append(title);

        if (country.flags && country.flags.png) {
            const flag = document.createElement("img");

            flag.src = country.flags.png;
            flag.alt = `Flag of ${country.name.common}`;
            flag.classList.add("country-flag");

            card.append(flag);
        }

        const capital =
            country.capital && country.capital.length > 0
                ? country.capital[0]
                : "N/A";

        const population = country.population
            ? country.population.toLocaleString()
            : "N/A";

        const region = country.region || "N/A";

        let currencies = "N/A";

        if (country.currencies) {
            currencies = Object.values(country.currencies)
                .map(currency => {
                    if (currency.name && currency.symbol) {
                        return `${currency.name} (${currency.symbol})`;
                    }

                    return currency.name || "Unknown";
                })
                .join(", ");
        }

        renderFact(card, "Capital", capital);
        renderFact(card, "Population", population);
        renderFact(card, "Region", region);
        renderFact(card, "Currencies", currencies);

        facts.append(card);

    } catch (err) {
        facts.innerHTML = "";

        const error = document.createElement("p");

        error.classList.add("error");
        error.textContent =
            "Country not found. Please check the country name and try again.";

        facts.append(error);

        console.error(err);
    }
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const countryName = countryInput.value.trim();

    if (!countryName) {
        return;
    }

    showCountry(countryName);
});

// Default country
showCountry("Ethiopia");