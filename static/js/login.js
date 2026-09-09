const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("LoginEmail").value;
    const password = document.getElementById("LoginPassword").value;

    const data = await apiRequest("/auth/login/", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    console.log("Login response:", data);
    saveTokens(data.access, data.refresh);
});



function saveTokens(access, refresh) {
    localStorage.setItem("resq360_access_token", access);
    localStorage.setItem("resq360_refresh_token", refresh);
}