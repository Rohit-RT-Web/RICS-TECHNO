// ============================================
//  RICS ADMIN PANEL - admin.js
//  Existing code ko touch nahi kiya,
//  sirf localStorage-based course management
// ============================================

// ===== ADMIN CREDENTIALS (Change karo apne hisaab se) =====
const ADMIN_USER = "rics_admin";
const ADMIN_PASS = "rics@2026";

// ===== DEFAULT COURSES (index.html se match karte hain) =====
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

// ===== STATE =====
let courses = [];
let editingId = null; // null = add mode, number = edit mode
let deleteTargetId = null;
let priceTargetId = null;

// ===== INIT =====
function init() {
  // localStorage se courses lo, agar nahi hain toh default
  const saved = localStorage.getItem("rics_courses");
  if (saved) {
    courses = JSON.parse(saved);
  } else {
    courses = JSON.parse(JSON.stringify(DEFAULT_COURSES));
    saveToStorage();
  }
  renderTable();
  updateStats();
}

function saveToStorage() {
  localStorage.setItem("rics_courses", JSON.stringify(courses));
}

// ===== LOGIN =====
function adminLogin() {
  const user = document.getElementById("admin-user").value.trim();
  const pass = document.getElementById("admin-pass").value.trim();
  const errEl = document.getElementById("login-error");

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("dashboard").style.display = "flex";
    init();
  } else {
    errEl.textContent = "❌ Galat username ya password. Dobara try karein.";
    setTimeout(() => {
      errEl.textContent = "";
    }, 3000);
  }
}

// Enter key se login
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Enter" &&
    document.getElementById("login-screen").style.display !== "none"
  ) {
    adminLogin();
  }
});

function adminLogout() {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("admin-user").value = "";
  document.getElementById("admin-pass").value = "";
}

// ===== SIDEBAR NAVIGATION =====
function showSection(sectionId, clickedLink) {
  // Sabhi sections hide karo
  document
    .querySelectorAll(".panel-section")
    .forEach((s) => (s.style.display = "none"));
  // Target section show karo
  document.getElementById(sectionId).style.display = "block";

  // Active nav link update
  if (clickedLink) {
    document
      .querySelectorAll(".nav-item")
      .forEach((n) => n.classList.remove("active"));
    clickedLink.classList.add("active");
  }

  // Header update
  const titles = {
    "courses-section": [
      "Manage Courses",
      "Edit, delete or update all courses from here",
    ],
    "add-section": [
      "Add / Edit Course",
      "Naya course add karo ya existing edit karo",
    ],
  };
  if (titles[sectionId]) {
    document.getElementById("page-title").textContent = titles[sectionId][0];
    document.getElementById("page-subtitle").textContent = titles[sectionId][1];
  }

  // Agar add section open hua, reset form
  if (sectionId === "add-section" && editingId === null) {
    resetForm();
  }
}

