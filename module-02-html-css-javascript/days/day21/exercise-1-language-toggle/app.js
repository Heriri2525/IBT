const select = document.querySelector("#lang");
const message = document.querySelector("#message");

// Restore saved language when the page loads
const savedLanguage = localStorage.getItem("lang");

if (savedLanguage) {
    select.value = savedLanguage;
    showMessage(savedLanguage);
}

// Save language whenever it changes
select.addEventListener("change", () => {
    localStorage.setItem("lang", select.value);
    showMessage(select.value);
});

function showMessage(language) {
    if (language === "am") {
        message.textContent = "ቋንቋዎ አማርኛ ነው።";
    } else {
        message.textContent = "Your language is English.";
    }
}