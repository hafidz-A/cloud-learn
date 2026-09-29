# Panduan memakai Langit

Langit adalah web app, jadi tidak perlu diunduh dari Play Store atau App Store. Setelah dipasang di layar
utama HP, Langit terbuka seperti aplikasi biasa dan tetap bisa dipakai tanpa internet.

## 1. Online-kan sekali saja (5 menit, di laptop atau HP)

1. Buka <https://github.com/hafidz-A/cloud-learn/settings/pages>.
2. Di bagian **Build and deployment**, ubah **Source** menjadi **GitHub Actions**. Tidak perlu klik Save;
   pilihannya langsung tersimpan.
3. Buka tab **Actions**: <https://github.com/hafidz-A/cloud-learn/actions>.
4. Pilih workflow **Deploy to GitHub Pages**, klik **Run workflow**, pilih branch `az900`, lalu **Run workflow**.
5. Tunggu sekitar 2 menit sampai tanda centang hijau muncul.
6. Langit sekarang ada di **<https://hafidz-a.github.io/cloud-learn/>**.

Setelah ini, setiap perubahan yang di-push ke branch `az900` otomatis ter-deploy ulang.

## 2. Pasang di HP dan PC

**iPhone (Safari)**

1. Buka <https://hafidz-a.github.io/cloud-learn/> di **Safari**.
2. Ketuk tombol **Bagikan** (kotak dengan panah ke atas). Di iOS 26, tombol ini ada di dalam menu **•••**
   di bilah bawah; di iOS 18 ke bawah, tombolnya ada langsung di bilah bawah.
3. Gulir daftar pilihannya, lalu ketuk **Tambahkan ke Layar Utama**. Kalau ada pilihan
   **Buka sebagai App Web**, biarkan menyala. Ketuk **Tambah**.
4. Mulai sekarang, selalu buka Langit dari **ikon di layar utama**. Di iPhone, data di ikon layar utama
   terpisah dari data di tab Safari, jadi progres di tab Safari tidak ikut pindah ke ikon.

**Android (Chrome)**

1. Buka <https://hafidz-a.github.io/cloud-learn/> di Chrome.
2. Ketuk menu **⋮** di kanan atas, lalu **Instal aplikasi** atau **Tambahkan ke layar utama**.

**PC Windows (Chrome atau Edge)**

1. Buka <https://hafidz-a.github.io/cloud-learn/> di Chrome atau Microsoft Edge.
2. Klik ikon **Instal** di ujung kanan kolom alamat (gambar monitor dengan panah ke bawah), lalu **Instal**.
   Kalau ikonnya tidak ada:
   - Chrome: menu **⋮** → **Cast, save, and share** → **Install page as app**.
   - Edge: menu **…** → **Apps** → **Install this site as an app**.
3. Langit terbuka di jendela sendiri dan muncul di menu Start. Klik kanan ikonnya di taskbar, lalu
   **Pin to taskbar** supaya gampang dibuka.
4. Langit dirancang selebar layar HP, jadi di PC tampil sebagai kolom di tengah. Jendelanya boleh
   dipersempit.

Nama menu bisa sedikit berbeda tergantung versi dan bahasa browser. Buka Langit sekali saat online;
setelah itu Langit tetap jalan walaupun internet mati. Versi baru terpasang otomatis saat Langit dibuka
dalam keadaan online.

## 3. Pengaturan awal

Ketuk ikon **gerigi** di kanan atas:

- **Target harian**: dengan 1,5 jam per hari, pilih **100 XP (Serius)**. Satu lesson memberi 10–15 XP.
- **Hearts**: biarkan menyala supaya lebih fokus. Matikan kalau terasa menghambat.
- **Suara**: nyalakan atau matikan sesuai tempat belajar.

## 4. Rutinitas 1,5 jam per hari

| Waktu | Kegiatan | Di mana |
|---|---|---|
| 10 menit | Ulang soal yang pernah salah (muncul lagi setelah 1, 3, lalu 7 hari) | Tab **Latihan** |
| 60 menit | 6–10 lesson baru, ikuti lingkaran yang memantul | Tab **Home** |
| 20 menit | Mini ujian per domain (15 soal, 15 menit), lalu baca pembahasannya | Tab **Ujian** |

