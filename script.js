/* =========================================
   NOVA — JAVASCRIPT PRINCIPAL
========================================= */

// =========================================
// CONFIGURACIÓN EMAILJS
// =========================================

const SERVICE_ID = "service_bov2lt8";
const TEMPLATE_ID = "template_akjyxnx";
const PUBLIC_KEY = "Bar1lgeVmtNYUihyT";

let emailJSReady = false;

if (window.emailjs) {
  emailjs.init({
    publicKey: PUBLIC_KEY
  });
  emailJSReady = true;
}

// =========================================
// INTRO DE APERTURA
// =========================================

const intro = document.getElementById("intro");

document.body.classList.add("intro-active");

function iniciarIntro() {
  if (!intro) {
    document.body.classList.remove("intro-active");
    iniciarAnimaciones();
    return;
  }

  setTimeout(() => {
    intro.classList.add("open");
  }, 500);

  setTimeout(() => {
    intro.classList.add("done");
    document.body.classList.remove("intro-active");
    iniciarAnimaciones();
  }, 2700);
}

if (document.readyState === "complete") {
  iniciarIntro();
} else {
  window.addEventListener("load", iniciarIntro, { once: true });
}

// =========================================
// ANIMACIÓN DE TÍTULOS LETRA POR LETRA
// =========================================

function prepararLetras() {
  const titles = document.querySelectorAll(".letter-title");

  titles.forEach((title) => {
    if (title.dataset.prepared === "true") return;

    const walker = document.createTreeWalker(
      title,
      NodeFilter.SHOW_TEXT
    );

    const textNodes = [];
    let node;

    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      const characters = Array.from(textNode.textContent);

      characters.forEach((character) => {
        if (character === "\n") {
          fragment.appendChild(document.createTextNode(character));
          return;
        }

        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = character;

        fragment.appendChild(span);
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });

    title.dataset.prepared = "true";
  });
}

function animarTitulo(title) {
  if (!title) return;

  title.classList.add("play");

  const letters = title.querySelectorAll(".letter");

  letters.forEach((letter, index) => {
    letter.style.setProperty(
      "--delay",
      `${Math.min(index * 35, 900)}ms`
    );
  });
}

// =========================================
// ANIMACIONES AL HACER SCROLL
// =========================================

function iniciarAnimaciones() {
  document.body.classList.add("js-ready");

  prepararLetras();

  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
      element.querySelectorAll(".letter-title").forEach(animarTitulo);
    });
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;

      element.classList.add("visible");

      element.querySelectorAll(".letter-title").forEach(animarTitulo);

      currentObserver.unobserve(element);
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -35px 0px"
  });

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

// =========================================
// MENÚ PARA CELULARES
// =========================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// =========================================
// BARRA DE PROGRESO
// =========================================

const scrollProgress = document.getElementById("scrollProgress");

function actualizarProgreso() {
  if (!scrollProgress) return;

  const altura =
    document.documentElement.scrollHeight - window.innerHeight;

  const progreso = altura > 0
    ? (window.scrollY / altura) * 100
    : 0;

  scrollProgress.style.width = `${progreso}%`;
}

window.addEventListener("scroll", actualizarProgreso, {
  passive: true
});

actualizarProgreso();

// =========================================
// FORMULARIO DE SUSCRIPCIÓN EMAILJS
// =========================================

const subscribeForm = document.getElementById("subscribe-form");
const submitButton = document.getElementById("submit-button");
const message = document.getElementById("message");

if (subscribeForm) {
  subscribeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    message.textContent = "";
    message.className = "form-message";

    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    // Campo oculto antispam
    const honeypot = subscribeForm.querySelector(
      'input[name="website"]'
    );

    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    // Validación del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      message.textContent = "Por favor, escribe un correo válido.";
      message.classList.add("error");
      return;
    }

    if (!emailJSReady || !window.emailjs) {
      message.textContent =
        "No se pudo conectar con el servicio. Recarga la página e inténtalo de nuevo.";
      message.classList.add("error");
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = "CONECTANDO...";

    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        subscribeForm
      );

      message.textContent =
        "¡Excelente! Tu correo quedó registrado. Bienvenido a NOVA.";
      message.classList.add("success");

      subscribeForm.reset();

    } catch (error) {
      console.error("Error de EmailJS:", error);

      message.textContent =
        "No fue posible completar la suscripción. Inténtalo nuevamente.";
      message.classList.add("error");

    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'QUIERO CONECTARME <span>↗</span>';
    }
  });
}

// =========================================
// SISTEMA DE MÚSICA FUTURISTA
// =========================================

const novaMusic = document.getElementById("novaMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const musicText = document.getElementById("musicText");

let musicPlaying = false;
let fadeTimer = null;

if (novaMusic) {
  novaMusic.volume = 0.25;
}

async function activarMusica() {
  if (!novaMusic) return;

  try {
    await novaMusic.play();

    musicPlaying = true;

    musicButton.classList.add("playing");
    musicButton.setAttribute("aria-label", "Pausar música");
    musicIcon.textContent = "♫";
    musicText.textContent = "MÚSICA ACTIVADA";

  } catch (error) {
    console.error("No se pudo reproducir la música:", error);

    musicText.textContent = "INTENTAR DE NUEVO";
    musicButton.classList.remove("playing");
  }
}

function pausarMusica() {
  if (!novaMusic) return;

  novaMusic.pause();

  musicPlaying = false;

  musicButton.classList.remove("playing");
  musicButton.setAttribute("aria-label", "Activar música");
  musicIcon.textContent = "♫";
  musicText.textContent = "ACTIVAR SONIDO";
}

if (musicButton && novaMusic) {
  musicButton.addEventListener("click", () => {
    if (musicPlaying) {
      pausarMusica();
    } else {
      activarMusica();
    }
  });

  novaMusic.addEventListener("error", () => {
    musicText.textContent = "AUDIO NO DISPONIBLE";
    musicButton.classList.remove("playing");
  });
}

// =========================================
// ANIMACIÓN SUAVE DE TARJETAS
// =========================================

const featureCards = document.querySelectorAll(".feature-card");

featureCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 900) return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 2;
    const rotateX = ((centerY - y) / centerY) * 2;

    card.style.transform =
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// =========================================
// AÑO AUTOMÁTICO EN FOOTER
// =========================================

const footerYear = document.querySelector(".footer-bottom span");

if (footerYear) {
  footerYear.textContent =
    `© ${new Date().getFullYear()} NOVA. Todos los derechos reservados.`;
}