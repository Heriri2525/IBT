async function loadDetails() {
    try {
        const res = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const posts = await res.json();

        const firstTwoPosts = posts.slice(0, 2);

        const details = await Promise.all(
            firstTwoPosts.map(async post => {
                const response = await fetch(
                    `https://jsonplaceholder.typicode.com/posts/${post.id}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                return response.json();
            })
        );

        console.log("First two post details:");
        console.log(details);
    } catch (err) {
        console.error("Could not load details:", err);
    }
}

loadDetails();