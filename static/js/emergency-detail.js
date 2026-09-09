document.addEventListener("DOMContentLoaded", async function () {
    const emergencyId = window.location.pathname.split("/").filter(Boolean).pop();

    const data = await apiRequest(`/incidents/track/${emergencyId}/`);

    console.log("Emergency details:", data);

    document.getElementById("incidentTitle").textContent =
        `${data.incident_type} — ${data.emergency_id}`;

    document.getElementById("incidentSeverity").textContent =
        data.severity;

    document.getElementById("incidentLocation").textContent =
        data.location_address;
});