document.addEventListener("DOMContentLoaded", function () {
  // Background network: slow-drifting nodes linked when close. Decorative only.
  var canvas = document.getElementById("net");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var colors = ["#ff5d6c", "#fbbf24", "#60a5fa", "#a78bfa", "#34d399"];
    var nodes = [];
    var width = 0;
    var height = 0;
    var LINK = 140;

    var setup = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(70, Math.round((width * height) / 22000));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          c: colors[i % colors.length],
        });
      }
    };

    var draw = function () {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = "rgba(52, 211, 153," + (0.14 * (1 - d / LINK)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = nodes[k].c;
        ctx.beginPath();
        ctx.arc(nodes[k].x, nodes[k].y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    var step = function () {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx = -n.vx;
        if (n.y < 0 || n.y > height) n.vy = -n.vy;
      }
      draw();
      if (!document.hidden) requestAnimationFrame(step);
    };

    setup();
    if (calm) {
      draw();
    } else {
      requestAnimationFrame(step);
      document.addEventListener("visibilitychange", function () {
        if (!document.hidden) requestAnimationFrame(step);
      });
    }
    var resizeTimer = 0;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { setup(); draw(); }, 150);
    });
  }

  // Contact dialog.
  var dialog = document.getElementById("contact-dialog");
  var openBtn = document.getElementById("open-contact");
  var closeBtn = document.getElementById("close-contact");
  if (dialog && openBtn && typeof dialog.showModal === "function") {
    openBtn.addEventListener("click", function () { dialog.showModal(); });
    closeBtn.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  } else if (openBtn) {
    openBtn.addEventListener("click", function () { window.location.href = "mailto:akshayma@gmail.com"; });
  }

  // Contact form (Formspree).
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var button = form.querySelector("button[type=submit]");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
      status.dataset.state = "error";
      status.textContent = "The form isn't connected yet. Please email akshayma@gmail.com.";
      return;
    }
    button.disabled = true;
    status.dataset.state = "";
    status.textContent = "Sending…";
    try {
      var response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      status.dataset.state = "ok";
      status.textContent = "Thanks, your message was sent.";
    } catch (error) {
      status.dataset.state = "error";
      status.textContent = "Something went wrong. Please email akshayma@gmail.com instead.";
    } finally {
      button.disabled = false;
    }
  });
});
