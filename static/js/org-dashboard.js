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

    loadNotifications();
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

                    ${incident.severity
                    ? `<span class="r-badge r-badge-danger">${incident.severity}</span>`
                    : `<span class="r-badge r-badge-danger">NOT SPECIFIED</span>`
                    }
                </div>
                <div class="incident-card__meta">
                    <span><b>${incident.people_affected}</b> PEOPLE</span>|
                    <span>${incident.location_address}</span>|
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


document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("resq360_access_token");
    localStorage.removeItem("resq360_refresh_token");

    window.location.href = "/login/";
});




async function loadNotifications() {
    const notifications = await apiRequest("/notifications/");
    const notificationList = document.getElementById("notificationList");

    notificationList.innerHTML = "";
    notifications.forEach(notification => {
        const item = document.createElement("div");
        item.className = `notif-item${notification.is_read ? "" : " is-unread"}`;

        item.innerHTML = `
            <div class="notif-item__icon"
                style="background:var(--r-red-surface);color:var(--r-red);">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <path d="M12 9v4.5M12 16.2h.01"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"/>
                </svg>
            </div>

            <div class="notif-item__body">
                <p class="notif-item__title">${notification.message}</p>
                <p class="notif-item__desc">
                    Emergency ID: ${notification.emergency_id}
                </p>
                <p class="notif-item__time">
                    ${new Date(notification.created_at).toLocaleString()}
                </p>
            </div>
        `;

        notificationList.appendChild(item);
        item.addEventListener("click", async function () {
            if (!notification.is_read) {
                await apiRequest(
                    `/notifications/${notification.id}/read/`,
                    {
                        method: "POST"
                    }
                );

                notification.is_read = true;
                item.classList.remove("is-unread");
            }

            window.location.href =
                `/organization/emergency/${notification.emergency_id}/`;
        });
    });
}