document.addEventListener("DOMContentLoaded", async function () {

    const emergencyId = window.location.pathname.split("/").filter(Boolean).pop();
    const data = await apiRequest(`/incidents/track/${emergencyId}/`);

    const incidents = await apiRequest("/organizations/incidents/");
    const incident = incidents.find(item => item.emergency_id === emergencyId);

    const latitude = incident.latitude;
    const longitude = incident.longitude;

    const map = L.map("incidentMap").setView([latitude, longitude],15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        referrerPolicy: "strict-origin-when-cross-origin"
    }).addTo(map);

    const emergencyIcon = L.divIcon({
        className: "emergency-marker",
        html: `<div style="
            width: 18px;
            height: 18px;
            background: #dc2626;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });

    const organizationIcon = L.divIcon({
        className: "organization-marker",
        html: `<div style="
            width: 18px;
            height: 18px;
            background: #2563eb;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });

    const emergencyMarker = L.marker(
        [latitude, longitude],
        { icon: emergencyIcon }
    ).addTo(map);

    emergencyMarker
        .bindPopup("Emergency location")
        .openPopup();

    navigator.geolocation.getCurrentPosition(
    async function (position) {
        const orgLatitude = position.coords.latitude;
        const orgLongitude = position.coords.longitude;

        console.log("Organization location:", orgLatitude, orgLongitude);
        console.log("Emergency location:", latitude, longitude);

    const routeUrl =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${orgLongitude},${orgLatitude};${longitude},${latitude}` +
    `?overview=full&geometries=geojson`;

    const routeResponse = await fetch(routeUrl);
    const routeData = await routeResponse.json();
    console.log("Route data:", routeData);
    const routeCoordinates = routeData.routes[0].geometry.coordinates;

    // Locaiton Direction From Live to Incident
    const leafletCoordinates = routeCoordinates.map(
        coordinate => [coordinate[1], coordinate[0]]
    );

    const routeLine = L.polyline(leafletCoordinates, {
        color: "#2576e8",
        weight: 5,
        opacity: 0.9
    }).addTo(map);

    const mapBounds = L.latLngBounds([
    [latitude, longitude],
    [orgLatitude, orgLongitude]
    ]);

    map.fitBounds(mapBounds, {
        padding: [15, 15]
    });

    const organizationMarker = L.marker(
        [orgLatitude, orgLongitude],
        { icon: organizationIcon }
    ).addTo(map);

    organizationMarker.bindPopup("Your location");

        },
        function (error) {
            console.log("Could not get organization location:", error);
        }
    );


// UPDATING THE STATUS RAIL
    function updateWorkflow(status) {
    const steps = [
        document.getElementById("stepReported"),
        document.getElementById("stepAccepted"),
        document.getElementById("stepEnroute"),
        document.getElementById("stepProgress")
    ];

    const connectors = [
        document.getElementById("connector1"),
        document.getElementById("connector2"),
        document.getElementById("connector3")
    ];

    const statusOrder = {
        REPORTED: 0,
        ACCEPTED: 1,
        ENROUTE: 2,
        IN_PROGRESS: 3,
        RESOLVED: 4
    };

    const currentStep = statusOrder[status];

    steps.forEach((step, index) => {
        step.classList.remove("is-done", "is-active");

        if (index < currentStep) {
            step.classList.add("is-done");
        } else if (index === currentStep) {
            step.classList.add("is-active");
        }
    });

    connectors.forEach((connector, index) => {
        connector.classList.remove("is-done");

        if (index < currentStep) {
            connector.classList.add("is-done");
        }
    });
}
    updateWorkflow(data.status);

    console.log("Emergency details:", data);
    console.log("Assignment:", incident);

    document.getElementById("incidentTitle").textContent =
        `${data.incident_type} — ${data.emergency_id}`;

    document.getElementById("incidentSeverity").textContent =
        data.severity;

    document.getElementById("incidentLocation").textContent =
        data.location_address;

    const actionBtn = document.getElementById("actionBtn");
    const statusMessage = document.getElementById("statusMessage");
    document.getElementById("incidentStatus").textContent = data.status;

    if (data.status === "REPORTED") {
        statusMessage.textContent =
            " — accept the emergency to begin response.";
        actionBtn.textContent = "Accept Emergency";

    } else if (data.status === "ACCEPTED") {
        statusMessage.textContent =
            " — mark as en route once your team departs.";
        actionBtn.textContent = "Mark as En Route";

    } else if (data.status === "ENROUTE") {
        statusMessage.textContent =
            " — your team is on the way.";
        actionBtn.textContent = "Mark as In Progress";

    } else if (data.status === "IN_PROGRESS") {
        statusMessage.textContent =
            " — response is currently in progress.";
        actionBtn.textContent = "Resolve Emergency";

    } else if (data.status === "RESOLVED") {
        statusMessage.textContent =
            " — this emergency has been resolved.";
        actionBtn.style.display = "none";
    }

    actionBtn.addEventListener("click", async function () {
    let response;
    if (data.status === "REPORTED") {
        response = await apiRequest(
            `/incidents/organization-assignments/${incident.id}/accept/`,
            {
                method: "POST"
            }
        );
        console.log("Accept response:", response);

        if (!response.error) {
            data.status = "ACCEPTED";
            updateWorkflow(data.status);
            document.getElementById("incidentStatus").textContent = "ACCEPTED";
            statusMessage.textContent =
                " — mark as en route once your team departs.";
            actionBtn.textContent = "Mark as En Route";
        }else {
            statusMessage.textContent = ` — ${response.error}`;
        }

    } else if (data.status === "ACCEPTED") {
            response = await apiRequest(
                `/incidents/organization-assignments/${incident.id}/enroute/`,
                {
                    method: "POST"
                }
            );
            console.log("Enroute response:", response);

            if (!response.error) {
                data.status = "ENROUTE";
                updateWorkflow(data.status);
                document.getElementById("incidentStatus").textContent = "ENROUTE";
                statusMessage.textContent =
                    " —The team is on the way.";
                actionBtn.textContent = "Mark as In Progress";
                }else {
            statusMessage.textContent = ` — Another organization has already accepted this emergency.`;
                    }
            } 
        else if (data.status === "ENROUTE") {
        response = await apiRequest(
            `/incidents/organization-assignments/${incident.id}/in-progress/`,
            {
                method: "POST"
            }
        );
        console.log("In Progress response:", response);

        if (!response.error) {
            data.status = "IN_PROGRESS";
            updateWorkflow(data.status);
            document.getElementById("incidentStatus").textContent = "IN_PROGRESS";
            statusMessage.textContent =
                " — response is currently in progress.";
            actionBtn.textContent = "Resolve Emergency";
        }else {
            statusMessage.textContent = ` — Another organization has already accepted this emergency.`;
                }

        } else if (data.status === "IN_PROGRESS") {
        response = await apiRequest(
            `/incidents/organization-assignments/${incident.id}/resolved/`,
            {
                method: "POST"
            }
        );
        console.log("Resolve response:", response);

        if (!response.error) {
            data.status = "RESOLVED";
            updateWorkflow(data.status);
            document.getElementById("incidentStatus").textContent = "RESOLVED";
            statusMessage.textContent =
                " — this emergency has been resolved.";

            actionBtn.style.display = "none";
    }else {
            statusMessage.textContent = ` — Another organization has already accepted this emergency.`;
        }
}
    });
});
