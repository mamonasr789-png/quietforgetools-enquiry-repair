(function () {
  var form = document.getElementById("demoForm");
  var labelPhone = document.getElementById("demoLabelPhone");
  var log = document.getElementById("demoLog");
  var btnDetect = document.getElementById("btnDetect");
  var btnRepair = document.getElementById("btnRepair");
  var btnTest = document.getElementById("btnTest");
  var btnReset = document.getElementById("btnReset");
  var pills = {
    broken: document.getElementById("pillBroken"),
    detected: document.getElementById("pillDetected"),
    repaired: document.getElementById("pillRepaired"),
    tested: document.getElementById("pillTested")
  };

  var state = "broken"; // broken | detected | repaired | tested

  function setLog(html) {
    log.innerHTML = html;
  }

  function setPills() {
    var on = {
      broken: state === "broken" || state === "detected",
      detected: state === "detected" || state === "repaired" || state === "tested",
      repaired: state === "repaired" || state === "tested",
      tested: state === "tested"
    };
    Object.keys(pills).forEach(function (k) {
      pills[k].classList.toggle("on", !!on[k]);
    });
  }

  function applyUi(keepFeedback) {
    if (!keepFeedback) {
      form.classList.remove("show-err", "show-ok");
    }
    form.classList.remove("fixed");
    if (state === "broken" || state === "detected") {
      labelPhone.textContent = "Email"; // intentional mislabel
      form.querySelector('button[type="submit"]').textContent = "Submit";
    } else {
      labelPhone.textContent = "Phone";
      form.querySelector('button[type="submit"]').textContent = "Send enquiry";
      form.classList.add("fixed");
    }
    btnDetect.disabled = state !== "broken";
    btnRepair.disabled = state !== "detected";
    btnTest.disabled = !(state === "repaired" || state === "tested");
    setPills();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.classList.remove("show-err", "show-ok");
    if (state === "broken" || state === "detected") {
      form.classList.add("show-err");
      setLog("Submit does nothing useful: the phone field is labelled <code>Email</code>, so visitors leave bad data — and there is no confirmation.");
    } else {
      form.classList.add("show-ok");
      setLog("Test pass: labels match fields, confirmation shows, enquiry path completes in this demo.");
      if (state === "repaired") {
        state = "tested";
        applyUi(true);
      }
    }
  });

  btnDetect.addEventListener("click", function () {
    state = "detected";
    applyUi();
    setLog("Detected issue: <code>&lt;label&gt;</code> on the phone input says <code>Email</code> (wrong association). Confirmation state missing.");
  });

  btnRepair.addEventListener("click", function () {
    state = "repaired";
    applyUi();
    setLog("Repaired: label corrected to <code>Phone</code>, CTA clarified, confirmation message added. Ready to test.");
  });

  btnTest.addEventListener("click", function () {
    if (state !== "repaired" && state !== "tested") return;
    state = "tested";
    applyUi();
    form.classList.add("show-ok");
    setLog("Tested: demo path works end-to-end. On a live site we would also verify desktop + mobile and your real notification route (with your approval).");
  });

  btnReset.addEventListener("click", function () {
    state = "broken";
    form.reset();
    applyUi();
    setLog("Reset to broken path. Step through: Detect → Repair → Test (or try Submit first).");
  });

  var intake = document.getElementById("intakeForm");
  if (intake) {
    intake.addEventListener("submit", function (e) {
      e.preventDefault();
      var pageUrl = document.getElementById("intakeUrl").value.trim();
      var defect = document.getElementById("intakeDefect").value.trim();
      var subject = encodeURIComponent("Enquiry Path Repair — £149");
      var body = encodeURIComponent(
        "Page URL: " + (pageUrl || "(paste URL)") +
        "\n\nWhat isn't working:\n" + (defect || "(describe the defect)") +
        "\n\n— sent from Enquiry Path Repair page"
      );
      window.location.href = "mailto:mamonasr789@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  applyUi();
  setLog("Start: broken enquiry path. Try Submit, then Detect → Repair → Test.");
})();
