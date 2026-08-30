/* ==========================================================================
   ResQ360 — shared interaction layer
   Loaded on every page via base_document.html. Every init is defensive
   (checks elements exist before wiring up) so one file can safely cover
   citizen, organization, and admin screens alike.
   ========================================================================== */
(function () {
  "use strict";

  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function qs(sel, root) { return (root || document).querySelector(sel); }

  /* ---------- Mobile drawer navigation (organization / admin sidebars) ---------- */
  function initDrawers() {
    qsa("[data-drawer]").forEach(function (drawer) {
      var shell = drawer.closest(".app-shell") || document;
      var overlay = qs("[data-drawer-overlay]", shell) || qs("[data-drawer-overlay]");
      var openBtns = qsa("[data-drawer-open]", shell);

      function open() {
        drawer.classList.add("is-open");
        if (overlay) overlay.classList.add("is-open");
        document.body.style.overflow = "hidden";
      }
      function close() {
        drawer.classList.remove("is-open");
        if (overlay) overlay.classList.remove("is-open");
        document.body.style.overflow = "";
      }
      openBtns.forEach(function (btn) { btn.addEventListener("click", open); });
      if (overlay) overlay.addEventListener("click", close);
      qsa("a", drawer).forEach(function (link) { link.addEventListener("click", close); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    });
  }

  /* ---------- Notification dropdown ---------- */
  function initDropdowns() {
    qsa("[data-dropdown-toggle]").forEach(function (toggle) {
      var panel = document.getElementById(toggle.getAttribute("data-dropdown-toggle"));
      if (!panel) return;
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var willOpen = !panel.classList.contains("is-open");
        qsa(".notif-panel.is-open").forEach(function (p) { p.classList.remove("is-open"); });
        if (willOpen) panel.classList.add("is-open");
      });
      panel.addEventListener("click", function (e) { e.stopPropagation(); });
    });
    document.addEventListener("click", function () {
      qsa(".notif-panel.is-open").forEach(function (p) { p.classList.remove("is-open"); });
    });
  }

  /* ---------- Modals (used by Admin Verification Detail: approve/reject/delete) ---------- */
  function initModals() {
    qsa("[data-modal-open]").forEach(function (btn) {
      var modal = document.getElementById(btn.getAttribute("data-modal-open"));
      if (modal) btn.addEventListener("click", function () { modal.classList.add("is-open"); });
    });
    qsa("[data-modal-close]").forEach(function (btn) {
      var modal = btn.closest(".modal-overlay");
      if (!modal) return;
      // Only intercept plain <button> "Cancel" actions. The confirm actions
      // (Confirm Approval / Confirm Rejection / Delete Permanently) are real
      // <a> links to the next screen, so clicking them should navigate as
      // normal rather than being swallowed here.
      if (btn.tagName === "BUTTON") {
        btn.addEventListener("click", function () { modal.classList.remove("is-open"); });
      }
    });
    qsa(".modal-overlay").forEach(function (overlay) {
      overlay.addEventListener("click", function (e) { if (e.target === overlay) overlay.classList.remove("is-open"); });
    });
  }

  /* ---------- Selectable card / pill groups (emergency type, severity, yes/no) ---------- */
  function updateContinueButtons() {
    qsa("[data-continue-requires]").forEach(function (btn) {
      var names = btn.getAttribute("data-continue-requires").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      var ready = names.every(function (name) {
        var group = qs('[data-select-group="' + name + '"]');
        if (!group) return true;
        return qsa(".is-selected", group).length > 0;
      });
      btn.toggleAttribute("disabled", !ready);
    });
  }

  function initSelectGroups() {
    qsa("[data-select-group]").forEach(function (group) {
      var multi = group.getAttribute("data-select-multi") === "true";
      qsa(".select-card, .severity-card, .toggle-pill", group).forEach(function (card) {
        card.addEventListener("click", function () {
          var siblings = qsa(".select-card, .severity-card, .toggle-pill", group);
          if (!multi) siblings.forEach(function (c) { c.classList.remove("is-selected"); });
          card.classList.toggle("is-selected", true);
          group.setAttribute("data-value", card.getAttribute("data-value") || "");
          updateContinueButtons();
        });
      });
    });
    updateContinueButtons();
  }

  // Disabled "button-styled" anchors (e.g. wizard Continue before a selection
  // is made) — real <a> elements have no native disabled state.
  function initDisabledAnchors() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("a[disabled]");
      if (t) e.preventDefault();
    }, true);
  }

  /* ---------- Stepper counters (e.g. "people affected") ---------- */
  function initCounters() {
    qsa("[data-counter]").forEach(function (counter) {
      var valueEl = qs("[data-counter-value]", counter);
      var min = parseInt(counter.getAttribute("data-counter-min") || "1", 10);
      var max = parseInt(counter.getAttribute("data-counter-max") || "99", 10);
      var current = parseInt(valueEl.textContent, 10) || min;
      function render() { valueEl.textContent = String(current); }
      qsa("[data-counter-dec]", counter).forEach(function (btn) { btn.addEventListener("click", function () { if (current > min) { current--; render(); } }); });
      qsa("[data-counter-inc]", counter).forEach(function (btn) { btn.addEventListener("click", function () { if (current < max) { current++; render(); } }); });
      render();
    });
  }

  /* ---------- Tabs (reserved for future multi-tab screens) ---------- */
  function initTabs() {
    qsa("[data-tabs]").forEach(function (tabGroup) {
      var buttons = qsa("[data-tab-target]", tabGroup);
      var panels = qsa("[data-tab-panel]");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          var target = btn.getAttribute("data-tab-target");
          panels.forEach(function (p) { p.hidden = p.getAttribute("data-tab-panel") !== target; });
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDrawers();
    initDropdowns();
    initModals();
    initSelectGroups();
    initDisabledAnchors();
    initCounters();
    initTabs();
  });

  // Exposed so page-specific scripts (citizen-report.js, org-register.js) can
  // re-check continue-button state after they change selections programmatically.
  window.ResQ = { qs: qs, qsa: qsa, updateContinueButtons: updateContinueButtons };
})();
