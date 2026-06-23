# Struktur Laravel — RIMBAWAN BK

Peta folder lengkap yang akan dipakai saat masuk tahap coding. Folder inti Laravel
(`app/`, `resources/`, `routes/`, dst) **dibuat otomatis** oleh perintah:

```bash
composer create-project laravel/laravel .
```

Karena itu folder Laravel **tidak dibuat manual sekarang** — agar tidak bentrok dengan
generator Laravel. Dokumen ini adalah peta acuannya. Setelah Laravel terpasang, kita
tambahkan sub-folder per modul di bawah ini.

Catatan versi (diisi saat setup):
- PHP: `___`
- Laravel: `___`
- MySQL: `___`

---

## Peta Folder Target

```
rimbawan-bk/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Siswa/
│   │   │   ├── OrangTua/
│   │   │   ├── Absensi/
│   │   │   ├── Nilai/
│   │   │   ├── Pelanggaran/
│   │   │   ├── Konseling/
│   │   │   ├── Asesmen/
│   │   │   ├── HomeVisit/
│   │   │   ├── Surat/
│   │   │   ├── Aduan/
│   │   │   ├── Laporan/
│   │   │   └── Pengaturan/
│   │   ├── Requests/          ← Form Request validasi (sub-folder per modul, sama seperti Controllers)
│   │   └── Middleware/        ← cek peran / akses
│   ├── Models/                ← Siswa, OrangTua, Absensi, Nilai, Pelanggaran, PoinLedger,
│   │                            Konseling, KonselingKelompok, Asesmen, HomeVisit, Surat,
│   │                            Aduan, AuditLog, dll.
│   ├── Policies/              ← otorisasi per model (akses BK, biodata keluarga, dll.)
│   ├── Services/              ← logika bisnis kompleks (sub-folder per modul)
│   │   ├── Pelanggaran/           (perhitungan poin, ambang, deteksi berulang)
│   │   ├── Surat/                 (pemicu & draft surat semi otomatis)
│   │   ├── Asesmen/               (skoring AKPD/DCM/ITP, rekomendasi)
│   │   ├── Notifikasi/            (WhatsApp & email)
│   │   └── Laporan/               (rekap & ekspor)
│   ├── Notifications/         ← notifikasi WhatsApp / email
│   └── Providers/
├── resources/
│   ├── views/
│   │   ├── layouts/           ← app, sidebar, topbar, cetak
│   │   ├── components/        ← kartu statistik, badge, tabel, modal, empty/error state
│   │   ├── auth/
│   │   ├── dashboard/         ← per peran: bk, wali-kelas, orang-tua, kepala-sekolah
│   │   ├── siswa/
│   │   ├── orang-tua/
│   │   ├── absensi/
│   │   ├── nilai/
│   │   ├── pelanggaran/
│   │   ├── konseling/
│   │   ├── asesmen/
│   │   ├── home-visit/
│   │   ├── surat/
│   │   ├── aduan/
│   │   ├── laporan/
│   │   └── pengaturan/
│   ├── css/
│   └── js/
├── routes/
│   └── web.php               (+ auth.php bila perlu)
├── database/
│   ├── migrations/
│   ├── seeders/              ← peran, master pelanggaran, ambang poin, instrumen asesmen
│   └── factories/
├── public/
│   └── assets/{css,js,img}
├── config/
└── storage/                 ← dokumen, bukti aduan, dll. (akses terlindungi)
```

---

## Aturan Coding (acuan)

- File lengkap dari baris pertama sampai terakhir; tulis path file sebelum kode.
- Validasi pakai **Form Request**.
- Otorisasi pakai **Policy / Gate**.
- Logika bisnis kompleks pakai **Service**.
- **Transaction** pada proses kritis (poin, surat, aduan).
- **Foreign key** & **index** pada relasi.
- **Soft delete** pada data penting.
- Tidak query langsung dari Blade.
- Tidak menyimpan API key di source code.
- Keamanan tidak bergantung pada menu yang disembunyikan — semua akses divalidasi di backend.
- Pesan validasi & antarmuka: Bahasa Indonesia.

---

## Catatan Privasi (acuan)

- Isi konseling hanya Guru BK berwenang.
- Biodata keluarga privat (tidak untuk wali kelas).
- Kepala sekolah hanya statistik agregat.
- Orang tua hanya anak yang terhubung.
- Identitas pelapor anonim tidak ditampilkan; bukti aduan hanya petugas berwenang.
- Notifikasi tidak memuat data sensitif.
- Aktivitas sensitif wajib masuk audit log.
