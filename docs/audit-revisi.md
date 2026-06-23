# Audit Awal dan Rekomendasi Revisi - RIMBAWAN BK

Tanggal audit: 23 Juni 2026

## Ringkasan

Project sudah punya arah produk yang kuat: BK diposisikan sebagai layanan pendampingan, bukan alat hukuman. Konteks brand, modul, privasi, dan urutan pengembangan juga sudah jelas.

Per 23 Juni 2026, folder ini belum berisi aplikasi Laravel. Isi utama masih dokumentasi, file zip arsip, dan prototype HTML. Karena PHP dan Composer belum tersedia di environment kerja ini, tahap yang paling aman saat ini adalah memperkuat prototype interaktif sebelum inisialisasi Laravel penuh.

## Temuan Audit

1. Belum ada repository Git aktif di folder `D:\rimbawan-bk`.
   Dampak: perubahan sulit dilacak dan sulit dibuat rollback.

2. Laravel belum diinisialisasi.
   Dampak: belum ada route, migration, model, policy, Form Request, service, testing, atau database.

3. Prototype lama masih berupa halaman statis terpisah.
   Dampak: validasi alur belum cukup mewakili penggunaan aplikasi harian Guru BK.

4. Ada duplikasi file di `files/` dan `prototype/pages/`.
   Dampak: rawan beda versi ketika desain berubah.

5. Aset CSS/JS bersama belum digunakan.
   Dampak: styling dan perilaku akan cepat sulit dirawat jika halaman bertambah.

6. Aturan privasi sudah tertulis, tetapi belum bisa diuji sebagai perilaku aplikasi.
   Dampak: risiko besar saat masuk implementasi backend jika audit log, masking, dan scope role tidak dirancang sejak awal.

7. File zip masih berada di root/folder kerja.
   Dampak: struktur proyek terasa bercampur antara source aktif dan arsip.

## Revisi yang Sudah Dilakukan

1. Mengubah `prototype/index.html` dari hub link menjadi prototype aplikasi interaktif.
2. Menambahkan `prototype/assets/css/app.css` sebagai design system awal.
3. Menambahkan `prototype/assets/js/app.js` untuk data dummy, routing, pencarian, filter, profil siswa, ledger poin, konseling, surat, laporan CSV, dan audit akses.
4. Menambahkan simulasi masking data sensitif dan pencatatan audit saat data dibuka.
5. Menambahkan simulasi pencatatan konseling yang tersimpan di `localStorage`.

## Saran Revisi Berikutnya

1. Inisialisasi Git sebelum perubahan makin banyak.
2. Pindahkan file zip ke folder arsip, misalnya `archives/`, setelah dipastikan tidak diperlukan sebagai source aktif.
3. Jadikan `prototype/index.html` sebagai prototype utama, lalu arsipkan prototype lama yang duplikatif.
4. Saat PHP dan Composer tersedia, mulai Laravel dari modul inti:
   - Authentication
   - Roles dan permissions
   - Master data siswa, kelas, asrama
   - Audit log
   - Data siswa dan orang tua/wali
5. Implementasi backend harus dimulai dari privasi:
   - policy per role
   - masking field sensitif
   - audit log untuk buka data sensitif
   - scope akses wali kelas, pembina asrama, orang tua, dan kepala sekolah
6. Buat migration awal untuk `students`, `guardians`, `dormitories`, `classes`, `violations`, `point_ledgers`, `counseling_sessions`, `letters`, dan `audit_logs`.
7. Ambang poin sebaiknya masuk tabel setting, bukan hardcode.

## Prioritas Build

Prioritas paling berguna setelah prototype ini:

1. Setup Laravel dan Git.
2. Authentication dan role.
3. Audit log sebagai pondasi privasi.
4. Data siswa 360 dengan masking.
5. Ledger pelanggaran dan poin.
6. Konseling dengan akses terbatas Guru BK.
7. Surat panggilan semi otomatis.

## Catatan Produk

Bahasa UI harus tetap non-judgmental. Gunakan istilah seperti "prioritas pendampingan", "perlu perhatian", "tindak lanjut", dan "monitoring". Hindari istilah yang membuat siswa terlihat sebagai objek hukuman.
