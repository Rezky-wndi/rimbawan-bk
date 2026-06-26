const STORAGE_KEY = "rimbawanBkCleanOpsV1";

const rombels = window.RIMBAWAN_DATA?.rombels || [
  "X A", "X B", "X C",
  "XI A", "XI B", "XI C",
  "XII A", "XII B", "XII C"
];

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
  customStudents: [],
  studentClassOverrides: {},
  studentDocuments: {},
  studentSubjects: {},
  studentViolations: {},
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
      id: "AKS-WK-XA",
      code: "WK-XA",
      role: "wali_kelas",
      owner: "Wali Kelas X A",
      scopeLabel: "Kelas X A",
      scope: { type: "class", value: "X A" },
      active: true
    },
    {
      id: "AKS-WK-XB",
      code: "WK-XB",
      role: "wali_kelas",
      owner: "Wali Kelas X B",
      scopeLabel: "Kelas X B",
      scope: { type: "class", value: "X B" },
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
    className: "all"
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
      followUp: "Koordinasi dengan wali kelas."
    }
  ]
};

const students = window.RIMBAWAN_DATA?.students || [];
const tasks = [
  ["Hari ini", "Lengkapi data peserta didik", "Periksa rombel dan biodata awal", "warn"],
  ["Besok", "Review catatan konseling", "Tinjauan tindak lanjut peserta didik", "warn"],
  ["3 hari", "Koordinasi wali kelas", "Pastikan akses wali kelas sesuai rombel", "info"],
  ["Tertunda", "Verifikasi catatan baru", "Belum ada pelanggaran aktif", "danger"]
];

