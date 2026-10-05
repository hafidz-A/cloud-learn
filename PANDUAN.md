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

## 3. Sinkron HP dan PC

Tanpa sinkron, progres hanya ada di perangkat tempat kamu belajar. Dengan sinkron, progres disimpan juga di
server, jadi sama di HP dan PC, dan tidak hilang walaupun ikon Langit terhapus atau HP hilang.

**Di perangkat pertama** (misalnya iPhone):

1. Buka Pengaturan (ikon gerigi), cari kartu **Sinkron HP dan PC**, lalu ketuk **Buat kode sinkron**.
2. Muncul kode 16 huruf dan angka, misalnya `ABCD-EFGH-JKLM-NPQR`. Ketuk **Salin**, lalu simpan di tempat
   aman, misalnya di aplikasi Catatan atau screenshot. Kode ini adalah kunci progresmu.

**Di perangkat kedua** (misalnya PC):

1. Buka Pengaturan, lalu klik **Saya sudah punya kode**.
2. Ketik kodenya (huruf kecil dan tanpa tanda strip juga boleh), lalu klik **Sambungkan**.
3. Progres kedua perangkat digabung. Tidak ada yang hilang: lesson yang selesai di mana pun tetap dihitung
   selesai, dan nilai terbaiknya yang dipakai.

Setelah tersambung, sinkron berjalan sendiri: saat Langit dibuka, beberapa detik setelah kamu belajar, dan
saat internet kembali. Tanpa internet, Langit tetap jalan seperti biasa dan menyinkron nanti. Tombol
**Sinkronkan sekarang** memaksa sinkron saat itu juga.

Kalau ikon Langit terhapus atau ganti HP: pasang lagi, buka Pengaturan → **Saya sudah punya kode**, masukkan
kode yang kamu simpan, dan progresmu kembali.

Yang perlu diingat:

- Siapa pun yang tahu kodenya bisa melihat dan mengubah progresmu, jadi jangan dibagikan.
- **Reset progres** di satu perangkat ikut mereset semua perangkat yang tersambung.
- Ujian yang sedang berjalan ikut disinkron: ujian yang dimulai di HP bisa dilanjutkan di laptop dengan
  jawaban, tanda, dan sisa waktu yang sama. Sisa waktu terkirim setiap kali kamu menjawab, menandai, pindah
  soal, atau menutup app. Hanya satu ujian yang bisa berjalan, apa pun course-nya.
- Server sinkron memakai paket gratis Supabase. Kalau Langit tidak dibuka sama sekali selama sekitar
  seminggu, Supabase bisa menidurkan server-nya; status sinkron akan menampilkan pesan gagal. Progres di
  perangkat tetap aman. Buka project **langit** di <https://supabase.com/dashboard> lalu klik **Restore**
  untuk membangunkannya.

## 4. Pengaturan awal

Ketuk ikon **gerigi** di kanan atas:

- **Target harian**: dengan 1,5 jam per hari, pilih **100 XP (Serius)**. Satu lesson memberi 10–15 XP.
- **Hearts**: biarkan menyala supaya lebih fokus. Matikan kalau terasa menghambat.
- **Suara**: nyalakan atau matikan sesuai tempat belajar.

## 5. Rutinitas 1,5 jam per hari

| Waktu | Kegiatan | Di mana |
|---|---|---|
| 10 menit | Ulang soal yang pernah salah (muncul lagi setelah 1, 3, lalu 7 hari) | Tab **Latihan** |
| 60 menit | 6–10 lesson baru, ikuti lingkaran yang memantul | Tab **Home** |
| 20 menit | Mini ujian per domain (15 soal, 15 menit), lalu baca pembahasannya | Tab **Ujian** |

Rencana kasar sampai siap ujian:

1. **Minggu 1**: selesaikan jalur 1–3 (48 lesson) dan tiga checkpoint.
2. **Minggu 2**: satu **Simulasi penuh** (50 soal, 45 menit) per hari, diselingi **Ujian titik lemah**.
3. Daftar ujian AZ-900 setelah indikator **Siap ujian** menyala, yaitu rata-rata 3 simulasi penuh terakhir minimal 800.

Untuk AZ-104, halaman Ujian memakai soal dan riwayat AZ-104 saja (pilih course AZ-104 di home): mini ujian
per domain 15 soal dalam 30 menit, ujian titik lemah 20 soal dalam 40 menit, dan simulasi penuh 50 soal
dalam 100 menit yang ditutup satu studi kasus. Indikator **Siap ujian** memakai aturan yang sama.

Untuk CCNA (pilih course CCNA di home):

1. **Cek versi ujian dulu.** Materi Langit mengikuti CCNA 200-301 **v2.0**, yang berlaku mulai 3 Februari 2027.
   Ujian sebelum tanggal itu masih v1.1.
2. **Ikuti batang pohon dari bawah ke atas.** Cabang **prasyarat** wajib, tapi bisa dilewati dengan **tes lompat**
   (minimal 80% benar). Cabang **hands-on** dan **pendukung** opsional, tapi hands-on sangat disarankan: soal
   simulator CLI mirip soal simulasi di ujian.
3. **Kerjakan lab** di cabang hands-on dengan Cisco Packet Tracer (gratis lewat Cisco Networking Academy),
   lalu cocokkan hasilmu dengan bagian **Cara membuktikan** di kartu lab.
