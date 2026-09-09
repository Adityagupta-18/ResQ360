document.addEventListener("DOMContentLoaded", async function () {
    const data = await apiRequest("/organizations/incidents/");

    console.log("Organization incidents:", data);
});