// ===== RENDER TABLE =====
function renderTable() {
  const tbody = document.getElementById("courses-table-body");
  tbody.innerHTML = "";

  if (courses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:40px; color:#aaa;">
      <i class="fa fa-inbox" style="font-size:2rem;display:block;margin-bottom:10px;"></i>
      Koi course nahi mila. Pehle course add karo.
    </td></tr>`;
    return;
  }

  courses.forEach((c, index) => {
    const discountPct = Math.round(
      ((c.origPrice - c.discPrice) / c.origPrice) * 100,
    );
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="color:#aaa; font-size:0.85rem;">${index + 1}</td>
      <td class="course-icon-cell">${c.icon || "📚"}</td>
      <td class="course-name">${c.title}</td>
      <td style="font-size:0.83rem; color:#666;">${c.duration} | ${c.level}</td>
      <td style="font-size:0.83rem; color:#555; max-width:180px;">${c.desc}</td>
      <td><span class="orig-price">₹${Number(c.origPrice).toLocaleString("en-IN")}</span></td>
      <td><span class="disc-price">₹${Number(c.discPrice).toLocaleString("en-IN")}</span></td>
      <td><span class="badge">${discountPct}% OFF</span></td>
      <td>
        <div class="action-btns">
          <button class="act-btn edit-price-btn" onclick="openPriceModal(${c.id})">
            <i class="fa fa-tag"></i> Price
          </button>
          <button class="act-btn edit-btn" onclick="editCourse(${c.id})">
            <i class="fa fa-pen"></i> Edit
          </button>
          <button class="act-btn del-btn" onclick="openDeleteModal(${c.id})">
            <i class="fa fa-trash"></i> Delete
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateStats() {
  document.getElementById("total-courses-count").textContent = courses.length;
}

// ===== ADD / EDIT COURSE =====
function saveCourse() {
  const icon = document.getElementById("f-icon").value.trim() || "📚";
  const title = document.getElementById("f-title").value.trim();
  const duration = document.getElementById("f-duration").value.trim();
  const level = document.getElementById("f-level").value.trim();
  const desc = document.getElementById("f-desc").value.trim();
  const origPrice = parseInt(document.getElementById("f-orig").value);
  const discPrice = parseInt(document.getElementById("f-disc").value);

  if (!title) {
    alert("Course title zaroori hai!");
    return;
  }
  if (!desc) {
    alert("Description zaroori hai!");
    return;
  }
  if (!origPrice || !discPrice) {
    alert("Dono prices enter karo!");
    return;
  }
  if (discPrice >= origPrice) {
    alert("Discounted price, original price se kam honi chahiye!");
    return;
  }

  if (editingId !== null) {
    // EDIT MODE
    const idx = courses.findIndex((c) => c.id === editingId);
    if (idx !== -1) {
      courses[idx] = {
        ...courses[idx],
        icon,
        title,
        duration,
        level,
        desc,
        origPrice,
        discPrice,
      };
    }
  } else {
    // ADD MODE
    const newId =
      courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
    courses.push({
      id: newId,
      icon,
      title,
      duration,
      level,
      desc,
      origPrice,
      discPrice,
    });
  }

  saveToStorage();
  renderTable();
  updateStats();
  showFormMsg(
    editingId !== null
      ? "✅ Course update ho gaya!"
      : "✅ Naya course add ho gaya!",
  );
  editingId = null;

  // 1.5 sec baad courses section pe wapas jao
  setTimeout(() => {
    resetForm();
    showSection("courses-section", document.querySelector(".nav-item"));
  }, 1500);
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
    `<i class="fa fa-pen"></i> Edit Course: ${c.title}`;

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
  ].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("form-heading").innerHTML =
    `<i class="fa fa-plus-circle"></i> Add New Course`;
  document.getElementById("form-msg").style.display = "none";
  editingId = null;
}

function showFormMsg(text) {
  const el = document.getElementById("form-msg");
  el.textContent = text;
  el.style.display = "block";
}

// ===== DELETE =====
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
  courses = courses.filter((c) => c.id !== deleteTargetId);
  saveToStorage();
  renderTable();
  updateStats();
  closeDeleteModal();
}

// ===== PRICE EDIT MODAL =====
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
    alert("Dono prices enter karo!");
    return;
  }
  if (newDisc >= newOrig) {
    alert("Discounted price, original price se kam honi chahiye!");
    return;
  }

  const idx = courses.findIndex((c) => c.id === priceTargetId);
  if (idx !== -1) {
    courses[idx].origPrice = newOrig;
    courses[idx].discPrice = newDisc;
  }
  saveToStorage();
  renderTable();
  closePriceModal();
}

// Modal background click se close
document.getElementById("delete-modal").addEventListener("click", function (e) {
  if (e.target === this) closeDeleteModal();
});
document.getElementById("price-modal").addEventListener("click", function (e) {
  if (e.target === this) closePriceModal();
});
