async function loadUsers() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const users = await res.json();

        renderUsers(users);
    } catch (err) {
        console.error("Could not load users:", err);
    }
}

function renderUsers(users) {
    users.forEach(user => {
        console.log(`${user.name} - ${user.email}`);
    });
}

loadUsers();