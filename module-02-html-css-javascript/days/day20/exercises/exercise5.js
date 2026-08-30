const status = document.querySelector("#status");
const list = document.querySelector("#list");
const retryButton = document.querySelector("#retry");

async function loadPosts() {
    status.textContent = "Loading...";
    list.innerHTML = "";
    retryButton.hidden = true;

    try {
        const res = await fetch(
            "https://jsonplaceholder.typicode.com/posts?_limit=5"
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const posts = await res.json();

        posts.forEach(post => {
            const li = document.createElement("li");

            li.textContent = post.title;

            list.append(li);
        });

        status.textContent = "Posts loaded successfully.";
    } catch (err) {
        status.textContent =
            "Could not load the posts. Please try again.";

        console.error(err);

        retryButton.hidden = false;
    }
}

retryButton.addEventListener("click", loadPosts);

loadPosts();