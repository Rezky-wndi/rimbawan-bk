const STORAGE_KEY = "rimbawanBkPrototype";

const roles = {
  guru_bk: {
    code: "BK-2026",
    name: "Guru BK / Admin",
    actor: "Sri Pamungkas, S.Pd",
    initials: "SP",
    scopeText: "Akses penuh sebagai pengelola utama aplikasi BK",
    routes: ["dashboard", "siswa", "profil", "pelanggaran", "konseling", "surat", "laporan", "kode-akses", "audit"],
    scope: { type: "all" },
    permissions: ["view_sensitive", "open_counseling", "manage_letters", "manage_codes", "view_audit", "view_identity", "export"]
  },
  wali_kelas: {
    name: "Wali Kelas",
    actor: "Wali Kelas",
    initials: "WK",
    scopeText: "Hanya siswa kelas/wali masing-masing",
    routes: ["dashboard", "siswa", "profil", "pelanggaran", "laporan"],
    scope: { type: "class", value: "XI TKJ" },
    permissions: ["view_identity", "export"]
  },
  kepala_sekolah: {
    name: "Kepala Sekolah",
    actor: "Kepala Sekolah",
    initials: "KS",
    scopeText: "Statistik agregat tanpa isi konseling dan biodata keluarga",
    routes: ["dashboard", "laporan"],
    scope: { type: "aggregate" },
    permissions: ["export"]
  }
};

const seedState = {
  activeStudentId: "SIS-001",
  sessionRole: null,
  sessionCodeId: null,
  accessCodes: [
    {
      id: "AKS-GURU-BK",
      code: "BK-2026",
      role: "guru_bk",
      owner: "Guru BK/Admin",
      scopeLabel: "Semua data",
      scope: { type: "all" },
      active: true
    },
    {
      id: "AKS-WK-XITKJ",
      code: "WK-XITKJ",
      role: "wali_kelas",
      owner: "Wali Kelas XI TKJ",
      scopeLabel: "Kelas XI TKJ",
      scope: { type: "class", value: "XI TKJ" },
      active: true
    },
    {
      id: "AKS-WK-XAPHP",
      code: "WK-XAPHP",
      role: "wali_kelas",
      owner: "Wali Kelas X APHP",
      scopeLabel: "Kelas X APHP",
      scope: { type: "class", value: "X APHP" },
      active: true
    },
    {
      id: "AKS-KEPSEK",
      code: "KS-2026",
      role: "kepala_sekolah",
      owner: "Kepala Sekolah",
      scopeLabel: "Laporan agregat sekolah",
      scope: { type: "aggregate" },
      active: true
    }
  ],
  filters: {
    risk: "all",
    dorm: "all"
  },
  auditLogs: [
    {
      time: "2026-06-23 08:12",
      actor: "Sri Pamungkas, S.Pd",
      action: "Melihat ringkasan dashboard",
      object: "Dashboard Guru BK",
      level: "Info"
    }
  ],
  counselingNotes: [
    {
      id: "KSL-001",
      studentId: "SIS-001",
      date: "2026-06-11",
      area: "Belajar",
      status: "Lanjutan",
      followUp: "Pendampingan akademik dan monitoring kehadiran."
    },
    {
      id: "KSL-002",
      studentId: "SIS-002",
      date: "2026-06-13",
      area: "Sosial",
      status: "Diproses",
      followUp: "Koordinasi dengan pembina asrama."
    }
  ]
};

const students = [
  {
    id: "SIS-001",
    nis: "2324.10.0042",
    name: "Andi Pratama",
    initials: "AP",
    className: "XI TKJ",
    dorm: "Meranti",
    room: "04",
    gender: "Laki-laki",
    attendance: 71,
    points: 118,
    risk: "Risiko Tinggi",
    stage: "Panggilan Orang Tua",
    phoneMasked: "0812-****-7890",
    phoneFull: "0812-3456-7890",
    emailMasked: "a*****@email.com",
    emailFull: "andi.pratama@email.com",
    parentPhoneMasked: "0813-****-2211",
    parentPhoneFull: "0813-7788-2211",
    notes: "Adaptasi asrama masih berlangsung. Memerlukan pendampingan bidang belajar dan kedisiplinan.",
    violations: [
      ["2026-06-17", "Terlambat masuk", "Ringan", 5, "Terverifikasi"],
      ["2026-06-09", "Membolos pelajaran", "Sedang", 25, "Terverifikasi"],
      ["2026-05-28", "Keluar asrama tanpa izin", "Berat", 50, "Terverifikasi"],
      ["2026-05-15", "Tidak mengikuti apel", "Sedang", 38, "Diproses"]
    ],
    academics: [
      ["Matematika", 75, 68],
      ["Bahasa Inggris", 75, 70],
      ["Bahasa Indonesia", 75, 82],
      ["Produktif TKJ", 75, 88]
    ]
  },
  {
    id: "SIS-002",
    nis: "2324.10.0077",
    name: "Rina Salsabila",
    initials: "RS",
    className: "X APHP",
    dorm: "Jati",
    room: "11",
    gender: "Perempuan",
    attendance: 84,
    points: 62,
    risk: "Perlu Perhatian",
    stage: "Konseling BK",
    phoneMasked: "0821-****-0192",
    phoneFull: "0821-5521-0192",
    emailMasked: "r*****@email.com",
    emailFull: "rina.salsabila@email.com",
    parentPhoneMasked: "0852-****-3344",
    parentPhoneFull: "0852-9900-3344",
    notes: "Perlu dukungan adaptasi sosial di asrama dan jadwal belajar malam.",
    violations: [
      ["2026-06-12", "Tidak mengikuti belajar malam", "Sedang", 20, "Terverifikasi"],
      ["2026-05-30", "Terlambat apel", "Ringan", 5, "Terverifikasi"],
      ["2026-05-22", "Keluar kelas tanpa izin", "Sedang", 37, "Terverifikasi"]
    ],
    academics: [
      ["Matematika", 75, 76],
      ["Bahasa Inggris", 75, 78],
      ["Pengolahan Hasil Hutan", 75, 84],
      ["PKn", 75, 80]
    ]
  },
  {
    id: "SIS-003",
    nis: "2324.10.0091",
    name: "Dimas Maulana",
    initials: "DM",
    className: "XII TKJ",
    dorm: "Meranti",
    room: "07",
    gender: "Laki-laki",
    attendance: 86,
    points: 54,
    risk: "Konseling Lanjutan",
    stage: "Konseling BK",
    phoneMasked: "0811-****-2201",
    phoneFull: "0811-6701-2201",
    emailMasked: "d*****@email.com",
    emailFull: "dimas.maulana@email.com",
    parentPhoneMasked: "0812-****-4500",
    parentPhoneFull: "0812-4400-4500",
    notes: "Konseling lanjutan terkait disiplin dan kesiapan praktik kerja.",
    violations: [
      ["2026-06-10", "Terlambat praktik", "Ringan", 5, "Terverifikasi"],
      ["2026-05-19", "Membolos pelajaran", "Sedang", 25, "Terverifikasi"],
      ["2026-04-30", "Tidak mengikuti apel", "Sedang", 24, "Terverifikasi"]
    ],
    academics: [
      ["Produktif TKJ", 75, 80],
      ["Bahasa Inggris", 75, 72],
      ["Matematika", 75, 74],
      ["Kewirausahaan", 75, 83]
    ]
  },
  {
    id: "SIS-004",
    nis: "2324.10.0102",
    name: "Nabila Fitri",
    initials: "NF",
    className: "XI APHP",
    dorm: "Jati",
    room: "09",
    gender: "Perempuan",
    attendance: 93,
    points: 31,
    risk: "Monitoring",
    stage: "Perlu Perhatian",
    phoneMasked: "0853-****-1132",
    phoneFull: "0853-8811-1132",
    emailMasked: "n*****@email.com",
    emailFull: "nabila.fitri@email.com",
    parentPhoneMasked: "0813-****-7831",
    parentPhoneFull: "0813-3200-7831",
    notes: "Monitoring ringan terkait adaptasi belajar setelah perpindahan kelas.",
    violations: [
      ["2026-06-03", "Terlambat apel", "Ringan", 5, "Terverifikasi"],
      ["2026-05-21", "Tidak membawa perlengkapan praktik", "Ringan", 10, "Terverifikasi"],
      ["2026-04-17", "Tidak mengikuti belajar malam", "Sedang", 16, "Terverifikasi"]
    ],
    academics: [
      ["Pengolahan Hasil Hutan", 75, 86],
      ["Matematika", 75, 79],
      ["Bahasa Indonesia", 75, 84],
      ["PKn", 75, 81]
    ]
  },
  {
    id: "SIS-005",
    nis: "2324.10.0115",
    name: "Muhammad Fajar",
    initials: "MF",
    className: "X ATPH",
    dorm: "Ulin",
    room: "03",
    gender: "Laki-laki",
    attendance: 96,
    points: 14,
    risk: "Aman",
    stage: "Aman",
    phoneMasked: "0822-****-7031",
    phoneFull: "0822-7100-7031",
    emailMasked: "f*****@email.com",
    emailFull: "m.fajar@email.com",
    parentPhoneMasked: "0812-****-9913",
    parentPhoneFull: "0812-4501-9913",
    notes: "Perkembangan baik. Direkomendasikan menjadi teman dukungan sebaya.",
    violations: [
      ["2026-05-20", "Terlambat apel", "Ringan", 5, "Terverifikasi"],
      ["2026-04-16", "Tidak membawa buku saku", "Ringan", 9, "Terverifikasi"]
    ],
    academics: [
      ["Silvikultur", 75, 87],
      ["Matematika", 75, 81],
      ["Bahasa Inggris", 75, 80],
      ["PKn", 75, 86]
    ]
  }
];

