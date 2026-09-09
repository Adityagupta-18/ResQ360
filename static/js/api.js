const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

async function apiRequest(endpoint, options = {}) {

    const url = API_BASE_URL + endpoint;
    const token = localStorage.getItem("resq360_access_token");
    const headers = {
    "Content-Type": "application/json"
    };
    if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    });
    return await response.json();
}




async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("resq360_refresh_token");

    const response = await fetch(API_BASE_URL + "/auth/token/refresh/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refresh: refreshToken
        })
    });

    const data = await response.json();

    if (data.access) {
        localStorage.setItem("resq360_access_token", data.access);
    }

    return data;
}