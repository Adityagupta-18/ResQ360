
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("LoginEmail").value;
    const password = document.getElementById("LoginPassword").value;

    console.log("Email:", email);
    console.log("Password:", password);
});