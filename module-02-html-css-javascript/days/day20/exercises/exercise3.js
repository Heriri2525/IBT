async function testWrongUrl() {
    try {
        const res = await fetch(
            "https://jsonplaceholder.typicode.com/this-url-does-not-exist"
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        console.log(data);
    } catch (err) {
        console.log("Wrong URL error caught:", err.message);
    }
}

async function test404() {
    try {
        const res = await fetch(
            "https://jsonplaceholder.typicode.com/posts/999999"
        );

        console.log("HTTP status:", res.status);
        console.log("res.ok:", res.ok);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        console.log(data);
    } catch (err) {
        console.log("404 error caught:", err.message);
    }
}

testWrongUrl();
test404();