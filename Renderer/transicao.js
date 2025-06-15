document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("a[href]");
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      if (href && href !== "#" && !href.startsWith("javascript:")) {
        e.preventDefault();
        const overlay = document.getElementById("loading-overlay");
        if (overlay) {
          overlay.classList.add("active");
        }
        setTimeout(() => {
          window.location.href = href;
        },500);
      }
    });
  });
});

  window.addEventListener("load", function () {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      overlay.classList.remove("active");
    }
  });

  function exibirOverlayEAposDelay(callback, delay = 500) {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.classList.add("active");
  }

  setTimeout(() => {
    if (typeof callback === "function") {
      callback();
    }
    if (overlay) {
      overlay.classList.remove("active");
    }
  }, delay);
}