Rencana kasar sampai siap ujian:

1. **Minggu 1**: selesaikan jalur 1–3 (48 lesson) dan tiga checkpoint.
2. **Minggu 2**: satu **Simulasi penuh** (50 soal, 45 menit) per hari, diselingi **Ujian titik lemah**.
3. Daftar ujian AZ-900 setelah indikator **Siap ujian** menyala, yaitu rata-rata 3 simulasi penuh terakhir minimal 800.

## 5. Cara kerja fiturnya

- **Lesson**: kartu **Konsep baru** memperkenalkan konsep, lalu soal naik dari mudah ke sulit. Soal yang
  salah muncul lagi di akhir lesson, dan lesson baru selesai setelah semua soal pernah dijawab benar.
- **Hearts**: 5 nyawa, berkurang 1 setiap jawaban salah di lesson. Kalau habis, lesson berhenti dan
  progres lesson itu tidak disimpan, tapi soal yang salah tetap tercatat untuk diulang. Cara mengisi lagi:
  **Latihan** (setiap jawaban benar di percobaan pertama mengisi 1 heart, maksimal 5), tunggu besok saat
  hearts terisi penuh, atau matikan hearts di **Pengaturan**. Checkpoint dan Ujian tidak memakai hearts.
- **Streak**: bertambah setiap hari kamu menyelesaikan minimal satu lesson atau latihan.
- **Level unit (mahkota 0/3)**: naik setiap kali semua lesson di unit itu diulang.
- **Checkpoint**: 20 soal campuran di akhir jalur, lulus kalau skornya minimal 80%. Checkpoint bisa dicoba
  lebih awal untuk melompat ke jalur berikutnya.
- **Glosarium**: di dalam soal, **tahan tap** pada singkatan yang bergaris titik, misalnya NSG, untuk
  melihat kepanjangannya. Daftar lengkap ada di tab **Glosarium**.
- **Lihat konsep**: saat latihan, tombol ini membuka lagi kartu konsep dari soal tersebut.
- **Ujian**: tiga mode, timer, grid nomor soal, dan tanda bendera untuk soal yang mau ditinjau. Kalau app
  tertutup di tengah ujian, jawaban dan sisa waktu tersimpan. Soal yang salah otomatis masuk antrean Latihan.
- **Statistik**: XP 7 hari terakhir, penguasaan per unit, dan per konsep (yang paling lemah di atas).
- **Keyboard di PC**: **Enter** untuk Lanjut dan Periksa, angka **1–4** untuk memilih jawaban,
  panah **→** (Benar) dan **←** (Salah) di kartu benar/salah, **Esc** untuk menutup panel di lesson. Di Ujian, panah
  **→** dan **←** pindah ke soal berikutnya dan sebelumnya. Kartu bisa diseret dengan mouse, dan
  kepanjangan singkatan muncul saat kursor diarahkan ke singkatan itu.

## 6. Hal yang perlu diingat

- **Progres tersimpan di perangkat dan browser itu saja.** Progres di iPhone dan di PC tidak tersambung,
  jadi sebaiknya pilih satu perangkat utama. Menghapus data browser, menghapus ikon Langit (uninstall),
  atau pindah HP akan memulai dari nol. Sinkron antar-perangkat (tahap 8, Supabase) belum dibuat.
- Skor di halaman Ujian adalah perkiraan. Microsoft memakai skala skor sendiri.
- Soal ditulis mengikuti materi AZ-900 terbaru. Kalau menemukan soal yang janggal, catat ID-nya (terlihat
  di pembahasan) supaya bisa diperbaiki.

## 7. Untuk developer (opsional)

```bash
npm install
npm run dev              # http://localhost:5173
npm run check:content    # cek aturan konten setelah mengubah soal
npm test                 # unit test
npm run test:e2e         # tes Playwright di lebar HP
```

Soal ada di `src/content/units/*.json`, satu file per unit. Singkatan baru ditambahkan ke
`src/content/glossary.json`.
