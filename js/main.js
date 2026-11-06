(() => {
  "use strict";

  const doc = document.documentElement;
  const header = document.querySelector("[data-header]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const topLinks = Array.from(document.querySelectorAll(".top-nav a"));
  const bottomLinks = Array.from(document.querySelectorAll(".bottom-nav a"));
  const sections = Array.from(
    document.querySelectorAll("#inicio, main section[id]")
  );
  const progressBar = document.querySelector("[data-progress]");
  const toTop = document.querySelector("[data-to-top]");
  const metrics = document.querySelector(".metrics");
  const chartCard = document.querySelector("[data-chart]");
  const gauge = document.querySelector("[data-gauge]");
  const gaugeLabel = document.querySelector("[data-gauge-label]");
  const hero = document.querySelector(".hero");
  const media = document.querySelector("[data-parallax]");
  const dashboard = document.querySelector(".window");

  /* Scroll: header, navegación, progreso y volver arriba ------------------- */
  let scrollTicking = false;

  const updateActiveNav = () => {
    if (!sections.length) return;

    const y = window.scrollY + 130;
    let current = sections[0];

    for (const section of sections) {
      if (section.offsetTop <= y) current = section;
    }

    const activeHref = `#${current.id}`;
    const bottomHref =
      current.id === "formacion" ? "#experiencia" : activeHref;

    const setActive = (links, href) => {
      links.forEach((link) => {
        const isActive = link.getAttribute("href") === href;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    setActive(topLinks, activeHref);
    setActive(bottomLinks, bottomHref);
  };

  const updateScrollUI = () => {
    const y = window.scrollY;
    const max = Math.max(doc.scrollHeight - window.innerHeight, 1);

    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-visible", y > 560);
    if (progressBar) {
      progressBar.style.transform = `scaleX(${Math.min(y / max, 1)})`;
    }

    updateActiveNav();
    scrollTicking = false;
  };

  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollUI);
  };

  updateScrollUI();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* Smooth scrolling para todos los enlaces internos ----------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start",
      });

      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", href);
      }
    });
  });

  /* Aparición de contenido al hacer scroll -------------------------------- */
  const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));

  const showAllReveals = () => {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  };

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    showAllReveals();
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* Gráfico: dibujo progresivo -------------------------------------------- */
  const drawChart = () => {
    if (chartCard) chartCard.classList.add("is-drawn");
  };

  if (chartCard) {
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      drawChart();
    } else {
      const chartObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            drawChart();
            observer.disconnect();
          });
        },
        { threshold: 0.25 }
      );

      chartObserver.observe(chartCard);
    }
  }

  /* Métricas: contadores y gauge ------------------------------------------ */
  const animateCount = (element) => {
    const target = Number.parseInt(element.getAttribute("data-count"), 10) || 0;
    const pad = Number.parseInt(element.getAttribute("data-pad"), 10) || 0;

    if (reduceMotion.matches) {
      element.textContent = String(target).padStart(pad, "0");
      return;
    }

    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased)).padStart(pad, "0");
      if (progress < 1) window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  };

  const animateGauge = () => {
    if (!gauge) return;

    const target = Number.parseInt(gauge.getAttribute("data-gauge"), 10) || 0;

    if (reduceMotion.matches) {
      gauge.style.setProperty("--p", String(target));
      if (gaugeLabel) gaugeLabel.textContent = `${target}%`;
      return;
    }

    gauge.style.setProperty("--p", "0");
    if (gaugeLabel) gaugeLabel.textContent = "0%";

    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      gauge.style.setProperty("--p", String(value));
      if (gaugeLabel) gaugeLabel.textContent = `${value}%`;

      if (progress < 1) window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  };

  const activateMetrics = () => {
    if (!metrics || metrics.dataset.animated === "true") return;
    metrics.dataset.animated = "true";
    metrics.classList.add("is-active");
    metrics.querySelectorAll("[data-count]").forEach(animateCount);
    animateGauge();
  };

  if (metrics) {
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      activateMetrics();
    } else {
      const metricsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            activateMetrics();
            observer.disconnect();
          });
        },
        { threshold: 0.25 }
      );

      metricsObserver.observe(metrics);
    }
  }

  /* Parallax y tilt 3D del panel ------------------------------------------ */
  if (hero && media && finePointer.matches && !reduceMotion.matches) {
    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let targetRX = 0;
    let targetRY = 0;

    const render = () => {
      frame = 0;
      media.style.setProperty("--px", `${targetX.toFixed(2)}px`);
      media.style.setProperty("--py", `${targetY.toFixed(2)}px`);

      if (dashboard) {
        dashboard.style.setProperty("--rx", `${targetRX.toFixed(2)}deg`);
        dashboard.style.setProperty("--ry", `${targetRY.toFixed(2)}deg`);
      }
    };

    const paint = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    hero.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;

      targetX = nx * 10;
      targetY = ny * 10;

      if (dashboard) {
        const rect = dashboard.getBoundingClientRect();
        const cx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const cy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
        targetRY = Math.max(-4, Math.min(4, cx * 5));
        targetRX = Math.max(-4, Math.min(4, -cy * 5));
      }

      paint();
    });

    hero.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      targetRX = 0;
      targetRY = 0;
      paint();
    });
  }

  /* Hover con foco de luz -------------------------------------------------- */
  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll(".card, .window").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;

        const rect = element.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        element.style.setProperty("--mx", `${x.toFixed(1)}%`);
        element.style.setProperty("--my", `${y.toFixed(1)}%`);
      });
    });
  }

  /* Solicitud de hoja de vida --------------------------------------------- */
  const cvDialog = document.getElementById("cv-dialog");
  const cvForm = cvDialog ? cvDialog.querySelector("[data-cv-form]") : null;
  const cvStatus = cvDialog ? cvDialog.querySelector("[data-cv-status]") : null;

  const openCvDialog = () => {
    if (!cvDialog) return;
    if (cvStatus) cvStatus.textContent = "";

    if (typeof cvDialog.showModal === "function") {
      cvDialog.showModal();
    } else {
      cvDialog.setAttribute("open", "");
    }

    document.body.classList.add("modal-open");

    const firstField = cvDialog.querySelector("input");
    if (firstField) {
      window.setTimeout(() => firstField.focus(), 60);
    }
  };

  const closeCvDialog = () => {
    if (!cvDialog) return;

    if (typeof cvDialog.close === "function") {
      cvDialog.close();
    } else {
      cvDialog.removeAttribute("open");
      document.body.classList.remove("modal-open");
    }
  };

  document.querySelectorAll("[data-cv-request]").forEach((button) => {
    button.addEventListener("click", openCvDialog);
  });

  if (cvDialog) {
    cvDialog.querySelectorAll("[data-cv-close]").forEach((button) => {
      button.addEventListener("click", closeCvDialog);
    });

    cvDialog.addEventListener("click", (event) => {
      const rect = cvDialog.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) closeCvDialog();
    });

    cvDialog.addEventListener("close", () => {
      document.body.classList.remove("modal-open");
    });
  }

  if (cvForm) {
    cvForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(cvForm);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const company = String(data.get("company") || "").trim();
      const message = String(data.get("message") || "").trim();

      const subject = `Solicitud de hoja de vida — ${name || "Portafolio"}`;
      const body = [
        "Hola Oscar,",
        "",
        "Solicito tu hoja de vida.",
        "",
        `Nombre: ${name}`,
        `Correo: ${email}`,
        `Empresa u organización: ${company || "No indicada"}`,
        "",
        "Motivo de la solicitud:",
        message,
        "",
        "Acepto que mis datos se usen únicamente para gestionar esta solicitud.",
      ].join("\n");

      const mailto =
        "mailto:oscar.gomez@autonoma.edu.co" +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      if (cvStatus) {
        cvStatus.textContent =
          "Se abrirá tu cliente de correo. Si no ocurre, escribe a oscar.gomez@autonoma.edu.co.";
      }

      window.location.href = mailto;
    });
  }

  /* Copiar correo ----------------------------------------------------------- */
  const legacyCopy = (text) => {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    field.style.pointerEvents = "none";
    document.body.appendChild(field);
    field.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    field.remove();
    return copied;
  };

  document.querySelectorAll("[data-copy]").forEach((button) => {
    const label = button.querySelector("[data-copy-label]");
    const originalLabel = label ? label.textContent : "";
    let timer = 0;

    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy") || "";
      let copied = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(value);
          copied = true;
        } catch (error) {
          copied = legacyCopy(value);
        }
      } else {
        copied = legacyCopy(value);
      }

      if (label) {
        label.textContent = copied ? "Correo copiado" : "No se pudo copiar";
      }
      button.classList.toggle("is-copied", copied);

      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (label) label.textContent = originalLabel;
        button.classList.remove("is-copied");
      }, 2200);
    });
  });

  /* Año actual ------------------------------------------------------------- */
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(year);
  });
})();
