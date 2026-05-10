// ============================================================
//  RICS Technologies - script.js (Final Version)
//  - Form Validation (Admission + Contact)
//  - Dynamic Courses from Google Sheets
//  - Dynamic Gallery from Google Sheets
// ============================================================

const scriptURL =
  "https://script.google.com/macros/s/AKfycbzIvA-rLO0vjL218yUF9HqANzf7TpTzeXroybKCZ3y0735Z6vHudfCEitULpeofTI9P/exec";

const admissionForm = document.getElementById("admission-form");
const admissionBtn = document.getElementById("submit-btn");
const contactForm = document.getElementById("contact-form");
const contactBtn = document.getElementById("contact-submit-btn");
const msg = document.getElementById("msg");
const heroSection = document.getElementById("hero");
const popupModal = document.getElementById("popup");

// ============================================================
//  VALIDATION HELPERS
// ============================================================
function showFieldError(input, message) {
  clearFieldError(input);
  input.style.borderColor = "#e63946";
  const err = document.createElement("span");
  err.className = "field-error";
  err.style.cssText =
    "color:#e63946;font-size:0.78rem;margin-top:4px;display:block;font-weight:500;";
  err.textContent = message;
  input.parentElement.appendChild(err);
}

function clearFieldError(input) {
  input.style.borderColor = "";
  const existing = input.parentElement.querySelector(".field-error");
  if (existing) existing.remove();
}

function validateName(name) {
  if (!name.trim()) return "Naam zaroori hai!";
  if (name.trim().length < 3)
    return "Naam kam se kam 3 characters ka hona chahiye!";
  if (!/^[a-zA-Z\s\u0900-\u097F]+$/.test(name.trim()))
    return "Naam mein sirf letters allowed hain!";
  return null;
}

function validateMobile(mobile) {
  if (!mobile.trim()) return "Mobile number zaroori hai!";
  if (!/^[6-9]\d{9}$/.test(mobile.trim()))
    return "Valid 10-digit Indian mobile number daalo!";
  return null;
}

function validateEmail(email) {
  if (!email.trim()) return "Email zaroori hai!";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "Valid email address daalo!";
  return null;
}

function validateMessage(message) {
  if (!message.trim()) return "Message zaroori hai!";
  if (message.trim().length < 10)
    return "Message kam se kam 10 characters ka hona chahiye!";
  return null;
}

// ============================================================
//  1. ADMISSION FORM
// ============================================================
if (admissionForm) {
  // Real-time validation
  const nameInput = admissionForm.querySelector('input[name="Name"]');
  const mobileInput = admissionForm.querySelector('input[name="Mobile"]');
  const courseSelect = admissionForm.querySelector('select[name="Course"]');

  if (nameInput)
    nameInput.addEventListener("input", () => {
      const e = validateName(nameInput.value);
      e ? showFieldError(nameInput, e) : clearFieldError(nameInput);
    });
  if (mobileInput)
    mobileInput.addEventListener("input", () => {
      const e = validateMobile(mobileInput.value);
      e ? showFieldError(mobileInput, e) : clearFieldError(mobileInput);
    });

  admissionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    // Name
    const nameErr = validateName(nameInput ? nameInput.value : "");
    if (nameErr) {
      showFieldError(nameInput, nameErr);
      valid = false;
    } else if (nameInput) clearFieldError(nameInput);

    // Mobile
    const mobErr = validateMobile(mobileInput ? mobileInput.value : "");
    if (mobErr) {
      showFieldError(mobileInput, mobErr);
      valid = false;
    } else if (mobileInput) clearFieldError(mobileInput);

    // Course
    if (courseSelect && !courseSelect.value) {
      showFieldError(courseSelect, "Course select karna zaroori hai!");
      valid = false;
    } else if (courseSelect) clearFieldError(courseSelect);

    if (!valid) return;

    admissionBtn.innerHTML = "Sending... <i class='fa fa-spinner fa-spin'></i>";
    admissionBtn.disabled = true;

    fetch(scriptURL, { method: "POST", body: new FormData(admissionForm) })
      .then(() => {
        msg.style.display = "block";
        admissionForm.reset();
        admissionBtn.innerHTML = "Submit Inquiry";
        admissionBtn.disabled = false;
        setTimeout(() => {
          msg.style.display = "none";
          closePopup();
        }, 3000);
      })
      .catch((error) => {
        console.error("Error!", error.message);
        admissionBtn.innerHTML = "Submit Inquiry";
        admissionBtn.disabled = false;
        alert("Kuch error hua! Dobara try karein.");
      });
  });
}

