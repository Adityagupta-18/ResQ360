const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    // Hide previous error
    loginError.classList.add("d-none");
    loginError.textContent = "";

    const email = document.getElementById("LoginEmail").value;
    const password = document.getElementById("LoginPassword").value;

    const data = await apiRequest("/auth/login/", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (data.verification_status?.[0] === "PEND") {

        const params = new URLSearchParams({
            status: "PEND",
            name: data.organization_name?.[0] || "",
            type: data.organization_type?.[0] || ""
        });
        window.location.href =
            "/verification-pending/?" + params.toString();
        return;
    }

    if (data.verification_status?.[0] === "REJ") {

        const params = new URLSearchParams({
            status: "REJ",
            name: data.organization_name?.[0] || "",
            type: data.organization_type?.[0] || ""
        });
        window.location.href =
            "/verification-pending/?" + params.toString();
        return;
    }

    // Invalid credentials
    if (!data.access || !data.refresh) {
        loginError.textContent =
            data.detail || "Invalid email or password.";
        loginError.classList.remove("d-none");
        return;
    }

    // Successful login
    saveTokens(data.access, data.refresh);

    const user = await apiRequest("/auth/me/");

    if (user.account_type === "ORG") {
        window.location.href = "/organization/dashboard/";
    } else if (user.account_type === "VOL") {
        window.location.href = "/volunteer/dashboard/";
    }
});



function saveTokens(access, refresh) {
    localStorage.setItem("resq360_access_token", access);
    localStorage.setItem("resq360_refresh_token", refresh);
}