const tasks = [
  ["Hari ini", "Tinjau draft SP-2026-016", "Akumulasi poin 118 menunggu persetujuan", "warn"],
  ["Besok", "Evaluasi konseling Andi P.", "Tinjauan komitmen siswa dan wali asrama", "warn"],
  ["3 hari", "Home visit Rina Salsabila", "Koordinasi dengan orang tua", "info"],
  ["Tertunda", "Verifikasi aduan TKT-0231", "Prioritas tinggi", "danger"]
];

const letters = [
  ["SP-2026-016", "Andi Pratama", "Akumulasi poin 118", "Draft"],
  ["SP-2026-015", "Rina Salsabila", "Koordinasi orang tua", "Menunggu Persetujuan"],
  ["SP-2026-014", "Andi Pratama", "Panggilan orang tua", "Dikonfirmasi Hadir"]
];

let state = loadState();
let activeRoute = "dashboard";
let activeProfileTab = "biodata";
let toastTimer;

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...seedState, ...stored };
  } catch (error) {
    return structuredClone(seedState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function accessCodes() {
  return state.accessCodes || seedState.accessCodes;
}

function currentAccessCode() {
  return accessCodes().find((item) => item.id === state.sessionCodeId) || null;
}

function currentRole() {
  return roles[state.sessionRole] || null;
}

function can(permission) {
  return currentRole()?.permissions.includes(permission) || false;
}

function canAccess(route) {
  return currentRole()?.routes.includes(route) || false;
}

function effectiveScope() {
  return currentAccessCode()?.scope || currentRole()?.scope || { type: "none" };
}

function effectiveActor() {
  const role = currentRole();
  const access = currentAccessCode();
  if (!role) return "Pengguna belum login";
  if (role.name === "Guru BK / Admin") return role.actor;
  return access?.owner || role.actor;
}

function roleDisplayName() {
  const role = currentRole();
  const access = currentAccessCode();
  if (!role) return "Belum login";
  if (role.name === "Guru BK / Admin") return role.name;
  return access?.owner || role.name;
}

function roleScopeText() {
  const role = currentRole();
  const access = currentAccessCode();
  if (!role) return "";
  return access?.scopeLabel || role.scopeText;
}

function visibleStudents() {
  const scope = effectiveScope();
  if (!currentRole()) return [];
  if (scope.type === "class") return students.filter((student) => student.className === scope.value);
  if (scope.type === "student") return students.filter((student) => student.id === scope.value);
  if (scope.type === "aggregate") return students;
  return students;
}

function visibleStudentIds() {
  return new Set(visibleStudents().map((student) => student.id));
}

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function nowStamp() {
  const now = new Date();
  const date = now.toLocaleDateString("sv-SE", { timeZone: "Asia/Makassar" });
  const time = now.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${date} ${time}`;
}

function addAudit(action, object, level = "Privasi") {
  state.auditLogs.unshift({
    time: nowStamp(),
    actor: effectiveActor(),
    action,
    object,
    level
  });
  state.auditLogs = state.auditLogs.slice(0, 50);
  saveState();
}

function showToast(message) {
  clearTimeout(toastTimer);
  qs("#toastText").textContent = message;
  qs("#toast").classList.add("show");
  toastTimer = setTimeout(() => qs("#toast").classList.remove("show"), 3000);
}

function badge(label) {
  const normalized = label.toLowerCase();
  let tone = "muted";
  if (["aman", "terverifikasi", "dikonfirmasi hadir", "selesai", "aktif"].some((v) => normalized.includes(v))) tone = "ok";
  if (["perhatian", "monitoring", "draft", "menunggu", "lanjutan"].some((v) => normalized.includes(v))) tone = "warn";
  if (["risiko", "tinggi", "tertunda", "berat"].some((v) => normalized.includes(v))) tone = "danger";
  if (["konseling", "diproses", "info", "terjadwal"].some((v) => normalized.includes(v))) tone = "info";
  return `<span class="badge ${tone}"><i class="fa-solid fa-circle"></i>${escapeHtml(label)}</span>`;
}

function pointStage(points) {
  if (points <= 25) return "Aman";
  if (points <= 50) return "Perlu Perhatian";
  if (points <= 100) return "Konseling BK";
  if (points <= 150) return "Panggilan Orang Tua";
  if (points <= 200) return "Home Visit";
  return "Sidang Disiplin";
}

function filteredStudents() {
  const search = qs("#globalSearch").value.trim().toLowerCase();
  const risk = state.filters?.risk || "all";
  const dorm = state.filters?.dorm || "all";
  return visibleStudents().filter((student) => {
    const haystack = [
      student.name,
      student.nis,
      student.className,
      student.dorm,
      student.risk,
      student.stage
    ].join(" ").toLowerCase();
    const bySearch = !search || haystack.includes(search);
    const byRisk = risk === "all" || student.risk === risk || student.stage === risk;
    const byDorm = dorm === "all" || student.dorm === dorm;
    return bySearch && byRisk && byDorm;
  });
}

function getStudent(id = state.activeStudentId) {
  const scoped = visibleStudents();
  return scoped.find((student) => student.id === id) || scoped[0] || students[0];
}

function render() {
  if (!currentRole()) {
    qsa(".view").forEach((view) => view.classList.remove("active"));
    qs("#app").classList.add("logged-out");
    qs("#view-login").classList.add("active");
    renderLogin();
    return;
  }

  qs("#app").classList.remove("logged-out");
  syncSessionUi();

  const route = (location.hash || "#dashboard").replace("#", "").split("/")[0] || "dashboard";
  activeRoute = route === "profil" ? "profil" : route;
  if (!canAccess(activeRoute)) {
    const fallback = currentRole().routes[0] || "dashboard";
    location.hash = `#${fallback}`;
    return;
  }
  qsa(".view").forEach((view) => view.classList.remove("active"));
  qsa(".nav a").forEach((link) => link.classList.toggle("active", link.dataset.route === activeRoute));

  const titleMap = {
    dashboard: "Dashboard",
    siswa: "Data Siswa",
    profil: "Profil Siswa",
    pelanggaran: "Pelanggaran & Poin",
    konseling: "Konseling",
    surat: "Surat Panggilan",
    laporan: "Laporan",
    "kode-akses": "Kode Akses",
    audit: "Audit Akses"
  };
  qs("#breadcrumb").textContent = titleMap[activeRoute] || "Dashboard";

  const view = qs(`#view-${activeRoute}`);
  if (!view) {
    location.hash = "#dashboard";
    return;
  }
  view.classList.add("active");

  const renderers = {
    dashboard: renderDashboard,
    siswa: renderStudents,
    profil: renderProfile,
    pelanggaran: renderViolations,
    konseling: renderCounseling,
    surat: renderLetters,
    laporan: renderReports,
    "kode-akses": renderAccessCodes,
    audit: renderAudit
  };
  renderers[activeRoute]();
}

function renderLogin() {
  qs("#view-login").innerHTML = `
    <div class="login-shell">
      <section class="login-brand">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21V12" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M12 12C12 9.2 9.8 7 7 7C7 9.8 9.2 12 12 12Z" fill="#F4DFAD"/>
            <path d="M12 11C12 8.5 14 6.5 16.5 6.5C16.5 9 14.5 11 12 11Z" fill="#fff"/>
            <path d="M5 21H19" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </span>
        <h1>RIMBAWAN BK</h1>
        <p>Aplikasi kerja Guru BK untuk memantau kondisi murid, menyiapkan laporan kepala sekolah, dan memberi akses terbatas untuk wali kelas.</p>
        <div class="login-points">
          <div><i class="fa-solid fa-user-shield"></i><span>Guru BK/Admin mengelola semua data dan membuat kode akses.</span></div>
          <div><i class="fa-solid fa-chalkboard-user"></i><span>Wali kelas hanya melihat siswa wali/kelasnya masing-masing.</span></div>
          <div><i class="fa-solid fa-chart-pie"></i><span>Kepala sekolah menerima ringkasan kondisi sekolah tanpa isi konseling rahasia.</span></div>
        </div>
      </section>
      <section class="login-card">
        <h2>Masuk dengan Kode Akses</h2>
        <p>Kode dibuat dan dikelola oleh Guru BK/Admin. Masukkan kode sesuai peran pengguna.</p>
        <form class="form-grid" id="loginForm">
          <div class="form-field full">
            <label for="loginCode">Kode akses</label>
            <input class="field-input" id="loginCode" autocomplete="off" placeholder="Contoh: BK-2026" required>
          </div>
          <div class="form-field full">
            <button class="button primary" type="submit"><i class="fa-solid fa-right-to-bracket"></i> Masuk</button>
          </div>
        </form>
        <div class="code-grid" aria-label="Kode contoh prototype">
          ${accessCodes().filter((item) => item.active).map((item) => `
            <button class="code-card" type="button" data-fill-code="${item.code}">
              <strong>${item.code}</strong>
              <span>${item.owner}</span>
            </button>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function syncSessionUi() {
  const role = currentRole();
  qs("#currentUserInitials").textContent = role.initials;
  qs("#currentUserName").textContent = roleDisplayName();
  qs("#currentUserRole").textContent = roleScopeText();
  qsa(".nav a").forEach((link) => {
    link.hidden = !canAccess(link.dataset.route);
  });
}

function renderDashboard() {
  const data = visibleStudents();
  const totalPoints = data.reduce((sum, student) => sum + student.points, 0);
  const highRisk = data.filter((student) => student.points > 100).length;
  const visibleIds = visibleStudentIds();
  const counselingCount = state.counselingNotes.filter((note) => visibleIds.has(note.studentId)).length;
  const avgAttendance = Math.round(data.reduce((sum, student) => sum + student.attendance, 0) / Math.max(1, data.length));
  const aggregateOnly = effectiveScope().type === "aggregate";

  qs("#view-dashboard").innerHTML = `
    <div class="page-head">
      <div>
        <h1>Dashboard Guru BK</h1>
        <p>${roleDisplayName()} - ${roleScopeText()}.</p>
      </div>
      <div class="actions">
        ${canAccess("siswa") ? `<button class="button ghost" data-route-go="siswa"><i class="fa-solid fa-user-graduate"></i> Buka Data Siswa</button>` : ""}
        ${canAccess("konseling") ? `<button class="button primary" data-route-go="konseling"><i class="fa-solid fa-plus"></i> Catat Konseling</button>` : ""}
      </div>
    </div>
    <div class="privacy">
      <i class="fa-solid fa-lock"></i>
      <div><strong>Tampilan terlindungi.</strong> Data yang muncul mengikuti kode akses login. Isi konseling dan data keluarga tetap dibatasi untuk Guru BK/Admin.</div>
    </div>
    <section class="stats">
      ${statCard("Total Siswa", data.length, aggregateOnly ? "Ringkasan sekolah" : "Dalam cakupan akses", "fa-solid fa-user-graduate", "green")}
      ${statCard("Prioritas Tinggi", highRisk, "Poin di atas 100", "fa-solid fa-triangle-exclamation", "red")}
      ${statCard("Konseling Tercatat", counselingCount, "Termasuk catatan lokal prototype", "fa-solid fa-comments", "gold")}
      ${statCard("Rata-rata Kehadiran", `${avgAttendance}%`, "Semester berjalan", "fa-solid fa-calendar-check", "blue")}
    </section>
    <div class="grid-2">
      <div>
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>${aggregateOnly ? "Distribusi Kondisi Murid" : "Siswa Prioritas Pendampingan"}</h2>
              <p>${aggregateOnly ? "Kepala sekolah melihat ringkasan, bukan isi konseling." : "Diurutkan dari skor poin tertinggi."}</p>
            </div>
            ${canAccess("siswa") ? `<button class="button ghost" data-route-go="siswa">Semua</button>` : ""}
          </div>
          <div class="table-wrap">${aggregateOnly ? aggregateSummary(data) : studentTable(data.slice().sort((a, b) => b.points - a.points).slice(0, 4))}</div>
        </section>
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Peta Layanan</h2>
              <p>Komposisi kebutuhan layanan bulan ini.</p>
            </div>
          </div>
          <div class="panel-body mini-bars">
            ${barRow("Konseling", 47, 60, "green")}
            ${barRow("Pelanggaran", 23, 60, "warn")}
            ${barRow("Home Visit", 5, 20, "info")}
            ${barRow("Aduan", 4, 20, "danger")}
          </div>
        </section>
      </div>
      <div>
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Pengingat Tindak Lanjut</h2>
              <p>Agenda yang perlu segera ditinjau.</p>
            </div>
          </div>
          <div class="panel-body timeline">
            ${tasks.map((task) => eventRow(task[0], task[1], task[2], badge(task[3] === "danger" ? "Tertunda" : task[0]))).join("")}
          </div>
        </section>
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Ambang Poin</h2>
              <p>Simulasi rekomendasi tahap pendampingan.</p>
            </div>
          </div>
          <div class="panel-body">
            <div class="form-field">
              <label for="pointInput">Jumlah poin</label>
              <input class="field-input" id="pointInput" type="number" min="0" value="${totalPoints}">
            </div>
            <p id="pointResult" class="note info" style="margin-top:12px;margin-bottom:0">
              <i class="fa-solid fa-circle-info"></i>
              <span>Total contoh ${totalPoints} poin masuk tahap ${pointStage(totalPoints)}.</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  `;
}

function statCard(label, value, note, icon, tone) {
  return `
    <article class="stat">
      <div class="stat-top"><span class="chip-icon ${tone}"><i class="${icon}"></i></span></div>
      <div class="stat-label">${label}</div>
      <div class="stat-value">${value}</div>
      <div class="stat-note">${note}</div>
    </article>
  `;
}

function barRow(label, value, max, tone) {
  const width = Math.min(100, Math.round((value / max) * 100));
  const cssTone = tone === "green" ? "" : tone;
  return `
    <div class="bar-row">
      <strong>${label}</strong>
      <span class="bar-track"><span class="bar-fill ${cssTone}" style="width:${width}%"></span></span>
      <span>${value}</span>
    </div>
  `;
}

function aggregateSummary(data) {
  const rows = [
    ["Aman", data.filter((student) => student.points <= 25).length],
    ["Perlu Perhatian", data.filter((student) => student.points > 25 && student.points <= 50).length],
    ["Konseling BK", data.filter((student) => student.points > 50 && student.points <= 100).length],
    ["Panggilan/Home Visit", data.filter((student) => student.points > 100).length]
  ];
  return `
    <table class="table">
      <thead><tr><th>Kategori</th><th>Jumlah Murid</th><th>Catatan</th></tr></thead>
      <tbody>
        ${rows.map((row) => `<tr><td>${badge(row[0])}</td><td><strong>${row[1]}</strong></td><td style="color:var(--text-2)">Data agregat untuk laporan kepala sekolah</td></tr>`).join("")}
      </tbody>
    </table>
  `;
}

function renderStudents() {
  const scoped = visibleStudents();
  const riskOptions = [...new Set(scoped.flatMap((student) => [student.risk, student.stage]))];
  const dormOptions = [...new Set(scoped.map((student) => student.dorm))];
  const data = filteredStudents();
  const selectedRisk = state.filters?.risk || "all";
  const selectedDorm = state.filters?.dorm || "all";
  qs("#view-siswa").innerHTML = `
    <div class="page-head">
      <div>
        <h1>Data Siswa</h1>
        <p>Daftar siswa dengan prioritas layanan berdasarkan kehadiran, poin, asrama, dan status pendampingan.</p>
      </div>
      <div class="actions">
        <button class="button ghost" id="exportStudents"><i class="fa-solid fa-file-csv"></i> Ekspor CSV</button>
        <button class="button primary" data-route-go="profil"><i class="fa-solid fa-address-card"></i> Buka Profil Aktif</button>
      </div>
    </div>
    <div class="filters">
      <select class="field-select" id="riskFilter" aria-label="Filter status">
        <option value="all" ${selectedRisk === "all" ? "selected" : ""}>Semua status</option>
        ${riskOptions.map((option) => `<option value="${option}" ${selectedRisk === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
      <select class="field-select" id="dormFilter" aria-label="Filter asrama">
        <option value="all" ${selectedDorm === "all" ? "selected" : ""}>Semua asrama</option>
        ${dormOptions.map((option) => `<option value="${option}" ${selectedDorm === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Daftar Siswa</h2>
          <p>${data.length} siswa tampil dari ${scoped.length} siswa dalam cakupan akses.</p>
        </div>
      </div>
      <div class="table-wrap">${studentTable(data)}</div>
    </section>
  `;
}

function studentTable(data) {
  if (!data.length) {
    return `<div class="empty"><i class="fa-regular fa-folder-open"></i><strong>Data tidak ditemukan</strong><p>Ubah kata kunci atau filter untuk melihat siswa lain.</p></div>`;
  }
  return `
    <table class="table">
      <thead>
        <tr>
          <th>Siswa</th>
          <th>Kelas</th>
          <th>Asrama</th>
          <th>Kehadiran</th>
          <th>Poin</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        ${data.map((student) => `
          <tr>
            <td>
              <div class="student-cell">
                <span class="avatar">${student.initials}</span>
                <div><strong>${student.name}</strong><span>NIS ${student.nis}</span></div>
              </div>
            </td>
            <td>${student.className}</td>
            <td>${student.dorm} / ${student.room}</td>
            <td><strong>${student.attendance}%</strong></td>
            <td><strong>${student.points}</strong></td>
            <td>${badge(student.risk)}</td>
            <td><button class="button ghost" data-open-student="${student.id}"><i class="fa-regular fa-eye"></i> Profil</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderProfile() {
  const student = getStudent();
  let tabs = [
    ["biodata", "fa-solid fa-id-card", "Biodata"],
    ["akademik", "fa-solid fa-chart-simple", "Akademik"],
    ["pelanggaran", "fa-solid fa-triangle-exclamation", "Poin"],
    ["konseling", "fa-solid fa-lock", "Konseling"],
    ["keluarga", "fa-solid fa-people-roof", "Keluarga"]
  ];
  if (!can("open_counseling")) tabs = tabs.filter((tab) => tab[0] !== "konseling");
  if (!can("view_sensitive")) tabs = tabs.filter((tab) => tab[0] !== "keluarga");
  if (!tabs.some((tab) => tab[0] === activeProfileTab)) activeProfileTab = tabs[0][0];

  qs("#view-profil").innerHTML = `
    <section class="profile-hero">
      <div class="profile-band"></div>
      <div class="profile-main">
        <div class="profile-avatar">${student.initials}</div>
        <div class="profile-title">
          <h1>${student.name} ${badge("Aktif")}</h1>
          <div class="meta">
            <span><i class="fa-solid fa-id-card"></i> NIS ${student.nis}</span>
            <span><i class="fa-solid fa-graduation-cap"></i> ${student.className}</span>
            <span><i class="fa-solid fa-building"></i> Asrama ${student.dorm}, kamar ${student.room}</span>
            <span><i class="fa-solid fa-venus-mars"></i> ${student.gender}</span>
          </div>
          <div class="meta">${badge(student.risk)} ${badge(student.stage)}</div>
        </div>
        <div class="profile-actions">
          <button class="button ghost" data-route-go="siswa"><i class="fa-solid fa-arrow-left"></i> Daftar</button>
          ${canAccess("konseling") ? `<button class="button primary" data-route-go="konseling"><i class="fa-solid fa-comment-medical"></i> Catat Konseling</button>` : ""}
        </div>
      </div>
      <div class="profile-stats">
        ${profileStat("Kehadiran", `${student.attendance}%`, "fa-solid fa-calendar-check", "green")}
        ${profileStat("Poin", student.points, "fa-solid fa-triangle-exclamation", "red")}
        ${profileStat("Tahap", pointStage(student.points), "fa-solid fa-route", "gold")}
        ${profileStat("Asrama", student.dorm, "fa-solid fa-building", "blue")}
      </div>
    </section>
    <div class="tabs">
      ${tabs.map((tab) => `<button class="tab-button ${activeProfileTab === tab[0] ? "active" : ""}" data-profile-tab="${tab[0]}"><i class="${tab[1]}"></i>${tab[2]}</button>`).join("")}
    </div>
    <section class="panel">
      <div class="panel-body">${profileTabContent(student)}</div>
    </section>
  `;
}

function profileStat(label, value, icon, tone) {
  return `
    <div class="profile-stat">
      <span class="chip-icon ${tone}"><i class="${icon}"></i></span>
      <div><strong>${value}</strong><span>${label}</span></div>
    </div>
  `;
}

function profileTabContent(student) {
  if (activeProfileTab === "akademik") {
    return `
      <div class="note info"><i class="fa-solid fa-circle-info"></i><div>Nilai akademik digunakan sebagai sinyal pendampingan. Guru BK membaca dan menganalisis, bukan mengubah nilai.</div></div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Mata Pelajaran</th><th>KKM</th><th>Nilai</th><th>Status</th></tr></thead>
          <tbody>
            ${student.academics.map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td><strong>${row[2]}</strong></td><td>${badge(row[2] >= row[1] ? "Tuntas" : "Di bawah KKM")}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  if (activeProfileTab === "pelanggaran") {
    return violationTable(student.violations);
  }

  if (activeProfileTab === "konseling") {
    const notes = state.counselingNotes.filter((note) => note.studentId === student.id);
    return `
      <div class="note warn"><i class="fa-solid fa-lock"></i><div>Isi konseling bersifat sangat rahasia. Membuka detail penuh harus tercatat di audit log.</div></div>
      <div class="timeline">
        ${notes.map((note) => eventRow(note.date, `Konseling ${note.area}`, note.followUp, `<button class="button ghost" data-open-confidential="${note.id}"><i class="fa-solid fa-lock"></i> Buka Isi</button>`)).join("") || emptyState("Belum ada catatan konseling", "Catatan baru dapat dibuat dari modul Konseling.")}
      </div>
    `;
  }

  if (activeProfileTab === "keluarga") {
    return `
      <div class="note warn"><i class="fa-solid fa-shield-halved"></i><div>Data keluarga privat. Wali kelas dan kepala sekolah tidak melihat detail ini.</div></div>
      <div class="field-grid">
        ${field("Ayah", "Bambang Pratama")}
        ${field("Pekerjaan Ayah", "Wiraswasta")}
        ${maskedField("Telepon Orang Tua", student.parentPhoneMasked, student.parentPhoneFull, `${student.name} - telepon orang tua`)}
        ${field("Ibu", "Siti Aminah")}
        ${field("Preferensi Notifikasi", "WhatsApp")}
        ${field("Kontak Darurat", "Bambang Pratama")}
      </div>
    `;
  }

  return `
    <div class="field-grid">
      ${field("Nama Lengkap", student.name)}
      ${field("NIS", student.nis)}
      ${field("Jenis Kelamin", student.gender)}
      ${field("Kelas", student.className)}
      ${field("Asrama", `${student.dorm}, kamar ${student.room}`)}
      ${can("view_sensitive") ? maskedField("Telepon", student.phoneMasked, student.phoneFull, `${student.name} - telepon siswa`) : field("Telepon", "Disembunyikan untuk role ini")}
      ${can("view_sensitive") ? maskedField("Email", student.emailMasked, student.emailFull, `${student.name} - email siswa`) : field("Email", "Disembunyikan untuk role ini")}
      ${field("Catatan Awal BK", student.notes)}
    </div>
  `;
}

function field(label, value) {
  return `<div><div class="field-label">${label}</div><div class="field-value">${escapeHtml(value)}</div></div>`;
}

function maskedField(label, masked, full, object) {
  return `
    <div>
      <div class="field-label">${label} <i class="fa-solid fa-lock" style="color:var(--gold)"></i></div>
      <div class="field-value">
        <span data-mask="${masked}" data-full="${full}">${masked}</span>
        <button class="mask-button" data-mask-toggle data-object="${escapeHtml(object)}" aria-label="Tampilkan ${label}">
          <i class="fa-regular fa-eye"></i>
        </button>
      </div>
    </div>
  `;
}

function renderViolations() {
  const rows = visibleStudents().flatMap((student) => student.violations.map((violation) => ({ student, violation })));
  qs("#view-pelanggaran").innerHTML = `
    <div class="page-head">
      <div>
        <h1>Pelanggaran & Poin</h1>
        <p>Ledger poin contoh. Poin hanya masuk setelah verifikasi dan koreksi harus menyimpan alasan.</p>
      </div>
      <div class="actions">
        <button class="button primary" data-route-go="surat"><i class="fa-solid fa-envelope-open-text"></i> Tinjau Surat</button>
      </div>
    </div>
    <div class="privacy">
      <i class="fa-solid fa-scale-balanced"></i>
      <div><strong>Catatan proses.</strong> Gunakan bahasa pendampingan. Hindari label yang menghakimi siswa.</div>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Ledger Terbaru</h2>
          <p>${rows.length} entri contoh dari ${students.length} siswa.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Tanggal</th><th>Siswa</th><th>Jenis</th><th>Tingkat</th><th>Poin</th><th>Status</th></tr></thead>
          <tbody>
            ${rows.map(({ student, violation }) => `<tr><td>${formatDate(violation[0])}</td><td>${student.name}</td><td>${violation[1]}</td><td>${badge(violation[2])}</td><td><strong>+${violation[3]}</strong></td><td>${badge(violation[4])}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function violationTable(rows) {
  return `
    <div class="note info"><i class="fa-solid fa-circle-info"></i><div>Ambang saat ini: 0-25 Aman, 26-50 Perlu Perhatian, 51-100 Konseling BK, 101-150 Panggilan Orang Tua, 151-200 Home Visit.</div></div>
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Tanggal</th><th>Jenis</th><th>Tingkat</th><th>Poin</th><th>Status</th></tr></thead>
        <tbody>
          ${rows.map((row) => `<tr><td>${formatDate(row[0])}</td><td>${row[1]}</td><td>${badge(row[2])}</td><td><strong>+${row[3]}</strong></td><td>${badge(row[4])}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderCounseling() {
  qs("#view-konseling").innerHTML = `
    <div class="page-head">
      <div>
        <h1>Konseling</h1>
        <p>Pencatatan status dan tindak lanjut konseling. Isi detail tetap diperlakukan sebagai data sangat rahasia.</p>
      </div>
      <div class="actions">
        <button class="button ghost" data-route-go="audit"><i class="fa-solid fa-shield-halved"></i> Audit Akses</button>
      </div>
    </div>
    <div class="grid-2">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Catat Konseling</h2>
            <p>Data tersimpan lokal di browser untuk validasi alur prototype.</p>
          </div>
        </div>
        <div class="panel-body">
          <form class="form-grid" id="counselingForm">
            <div class="form-field">
              <label for="counselStudent">Siswa</label>
              <select class="field-select" id="counselStudent" required>
                ${students.map((student) => `<option value="${student.id}" ${student.id === state.activeStudentId ? "selected" : ""}>${student.name} - ${student.className}</option>`).join("")}
              </select>
            </div>
            <div class="form-field">
              <label for="counselArea">Bidang</label>
              <select class="field-select" id="counselArea" required>
                <option>Belajar</option>
                <option>Pribadi</option>
                <option>Sosial</option>
                <option>Karier</option>
                <option>Disiplin</option>
              </select>
            </div>
            <div class="form-field">
              <label for="counselStatus">Status</label>
              <select class="field-select" id="counselStatus" required>
                <option>Diproses</option>
                <option>Lanjutan</option>
                <option>Selesai</option>
              </select>
            </div>
            <div class="form-field">
              <label for="counselDate">Tanggal</label>
              <input class="field-input" id="counselDate" type="date" value="2026-06-23" required>
            </div>
            <div class="form-field full">
              <label for="counselFollowUp">Tindak lanjut</label>
              <textarea class="field-area" id="counselFollowUp" required placeholder="Contoh: koordinasi wali asrama, monitoring kehadiran, atau jadwal sesi lanjutan."></textarea>
            </div>
            <div class="form-field full">
              <button class="button primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> Simpan Catatan</button>
            </div>
          </form>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Riwayat Konseling</h2>
            <p>Isi lengkap tidak ditampilkan di daftar.</p>
          </div>
        </div>
        <div class="panel-body timeline">
          ${state.counselingNotes.map((note) => {
            const student = getStudent(note.studentId);
            return eventRow(note.date, `${student.name} - ${note.area}`, note.followUp, `${badge(note.status)} <button class="button ghost" data-open-confidential="${note.id}"><i class="fa-solid fa-lock"></i> Buka Isi</button>`);
          }).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderLetters() {
  qs("#view-surat").innerHTML = `
    <div class="page-head">
      <div>
        <h1>Surat Panggilan</h1>
        <p>Alur semi otomatis: pemicu, draft, tinjau Guru BK, setujui, lalu kirim.</p>
      </div>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Draft dan Riwayat</h2>
          <p>Tidak ada surat yang dikirim tanpa persetujuan Guru BK.</p>
        </div>
      </div>
      <div class="panel-body timeline">
        ${letters.map((letter) => eventRow(letter[0], `${letter[0]} - ${letter[1]}`, letter[2], `${badge(letter[3])}<button class="button ghost" data-approve-letter="${letter[0]}"><i class="fa-solid fa-check"></i> Tinjau</button>`)).join("")}
      </div>
    </section>
  `;
}

function renderReports() {
  const data = visibleStudents();
  qs("#view-laporan").innerHTML = `
    <div class="page-head">
      <div>
        <h1>Laporan</h1>
        <p>Laporan mengikuti cakupan login: ${roleDisplayName()} - ${roleScopeText()}.</p>
      </div>
    </div>
    <div class="grid-3">
      ${reportCard("Rekap Bulanan BK", "Statistik konseling, pelanggaran, home visit, dan surat.", "downloadMonthlyReport")}
      ${reportCard("Daftar Prioritas", "Siswa dengan risiko layanan tertinggi dan tindak lanjut.", "downloadPriorityReport")}
      ${reportCard("Audit Akses", "Aktivitas akses data sensitif dan privasi.", "downloadAuditReport")}
    </div>
  `;
}

function renderAccessCodes() {
  if (!can("manage_codes")) {
    qs("#view-kode-akses").innerHTML = emptyState("Tidak ada akses", "Kode akses hanya dapat dibuat dan diatur oleh Guru BK/Admin.");
    return;
  }

  qs("#view-kode-akses").innerHTML = `
    <div class="page-head">
      <div>
        <h1>Kode Akses</h1>
        <p>Guru BK/Admin membuat kode login untuk wali kelas dan kepala sekolah. Kode menentukan role dan cakupan data yang dapat dilihat.</p>
      </div>
    </div>
    <div class="grid-2">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Buat Kode Baru</h2>
            <p>Prototype ini menyimpan kode di browser untuk validasi alur.</p>
          </div>
        </div>
        <div class="panel-body">
          <form class="form-grid" id="accessCodeForm">
            <div class="form-field">
              <label for="accessRole">Role</label>
              <select class="field-select" id="accessRole" required>
                <option value="wali_kelas">Wali Kelas</option>
                <option value="kepala_sekolah">Kepala Sekolah</option>
              </select>
            </div>
            <div class="form-field">
              <label for="accessOwner">Nama / Pemegang Kode</label>
              <input class="field-input" id="accessOwner" placeholder="Contoh: Wali Kelas XI APHP" required>
            </div>
            <div class="form-field">
              <label for="accessCode">Kode Login</label>
              <input class="field-input" id="accessCode" placeholder="Contoh: WK-XIAPHP" required>
            </div>
            <div class="form-field">
              <label for="accessScope">Cakupan</label>
              <select class="field-select" id="accessScope" required>
                ${[...new Set(students.map((student) => student.className))].map((className) => `<option value="${className}">Kelas ${className}</option>`).join("")}
                <option value="AGREGAT">Laporan agregat sekolah</option>
              </select>
            </div>
            <div class="form-field full">
              <button class="button primary" type="submit"><i class="fa-solid fa-key"></i> Simpan Kode</button>
            </div>
          </form>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Kode Aktif</h2>
            <p>${accessCodes().length} kode tersedia.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Kode</th><th>Pemegang</th><th>Role</th><th>Cakupan</th><th>Status</th></tr></thead>
            <tbody>
              ${accessCodes().map((item) => `
                <tr>
                  <td><strong>${escapeHtml(item.code)}</strong></td>
                  <td>${escapeHtml(item.owner)}</td>
                  <td>${roles[item.role]?.name || item.role}</td>
                  <td>${escapeHtml(item.scopeLabel)}</td>
                  <td>${badge(item.active ? "Aktif" : "Nonaktif")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function reportCard(title, description, action) {
  return `
    <section class="report-card">
      <div><strong>${title}</strong><span>${description}</span></div>
      <button class="button ghost" data-report="${action}"><i class="fa-solid fa-download"></i> CSV</button>
    </section>
  `;
}

function renderAudit() {
  qs("#view-audit").innerHTML = `
    <div class="page-head">
      <div>
        <h1>Audit Akses</h1>
        <p>Log prototype untuk membuka data masking, isi konseling, dan aksi sensitif.</p>
      </div>
      <div class="actions">
        <button class="button ghost" id="clearAudit"><i class="fa-solid fa-eraser"></i> Bersihkan Log Lokal</button>
      </div>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Log Terbaru</h2>
          <p>${state.auditLogs.length} aktivitas tersimpan lokal.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Waktu</th><th>Aktor</th><th>Aksi</th><th>Objek</th><th>Level</th></tr></thead>
          <tbody>
            ${state.auditLogs.map((log) => `<tr><td>${log.time}</td><td>${log.actor}</td><td>${log.action}</td><td>${escapeHtml(log.object)}</td><td>${badge(log.level)}</td></tr>`).join("") || `<tr><td colspan="5">${emptyState("Belum ada log", "Aktivitas sensitif akan muncul di sini.")}</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function eventRow(date, title, subtitle, right) {
  const parsed = Date.parse(date);
  const d = Number.isNaN(parsed) ? String(date) : new Date(date).getDate();
  const m = Number.isNaN(parsed) ? "" : new Intl.DateTimeFormat("id-ID", { month: "short" }).format(new Date(date));
  return `
    <div class="event">
      <div class="event-date"><strong>${d}</strong><span>${m}</span></div>
      <div class="event-body"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span></div>
      <div>${right}</div>
    </div>
  `;
}

function emptyState(title, text) {
  return `<div class="empty"><i class="fa-regular fa-folder-open"></i><strong>${title}</strong><p>${text}</p></div>`;
}

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  showToast("CSV dibuat dari data prototype.");
}

function exportStudents() {
  const rows = [
    ["NIS", "Nama", "Kelas", "Asrama", "Kehadiran", "Poin", "Status", "Tahap"],
    ...filteredStudents().map((student) => [student.nis, student.name, student.className, student.dorm, student.attendance, student.points, student.risk, student.stage])
  ];
  downloadCsv("rimbawan-bk-data-siswa.csv", rows);
}

function handleReports(action) {
  if (action === "downloadAuditReport") {
    if (!can("view_audit")) {
      showToast("Audit akses hanya untuk Guru BK/Admin.");
      return;
    }
    downloadCsv("rimbawan-bk-audit.csv", [["Waktu", "Aktor", "Aksi", "Objek", "Level"], ...state.auditLogs.map((log) => [log.time, log.actor, log.action, log.object, log.level])]);
    return;
  }
  if (action === "downloadPriorityReport") {
    const rows = visibleStudents().filter((student) => student.points > 50);
    downloadCsv("rimbawan-bk-prioritas.csv", [["Nama", "Kelas", "Asrama", "Poin", "Tahap"], ...rows.map((student) => [effectiveScope().type === "aggregate" ? "Agregat" : student.name, student.className, student.dorm, student.points, student.stage])]);
    return;
  }
  const data = visibleStudents();
  const ids = visibleStudentIds();
  downloadCsv("rimbawan-bk-rekap-bulanan.csv", [["Metrik", "Nilai"], ["Total Siswa", data.length], ["Konseling", state.counselingNotes.filter((note) => ids.has(note.studentId)).length], ["Surat", can("manage_letters") ? letters.length : "Ringkasan"], ["Pelanggaran", data.reduce((sum, student) => sum + student.violations.length, 0)]]);
}

document.addEventListener("click", (event) => {
  const fillCode = event.target.closest("[data-fill-code]");
  if (fillCode) {
    qs("#loginCode").value = fillCode.dataset.fillCode;
    qs("#loginCode").focus();
  }

  if (event.target.closest("#logoutButton")) {
    addAudit("Keluar dari aplikasi", roleDisplayName(), "Info");
    state.sessionRole = null;
    state.sessionCodeId = null;
    saveState();
    location.hash = "#login";
    render();
    showToast("Sesi login ditutup.");
  }

  const navOpen = event.target.closest("[data-open-nav]");
  if (navOpen) qs("#app").classList.add("nav-open");

  const navClose = event.target.closest("[data-close-nav]");
  if (navClose) qs("#app").classList.remove("nav-open");

  const routeGo = event.target.closest("[data-route-go]");
  if (routeGo) {
    location.hash = `#${routeGo.dataset.routeGo}`;
    qs("#app").classList.remove("nav-open");
  }

  const openStudent = event.target.closest("[data-open-student]");
  if (openStudent) {
    state.activeStudentId = openStudent.dataset.openStudent;
    saveState();
    location.hash = "#profil";
  }

  const profileTab = event.target.closest("[data-profile-tab]");
  if (profileTab) {
    activeProfileTab = profileTab.dataset.profileTab;
    renderProfile();
  }

  const maskToggle = event.target.closest("[data-mask-toggle]");
  if (maskToggle) {
    const span = maskToggle.parentElement.querySelector("[data-mask]");
    const showing = span.textContent === span.dataset.full;
    span.textContent = showing ? span.dataset.mask : span.dataset.full;
    maskToggle.querySelector("i").className = showing ? "fa-regular fa-eye" : "fa-regular fa-eye-slash";
    if (!showing) {
      addAudit("Membuka data ter-masking", maskToggle.dataset.object);
      showToast("Data sensitif ditampilkan dan dicatat di audit log.");
    }
  }

  const confidential = event.target.closest("[data-open-confidential]");
  if (confidential) {
    addAudit("Membuka isi konseling", confidential.dataset.openConfidential);
    showToast("Akses isi konseling dicatat di audit log.");
    if (activeRoute === "audit") renderAudit();
  }

  const approveLetter = event.target.closest("[data-approve-letter]");
  if (approveLetter) {
    addAudit("Meninjau draft surat panggilan", approveLetter.dataset.approveLetter, "Surat");
    showToast("Draft surat masuk daftar tinjauan Guru BK.");
  }

  const report = event.target.closest("[data-report]");
  if (report) handleReports(report.dataset.report);

  if (event.target.closest("#exportStudents")) exportStudents();

  if (event.target.closest("#clearAudit")) {
    state.auditLogs = [];
    saveState();
    renderAudit();
    showToast("Log lokal prototype dibersihkan.");
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "globalSearch" && (activeRoute === "siswa" || activeRoute === "dashboard")) {
    activeRoute === "siswa" ? renderStudents() : renderDashboard();
  }
  if (event.target.id === "pointInput") {
    const value = Number(event.target.value || 0);
    qs("#pointResult span").textContent = `${value} poin masuk tahap ${pointStage(value)}.`;
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "riskFilter" || event.target.id === "dormFilter") {
    state.filters = {
      risk: qs("#riskFilter")?.value || "all",
      dorm: qs("#dormFilter")?.value || "all"
    };
    saveState();
    renderStudents();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "loginForm") {
    event.preventDefault();
    const code = qs("#loginCode").value.trim().toUpperCase();
    const matched = accessCodes().find((item) => item.active && item.code.toUpperCase() === code);
    if (!matched) {
      showToast("Kode akses tidak ditemukan atau tidak aktif.");
      return;
    }
    state.sessionRole = matched.role;
    state.sessionCodeId = matched.id;
    if (matched.scope.type === "class") {
      const firstStudent = students.find((student) => student.className === matched.scope.value);
      if (firstStudent) state.activeStudentId = firstStudent.id;
    }
    addAudit("Login dengan kode akses", matched.owner, "Login");
    saveState();
    location.hash = "#dashboard";
    render();
    showToast(`Masuk sebagai ${matched.owner}.`);
    return;
  }

  if (event.target.id === "accessCodeForm") {
    event.preventDefault();
    const role = qs("#accessRole").value;
    const scopeValue = qs("#accessScope").value;
    const isAggregate = role === "kepala_sekolah" || scopeValue === "AGREGAT";
    const newCode = {
      id: `AKS-${Date.now()}`,
      code: qs("#accessCode").value.trim().toUpperCase(),
      role,
      owner: qs("#accessOwner").value.trim(),
      scopeLabel: isAggregate ? "Laporan agregat sekolah" : `Kelas ${scopeValue}`,
      scope: isAggregate ? { type: "aggregate" } : { type: "class", value: scopeValue },
      active: true
    };
    if (accessCodes().some((item) => item.code.toUpperCase() === newCode.code)) {
      showToast("Kode sudah dipakai. Buat kode lain.");
      return;
    }
    state.accessCodes = [newCode, ...accessCodes()];
    addAudit("Membuat kode akses", `${newCode.owner} - ${newCode.code}`, "Kode Akses");
    saveState();
    renderAccessCodes();
    showToast("Kode akses baru tersimpan.");
    return;
  }

  if (event.target.id !== "counselingForm") return;
  event.preventDefault();
  const studentId = qs("#counselStudent").value;
  const student = getStudent(studentId);
  const note = {
    id: `KSL-${String(Date.now()).slice(-6)}`,
    studentId,
    date: qs("#counselDate").value,
    area: qs("#counselArea").value,
    status: qs("#counselStatus").value,
    followUp: qs("#counselFollowUp").value.trim()
  };
  state.counselingNotes.unshift(note);
  state.activeStudentId = studentId;
  addAudit("Menambah catatan konseling", `${student.name} - ${note.area}`, "Konseling");
  saveState();
  showToast("Catatan konseling tersimpan di prototype.");
  renderCounseling();
});

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  qs("#notificationButton").addEventListener("click", () => showToast("Ada 4 agenda tindak lanjut yang perlu ditinjau."));
  render();
});
