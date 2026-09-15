document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const organizationName = params.get("name");
    const organizationType = params.get("type");

    const title = document.getElementById("verificationTitle");
    const message = document.getElementById("verificationMessage");
    const statusBadge = document.getElementById("verificationStatus");
    const nameElement =
    document.getElementById("verificationOrganizationName");

    const typeElement =
    document.getElementById("verificationOrganizationType");
    if (nameElement) {
        nameElement.textContent = organizationName || "—";
    }

    if (typeElement) {
        typeElement.textContent = organizationType || "—";
    }

    if (status === "REJ") {

        title.textContent = "Verification Rejected";

        message.textContent =
            "Your organization registration has been rejected. Please contact the administrator for further assistance.";

        statusBadge.textContent = "Rejected";
        statusBadge.classList.remove("r-badge-warning");
        statusBadge.classList.add("r-badge-danger");

    } else {

        title.textContent = "Verification Pending";

        message.textContent =
            "Your organization registration is currently pending verification. Please wait for an administrator to review your application.";

        statusBadge.textContent = "Pending review";

    }
});