const letters = [
  ["SP-2026-016", "Peserta didik", "Draft surat panggilan bila diperlukan", "Draft"],
  ["SP-2026-015", "Peserta didik", "Koordinasi orang tua", "Menunggu Persetujuan"],
  ["SP-2026-014", "Peserta didik", "Panggilan orang tua", "Dikonfirmasi Hadir"]
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

function allStudents() {
  return [...students, ...(state.customStudents || [])];
}

function studentDocuments(studentId) {
  return state.studentDocuments?.[studentId] || [];
}

function academicsFor(student) {
  return [...(student.academics || []), ...(state.studentSubjects?.[student.id] || [])];
}

function violationsFor(student) {
  return [...(student.violations || []), ...(state.studentViolations?.[student.id] || [])];
}

function classFor(student) {
  return state.studentClassOverrides?.[student.id] || student.className;
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
  const source = allStudents();
  if (scope.type === "class") return source.filter((student) => classFor(student) === scope.value);
  if (scope.type === "student") return source.filter((student) => student.id === scope.value);
  if (scope.type === "aggregate") return source;
  return source;
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

function riskFor(student) {
  return violationsFor(student).length ? "Ada Catatan" : "Aktif";
}

function initialsFromName(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "SW";
}

function maskContact(value, fallback = "-") {
  if (!value) return fallback;
  if (value.includes("@")) {
    const [name, domain] = value.split("@");
    return `${name.slice(0, 1)}*****@${domain || "email.com"}`;
  }
  return value.length > 7 ? `${value.slice(0, 4)}-****-${value.slice(-4)}` : value;
}

function filteredStudents() {
  const search = qs("#globalSearch").value.trim().toLowerCase();
  const selectedClass = state.filters?.className || "all";
  return visibleStudents().filter((student) => {
    const haystack = [
      student.name,
      student.nis,
      classFor(student),
      riskFor(student)
    ].join(" ").toLowerCase();
    const bySearch = !search || haystack.includes(search);
    const byClass = selectedClass === "all" || classFor(student) === selectedClass;
    return bySearch && byClass;
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
    siswa: "Peserta Didik",
    profil: "Profil Peserta Didik",
    pelanggaran: "Pelanggaran",
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
  const visibleIds = visibleStudentIds();
  const counselingCount = state.counselingNotes.filter((note) => visibleIds.has(note.studentId)).length;
  const violationCount = data.reduce((sum, student) => sum + violationsFor(student).length, 0);
  const avgAttendance = Math.round(data.reduce((sum, student) => sum + student.attendance, 0) / Math.max(1, data.length));
  const aggregateOnly = effectiveScope().type === "aggregate";

  qs("#view-dashboard").innerHTML = `
    <div class="page-head">
      <div>
        <h1>Dashboard Guru BK</h1>
        <p>${roleDisplayName()} - ${roleScopeText()}.</p>
      </div>
      <div class="actions">
        ${canAccess("siswa") ? `<button class="button ghost" data-route-go="siswa"><i class="fa-solid fa-user-graduate"></i> Buka Data Peserta Didik</button>` : ""}
        ${canAccess("konseling") ? `<button class="button primary" data-route-go="konseling"><i class="fa-solid fa-plus"></i> Catat Konseling</button>` : ""}
      </div>
    </div>
    <div class="privacy">
      <i class="fa-solid fa-lock"></i>
      <div><strong>Tampilan terlindungi.</strong> Data ditampilkan per kelas/rombel. Isi konseling dan biodata keluarga tetap dibatasi untuk Guru BK/Admin.</div>
    </div>
    <section class="stats">
      ${statCard("Total Peserta Didik", data.length, aggregateOnly ? "Ringkasan sekolah" : "Dalam cakupan akses", "fa-solid fa-user-graduate", "green")}
      ${statCard("Total Kelas", new Set(data.map((student) => classFor(student))).size, "Rombel aktif", "fa-solid fa-chalkboard-user", "blue")}
      ${statCard("Konseling Tercatat", counselingCount, "Termasuk catatan lokal prototype", "fa-solid fa-comments", "gold")}
      ${statCard("Catatan Pelanggaran", violationCount, "Catatan aktif", "fa-solid fa-clipboard-list", "red")}
    </section>
    <div class="grid-2">
      <div>
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>${aggregateOnly ? "Ringkasan Peserta Didik per Kelas" : "Peserta Didik per Kelas"}</h2>
              <p>Data peserta didik dikelompokkan berdasarkan rombel.</p>
            </div>
            ${canAccess("siswa") ? `<button class="button ghost" data-route-go="siswa">Semua</button>` : ""}
          </div>
          <div class="table-wrap">${aggregateSummary(data)}</div>
        </section>
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>Peta Layanan</h2>
              <p>Komposisi layanan awal setelah data peserta didik dimasukkan.</p>
            </div>
          </div>
          <div class="panel-body mini-bars">
            ${barRow("Peserta Didik", data.length, Math.max(1, data.length), "green")}
            ${barRow("Konseling", counselingCount, Math.max(1, data.length), "info")}
            ${barRow("Pelanggaran", violationCount, Math.max(1, data.length), "warn")}
            ${barRow("Kelas", new Set(data.map((student) => classFor(student))).size, rombels.length, "info")}
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
              <h2>Masa Transisi Kenaikan Kelas</h2>
              <p>Kelas peserta didik bisa diubah dari halaman profil masing-masing.</p>
            </div>
          </div>
          <div class="panel-body">
            <div class="note info" style="margin-bottom:0"><i class="fa-solid fa-circle-info"></i><div>Gunakan fitur <b>Ubah Kelas</b> pada profil peserta didik untuk memindahkan rombel tanpa menghapus data biodata.</div></div>
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
  const rows = rombels.map((rombel) => [rombel, data.filter((student) => classFor(student) === rombel).length]);
  return `
    <table class="table">
      <thead><tr><th>Kelas / Rombel</th><th>Jumlah Peserta Didik</th><th>Catatan</th></tr></thead>
      <tbody>
        ${rows.map((row) => `<tr><td>${badge(row[0])}</td><td><strong>${row[1]}</strong></td><td style="color:var(--text-2)">Data aktif per kelas</td></tr>`).join("")}
      </tbody>
    </table>
  `;
}

function renderStudents() {
  const scoped = visibleStudents();
  const classOptions = [...new Set(scoped.map((student) => classFor(student)))];
  const data = filteredStudents();
  const selectedClass = state.filters?.className || "all";
  qs("#view-siswa").innerHTML = `
    <div class="page-head">
      <div>
        <h1>Data Peserta Didik</h1>
        <p>Daftar peserta didik berdasarkan kelas/rombel. Kelas bisa diubah saat masa transisi kenaikan kelas.</p>
      </div>
      <div class="actions">
        ${can("view_sensitive") ? `<button class="button primary" data-toggle-panel="addStudentPanel"><i class="fa-solid fa-user-plus"></i> Tambah Peserta Didik</button>` : ""}
        <button class="button ghost" id="exportStudents"><i class="fa-solid fa-file-csv"></i> Ekspor CSV</button>
        <button class="button primary" data-route-go="profil"><i class="fa-solid fa-address-card"></i> Buka Profil Aktif</button>
      </div>
    </div>
    ${can("view_sensitive") ? addStudentPanel() : ""}
    <div class="filters">
      <select class="field-select" id="classFilter" aria-label="Filter kelas">
        <option value="all" ${selectedClass === "all" ? "selected" : ""}>Semua kelas</option>
        ${classOptions.map((option) => `<option value="${option}" ${selectedClass === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Daftar Peserta Didik</h2>
          <p>${data.length} peserta didik tampil dari ${scoped.length} peserta didik dalam cakupan akses.</p>
        </div>
      </div>
      <div class="table-wrap">${studentTable(data)}</div>
    </section>
  `;
}

function addStudentPanel() {
  return `
    <section class="panel collapsible-panel" id="addStudentPanel" hidden>
      <div class="panel-head">
        <div>
          <h2>Tambah Peserta Didik</h2>
          <p>Rombel tersedia 9 kelas: X A sampai XII C.</p>
        </div>
      </div>
      <div class="panel-body">
        <form class="form-grid" id="studentForm">
          <div class="form-field">
            <label for="studentName">Nama siswa</label>
            <input class="field-input" id="studentName" required>
          </div>
          <div class="form-field">
            <label for="studentNis">NIS</label>
            <input class="field-input" id="studentNis" required>
          </div>
          <div class="form-field">
            <label for="studentClass">Rombel</label>
            <select class="field-select" id="studentClass" required>
              ${rombels.map((rombel) => `<option value="${rombel}">${rombel}</option>`).join("")}
            </select>
          </div>
          <div class="form-field">
            <label for="studentGender">Jenis kelamin</label>
            <select class="field-select" id="studentGender" required>
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
          </div>
          <div class="form-field full">
            <label for="studentNotes">Catatan awal BK</label>
            <textarea class="field-area" id="studentNotes" placeholder="Catatan singkat kebutuhan pendampingan awal."></textarea>
          </div>
          <div class="form-field full">
            <button class="button primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> Simpan Peserta Didik</button>
          </div>
        </form>
      </div>
    </section>
  `;
}

function studentTable(data) {
  if (!data.length) {
    return `<div class="empty"><i class="fa-regular fa-folder-open"></i><strong>Data tidak ditemukan</strong><p>Ubah kata kunci atau filter untuk melihat peserta didik lain.</p></div>`;
  }
  return `
    <table class="table">
      <thead>
        <tr>
          <th>Peserta Didik</th>
          <th>Kelas</th>
          <th>Kehadiran</th>
          <th>Catatan Pelanggaran</th>
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
            <td>${classFor(student)}</td>
            <td><strong>${student.attendance}%</strong></td>
            <td><strong>${violationsFor(student).length}</strong></td>
            <td>${badge(riskFor(student))}</td>
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
    ["pelanggaran", "fa-solid fa-triangle-exclamation", "Pelanggaran"],
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
            <span><i class="fa-solid fa-graduation-cap"></i> Kelas ${classFor(student)}</span>
            <span><i class="fa-solid fa-venus-mars"></i> ${student.gender}</span>
          </div>
          <div class="meta">${badge(riskFor(student))} ${badge(`${violationsFor(student).length} catatan pelanggaran`)}</div>
        </div>
        <div class="profile-actions">
          <button class="button ghost" data-route-go="siswa"><i class="fa-solid fa-arrow-left"></i> Daftar</button>
          ${canAccess("konseling") ? `<button class="button primary" data-route-go="konseling"><i class="fa-solid fa-comment-medical"></i> Catat Konseling</button>` : ""}
        </div>
      </div>
      <div class="profile-stats">
        ${profileStat("Kehadiran", `${student.attendance}%`, "fa-solid fa-calendar-check", "green")}
        ${profileStat("Kelas", classFor(student), "fa-solid fa-chalkboard-user", "blue")}
        ${profileStat("Pelanggaran", violationsFor(student).length, "fa-solid fa-clipboard-list", "red")}
        ${profileStat("Status", riskFor(student), "fa-solid fa-circle-check", "gold")}
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
      ${can("view_sensitive") ? subjectForm(student) : ""}
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Mata Pelajaran</th><th>KKM</th><th>Nilai</th><th>Status</th></tr></thead>
          <tbody>
            ${academicsFor(student).length ? academicsFor(student).map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td><strong>${row[2]}</strong></td><td>${badge(row[2] >= row[1] ? "Tuntas" : "Di bawah KKM")}</td></tr>`).join("") : `<tr><td colspan="4" style="color:var(--text-2)">Belum ada data mata pelajaran.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
  }

  if (activeProfileTab === "pelanggaran") {
    return `${can("view_sensitive") ? violationForm(student) : ""}${violationTable(violationsFor(student))}`;
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
        ${field("Ayah", "-")}
        ${field("Pekerjaan Ayah", "-")}
        ${maskedField("Telepon Orang Tua", student.parentPhoneMasked, student.parentPhoneFull, `${student.name} - telepon orang tua`)}
        ${field("Ibu", "-")}
        ${field("Preferensi Notifikasi", "-")}
        ${field("Kontak Darurat", "-")}
      </div>
    `;
  }

  return `
    ${can("view_sensitive") ? classEditForm(student) : ""}
    <div class="field-grid">
      ${field("Nama Lengkap", student.name)}
      ${field("NIS", student.nis)}
      ${field("Jenis Kelamin", student.gender)}
      ${field("Kelas Saat Ini", classFor(student))}
      ${can("view_sensitive") ? maskedField("Telepon", student.phoneMasked, student.phoneFull, `${student.name} - telepon siswa`) : field("Telepon", "Disembunyikan untuk role ini")}
      ${can("view_sensitive") ? maskedField("Email", student.emailMasked, student.emailFull, `${student.name} - email siswa`) : field("Email", "Disembunyikan untuk role ini")}
      ${field("Catatan Awal BK", student.notes)}
    </div>
    ${can("view_sensitive") ? documentStorage(student) : ""}
  `;
}

function classEditForm(student) {
  return `
    <form class="inline-form" id="classEditForm" data-student-id="${student.id}">
      <div class="form-field">
        <label for="studentNewClass">Ubah kelas / rombel</label>
        <select class="field-select" id="studentNewClass" required>
          ${rombels.map((rombel) => `<option value="${rombel}" ${classFor(student) === rombel ? "selected" : ""}>${rombel}</option>`).join("")}
        </select>
      </div>
      <button class="button primary" type="submit"><i class="fa-solid fa-rotate"></i> Simpan Kelas</button>
    </form>
  `;
}

function subjectForm(student) {
  return `
    <form class="inline-form" id="subjectForm" data-student-id="${student.id}">
      <div class="form-field">
        <label for="subjectName">Mata pelajaran</label>
        <input class="field-input" id="subjectName" placeholder="Contoh: Bahasa Inggris" required>
      </div>
      <div class="form-field">
        <label for="subjectKkm">KKM</label>
        <input class="field-input" id="subjectKkm" type="number" min="0" max="100" value="75" required>
      </div>
      <div class="form-field">
        <label for="subjectScore">Nilai</label>
        <input class="field-input" id="subjectScore" type="number" min="0" max="100" required>
      </div>
      <button class="button primary" type="submit"><i class="fa-solid fa-plus"></i> Tambah Pelajaran</button>
    </form>
  `;
}

function violationForm(student) {
  return `
    <form class="inline-form" id="violationForm" data-student-id="${student.id}">
      <div class="form-field">
        <label for="violationDate">Tanggal</label>
        <input class="field-input" id="violationDate" type="date" value="2026-06-26" required>
      </div>
      <div class="form-field">
        <label for="violationType">Jenis pelanggaran</label>
        <input class="field-input" id="violationType" placeholder="Contoh: Terlambat apel" required>
      </div>
      <div class="form-field">
        <label for="violationLevel">Kategori</label>
        <select class="field-select" id="violationLevel">
          <option>Ringan</option>
          <option>Sedang</option>
          <option>Berat</option>
        </select>
      </div>
      <div class="form-field">
        <label for="violationStatus">Status</label>
        <select class="field-select" id="violationStatus">
          <option>Diproses</option>
          <option>Terverifikasi</option>
          <option>Selesai</option>
        </select>
      </div>
      <button class="button primary" type="submit"><i class="fa-solid fa-plus"></i> Tambah Pelanggaran</button>
    </form>
  `;
}

function documentStorage(student) {
  const docs = studentDocuments(student.id);
  const expected = ["Akta", "Ijazah", "Kartu Keluarga"];
  return `
    <section class="sub-panel">
      <div class="panel-head compact">
        <div>
          <h2>Simpan File Biodata</h2>
          <p>Akta, ijazah, dan KK. Prototype menyimpan nama file, bukan isi dokumen.</p>
        </div>
      </div>
      <div class="panel-body">
        <form class="form-grid" id="documentForm" data-student-id="${student.id}">
          ${expected.map((label) => `
            <div class="form-field">
              <label for="doc${label.replace(/\s/g, "")}">${label}</label>
              <input class="field-input" id="doc${label.replace(/\s/g, "")}" type="file" data-doc-type="${label}">
            </div>
          `).join("")}
          <div class="form-field full">
            <button class="button primary" type="submit"><i class="fa-solid fa-upload"></i> Simpan File</button>
          </div>
        </form>
        <div class="doc-list">
          ${docs.length ? docs.map((doc) => `
            <div class="doc-row">
              <span class="chip-icon blue"><i class="fa-solid fa-file"></i></span>
              <div><strong>${escapeHtml(doc.type)}</strong><span>${escapeHtml(doc.name)} - ${doc.size}</span></div>
            </div>
          `).join("") : `<div class="empty slim"><i class="fa-regular fa-folder-open"></i><strong>Belum ada file</strong><p>File yang dipilih akan tercatat di sini.</p></div>`}
        </div>
      </div>
    </section>
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
  const scoped = visibleStudents();
  const rows = scoped.flatMap((student) => violationsFor(student).map((violation) => ({ student, violation })));
  qs("#view-pelanggaran").innerHTML = `
    <div class="page-head">
      <div>
        <h1>Pelanggaran</h1>
        <p>Catatan pelanggaran peserta didik. Fokus pada jenis, kategori, status, dan tindak lanjut.</p>
      </div>
      <div class="actions">
        ${can("view_sensitive") ? `<button class="button primary" data-route-go="siswa"><i class="fa-solid fa-user-graduate"></i> Pilih Peserta Didik</button>` : ""}
      </div>
    </div>
    <div class="privacy">
      <i class="fa-solid fa-scale-balanced"></i>
      <div><strong>Catatan proses.</strong> Gunakan bahasa pendampingan. Hindari label yang menghakimi peserta didik.</div>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Catatan Terbaru</h2>
          <p>${rows.length} catatan dari ${scoped.length} peserta didik dalam cakupan akses.</p>
        </div>
      </div>
      <div class="table-wrap">
        ${rows.length ? `<table class="table">
          <thead><tr><th>Tanggal</th><th>Peserta Didik</th><th>Kelas</th><th>Jenis</th><th>Kategori</th><th>Status</th></tr></thead>
          <tbody>
            ${rows.map(({ student, violation }) => `<tr><td>${formatDate(violation[0])}</td><td>${student.name}</td><td>${classFor(student)}</td><td>${violation[1]}</td><td>${badge(violation[2])}</td><td>${badge(violation[3])}</td></tr>`).join("")}
          </tbody>
        </table>` : emptyState("Belum ada pelanggaran", "Data peserta didik sudah masuk dan catatan pelanggaran masih kosong.")}
      </div>
    </section>
  `;
}

function violationTable(rows) {
  if (!rows.length) {
    return emptyState("Belum ada pelanggaran", "Peserta didik ini belum memiliki catatan pelanggaran.");
  }
  return `
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Tanggal</th><th>Jenis</th><th>Kategori</th><th>Status</th></tr></thead>
        <tbody>
          ${rows.map((row) => `<tr><td>${formatDate(row[0])}</td><td>${row[1]}</td><td>${badge(row[2])}</td><td>${badge(row[3])}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderCounseling() {
  const visibleIds = visibleStudentIds();
  const notes = state.counselingNotes.filter((note) => visibleIds.has(note.studentId));
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
              <label for="counselStudent">Peserta Didik</label>
              <select class="field-select" id="counselStudent" required>
                ${visibleStudents().map((student) => `<option value="${student.id}" ${student.id === state.activeStudentId ? "selected" : ""}>${student.name} - ${classFor(student)}</option>`).join("")}
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
              <textarea class="field-area" id="counselFollowUp" required placeholder="Contoh: koordinasi wali kelas, monitoring kehadiran, atau jadwal sesi lanjutan."></textarea>
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
          ${notes.map((note) => {
            const student = getStudent(note.studentId);
            return eventRow(note.date, `${student.name} - ${note.area}`, note.followUp, `${badge(note.status)} <button class="button ghost" data-open-confidential="${note.id}"><i class="fa-solid fa-lock"></i> Buka Isi</button>`);
          }).join("") || emptyState("Belum ada riwayat konseling", "Catatan akan muncul setelah disimpan.")}
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
      ${reportCard("Catatan Pelanggaran", "Peserta didik yang memiliki catatan pelanggaran.", "downloadPriorityReport")}
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
                ${rombels.map((className) => `<option value="${className}">Kelas ${className}</option>`).join("")}
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
    ["NIS", "Nama", "Kelas", "Kehadiran", "Catatan Pelanggaran", "Status"],
    ...filteredStudents().map((student) => [student.nis, student.name, classFor(student), student.attendance, violationsFor(student).length, riskFor(student)])
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
    const rows = visibleStudents().filter((student) => violationsFor(student).length > 0);
    downloadCsv("rimbawan-bk-catatan-pelanggaran.csv", [["Nama", "Kelas", "Jumlah Catatan", "Status"], ...rows.map((student) => [effectiveScope().type === "aggregate" ? "Agregat" : student.name, classFor(student), violationsFor(student).length, riskFor(student)])]);
    return;
  }
  const data = visibleStudents();
  const ids = visibleStudentIds();
  downloadCsv("rimbawan-bk-rekap-bulanan.csv", [["Metrik", "Nilai"], ["Total Peserta Didik", data.length], ["Konseling", state.counselingNotes.filter((note) => ids.has(note.studentId)).length], ["Surat", can("manage_letters") ? letters.length : "Ringkasan"], ["Pelanggaran", data.reduce((sum, student) => sum + violationsFor(student).length, 0)]]);
}

document.addEventListener("click", (event) => {
  const profileMenuButton = event.target.closest("#profileMenuButton");
  const profilePopover = qs("#profilePopover");
  if (profileMenuButton && profilePopover) {
    const willOpen = !profilePopover.classList.contains("open");
    profilePopover.classList.toggle("open", willOpen);
    profileMenuButton.setAttribute("aria-expanded", String(willOpen));
    return;
  }

  if (profilePopover && !event.target.closest("#profilePopover") && !profileMenuButton) {
    profilePopover.classList.remove("open");
    qs("#profileMenuButton")?.setAttribute("aria-expanded", "false");
  }

  const togglePanel = event.target.closest("[data-toggle-panel]");
  if (togglePanel) {
    const panel = qs(`#${togglePanel.dataset.togglePanel}`);
    if (panel) panel.hidden = !panel.hidden;
  }

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
    if (profilePopover) profilePopover.classList.remove("open");
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
});

document.addEventListener("change", (event) => {
  if (event.target.id === "classFilter") {
    state.filters = {
      className: qs("#classFilter")?.value || "all"
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
      const firstStudent = allStudents().find((student) => classFor(student) === matched.scope.value);
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

  if (event.target.id === "studentForm") {
    event.preventDefault();
    const name = qs("#studentName").value.trim();
    const phone = "";
    const newStudent = {
      id: `SIS-${Date.now()}`,
      nis: qs("#studentNis").value.trim(),
      name,
      initials: initialsFromName(name),
      className: qs("#studentClass").value,
      dorm: "-",
      room: "-",
      gender: qs("#studentGender").value,
      attendance: 100,
      points: 0,
      risk: "Aktif",
      stage: "Belum Ada Pelanggaran",
      phoneMasked: maskContact(phone),
      phoneFull: phone || "-",
      emailMasked: "-",
      emailFull: "-",
      parentPhoneMasked: "-",
      parentPhoneFull: "-",
      notes: qs("#studentNotes").value.trim() || "Belum ada catatan awal BK.",
      violations: [],
      academics: []
    };
    state.customStudents = [newStudent, ...(state.customStudents || [])];
    state.activeStudentId = newStudent.id;
    addAudit("Menambah peserta didik", `${newStudent.name} - ${newStudent.className}`, "Data Peserta Didik");
    saveState();
    showToast("Peserta didik baru tersimpan di prototype.");
    renderStudents();
    return;
  }

  if (event.target.id === "classEditForm") {
    event.preventDefault();
    const studentId = event.target.dataset.studentId;
    const newClass = qs("#studentNewClass").value;
    state.studentClassOverrides = state.studentClassOverrides || {};
    state.studentClassOverrides[studentId] = newClass;
    addAudit("Mengubah kelas peserta didik", `${getStudent(studentId).name} - ${newClass}`, "Data Peserta Didik");
    saveState();
    showToast("Kelas peserta didik diperbarui.");
    renderProfile();
    return;
  }

  if (event.target.id === "subjectForm") {
    event.preventDefault();
    const studentId = event.target.dataset.studentId;
    const row = [
      qs("#subjectName").value.trim(),
      Number(qs("#subjectKkm").value || 75),
      Number(qs("#subjectScore").value || 0)
    ];
    state.studentSubjects = state.studentSubjects || {};
    state.studentSubjects[studentId] = [row, ...(state.studentSubjects[studentId] || [])];
    addAudit("Menambah mata pelajaran", `${getStudent(studentId).name} - ${row[0]}`, "Akademik");
    saveState();
    showToast("Mata pelajaran ditambahkan.");
    renderProfile();
    return;
  }

  if (event.target.id === "violationForm") {
    event.preventDefault();
    const studentId = event.target.dataset.studentId;
    const row = [
      qs("#violationDate").value,
      qs("#violationType").value.trim(),
      qs("#violationLevel").value,
      qs("#violationStatus").value
    ];
    state.studentViolations = state.studentViolations || {};
    state.studentViolations[studentId] = [row, ...(state.studentViolations[studentId] || [])];
    addAudit("Menambah pelanggaran", `${getStudent(studentId).name} - ${row[1]}`, "Pelanggaran");
    saveState();
    showToast("Pelanggaran ditambahkan.");
    renderProfile();
    return;
  }

  if (event.target.id === "documentForm") {
    event.preventDefault();
    const studentId = event.target.dataset.studentId;
    const selected = [...event.target.querySelectorAll("input[type='file']")]
      .filter((input) => input.files && input.files[0])
      .map((input) => {
        const file = input.files[0];
        return {
          type: input.dataset.docType,
          name: file.name,
          size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
          savedAt: nowStamp()
        };
      });
    if (!selected.length) {
      showToast("Pilih minimal satu file terlebih dahulu.");
      return;
    }
    state.studentDocuments = state.studentDocuments || {};
    state.studentDocuments[studentId] = [...selected, ...(state.studentDocuments[studentId] || [])];
    addAudit("Menyimpan file biodata", `${getStudent(studentId).name} - ${selected.map((item) => item.type).join(", ")}`, "Dokumen");
    saveState();
    showToast("File biodata tercatat di prototype.");
    renderProfile();
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
