// ============================================
//  RICS ADMIN PANEL - admin.js
//  - Secure Login (credentials backend se)
//  - Course Management
//  - Gallery Management (Google Sheets)
// ============================================

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzIvA-rLO0vjL218yUF9HqANzf7TpTzeXroybKCZ3y0735Z6vHudfCEitULpeofTI9P/exec";

// ===== CREDENTIALS (yahan change karo) =====
// NOTE: Ye client-side mein hain, isliye hum extra
// obfuscation use kar rahe hain — environment variables
// sirf Node.js/server par kaam karti hain.
// Best practice: ye values change kar lo aur file private rakho.
const _a = atob("Um9oaXRzYWluaUA2Mzk2"); // "Rohitsaini@6396"
const _b = atob("Uk9ISVRTQUlOSTQ0"); // "ROHITSAINI44"

// ===== STATE =====
let courses = [];
let editingId = null;
let deleteTargetId = null;
let priceTargetId = null;
let galleryImages = [];
let galleryDeleteId = null;
let selectedImageBase64 = null;

// ===== DEFAULT COURSES =====
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

// ============================================
//  LOGIN
// ============================================
function adminLogin() {
  const user = document.getElementById("admin-user").value.trim();
  const pass = document.getElementById("admin-pass").value.trim();
  const errEl = document.getElementById("login-error");

  if (!user || !pass) {
    errEl.textContent = "⚠️ Username aur password dono zaroori hain!";
    setTimeout(() => (errEl.textContent = ""), 3000);
    return;
  }

  if (user === _a && pass === _b) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("dashboard").style.display = "flex";
    init();
  } else {
    errEl.textContent = "❌ Galat username ya password!";
    document.getElementById("admin-pass").value = "";
    setTimeout(() => (errEl.textContent = ""), 3000);
  }
}

document.addEventListener("keydown", (e) => {
  const ls = document.getElementById("login-screen");
  if (e.key === "Enter" && ls && ls.style.display !== "none") adminLogin();
});

function adminLogout() {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("admin-user").value = "";
  document.getElementById("admin-pass").value = "";
}

// ============================================
//  INIT
// ============================================
function init() {
  fetchCourses();
  fetchGallery();
}

// ============================================
//  SIDEBAR NAVIGATION
// ============================================
function showSection(sectionId, clickedLink) {
  document
    .querySelectorAll(".panel-section")
    .forEach((s) => (s.style.display = "none"));
  document.getElementById(sectionId).style.display = "block";

  if (clickedLink) {
    document
      .querySelectorAll(".nav-item")
      .forEach((n) => n.classList.remove("active"));
    clickedLink.classList.add("active");
  }

  const titles = {
    "courses-section": ["Manage Courses", "Edit, delete or update all courses"],
    "add-section": [
      "Add / Edit Course",
      "Naya course add karo ya existing edit karo",
    ],
    "gallery-section": ["Manage Gallery", "Campus gallery images update karo"],
  };
  if (titles[sectionId]) {
    document.getElementById("page-title").textContent = titles[sectionId][0];
    document.getElementById("page-subtitle").textContent = titles[sectionId][1];
  }

  if (sectionId === "add-section" && editingId === null) resetForm();
}

// ============================================
//  COURSES - FETCH
// ============================================
function fetchCourses() {
  document.getElementById("courses-table-body").innerHTML =
    `<tr><td colspan="9" style="text-align:center;padding:40px;color:#aaa;">
      <i class="fa fa-spinner fa-spin" style="font-size:2rem;display:block;margin-bottom:10px;"></i>
      Load ho raha hai...
    </td></tr>`;

  fetch(SCRIPT_URL + "?action=getCourses")
    .then((r) => r.json())
    .then((data) => {
      if (
        data.result === "success" &&
        data.courses &&
        data.courses.length > 0
      ) {
        courses = data.courses.map((c) => ({
          ...c,
          id: Number(c.id),
          origPrice: Number(c.origPrice),
          discPrice: Number(c.discPrice),
        }));
      } else {
        courses = JSON.parse(JSON.stringify(DEFAULT_COURSES));
        saveAllDefaultCourses();
      }
      renderTable();
      updateStats();
    })
    .catch(() => {
      courses = JSON.parse(JSON.stringify(DEFAULT_COURSES));
      renderTable();
      updateStats();
      showToast(
        "⚠️ Sheets connect nahi hua, default data dikh raha hai",
        "error",
      );
    });
}

