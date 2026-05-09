// APNA NAYA DEPLOYMENT URL YAHAN DALEIN
const scriptURL =
  "https://script.google.com/macros/s/AKfycbzqbFz6aF3me75hAZCujZUnPX1qGLbH21ejGn_hVXcj0sV1BspOyEa3cQ0kqvNYjyHE/exec";

// --- 1. ADMISSION FORM LOGIC (Popup wala) ---
const admissionForm = document.getElementById("admission-form");
const admissionBtn = document.getElementById("submit-btn");
const msg = document.getElementById("msg");

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

// --- 2. CONTACT FORM LOGIC (Bottom wala) ---
const contactForm = document.getElementById("contact-form");
const contactBtn = document.getElementById("contact-submit-btn");

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

// --- 3. UI LOGIC (Popup & Background) ---
function openPopup() {
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Hero Background Slider
const images = [
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
];

let currentIndex = 0;
function changeBg() {
  const hero = document.getElementById("hero");
  if (hero) {
    hero.style.backgroundImage = `url('${images[currentIndex]}')`;
    currentIndex = (currentIndex + 1) % images.length;
  }
}
setInterval(changeBg, 5000);
changeBg();
