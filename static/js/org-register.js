(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        var accountTypeEl = document.getElementById("accountType");
        var organizationFieldsEl =
            document.getElementById("organizationFields");
        var volunteerFieldsEl =
            document.getElementById("volunteerFields");

        var organizationDetailsEl =
            document.getElementById("organizationDetails");
        var organizationDocumentEl =
            document.getElementById("organizationDocument");

        var nextBtn = document.getElementById("regNextBtn");
        var backBtn = document.getElementById("regBackBtn");
        var stepLabel = document.getElementById("regStepLabel");
        var totalStepsLabel =document.getElementById("regTotalSteps");

        if (!nextBtn || !accountTypeEl) return;

        var step = 1;

        function isVolunteer() {
            return accountTypeEl.value === "VOL";
        }

        function updateAccountTypeFields() {

            var volunteer = isVolunteer();

            organizationFieldsEl.hidden = volunteer;
            volunteerFieldsEl.hidden = !volunteer;

            organizationDetailsEl.hidden = volunteer;
            organizationDocumentEl.hidden = volunteer;

            step = 1;
            render();
        }

        function render() {

            var volunteer = isVolunteer();
            var totalSteps = volunteer ? 1 : 3;
            if (totalStepsLabel) {
                totalStepsLabel.textContent = String(totalSteps);
            }

            document.querySelectorAll("[data-reg-panel]").forEach(function (panel) {
                panel.hidden =
                    panel.getAttribute("data-reg-panel") !== String(step);
            });

            document.querySelectorAll("[data-reg-step]").forEach(function (dot) {

                var s = parseInt(
                    dot.getAttribute("data-reg-step"),
                    10
                );

                dot.hidden = volunteer && s > 1;

                dot.classList.toggle("is-done", s < step);
                dot.classList.toggle("is-active", s === step);
            });

            if (stepLabel) {
                stepLabel.textContent = String(step);
            }

            if (backBtn) {
                backBtn.style.visibility =
                    step === 1 ? "hidden" : "visible";
            }

            if (volunteer) {
                nextBtn.textContent = "Register";
            } else {
                nextBtn.textContent =
                    step === totalSteps
                        ? "Submit for Verification"
                        : "Continue";
            }
        }

        accountTypeEl.addEventListener(
            "change",
            updateAccountTypeFields
        );

        nextBtn.addEventListener("click", function () {

            var volunteer = isVolunteer();
            var totalSteps = volunteer ? 1 : 3;


            var currentPanel = document.querySelector(
                '[data-reg-panel="' + step + '"]'
            );

            if (currentPanel) {
            var requiredFields = currentPanel.querySelectorAll(
                "input[required], select[required], textarea[required]"
            );

            for (var i = 0; i < requiredFields.length; i++) {

                var field = requiredFields[i];

                // Ignore fields belonging to the currently hidden account type.
                if (field.offsetParent === null) {
                    continue;
                }

                if (!field.checkValidity()) {
                    field.reportValidity();
                    return;
                }
            }
            }

            if (step < totalSteps) {
                step++;
                render();
                return;
            }


            var formData = new FormData();

            if (volunteer) {

                formData.append(
                    "full_name",
                    document.getElementById("volunteerName").value.trim()
                );

                formData.append(
                    "email",
                    document.getElementById("volunteerEmail").value.trim()
                );

                formData.append(
                    "password",
                    document.getElementById("volunteerPassword").value
                );

                formData.append("account_type", "VOL");

            } else {

                formData.append(
                    "full_name",
                    document.getElementById("organizationName").value.trim()
                );

                formData.append(
                    "email",
                    document.getElementById("organizationEmail").value.trim()
                );

                formData.append(
                    "password",
                    document.getElementById("organizationPassword").value
                );

                formData.append(
                    "name",
                    document.getElementById("organizationName").value.trim()
                );

                formData.append(
                    "organization_type",
                    document.getElementById("organizationType").value
                );

                formData.append(
                    "address",
                    document.getElementById("organizationAddress").value.trim()
                );

                formData.append(
                    "verification_document",
                    document.getElementById("verificationDocument").files[0]
                );
            }

            var endpoint = volunteer
                ? "/api/v1/auth/register/"
                : "/api/v1/organizations/register/";

            nextBtn.disabled = true;

            fetch(endpoint, {
                method: "POST",
                body: formData
            })
            .then(async function (response) {

                var data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        Object.values(data).flat().join(" ")
                    );
                }

                return data;
            })
            .then(function (data) {

            if (volunteer) {
                window.location.href = "/login/";
            } else {
                window.location.href = nextBtn.getAttribute("data-final-href");
            }

            })
            .catch(function (error) {

                alert(error.message || "Registration failed. Please try again.");

            })
            .finally(function () {
                nextBtn.disabled = false;
            });



        });

        if (backBtn) {
            backBtn.addEventListener("click", function () {

                if (step > 1) {
                    step--;
                    render();
                }

            });
        }

        updateAccountTypeFields();
    });

})();