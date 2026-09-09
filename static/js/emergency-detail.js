document.addEventListener("DOMContentLoaded", async function () {
    const emergencyId = window.location.pathname.split("/").filter(Boolean).pop();

    const data = await apiRequest(`/incidents/track/${emergencyId}/`);

    const incidents = await apiRequest("/organizations/incidents/");
    const incident = incidents.find(
    item => item.emergency_id === emergencyId
    );

    console.log("Emergency details:", data);
    console.log("Assignment:", incident);

    document.getElementById("incidentTitle").textContent =
        `${data.incident_type} — ${data.emergency_id}`;

    document.getElementById("incidentSeverity").textContent =
        data.severity;

    document.getElementById("incidentLocation").textContent =
        data.location_address;

    
    const enrouteBtn = document.getElementById("enrouteBtn");

    enrouteBtn.addEventListener("click", async function () {
        const response = await apiRequest(
            `/incidents/organization-assignments/${incident.id}/enroute/`,
            {
                method: "POST"
            }
        );
        console.log("Enroute response:", response);
    });
});
