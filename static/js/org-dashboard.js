document.addEventListener("DOMContentLoaded", async function () {
    const data = await apiRequest("/organizations/incidents/");

    console.log("Organization incidents:", data);
});




document.addEventListener("DOMContentLoaded", async function () {

    const organization = await apiRequest("/organizations/me/");
    document.getElementById("organizationName").textContent =
    organization.name;
    // SIDEBAR
    document.getElementById("orgName").textContent = organization.name;

    const organizationTypes = {MED: "Medical",FIRE_RESCUE: "Fire & Rescue",POLICE_SECURITY: "Police & Security",NGO: "NGO"};
    document.getElementById("orgRole").textContent =
        `Verified · ${organizationTypes[organization.organization_type]}`

    const initials = organization.name.split(" ").map(word => word[0]).join("").slice(0, 2).toUpperCase();  
    document.getElementById("orgAvatar").textContent = initials;

    const incidentList = document.getElementById("incidentList");
    const data = await apiRequest("/organizations/incidents/");
    console.log("Organization incidents:", data);

    if (Array.isArray(data)) {
        incidentList.innerHTML = "";

        data.forEach(function (incident) {
            if (incident.status === "RESOLVED") {
                return;
            }
            const card = document.createElement("div");

            card.className = "r-card incident-card";
            card.innerHTML = `
                <div class="incident-card__top">
                    <span class="incident-card__type">
                        ${incident.incident_type} - ${incident.emergency_id}
                    </span>

                    <span class="r-badge r-badge-danger">
                        ${incident.severity}
                    </span>
                </div>
                <div class="incident-card__meta">
                    <span>${incident.people_affected} people</span>
                    <span>${incident.location_address}</span>
                    <span>${incident.status}</span>
                </div>
                <div class="incident-card__actions">
                    <a href="/organization/emergency/${incident.emergency_id}/" class="r-btn r-btn-primary r-btn-sm">Open</a>
                </div>
            `;
            incidentList.appendChild(card);
        });
    }
});