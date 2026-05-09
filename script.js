// APNA NAYA DEPLOYMENT URL YAHAN DALEIN
const scriptURL =
  "https://script.google.com/macros/s/AKfycbzqbFz6aF3me75hAZCujZUnPX1qGLbH21ejGn_hVXcj0sV1BspOyEa3cQ0kqvNYjyHE/exec";

// Performance Optimization: DOM Caching
const admissionForm = document.getElementById("admission-form");
const admissionBtn = document.getElementById("submit-btn");
const contactForm = document.getElementById("contact-form");
const contactBtn = document.getElementById("contact-submit-btn");
const msg = document.getElementById("msg");
const heroSection = document.getElementById("hero");
const popupModal = document.getElementById("popup");

// --- 1. ADMISSION FORM LOGIC ---
if (admissionForm) {
  admissionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    admissionBtn.innerHTML = "Sending...";

    fetch(scriptURL, { method: "POST", body: new FormData(admissionForm) })
      .then((response) => {
        msg.style.display = "block";
        admissionForm.reset();
        admissionBtn.innerHTML = "Submit Inquiry";
        setTimeout(() => {
          msg.style.display = "none";
          closePopup();
        }, 3000);
      })
      .catch((error) => {
        console.error("Error!", error.message);
        admissionBtn.innerHTML = "Submit Inquiry";
      });
  });
}

// --- 2. CONTACT FORM LOGIC ---
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    contactBtn.innerHTML = "Sending...";

    fetch(scriptURL, { method: "POST", body: new FormData(contactForm) })
      .then((response) => {
        alert("Message Sent Successfully!");
        contactForm.reset();
        contactBtn.innerHTML = "Send Message";
      })
      .catch((error) => {
        console.error("Error!", error.message);
        contactBtn.innerHTML = "Send Message";
      });
  });
}

// --- 3. UI LOGIC (Optimized) ---
function openPopup() {
  if (popupModal) popupModal.style.display = "flex";
}

function closePopup() {
  if (popupModal) popupModal.style.display = "none";
}

// Hero Background Slider (Optimized with Pre-loading)
const images = [
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
];

// Images ko memory mein pre-load karna taaki performance badhe
images.forEach((src) => {
  const img = new Image();
  img.src = src;
});

let currentIndex = 0;
function changeBg() {
  if (heroSection) {
    heroSection.style.backgroundImage = `url('${images[currentIndex]}')`;
    currentIndex = (currentIndex + 1) % images.length;
  }
}

// Performance Tip: Use RequestAnimationFrame or lower interval for less CPU strain
setInterval(changeBg, 5000);
changeBg();
