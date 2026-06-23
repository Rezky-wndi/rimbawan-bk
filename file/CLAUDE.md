# CLAUDE.md — RIMBAWAN BK

Konteks proyek untuk Claude Code. **Baca sebelum menulis kode.**

## Ringkasan
Aplikasi web manajemen Bimbingan & Konseling untuk SMK Kehutanan (sistem asrama). BK = layanan **pendampingan**, bukan alat hukuman. UI **Bahasa Indonesia**. Konteks merek/produk lengkap di `BrandContext.md`.

## Stack
- Backend: **Laravel** (PHP) + **Blade**
- Frontend: **Bootstrap 5** + **Vanilla JS** (tanpa SPA framework)
- DB: **MySQL** · Chart: **Chart.js** · Ikon: **Font Awesome**
- Dev lokal: **Laragon** (PHP + MySQL + Composer)

## Standar koding (WAJIB)
- Tulis **file lengkap**. Selalu cantumkan path file sebelum blok kode.
- Validasi input pakai **Form Request** (bukan validasi inline di controller).
- Otorisasi pakai **Policy/Gate** per aksi. **Backend wajib memvalidasi tiap akses** — jangan andalkan UI menyembunyikan tombol.
- Logika bisnis di **Service class**, bukan di controller/Blade.
- Operasi kritis (poin, surat, kasus) pakai **DB transaction**.
- Skema: **foreign key + index**. **Soft delete** untuk data penting.
- Blade **tanpa query** (no DB call di view) — data dikirim dari controller.
- **Tanpa API key/credential di source code** — pakai `.env`.
- Bahasa UI & pesan validasi: **Indonesia**.

## Privasi (tegakkan di server, bukan hanya di UI)
- Isi konseling: hanya Guru BK. Setiap buka isi → tulis ke `audit_log` (user, waktu, objek, aksi).
- Biodata keluarga: bukan untuk wali kelas/kepsek.
- Telepon/email/NIK: masking di tampilan; buka masking → audit log.
- Wali kelas: scoped ke kelasnya. Orang tua: scoped ke anaknya. Kepsek: agregat saja.
- Pelapor aduan anonim: identitas tidak ditampilkan ke petugas biasa; bukti hanya petugas berwenang.
- Tiap endpoint cek **peran + kepemilikan data** sebelum mengembalikan apa pun.

## Ambang poin (configurable — simpan di tabel setting, jangan hardcode)
0–25 Aman · 26–50 Perlu Perhatian · 51–100 Konseling BK · 101–150 Panggilan Ortu · 151–200 Home Visit · >200 Sidang Disiplin.
Poin masuk **setelah verifikasi**. Koreksi via **ledger + alasan** (jangan edit nilai poin langsung).

## Surat panggilan (semi otomatis)
Pemicu → buat draft → Guru BK tinjau (ubah/tunda/batal/setujui) → generate PDF → kirim WA/email.
**Tidak terkirim tanpa persetujuan Guru BK.**

## Urutan pengembangan
1. Authentication → 2. Roles/Permissions → 3. Master Data → 4. Data Siswa → 5. Orang Tua/Wali → 6. Absensi → 7. Nilai → 8. Pelanggaran/Poin → 9. Konseling Individu → 10. Konseling Kelompok → 11. Asesmen → 12. Home Visit → 13. Surat Panggilan → 14. Aduan → 15. Dashboard → 16. Laporan → 17. WA/Email → 18. Audit/Arsip → 19. Testing → 20. Deployment.

**Kerjakan satu modul sampai tuntas** (migrasi → model → policy → service → controller → Form Request → view) sebelum lanjut modul berikutnya.

## Design tokens (untuk Blade/CSS)
Forest 950 `#082D20` / 900 `#0C3D2D` / 800 `#11533C` / 700 `#176C4A` / 600 `#1F8759` · Forest 100 `#E7F5ED` / 50 `#F4FAF6` · Gold `#D7AA4D` / `#F4DFAD`.
Sistem: bg `#F2F6F3` · card `#fff` · text `#17231E` · text-2 `#66776F` · border `#DCE6E0` · danger `#C63C3C` · warning `#D58B20` · info `#2F75B5`.
Font Inter · radius kartu 16–18px · sidebar 280px.
Status = **warna + teks/ikon** (warna bukan satu-satunya penanda).

## Jangan
- Jangan taruh logika/query di Blade.
- Jangan skip Form Request atau Policy.
- Jangan hardcode rahasia atau ambang poin.
- Jangan kembalikan data lintas-peran tanpa cek kepemilikan.
- Jangan jadikan warna satu-satunya penanda status.