function saveAllDefaultCourses() {
  DEFAULT_COURSES.forEach((c) => {
    fetch(SCRIPT_URL + "?action=saveCourse", {
      method: "POST",
      body: JSON.stringify(c),
    }).catch((err) => console.error(err));
  });
}

// ============================================
//  COURSES - RENDER TABLE
// ============================================
function renderTable() {
  const tbody = document.getElementById("courses-table-body");
  tbody.innerHTML = "";

  if (!courses.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px;color:#aaa;">
      <i class="fa fa-inbox" style="font-size:2rem;display:block;margin-bottom:10px;"></i>
      Koi course nahi mila.
    </td></tr>`;
    return;
  }

  courses.forEach((c, i) => {
    const pct = Math.round(((c.origPrice - c.discPrice) / c.origPrice) * 100);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="color:#aaa;font-size:.85rem;">${i + 1}</td>
      <td style="font-size:1.6rem;">${c.icon || "📚"}</td>
      <td style="font-weight:600;color:var(--primary);">${c.title}</td>
      <td style="font-size:.83rem;color:#666;">${c.duration} | ${c.level}</td>
      <td style="font-size:.83rem;color:#555;max-width:180px;">${c.desc}</td>
      <td><span style="text-decoration:line-through;color:#aaa;font-size:.82rem;">₹${Number(c.origPrice).toLocaleString("en-IN")}</span></td>
      <td><span style="color:var(--danger);font-weight:700;font-size:1rem;">₹${Number(c.discPrice).toLocaleString("en-IN")}</span></td>
      <td><span class="badge">${pct}% OFF</span></td>
      <td>
        <div class="action-btns">
          <button class="act-btn edit-price-btn" onclick="openPriceModal(${c.id})"><i class="fa fa-tag"></i> Price</button>
          <button class="act-btn edit-btn"       onclick="editCourse(${c.id})"><i class="fa fa-pen"></i> Edit</button>
          <button class="act-btn del-btn"        onclick="openDeleteModal(${c.id})"><i class="fa fa-trash"></i> Delete</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
}

function updateStats() {
  document.getElementById("total-courses-count").textContent = courses.length;
}

// ============================================
//  COURSES - SAVE / EDIT
// ============================================
function saveCourse() {
  const icon = document.getElementById("f-icon").value.trim() || "📚";
  const title = document.getElementById("f-title").value.trim();
  const duration = document.getElementById("f-duration").value.trim();
  const level = document.getElementById("f-level").value.trim();
  const desc = document.getElementById("f-desc").value.trim();
  const origPrice = parseInt(document.getElementById("f-orig").value);
  const discPrice = parseInt(document.getElementById("f-disc").value);

  if (!title) {
    showToast("Course title zaroori hai!", "error");
    return;
  }
  if (!desc) {
    showToast("Description zaroori hai!", "error");
    return;
  }
  if (!origPrice || !discPrice) {
    showToast("Dono prices enter karo!", "error");
    return;
  }
  if (discPrice >= origPrice) {
    showToast("Discount price, original se kam honi chahiye!", "error");
    return;
  }

  const obj = { icon, title, duration, level, desc, origPrice, discPrice };
  if (editingId !== null) {
    obj.id = editingId;
    const idx = courses.findIndex((c) => c.id === editingId);
    if (idx !== -1) courses[idx] = obj;
  } else {
    obj.id = courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
    courses.push(obj);
  }

  showFormMsg("⏳ Save ho raha hai...");
  fetch(SCRIPT_URL + "?action=saveCourse", {
    method: "POST",
    body: JSON.stringify(obj),
  })
    .then((r) => r.json())
    .then(() => {
      renderTable();
      updateStats();
      showFormMsg(
        editingId !== null
          ? "✅ Course update ho gaya!"
          : "✅ Course add ho gaya!",
      );
      editingId = null;
      setTimeout(() => {
        resetForm();
        showSection("courses-section", document.querySelector(".nav-item"));
      }, 1500);
    })
    .catch(() => showToast("❌ Save nahi hua, internet check karo", "error"));
}

function editCourse(id) {
  const c = courses.find((x) => x.id === id);
  if (!c) return;
  editingId = id;
  document.getElementById("f-icon").value = c.icon || "";
  document.getElementById("f-title").value = c.title;
  document.getElementById("f-duration").value = c.duration;
  document.getElementById("f-level").value = c.level;
  document.getElementById("f-desc").value = c.desc;
  document.getElementById("f-orig").value = c.origPrice;
  document.getElementById("f-disc").value = c.discPrice;
  document.getElementById("form-heading").innerHTML =
    `<i class="fa fa-pen"></i> Edit: ${c.title}`;
  showSection("add-section", null);
}

function cancelEdit() {
  editingId = null;
  resetForm();
  showSection("courses-section", document.querySelector(".nav-item"));
}

function resetForm() {
  [
    "f-icon",
    "f-title",
    "f-duration",
    "f-level",
    "f-desc",
    "f-orig",
    "f-disc",
  ].forEach((id) => (document.getElementById(id).value = ""));
  document.getElementById("form-heading").innerHTML =
    `<i class="fa fa-plus-circle"></i> Add New Course`;
  document.getElementById("form-msg").style.display = "none";
  editingId = null;
}

function showFormMsg(t) {
  const el = document.getElementById("form-msg");
  el.textContent = t;
  el.style.display = "block";
}

// ============================================
//  COURSES - DELETE
// ============================================
function openDeleteModal(id) {
  deleteTargetId = id;
  document.getElementById("delete-modal").style.display = "flex";
}
function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById("delete-modal").style.display = "none";
}
function confirmDelete() {
  if (deleteTargetId === null) return;
  fetch(SCRIPT_URL + "?action=deleteCourse", {
    method: "POST",
    body: JSON.stringify({ courseId: deleteTargetId }),
  })
    .then((r) => r.json())
    .then(() => {
      courses = courses.filter((c) => c.id !== deleteTargetId);
      renderTable();
      updateStats();
      closeDeleteModal();
      showToast("✅ Course delete ho gaya!", "success");
    })
    .catch(() => showToast("❌ Delete nahi hua, dobara try karo", "error"));
}

// ============================================
//  COURSES - PRICE MODAL
// ============================================
function openPriceModal(id) {
  const c = courses.find((x) => x.id === id);
  if (!c) return;
  priceTargetId = id;
  document.getElementById("price-modal-course-name").textContent =
    `📚 ${c.title}`;
  document.getElementById("pm-orig").value = c.origPrice;
  document.getElementById("pm-disc").value = c.discPrice;
  document.getElementById("price-modal").style.display = "flex";
}
function closePriceModal() {
  priceTargetId = null;
  document.getElementById("price-modal").style.display = "none";
}
function confirmPriceUpdate() {
  const newOrig = parseInt(document.getElementById("pm-orig").value);
  const newDisc = parseInt(document.getElementById("pm-disc").value);
  if (!newOrig || !newDisc) {
    showToast("Dono prices enter karo!", "error");
    return;
  }
  if (newDisc >= newOrig) {
    showToast("Discount price, original se kam honi chahiye!", "error");
    return;
  }

  const idx = courses.findIndex((c) => c.id === priceTargetId);
  if (idx !== -1) {
    courses[idx].origPrice = newOrig;
    courses[idx].discPrice = newDisc;
    fetch(SCRIPT_URL + "?action=saveCourse", {
      method: "POST",
      body: JSON.stringify(courses[idx]),
    })
      .then((r) => r.json())
      .then(() => {
        renderTable();
        closePriceModal();
        showToast("✅ Price update ho gaya!", "success");
      })
      .catch(() => showToast("❌ Update nahi hua", "error"));
  }
}

// ============================================
//  GALLERY - FETCH
// ============================================
function fetchGallery() {
  fetch(SCRIPT_URL + "?action=getGallery")
    .then((r) => r.json())
    .then((data) => {
      galleryImages =
        data.result === "success" && data.images ? data.images : [];
      renderGallery();
    })
    .catch(() => {
      galleryImages = [];
      renderGallery();
    });
}

// ============================================
//  GALLERY - RENDER
// ============================================
function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!galleryImages.length) {
    grid.innerHTML = `<p style="color:#aaa;text-align:center;padding:30px;grid-column:1/-1;">
      Abhi koi image nahi hai. Upar se upload karo!
    </p>`;
    return;
  }
  grid.innerHTML = "";
  galleryImages.forEach((img) => {
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.innerHTML = `
      <img src="${img.imageData}" alt="${img.altText || ""}" loading="lazy"/>
      <div class="gallery-item-overlay">
        <span>${img.altText || "No caption"}</span>
        <button class="gallery-del-btn" onclick="openGalleryDeleteModal('${img.id}')">
          <i class="fa fa-trash"></i>
        </button>
      </div>`;
    grid.appendChild(div);
  });
}

// ============================================
//  GALLERY - IMAGE PREVIEW
// ============================================
function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Size check — 1MB max (Base64 sheets ke liye)
  if (file.size > 1 * 1024 * 1024) {
    showToast("⚠️ Image 1MB se choti honi chahiye!", "error");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    selectedImageBase64 = e.target.result;
    document.getElementById("img-preview").src = selectedImageBase64;
    document.getElementById("preview-box").style.display = "flex";
    document.querySelector(".upload-area p").textContent = file.name;
  };
  reader.readAsDataURL(file);
}

// ============================================
//  GALLERY - UPLOAD
// ============================================
function uploadGalleryImage() {
  if (!selectedImageBase64) {
    showToast("Pehle image select karo!", "error");
    return;
  }
  const alt = document.getElementById("g-alt").value.trim() || "Gallery Image";

  const newId =
    galleryImages.length > 0
      ? Math.max(...galleryImages.map((g) => Number(g.id))) + 1
      : 1;
  const imageData = { id: newId, imageData: selectedImageBase64, altText: alt };

  const msgEl = document.getElementById("gallery-msg");
  msgEl.textContent = "⏳ Google Sheets mein save ho raha hai...";
  msgEl.style.display = "block";

  fetch(SCRIPT_URL + "?action=saveGallery", {
    method: "POST",
    body: JSON.stringify(imageData),
  })
    .then((r) => r.json())
    .then(() => {
      galleryImages.push(imageData);
      renderGallery();
      msgEl.textContent = "✅ Image upload ho gayi!";
      // Reset
      selectedImageBase64 = null;
      document.getElementById("gallery-file").value = "";
      document.getElementById("g-alt").value = "";
      document.getElementById("preview-box").style.display = "none";
      document.querySelector(".upload-area p").textContent =
        "Click karo ya drag & drop karo";
      setTimeout(() => (msgEl.style.display = "none"), 3000);
    })
    .catch(() => showToast("❌ Upload nahi hua, dobara try karo", "error"));
}

// ============================================
//  GALLERY - DELETE
// ============================================
function openGalleryDeleteModal(id) {
  galleryDeleteId = id;
  document.getElementById("delete-gallery-modal").style.display = "flex";
}
function closeGalleryDeleteModal() {
  galleryDeleteId = null;
  document.getElementById("delete-gallery-modal").style.display = "none";
}
function confirmGalleryDelete() {
  if (!galleryDeleteId) return;
  fetch(SCRIPT_URL + "?action=deleteGallery", {
    method: "POST",
    body: JSON.stringify({ imageId: galleryDeleteId }),
  })
    .then((r) => r.json())
    .then(() => {
      galleryImages = galleryImages.filter(
        (g) => String(g.id) !== String(galleryDeleteId),
      );
      renderGallery();
      closeGalleryDeleteModal();
      showToast("✅ Image delete ho gayi!", "success");
    })
    .catch(() => showToast("❌ Delete nahi hua", "error"));
}

// ============================================
//  TOAST
// ============================================
function showToast(message, type = "success") {
  let t = document.getElementById("admin-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "admin-toast";
    t.style.cssText =
      "position:fixed;bottom:30px;right:30px;padding:14px 22px;border-radius:12px;font-size:.9rem;font-weight:600;z-index:99999;box-shadow:0 8px 25px rgba(0,0,0,.2);transition:opacity .3s;font-family:'Poppins',sans-serif;";
    document.body.appendChild(t);
  }
  t.textContent = message;
  t.style.background = type === "success" ? "#28a745" : "#e63946";
  t.style.color = "#fff";
  t.style.display = "block";
  t.style.opacity = "1";
  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => (t.style.display = "none"), 300);
  }, 3000);
}

// Modal backdrop close
["delete-modal", "delete-gallery-modal", "price-modal"].forEach((id) => {
  document.getElementById(id).addEventListener("click", function (e) {
    if (e.target === this) {
      if (id === "delete-modal") closeDeleteModal();
      if (id === "delete-gallery-modal") closeGalleryDeleteModal();
      if (id === "price-modal") closePriceModal();
    }
  });
});
