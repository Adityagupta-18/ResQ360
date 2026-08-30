/* ==========================================================================
   ResQ360 — Organization Registration multi-step form
   Purely client-side step switching for this prototype phase. On the final
   step, "Continue" becomes the real submit action and navigates to the
   Verification Pending screen via the URL supplied in data-final-href.
   Include this file only on the Organization Registration screen.
   ========================================================================== */
(function () {
  "use strict";
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  document.addEventListener("DOMContentLoaded", function () {
    var nextBtn = document.getElementById("regNextBtn");
    var backBtn = document.getElementById("regBackBtn");
    var stepLabel = document.getElementById("regStepLabel");
    if (!nextBtn) return; // not on the registration screen

    var TOTAL_STEPS = 3;
    var step = 1;

    function render() {
      qsa("[data-reg-panel]").forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-reg-panel") !== String(step);
      });
      qsa("[data-reg-step]").forEach(function (dot) {
        var s = parseInt(dot.getAttribute("data-reg-step"), 10);
        dot.classList.toggle("is-done", s < step);
        dot.classList.toggle("is-active", s === step);
      });
      if (stepLabel) stepLabel.textContent = String(step);
      if (backBtn) backBtn.style.visibility = step === 1 ? "hidden" : "visible";
      nextBtn.textContent = step === TOTAL_STEPS ? "Submit for Verification" : "Continue";
    }

    nextBtn.addEventListener("click", function () {
      if (step < TOTAL_STEPS) {
        step++;
        render();
      } else {
        var href = nextBtn.getAttribute("data-final-href");
        if (href) window.location.href = href;
      }
    });

    if (backBtn) {
      backBtn.addEventListener("click", function () {
        if (step > 1) { step--; render(); }
      });
    }

    render();
  });
})();
