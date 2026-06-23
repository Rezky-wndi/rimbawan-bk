# RIMBAWAN BK

Sistem Informasi Manajemen Bimbingan dan Konseling untuk SMK Kehutanan dan sekolah berasrama.

> *Membimbing, Memantau, dan Mengembangkan Karakter Rimbawan Muda.*

BK ditampilkan sebagai layanan pendampingan dan pengembangan siswa — bukan sekadar tempat
mencatat pelanggaran.

---

## Status Proyek

**Tahap saat ini:** Prototype interaktif & validasi alur (sebelum coding Laravel penuh).

Belum dilakukan: implementasi Laravel, migration final, database produksi, integrasi
WhatsApp/email produksi, dan deployment.

Prototype utama saat ini ada di `prototype/index.html`. Halaman tersebut sudah memuat
dashboard, data siswa, profil siswa, pelanggaran/poin, konseling, surat panggilan,
laporan CSV, dan simulasi audit akses data sensitif.

Link prototype online: `https://rimbawan-bk.vercel.app`

Catatan audit awal dan rekomendasi revisi ada di `docs/audit-revisi.md`.

---

## Struktur Folder

```
rimbawan-bk/
├── README.md              ← file ini
├── .gitignore
├── docs/                  ← dokumen acuan & rencana
│   ├── BrandContext.md        (taruh dokumen brand Anda di sini)
│   ├── ProductContext.md      (taruh dokumen produk Anda di sini)
│   └── struktur-laravel.md    (peta lengkap struktur Laravel saat coding)
└── prototype/             ← FASE SEKARANG: wireframe HTML
    ├── index.html             (hub: daftar semua halaman prototype)
    ├── pages/
    │   └── dashboard-guru-bk.html
    └── assets/                (css / js / img bersama untuk prototype)
        ├── css/
        ├── js/
        └── img/
```

Saat masuk tahap coding, project Laravel akan diinisialisasi pada folder ini juga
(`app/`, `resources/`, `routes/`, `database/`, dst). Lihat `docs/struktur-laravel.md`
untuk peta lengkapnya.

---

## Cara Membuka Prototype

Buka `prototype/index.html` di browser, atau jalankan sebagai web lokal:

```bash
npm run dev
```

Lalu buka `http://localhost:4173`.

---

## Rencana Teknologi

- **Backend:** Laravel
- **Frontend:** Blade
- **UI:** Bootstrap 5
- **JavaScript:** Vanilla JavaScript
- **Database:** MySQL
- **Grafik:** Chart.js
- **Ikon:** Satu library konsisten (mis. Font Awesome)
- **Version control:** Git

Versi PHP, Laravel, MySQL, dan library dicatat di `docs/struktur-laravel.md` saat setup.

---

## Urutan Pengembangan

1. Authentication
2. Roles & Permissions
3. Master Data
4. Data Siswa
5. Orang Tua / Wali
6. Absensi
7. Nilai Akademik
8. Pelanggaran & Poin
9. Konseling Individu
10. Konseling Kelompok
11. Asesmen BK
12. Home Visit
13. Surat Panggilan
14. Layanan Aduan
15. Dashboard
16. Laporan
17. WhatsApp & Email
18. Audit & Arsip
19. Testing
20. Deployment
