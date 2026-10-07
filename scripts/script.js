/* Línea Base · comportamiento general */
(function () {
  var body = document.body;
  var loader = document.getElementById("loader");

  function start() {
    body.classList.remove("loading");
    body.classList.add("ready");
  }

  // Páginas sin pantalla de carga
  if (!loader) { start(); }
  else {
    var seen = false;
    try { seen = sessionStorage.getItem("lb-loaded") === "1"; } catch (e) {}

    var bar = loader.querySelector(".loader-bar i");
    var count = loader.querySelector(".loader-count");
    var duration = seen ? 500 : 2200;
    var t0 = performance.now();
    var finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      loader.classList.add("done");
      try { sessionStorage.setItem("lb-loaded", "1"); } catch (e) {}
      setTimeout(start, 450);
      setTimeout(function () { loader.style.display = "none"; }, 1200);
    }

    function tick(now) {
      var p = Math.min((now - t0) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      bar.style.transform = "scaleX(" + eased + ")";
      count.textContent = Math.round(eased * 100);
      if (p < 1) requestAnimationFrame(tick);
      else if (document.readyState === "complete") finish();
      else window.addEventListener("load", finish, { once: true });
    }
    requestAnimationFrame(tick);
    setTimeout(finish, 6000); // seguro por si algo falla
  }

  // Revelado al hacer scroll
  var items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
})();
