// ============================================================
//  RICS Technologies - script.js (Updated with Admin Sync)
//  Purana code bilkul same hai, sirf courses section
//  ab localStorage se dynamically render hota hai
// ============================================================

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

setInterval(changeBg, 5000);
changeBg();

// ============================================================
//  NAYA CODE: Dynamic Course Rendering from Admin Panel
//  (Ye courses section ko localStorage se sync karta hai)
// ============================================================

// Default courses (admin.js ke saath match karte hain)
const DEFAULT_COURSES = [
  {
    id: 1,
    icon: "💻",
    title: "CCC",
    duration: "3 Months",
    level: "Beginner",
    desc: "Government Certified Computer Course",
    origPrice: 3500,
    discPrice: 2499,
  },
  {
    id: 2,
    icon: "🎓",
    title: "O Level",
    duration: "1 Year",
    level: "Advanced",
    desc: "NIELIT Government Certification Program",
    origPrice: 15000,
    discPrice: 12000,
  },
  {
    id: 3,
    icon: "🖥",
    title: "DCA",
    duration: "6 Months",
    level: "Beginner",
    desc: "Diploma in Computer Applications",
    origPrice: 6000,
    discPrice: 4500,
  },
  {
    id: 4,
    icon: "🚀",
    title: "ADCA",
    duration: "1 Year",
    level: "Advanced",
    desc: "Advanced Diploma with Live Projects",
    origPrice: 12000,
    discPrice: 8999,
  },
  {
    id: 5,
    icon: "📊",
    title: "Tally Prime + GST",
    duration: "4 Months",
    level: "Job Oriented",
    desc: "Complete Accounting & Taxation Training",
    origPrice: 8000,
    discPrice: 5999,
  },
  {
    id: 6,
    icon: "🌐",
    title: "Web Development",
    duration: "6 Months",
    level: "Live Projects",
    desc: "HTML, CSS, JavaScript & Website Projects",
    origPrice: 10000,
    discPrice: 7500,
  },
  {
    id: 7,
    icon: "🎨",
    title: "Graphic Designing",
    duration: "4 Months",
    level: "Creative Field",
    desc: "Photoshop, CorelDraw & Canva",
    origPrice: 7000,
    discPrice: 4999,
  },
  {
    id: 8,
    icon: "🐍",
    title: "Python Programming",
    duration: "5 Months",
    level: "Coding",
    desc: "Programming from Basic to Advanced",
    origPrice: 9000,
    discPrice: 6499,
  },
  {
    id: 9,
    icon: "📱",
    title: "Digital Marketing",
    duration: "3 Months",
    level: "Online Career",
    desc: "SEO, Social Media & Google Ads",
    origPrice: 6000,
    discPrice: 3999,
  },
  {
    id: 10,
    icon: "⌨",
    title: "Typing Course",
    duration: "2 Months",
    level: "Practice Based",
    desc: "Hindi & English Typing Training",
    origPrice: 2000,
    discPrice: 1200,
  },
  {
    id: 11,
    icon: "🔧",
    title: "Hardware & Networking",
    duration: "6 Months",
    level: "Technical",
    desc: "Computer Repairing & Networking",
    origPrice: 8000,
    discPrice: 5500,
  },
  {
    id: 12,
    icon: "⚙️",
    title: "C & C++ Programming",
    duration: "4 Months",
    level: "Foundation",
    desc: "Learn Logic Building with C and OOPs with C++",
    origPrice: 5000,
    discPrice: 3499,
  },
  {
    id: 13,
    icon: "☕",
    title: "Java (Core + Advanced)",
    duration: "6 Months",
    level: "Backend",
    desc: "Complete Java, Servlets, JSP & Frameworks",
    origPrice: 12000,
    discPrice: 8500,
  },
  {
    id: 14,
    icon: "📊",
    title: "Data Structures (DSA)",
    duration: "3 Months",
    level: "Interview Prep",
    desc: "Master Algorithms & Problem Solving Skills",
    origPrice: 8000,
    discPrice: 5999,
  },
  {
    id: 15,
    icon: "🗄️",
    title: "MySQL Database",
    duration: "2 Months",
    level: "Database",
    desc: "SQL Queries, Database Design & Management",
    origPrice: 4000,
    discPrice: 2499,
  },
];

function getCourses() {
  const saved = localStorage.getItem("rics_courses");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return DEFAULT_COURSES;
}

function renderCourses() {
  const container = document.querySelector(".courses");
  if (!container) return;

  const courses = getCourses();
  container.innerHTML = "";

  courses.forEach((c) => {
    const discountPct = Math.round(
      ((c.origPrice - c.discPrice) / c.origPrice) * 100,
    );
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-icon">${c.icon || "📚"}</div>
      <h3>${c.title}</h3>
      <p class="course-info">Duration: ${c.duration} | Level: ${c.level}</p>
      <div class="price-container">
        <span class="original-price">₹${Number(c.origPrice).toLocaleString("en-IN")}</span>
        <span class="discount-price">₹${Number(c.discPrice).toLocaleString("en-IN")}</span>
        <span class="discount-badge">${discountPct}% OFF</span>
      </div>
      <p>${c.desc}</p>
      <br/>
      <a href="javascript:void(0)" onclick="openPopup()" class="enroll-btn">Enroll Now</a>
    `;
    container.appendChild(card);
  });

  // Admission form dropdown bhi update karo
  updateAdmissionDropdown(courses);
}

function updateAdmissionDropdown(courses) {
  const select = document.querySelector(
    '#admission-form select[name="Course"]',
  );
  if (!select) return;

  // Pehle wale options hata do (default option rakhenge)
  select.innerHTML = `<option value="" disabled selected>Select Course</option>`;
  courses.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.title;
    opt.textContent = c.title;
    select.appendChild(opt);
  });
}

// Page load hone par courses render karo
document.addEventListener("DOMContentLoaded", renderCourses);
