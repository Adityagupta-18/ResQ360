document.addEventListener("DOMContentLoaded", function () {

    const map = L.map("nearbyMap");
    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 19,
            referrerPolicy: "strict-origin-when-cross-origin"
        }
    ).addTo(map);

    const resultsContainer =
        document.getElementById("nearbyResults");

    let userLocation = null;
    let userMarker = null;
    let destinationMarker = null;
    let routeLine = null;

    navigator.geolocation.getCurrentPosition(
        function (position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            userLocation = [lat, lon];

            map.setView(userLocation, 14);
            userMarker = L.marker(userLocation)
                .addTo(map)
                .bindPopup("Your location")
                .openPopup();
        },

        function () {
            resultsContainer.innerHTML =
                "<div class='r-card card-pad'>" +
                "Location access is required to find nearby help." +
                "</div>";
        }
    );

    document
        .querySelectorAll(".nearby-category")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const type = button.dataset.type;
                document
                .querySelectorAll(".nearby-category")
                .forEach(function (categoryButton) {
                    categoryButton.classList.remove("active");
                });

            button.classList.add("active");

                if (!userLocation) {
                    return;
                }
                map.eachLayer(function (layer) {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });
                userMarker = L.marker(userLocation)
                .addTo(map)
                .bindPopup("Your location");

                if (!userLocation) {
                    return;
                }

                loadNearbyPlaces(type);
            });

        });


            function calculateDistance(lat1, lon1, lat2, lon2) {

            const R = 6371;

            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;

            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) *
                Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

            const c = 2 * Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

            return R * c;
        }


        async function loadNearbyPlaces(type) {

            if (routeLine) {
                map.removeLayer(routeLine);
                routeLine = null;
            }

            resultsContainer.innerHTML =
                "<div class='r-card card-pad'>Finding nearest help...</div>";

            let searchQuery = "";

            if (type === "hospital") {
                searchQuery = "hospital";
            } else if (type === "police") {
                searchQuery = "police station";
            } else if (type === "fire") {
                searchQuery = "fire station";
            }

            const lat = userLocation[0];
            const lon = userLocation[1];

            const delta = 0.05;

            const viewbox = [
                lon - delta,
                lat + delta,
                lon + delta,
                lat - delta
            ].join(",");

            const url =
                "https://nominatim.openstreetmap.org/search?" +
                new URLSearchParams({
                    q: searchQuery,
                    format: "jsonv2",
                    limit: "100",
                    viewbox: viewbox,
                    bounded: "1"
                });

            try {

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(
                        "Nominatim request failed: " + response.status
                    );
                }

                const data = await response.json();

                if (data.length === 0) {
                    resultsContainer.innerHTML =
                        "<div class='r-card card-pad'>" +
                        "No nearby place was found." +
                        "</div>";
                    return;
                }

                let nearestPlace = null;
                let nearestDistance = Infinity;

                data.forEach(function (item) {

                    const itemLat = parseFloat(item.lat);
                    const itemLon = parseFloat(item.lon);

                    const distance = calculateDistance(
                        userLocation[0],
                        userLocation[1],
                        itemLat,
                        itemLon
                    );

                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestPlace = item;
                    }
                });

                const place = nearestPlace;

                const destinationLat = parseFloat(place.lat);
                const destinationLon = parseFloat(place.lon);

                L.marker([
                    destinationLat,
                    destinationLon
                ])
                    .addTo(map)
                    .bindPopup(place.display_name);

                const routeUrl =
                    "https://router.project-osrm.org/route/v1/driving/" +
                    userLocation[1] + "," + userLocation[0] +
                    ";" +
                    destinationLon + "," + destinationLat +
                    "?overview=full&geometries=geojson";

                const routeResponse = await fetch(routeUrl);

                if (!routeResponse.ok) {
                    throw new Error("Route request failed");
                }

                const routeData = await routeResponse.json();

                if (routeData.routes && routeData.routes.length > 0) {

                    const routeCoordinates =
                        routeData.routes[0].geometry.coordinates.map(function (coordinate) {
                            return [coordinate[1], coordinate[0]];
                        });

                    routeLine = L.polyline(routeCoordinates, {
                        weight: 5
                    }).addTo(map);

                    map.fitBounds(routeLine.getBounds(), {
                        padding: [30, 30]
                    });
                }

                const placeLat = parseFloat(place.lat);
                const placeLon = parseFloat(place.lon);

                const placeName =
                    place.display_name.split(",")[0] || "Nearby help";

                let placeType = "Fire";

                if (type === "hospital") {
                    placeType = "Hospital";
                } else if (type === "police") {
                    placeType = "Police";
                }

                resultsContainer.innerHTML =
                    "<div class='r-card incident-card'>" +
                        "<div class='incident-card__top'>" +
                            "<span class='incident-card__type'>" +
                                placeName +
                            "</span>" +
                            "<span class='r-badge r-badge-info'>" +
                                placeType +
                            "</span>" +
                        "</div>" +
                        "<div class='incident-card__meta'>" +
                            "<span>" +
                                nearestDistance.toFixed(2) +
                                " km away</span>" +
                        "</div>" +
                    "</div>";

                L.marker([placeLat, placeLon])
                    .addTo(map)
                    .bindPopup(placeName)
                    .openPopup();

                map.setView([placeLat, placeLon], 14);

            } catch (error) {

                console.error("Nearby search failed:", error);

                resultsContainer.innerHTML =
                    "<div class='r-card card-pad'>" +
                    "Unable to find nearby help. Please try again." +
                    "</div>";
            }
        }

});