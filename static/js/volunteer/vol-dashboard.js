document.addEventListener("DOMContentLoaded", async function () {

const volunteer = await apiRequest("/auth/volunteer/me/");

console.log("Volunteer profile:", volunteer);

if (volunteer && volunteer.full_name) {

    document.getElementById("volunteerName").textContent =
        volunteer.full_name;

    // SIDEBAR
    document.getElementById("volName").textContent =volunteer.full_name;
    document.getElementById("volRole").textContent ="Verified · Volunteer";

    const initials = volunteer.full_name.split(" ").map(word => word[0]).join("").slice(0, 2).toUpperCase();
    document.getElementById("volAvatar").textContent =initials;
}

    await loadNotifications();
    const incidentList = document.getElementById("incidentList");

    // Load notifications
    const notifications = await apiRequest("/notifications/");

    console.log("Volunteer notifications:", notifications);

    if (!Array.isArray(notifications)) {
        return;
    }

    incidentList.innerHTML = "";

    // Create one emergency card for each notification
    for (const notification of notifications) {

        try {
            // Get complete incident information
            const incident = await apiRequest(
                `/incidents/track/${notification.emergency_id}/`
            );

            console.log("Incident:", incident);

            // Don't show resolved emergencies
            if (incident.status === "RESOLVED") {
                continue;
            }

            const card = document.createElement("div");

            card.className = "r-card incident-card";

            card.innerHTML = `
                <div class="incident-card__top">
                    <span class="incident-card__type">
                        ${incident.incident_type} - ${incident.emergency_id}
                    </span>

                    ${
                        incident.severity
                        ? `<span class="r-badge r-badge-danger">${incident.severity}</span>`
                        : `<span class="r-badge r-badge-danger">NOT SPECIFIED</span>`
                    }
                </div>

                <div class="incident-card__meta">
                    <span>
                        <b>${incident.people_affected}</b> PEOPLE
                    </span>

                    |

                    <span>
                        ${incident.location_address || "Location not specified"}
                    </span>

                    |

                    <span>
                        ${incident.status}
                    </span>
                </div>

                <div class="incident-card__actions">
                    <a
                        href="/volunteer/emergency/${incident.emergency_id}/"
                        class="r-btn r-btn-primary r-btn-sm"
                    >
                        Open
                    </a>
                </div>
            `;

            incidentList.appendChild(card);

        } catch (error) {
            console.error(
                `Failed to load incident ${notification.emergency_id}:`,
                error
            );
        }
    }
});



async function loadNotifications() {

    const notifications = await apiRequest("/notifications/");
    const notificationList = document.getElementById("notificationList");

    notificationList.innerHTML = "";

    const unreadCount = notifications.filter(
        notification => !notification.is_read).length;
    console.log("Unread count:", unreadCount);
    console.log(
        "Dot element:",
        document.getElementById("notificationDot")
    );

    document.getElementById("notificationDot").style.display =
        unreadCount > 0 ? "block" : "none";


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
                const remainingUnread = notifications.filter(
                    notification => !notification.is_read).length;

                document.getElementById("notificationDot").style.display =
                    remainingUnread > 0 ? "block" : "none";
            }

            window.location.href =
                `/volunteer/emergency/${notification.emergency_id}/`;
        });
    });
}



document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("resq360_access_token");
    localStorage.removeItem("resq360_refresh_token");

    window.location.href = "/login/";
});


