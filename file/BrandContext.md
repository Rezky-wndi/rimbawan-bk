# RIMBAWAN BK — Brand & Product Context

> Lampirkan file ini di awal chat baru agar Claude langsung paham proyek tanpa penjelasan ulang. Menggantikan kebutuhan melampirkan BrandContext.pdf + ProductContext.pdf sekaligus.

## Apa ini
Sistem Informasi Manajemen Bimbingan & Konseling untuk **SMK Kehutanan** (sekolah vokasi kehutanan, sistem asrama).
**Tagline:** "Membimbing, Memantau, dan Mengembangkan Karakter Rimbawan Muda."
**Prinsip inti:** BK = layanan **pendampingan & pengembangan karakter**, BUKAN sekadar alat pencatat pelanggaran.

## Nada & bahasa
- Non-judgmental: pakai "perlu pendampingan", hindari "siswa bermasalah".
- Bahasa UI: Indonesia.
- Fokus pada solusi dan perkembangan siswa, bukan menghakimi.

## Peran & hak akses (inti privasi)
- **Guru BK** — akses penuh layanan BK.
- **Wali Kelas** — hanya kelasnya; tidak bisa lihat isi konseling / biodata keluarga.
- **Pembina Asrama** — hanya asramanya.
- **Orang Tua** — hanya anak terhubung; tidak bisa lihat isi konseling.
- **Kepala Sekolah** — hanya data agregat; tanpa isi konseling / biodata keluarga rinci.

## Aturan privasi data
- Isi konseling = **Sangat Rahasia** (hanya Guru BK). Setiap buka isi → catat audit log.
- Biodata keluarga = privat (bukan untuk wali kelas/kepsek).
- Masking telepon/email/NIK; buka masking → audit log.
- Identitas pelapor aduan (anonim) dilindungi; bukti hanya untuk petugas berwenang.

## Design system
**Forest:** 950 `#082D20` · 900 `#0C3D2D` · 800 `#11533C` · 700 `#176C4A` · 600 `#1F8759` · 100 `#E7F5ED` · 50 `#F4FAF6`
**Gold:** `#D7AA4D` · Light `#F4DFAD`
**Sistem:** bg `#F2F6F3` · card `#FFFFFF` · text `#17231E` · text-2 `#66776F` · border `#DCE6E0` · danger `#C63C3C` · warning `#D58B20` · info `#2F75B5`
Font **Inter** · kartu radius 16–18px · sidebar ~280px.
**Hindari:** hijau neon, background gelap full-page, ornamen hutan berlebihan, font dekoratif, kesan game.

## Status (warna + teks/ikon — warna jangan jadi satu-satunya pembeda)
- Hijau = aman / selesai / hadir
- Kuning = perlu perhatian / menunggu / monitoring
- Merah = risiko tinggi / pelanggaran berat / tidak hadir
- Biru = diproses / info / terjadwal
- Abu = arsip / nonaktif

## Ambang poin (dapat dikonfigurasi)
0–25 Aman · 26–50 Perlu Perhatian · 51–100 Konseling BK · 101–150 Panggilan Orang Tua · 151–200 Home Visit · >200 Sidang Disiplin.

## Modul
Authentication · Roles/Permissions · Master Data · Data Siswa · Orang Tua/Wali · Absensi · Nilai · Pelanggaran/Poin · Konseling Individu · Konseling Kelompok · Asesmen · Home Visit · Surat Panggilan · Aduan · Dashboard · Laporan · Notifikasi (WA/Email) · Audit/Arsip.

## Stack target
Laravel + Blade + Bootstrap 5 + Vanilla JS + MySQL + Chart.js + Font Awesome.
