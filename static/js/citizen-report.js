/* ==========================================================================
   ResQ360 — Citizen emergency-report flow
   Carries demo answers between the report screens via localStorage so the
   Review, Confirmation and Tracking screens can reflect what was actually
   selected. This is prototype-only state: a real build replaces every
   localStorage call here with the equivalent DRF request/response.
   Include this file only on: type, location, details, optional, review,
   confirmation and tracking screens. Every block below is guarded by an
   element-existence check, so it is always safe to include.
   ========================================================================== */
(function () {
  "use strict";
  var REPORT_KEY = "resq360_demo_report";
  var TRACK_KEY = "resq360_demo_tracking";

  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function qs(sel, root) { return (root || document).querySelector(sel); }

  function loadReport() { try { return JSON.parse(localStorage.getItem(REPORT_KEY)) || {}; } catch (e) { return {}; } }
  function saveReport(d) { try { localStorage.setItem(REPORT_KEY, JSON.stringify(d)); } catch (e) { /* storage unavailable — continue silently */ } }

  var TYPE_LABELS = { accident: "Accident", medical: "Medical Emergency", fire: "Fire", crime: "Crime / Security", missing: "Missing Person", other: "Other" };
  var SEVERITY_LABELS = { critical: "Critical", serious: "Serious", minor: "Minor", unknown: "Unknown" };
  var TIMELINE_LABELS = ["Reported", "Matching", "Alerting responders", "Accepted", "En route", "Arrived", "In progress", "Resolved"];

  document.addEventListener("DOMContentLoaded", function () {

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
    }

    /* ---- Screen: Emergency Location ---- */
    var useCurrentBtn = document.getElementById("useCurrentLocation");
    var manualBtn = document.getElementById("useManualLocation");
    var denyBtn = document.getElementById("simulateDenied");
    if (useCurrentBtn || manualBtn) {
      var statusEl = document.getElementById("locationStatus");
      var deniedEl = document.getElementById("locationDenied");
      var addressEl = document.getElementById("locationAddress");
      var continueBtn = document.getElementById("continueBtnLocation");
      var DEMO_ADDRESS = "Sector 12, MG Road, near City Hospital";

      if (useCurrentBtn) {
        useCurrentBtn.addEventListener("click", function () {
          if (statusEl) statusEl.hidden = false;
          if (deniedEl) deniedEl.hidden = true;
          if (addressEl) addressEl.hidden = true;
          useCurrentBtn.setAttribute("disabled", "true");
          // Demo only: simulate a resolved location instead of calling the
          // real Geolocation API, so the prototype behaves identically for
          // every reviewer regardless of browser permissions.
          setTimeout(function () {
            if (statusEl) statusEl.hidden = true;
            if (addressEl) addressEl.hidden = false;
            useCurrentBtn.removeAttribute("disabled");
            var d = loadReport();
            d.location = DEMO_ADDRESS;
            saveReport(d);
            if (continueBtn) continueBtn.removeAttribute("disabled");
          }, 800);
        });
      }
      if (manualBtn) {
        manualBtn.addEventListener("click", function () {
          if (deniedEl) deniedEl.hidden = true;
          if (addressEl) addressEl.hidden = false;
          var d = loadReport();
          d.location = DEMO_ADDRESS;
          saveReport(d);
          if (continueBtn) continueBtn.removeAttribute("disabled");
        });
      }
      if (denyBtn) {
        denyBtn.addEventListener("click", function () {
          if (deniedEl) deniedEl.hidden = false;
          if (addressEl) addressEl.hidden = true;
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
      setText("reviewDescription", d.description || "No description added");
    }
    var submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.addEventListener("click", function () {
        var d2 = loadReport();
        var n = 1000 + Math.floor(Math.random() * 9000);
        d2.emergencyId = "EMG-" + n;
        saveReport(d2);
        try { localStorage.setItem(TRACK_KEY, JSON.stringify({ stepIndex: 0 })); } catch (e) { /* noop */ }
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
