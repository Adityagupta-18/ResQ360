(function () {
  "use strict";
  var REPORT_KEY = "resq360_demo_report";
  var TRACK_KEY = "resq360_demo_tracking";

  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function qs(sel, root) { return (root || document).querySelector(sel); }

  function loadReport() { try { return JSON.parse(localStorage.getItem(REPORT_KEY)) || {}; } catch (e) { return {}; } }
  function saveReport(d) { try { localStorage.setItem(REPORT_KEY, JSON.stringify(d)); } catch (e) { /* storage unavailable — continue silently */ } }

  async function updateLocationAddress(latitude, longitude) {
    var addressEl = document.getElementById("locationAddress");
    var textEl = document.getElementById("selectedLocationText");

    if (!textEl) return;

    textEl.textContent = "Finding address...";

    try {
        var response = await fetch(
            "https://nominatim.openstreetmap.org/reverse" +
            "?format=jsonv2" +
            "&lat=" + encodeURIComponent(latitude) +
            "&lon=" + encodeURIComponent(longitude)
        );

        if (!response.ok) {
            throw new Error("Reverse geocoding failed");
        }

        var data = await response.json();

        textEl.textContent =
            data.display_name || "Location selected";

        var d = loadReport();
        d.location = data.display_name || "";
        saveReport(d);

        if (addressEl) {
            addressEl.hidden = false;
        }

    } catch (error) {
        textEl.textContent = "Location selected";

        var d = loadReport();
        d.location = "";
        saveReport(d);

        if (addressEl) {
            addressEl.hidden = false;
        }
    }
}


  var TYPE_LABELS = { accident: "Accident", 
    medical: "Medical Emergency",
     fire: "Fire", 
     crime: "Crime / Security", 
     missing: "Missing Person", 
     other: "Other" };

  var INCIDENT_TYPE_MAP = {
    accident: "ACCIDENT",
    medical: "MEDICAL",
    fire: "FIRE",
    crime: "CRIME_SECURITY",
    missing: "MISSING_PERSON",
    blood_bank: "BLOOD_BANK"
};

var SEVERITY_MAP = {
    critical: "CRITICAL",
    serious: "SERIOUS",
    minor: "MINOR",
    unknown: "UNKNOWN"
};
  var SEVERITY_LABELS = { critical: "Critical", 
    serious: "Serious", 
    minor: "Minor", 
    unknown: "Unknown" };

  var TIMELINE_LABELS = ["Reported", "Accepted", "En route","In progress", "Resolved"];



  document.addEventListener("DOMContentLoaded", function () {

    var mapEl = document.getElementById("citizenMap");
    var mapEl = document.getElementById("citizenMap");
    var citizenMap = null;
    var citizenMarker = null;

  if (mapEl && window.L) {
    citizenMap = L.map("citizenMap").setView([28.6139, 77.2090], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      referrerPolicy: "strict-origin-when-cross-origin"
    }).addTo(citizenMap);
  }

    /* ---- Screen: What happened? (emergency type) ---- */
    var typeContinueBtn = document.getElementById("continueBtnType");
    if (typeContinueBtn) {
      // Restore a previous selection if the citizen navigates back to this screen.
      var existing = loadReport();
      if (existing.type) {
        var group = qs('[data-select-group="emergency-type"]');
        var match = group ? qs('[data-value="' + existing.type + '"]', group) : null;
        if (match) {
          match.classList.add("is-selected");
          group.setAttribute("data-value", existing.type);
          if (window.ResQ) window.ResQ.updateContinueButtons();
        }
      }
      typeContinueBtn.addEventListener("click", function () {
        var g = qs('[data-select-group="emergency-type"]');
        var value = g ? g.getAttribute("data-value") : "";
        if (!value) return;
        var d = loadReport();
        d.type = value;
        d.typeLabel = TYPE_LABELS[value] || value;
        saveReport(d);
      });
      if (mapEl && citizenMap) {
      citizenMap.setView([d.latitude, d.longitude], 16);

      citizenMarker = L.marker(
        [d.latitude, d.longitude],
        { draggable: true }
      ).addTo(citizenMap);
    }
    }

    /* ---- Screen: Emergency Location ---- */
        var useCurrentBtn = document.getElementById("useCurrentLocation");
        var manualBtn = document.getElementById("useManualLocation");
        if (useCurrentBtn || manualBtn) {
          var statusEl = document.getElementById("locationStatus");
          var deniedEl = document.getElementById("locationDenied");
          var addressEl = document.getElementById("locationAddress");
          var continueBtn = document.getElementById("continueBtnLocation");
    

    if (useCurrentBtn) {
      useCurrentBtn.addEventListener("click", function () {
        if (statusEl) statusEl.hidden = false;
        if (deniedEl) deniedEl.hidden = true;
        if (addressEl) addressEl.hidden = true;
        useCurrentBtn.setAttribute("disabled", "true");

        navigator.geolocation.getCurrentPosition(
          function (position) {
            if (statusEl) statusEl.hidden = true;
            if (addressEl) addressEl.hidden = false;
            useCurrentBtn.removeAttribute("disabled");

            var d = loadReport();
            d.latitude = position.coords.latitude;
            d.longitude = position.coords.longitude;
            saveReport(d);
            updateLocationAddress(d.latitude, d.longitude);

          if (mapEl && citizenMap) {
            citizenMap.setView([d.latitude, d.longitude], 16);

            citizenMarker = L.marker(
              [d.latitude, d.longitude],
              { draggable: true }
            ).addTo(citizenMap);

            citizenMarker.on("dragend", function (event) {
            var position = event.target.getLatLng();

            var updatedReport = loadReport();
            updatedReport.latitude = position.lat;
            updatedReport.longitude = position.lng;
            saveReport(updatedReport);
            updateLocationAddress(updatedReport.latitude,updatedReport.longitude);
          });
          }

          if (continueBtn) continueBtn.removeAttribute("disabled");
          },
          function () {
            if (statusEl) statusEl.hidden = true;
            if (deniedEl) deniedEl.hidden = false;
            useCurrentBtn.removeAttribute("disabled");
          }
        );
      });
    }

    if (manualBtn) {
        manualBtn.addEventListener("click", function () {

            if (!citizenMap) return;

            if (deniedEl) deniedEl.hidden = true;

            var d = loadReport();

            // If a marker already exists, use it.
            if (citizenMarker) {
                citizenMarker.dragging.enable();
                citizenMap.setView(citizenMarker.getLatLng(), 16);
                return;
            }

            // No GPS marker exists, so create one at the map center.
            var center = citizenMap.getCenter();

            d.latitude = center.lat;
            d.longitude = center.lng;
            saveReport(d);

            citizenMarker = L.marker(
                [center.lat, center.lng],
                { draggable: true }
            ).addTo(citizenMap);

            citizenMarker.on("dragend", function (event) {
                var position = event.target.getLatLng();

                var updatedReport = loadReport();
                updatedReport.latitude = position.lat;
                updatedReport.longitude = position.lng;
                saveReport(updatedReport);
            });

            if (continueBtn) {
                continueBtn.removeAttribute("disabled");
            }
        });
    }
      }



    /* ---- Screen: Emergency Details ---- */
    var detailsContinueBtn = document.getElementById("continueBtnDetails");

    if (detailsContinueBtn) {
      detailsContinueBtn.addEventListener("click", function () {

        var d = loadReport();
        var sevGroup = qs('[data-select-group="severity"]');
        var peopleEl = qs('[data-counter-value]');

        d.severity = sevGroup ? sevGroup.getAttribute("data-value") : "";
        
        d.severityLabel = SEVERITY_LABELS[d.severity] || "";
        d.people = peopleEl ? peopleEl.textContent : "1";
        var quickAnswers = {};

        qsa("[data-question]").forEach(function (row) {
          var selected = qs(".toggle-pill.is-selected", row);

            quickAnswers[row.getAttribute("data-question")] = selected ? selected.getAttribute("data-value") : null;
          });
        d.quickAnswers = quickAnswers;
        saveReport(d);
      });
    }

    /* ---- Screen: Optional Information ---- */
    var optionalContinueBtn = document.getElementById("continueBtnOptional");
    if (optionalContinueBtn) {
      optionalContinueBtn.addEventListener("click", function () {
        var d = loadReport();
        var desc = document.getElementById("descriptionField");
        d.description = desc ? desc.value.trim() : "";
        saveReport(d);
      });
    }

    /* ---- Screen: Review & Submit ---- */
    var reviewTypeEl = document.getElementById("reviewType");
    if (reviewTypeEl) {
      var d = loadReport();
      var setText = function (id, value) { var el = document.getElementById(id); if (el) el.textContent = value || "—"; };
      setText("reviewType", d.typeLabel);
      setText("reviewLocation", d.location);
      setText("reviewSeverity", d.severityLabel);
      setText("reviewPeople", d.people);
    }

    

var submitBtn = document.getElementById("submitBtn");

if (submitBtn) {
    submitBtn.addEventListener("click", async function () {

        var d = loadReport();

        var payload = {
            incident_type: INCIDENT_TYPE_MAP[d.type],
            latitude: Number(Number(d.latitude).toFixed(6)),
            longitude: Number(Number(d.longitude).toFixed(6)),
            location_address: d.location || "",
            people_affected: Number(d.people),
            severity: SEVERITY_MAP[d.severity],

            road_blocked: d.quickAnswers &&
                d.quickAnswers["road-blocked"] === "yes",

            fire_smoke: d.quickAnswers &&
                d.quickAnswers["fire-smoke"] === "yes",

            severe_bleeding: d.quickAnswers &&
                d.quickAnswers["severe-bleeding"] === "yes",

            person_trapped: d.quickAnswers &&
                d.quickAnswers["person-trapped"] === "yes"
        };


        var response = await fetch("/api/v1/incidents/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        var result = await response.json();

        if (!response.ok) {
            console.error("Incident creation failed:", result);
            return;
        }

        d.emergencyId = result.emergency_id;
        saveReport(d);

        window.location.href = "/incident-confirmation";
    });
}



    /* ---- Screen: Emergency Confirmation ---- */
    var idEl = document.getElementById("emergencyIdValue");
    if (idEl) {
      var dc = loadReport();
      idEl.textContent = dc.emergencyId || "EMG-1042";
    }

    /* ---- Screen: Emergency Tracking ---- */
    var trackIdEl = document.getElementById("trackEmergencyId");
    if (trackIdEl) {
      var dt = loadReport();
      trackIdEl.textContent = dt.emergencyId || "EMG-1042";
      var trackTypeEl = document.getElementById("trackType");
      if (trackTypeEl) trackTypeEl.textContent = dt.typeLabel || "Medical Emergency";
      var trackLocEl = document.getElementById("trackLocation");
      if (trackLocEl) trackLocEl.textContent = dt.location || "Sector 12, MG Road, near City Hospital";

      var tracking = {};
      try { tracking = JSON.parse(localStorage.getItem(TRACK_KEY)) || {}; } catch (e) { tracking = {}; }
      var stepIndex = typeof tracking.stepIndex === "number" ? tracking.stepIndex : 0;

      function render() {
        var nodes = qsa(".timeline-step");
        nodes.forEach(function (node, i) {
          node.classList.remove("is-done", "is-active");
          if (i < stepIndex) node.classList.add("is-done");
          else if (i === stepIndex) node.classList.add("is-active");
        });
        var statusLabelEl = document.getElementById("currentStatusLabel");
        if (statusLabelEl) statusLabelEl.textContent = TIMELINE_LABELS[stepIndex] || "Reported";
        var orgBlock = document.getElementById("assignedOrgBlock");
        if (orgBlock) orgBlock.hidden = stepIndex < 3;
        var doneBanner = document.getElementById("resolvedBanner");
        if (doneBanner) doneBanner.hidden = stepIndex < 7;
        var advanceBtn = document.getElementById("simulateAdvance");
        if (advanceBtn) advanceBtn.toggleAttribute("disabled", stepIndex >= TIMELINE_LABELS.length - 1);
      }
      render();

      var advanceBtn2 = document.getElementById("simulateAdvance");
      if (advanceBtn2) {
        advanceBtn2.addEventListener("click", function () {
          var tt = {};
          try { tt = JSON.parse(localStorage.getItem(TRACK_KEY)) || {}; } catch (e) { tt = {}; }
          var idx = typeof tt.stepIndex === "number" ? tt.stepIndex : 0;
          if (idx < TIMELINE_LABELS.length - 1) {
            idx++;
            tt.stepIndex = idx;
            try { localStorage.setItem(TRACK_KEY, JSON.stringify(tt)); } catch (e) { /* noop */ }
            stepIndex = idx;
            render();
          }
        });
      }
    }
  });
})();