4. Halaman Ujian CCNA: mini ujian per domain 25 soal dalam 30 menit, ujian titik lemah 30 soal dalam 36 menit, dan
   simulasi penuh 100 soal dalam 120 menit. Cisco tidak memublikasikan nilai lulus, jadi hasilnya tanpa label lulus.
   Indikator **Siap ujian** menyala kalau rata-rata 3 simulasi penuh terakhir minimal **850**.

## 6. Cara kerja fiturnya

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
  tertutup di tengah ujian, jawaban dan sisa waktu tersimpan. Soal yang dijawab salah otomatis masuk antrean
  Latihan; soal yang tidak dijawab tidak.
- **Studi kasus (simulasi penuh AZ-104)**: bagian terakhir ujian. Skenarionya dibaca lewat tab **Skenario**
  (Overview, Existing environment, Requirements), soalnya lewat tab **Soal**. Seperti ujian asli, setelah
  kamu lanjut ke studi kasus, soal di bagian sebelumnya terkunci, jadi periksa dulu soal yang ditandai.
  Soal studi kasus yang salah juga masuk Latihan, lengkap dengan skenarionya.
- **Placement test AZ-104 (opsional)**: 30 soal, 2 dari setiap unit, ditawarkan di home sebelum lesson AZ-104
  pertama. Unit yang skornya minimal 80% boleh ditandai selesai. Jawabannya tidak masuk statistik maupun Latihan.
- **Coba di Azure dan misi unit (AZ-104)**: setiap lesson AZ-104 punya satu tips praktik di layar selesai lesson
  dan di Panduan unit. Di akhir Panduan unit ada misi 20–40 menit yang menggabungkan semua lesson unit itu.
  Label **Hati-hati biaya** menandai yang bisa memakan biaya (Bastion selain SKU Developer, Standard Load
  Balancer, Site Recovery, tier App Service berbayar, lisensi Microsoft Entra ID P1/P2). Buat resource misi di
  satu resource group dan hapus setelah selesai.
- **Pohon lesson CCNA**: lesson utama ada di batang. Cabang yang tumbuh dari sebuah lesson berarti
  **prasyarat** (wajib, bisa dilewati dengan tes lompat), **hands-on** (opsional, simulator CLI lalu lab), atau
  **pendukung** (opsional, materi tambahan). Cabang bisa bercabang lagi, misalnya lab kedua yang tumbuh dari lab pertama.
- **Soal simulator CLI (CCNA)**: ketik perintah IOS seperti di terminal router atau switch. Seperti IOS asli, setiap kata boleh
  disingkat selama unik, misalnya `hostn R2`, `ip add`, `no shut`, atau `switchp mo acc`; kalau singkatannya cocok
  dengan lebih dari satu perintah, muncul `% Ambiguous command`. Panah atas/bawah memanggil perintah sebelumnya. Bantuan `?` dan Tab
  tidak ada. Pesan yang diawali **Langit:** berasal dari simulator, bukan dari IOS asli, misalnya untuk output yang
  tidak disimulasikan. Yang dinilai adalah hasil konfigurasinya, jadi urutan atau cara mengetik boleh berbeda.
- **Lab (CCNA)**: setiap cabang hands-on punya kartu lab berisi topologi, tabel alamat, langkah, perintah, cara
  membuktikan, dan sumber resmi. Label kuning **Belum dicoba langsung** berarti langkahnya baru dicek ke dokumentasi
  Cisco dan simulator Langit, belum dicoba di Packet Tracer. Kalau hasilmu berbeda, catat supaya bisa diperbaiki.
- **Statistik**: XP 7 hari terakhir, penguasaan per unit, dan per konsep (yang paling lemah di atas).
- **Keyboard di PC**: **Enter** untuk Lanjut dan Periksa, angka **1–4** untuk memilih jawaban,
  panah **→** (Benar) dan **←** (Salah) di kartu benar/salah, **Esc** untuk menutup panel di lesson. Di Ujian, panah
  **→** dan **←** pindah ke soal berikutnya dan sebelumnya. Kartu bisa diseret dengan mouse, dan
  kepanjangan singkatan muncul saat kursor diarahkan ke singkatan itu.

## 7. Hal yang perlu diingat

- **Tanpa sinkron, progres tersimpan di perangkat dan browser itu saja.** Menghapus data browser, menghapus
  ikon Langit (uninstall), atau pindah HP akan memulai dari nol. Nyalakan sinkron (bagian 3) supaya progres
  aman dan sama di semua perangkat.
- Skor di halaman Ujian adalah perkiraan. Microsoft memakai skala skor sendiri, dan Cisco tidak memublikasikan
  nilai lulus CCNA.
- Soal ditulis mengikuti materi AZ-900 dan AZ-104 terbaru, dicek ke dokumentasi Microsoft Learn. Fakta CCNA dicek ke
  dokumentasi Cisco, RFC, dan Ansible; yang belum bisa dicocokkan kalimat per kalimat didaftar di
  `docs/VERIFIKASI_MATERI.md`. Kalau menemukan soal yang janggal, catat ID-nya (terlihat
  di pembahasan) supaya bisa diperbaiki.

## 8. Untuk developer (opsional)

```bash
npm install
npm run dev              # http://localhost:5173
npm run check:content    # cek aturan konten setelah mengubah soal
npm test                 # unit test
npm run test:e2e         # tes Playwright di lebar HP
```

Soal ada di `src/content/units/*.json`, satu file per unit. Singkatan baru ditambahkan ke
`src/content/glossary.json`.
