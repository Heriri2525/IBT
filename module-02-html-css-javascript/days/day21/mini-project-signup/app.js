const form = document.querySelector("#signup");

const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");

const errorMessage = document.querySelector("#error");
const successMessage = document.querySelector("#success");

const countMessage = document.querySelector("#count");
const signupList = document.querySelector("#signupList");

// Ethiopian phone number regex
const PHONE = /^(?:\+251|0)9\d{8}$/;


// Load saved signups when the page starts
let signups = loadSignups();


// Handle form submission
form.addEventListener("submit", (event) => {

    // Prevent page reload
    event.preventDefault();

    // Clear old messages
    errorMessage.textContent = "";
    successMessage.textContent = "";

    // Read and trim input values
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    // Validate the form
    const error = validate({
        name,
        phone
    });

    // If validation fails, show the error
    if (error) {
        errorMessage.textContent = error;
        return;
    }

    // Create signup object
    const signup = {
        name: name,
        phone: phone
    };

    // Add signup to the array
    signups.push(signup);

    // Save signups to localStorage
    saveSignups(signups);

    // Show success message
    successMessage.textContent = "Signup successful!";

    // Clear the form
    form.reset();

    // Update the displayed signup list
    displaySignups();
});


// Validate form data
function validate({ name, phone }) {

    // Check name
    if (!name) {
        return "Please enter your full name.";
    }

    // Check minimum name length
    if (name.length < 2) {
        return "Your name must be at least 2 characters.";
    }

    // Check phone
    if (!phone) {
        return "Please enter your phone number.";
    }

    // Check Ethiopian phone format
    if (!PHONE.test(phone)) {
        return "Enter a valid Ethiopian phone number.";
    }

    // No errors
    return "";
}


// Save signups to localStorage
function saveSignups(data) {

    localStorage.setItem(
        "signups",
        JSON.stringify(data)
    );
}


// Load signups from localStorage
function loadSignups() {

    try {

        const raw = localStorage.getItem("signups");

        // If nothing exists, return empty array
        if (!raw) {
            return [];
        }

        const data = JSON.parse(raw);

        // Make sure stored data is an array
        if (!Array.isArray(data)) {
            return [];
        }

        return data;

    } catch (error) {

        // If stored JSON is corrupt
        return [];
    }
}


// Display saved signups
function displaySignups() {

    // Show number of signups
    countMessage.textContent =
        `People signed up: ${signups.length}`;

    // Clear current list
    signupList.textContent = "";

    // Display every signup
    signups.forEach((signup) => {

        const li = document.createElement("li");

        li.textContent =
            `${signup.name} - ${signup.phone}`;

        signupList.appendChild(li);
    });
}


// Display saved data when the page loads
displaySignups();