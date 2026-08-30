async function getEtbRate() {
    try {
        const res = await fetch(
            "https://api.exchangerate.host/latest?base=USD&symbols=ETB"
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        return data.rates.ETB;
    } catch (err) {
        console.error("Could not get exchange rate:", err);
    }
}

async function main() {
    const rate = await getEtbRate();

    if (rate) {
        console.log(`1 USD = ${rate} ETB`);
    }
}

main();