// ============================================================
//  2. CONTACT FORM
// ============================================================
if (contactForm) {
  const cName = contactForm.querySelector('input[name="Name"]');
  const cEmail = contactForm.querySelector('input[name="Email"]');
  const cMessage = contactForm.querySelector('textarea[name="Message"]');

  if (cName)
    cName.addEventListener("input", () => {
      const e = validateName(cName.value);
      e ? showFieldError(cName, e) : clearFieldError(cName);
    });
  if (cEmail)
    cEmail.addEventListener("input", () => {
      const e = validateEmail(cEmail.value);
      e ? showFieldError(cEmail, e) : clearFieldError(cEmail);
    });
  if (cMessage)
    cMessage.addEventListener("input", () => {
      const e = validateMessage(cMessage.value);
      e ? showFieldError(cMessage, e) : clearFieldError(cMessage);
    });

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const nameErr = validateName(cName ? cName.value : "");
    if (nameErr) {
      showFieldError(cName, nameErr);
      valid = false;
    } else if (cName) clearFieldError(cName);

    const emailErr = validateEmail(cEmail ? cEmail.value : "");
    if (emailErr) {
      showFieldError(cEmail, emailErr);
      valid = false;
    } else if (cEmail) clearFieldError(cEmail);

    const msgErr = validateMessage(cMessage ? cMessage.value : "");
    if (msgErr) {
      showFieldError(cMessage, msgErr);
      valid = false;
    } else if (cMessage) clearFieldError(cMessage);

    if (!valid) return;

    contactBtn.innerHTML = "Sending... <i class='fa fa-spinner fa-spin'></i>";
    contactBtn.disabled = true;

    fetch(scriptURL, { method: "POST", body: new FormData(contactForm) })
      .then(() => {
        alert("✅ Message Sent Successfully!");
        contactForm.reset();
        contactBtn.innerHTML = "Send Message";
        contactBtn.disabled = false;
      })
      .catch((error) => {
        console.error("Error!", error.message);
        contactBtn.innerHTML = "Send Message";
        contactBtn.disabled = false;
        alert("Kuch error hua! Dobara try karein.");
      });
  });
}

// ============================================================
//  3. POPUP
// ============================================================
function openPopup() {
  if (popupModal) popupModal.style.display = "flex";
}
function closePopup() {
  if (popupModal) popupModal.style.display = "none";
}

// ============================================================
//  4. HERO SLIDER
// ============================================================
const images = [
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
];
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
//  5. DYNAMIC COURSES (Google Sheets)
// ============================================================
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

function renderCourses(courses) {
  const container = document.querySelector(".courses");
  if (!container) return;
  container.innerHTML = "";
  courses.forEach((c) => {
    const pct = Math.round(((c.origPrice - c.discPrice) / c.origPrice) * 100);
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-icon">${c.icon || "📚"}</div>
      <h3>${c.title}</h3>
      <p class="course-info">Duration: ${c.duration} | Level: ${c.level}</p>
      <div class="price-container">
        <span class="original-price">₹${Number(c.origPrice).toLocaleString("en-IN")}</span>
        <span class="discount-price">₹${Number(c.discPrice).toLocaleString("en-IN")}</span>
        <span class="discount-badge">${pct}% OFF</span>
      </div>
      <p>${c.desc}</p><br/>
      <a href="javascript:void(0)" onclick="openPopup()" class="enroll-btn">Enroll Now</a>`;
    container.appendChild(card);
  });
  updateDropdown(courses);
}

function updateDropdown(courses) {
  const select = document.querySelector(
    '#admission-form select[name="Course"]',
  );
  if (!select) return;
  select.innerHTML = `<option value="" disabled selected>Select Course</option>`;
  courses.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.title;
    opt.textContent = c.title;
    select.appendChild(opt);
  });
}

// ============================================================
//  6. DYNAMIC GALLERY (Google Sheets)
// ============================================================
function renderGallery(images) {
  const galleryEl = document.querySelector(".gallery");
  if (!galleryEl) return;

  if (!images || !images.length) return; // purani static images rehne do

  galleryEl.innerHTML = "";
  images.forEach((img) => {
    const el = document.createElement("img");
    el.src = img.imageData;
    el.alt = img.altText || "Gallery";
    el.loading = "lazy";
    galleryEl.appendChild(el);
  });
}

// ============================================================
//  PAGE LOAD - Fetch Everything
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Courses
  fetch(scriptURL + "?action=getCourses")
    .then((r) => r.json())
    .then((data) => {
      if (
        data.result === "success" &&
        data.courses &&
        data.courses.length > 0
      ) {
        renderCourses(
          data.courses.map((c) => ({
            ...c,
            origPrice: Number(c.origPrice),
            discPrice: Number(c.discPrice),
          })),
        );
      } else {
        renderCourses(DEFAULT_COURSES);
      }
    })
    .catch(() => renderCourses(DEFAULT_COURSES));

  // Gallery
  fetch(scriptURL + "?action=getGallery")
    .then((r) => r.json())
    .then((data) => {
      if (data.result === "success" && data.images && data.images.length > 0) {
        renderGallery(data.images);
      }
    })
    .catch(() => {}); // error par purani static gallery rehne do
});
