# Catatan bug Langit

Daftar bug yang pernah ditemukan dan diperbaiki. **Baca file ini sebelum mengerjakan setiap tahap**
(lihat `LANGIT_AZ900_PERBAIKAN_MATERI.md` bagian 9 dan `LANGIT_AZ104_PLAN.md` bagian 11), dan tambahkan
baris baru setiap kali menemukan dan memperbaiki bug.

Pengecekan cepat yang menjalankan hampir semua "cara mengecek" di bawah:

```bash
npm run lint && npx tsc -b      # kode
npm test                        # unit test, termasuk aturan konten
npm run validate:content        # aturan konten dan cakupan materi
npm run test:e2e                # Playwright di lebar HP, termasuk axe (aksesibilitas)
```

## 1. Dari commit perbaikan

Disusun dari riwayat git (pesan commit dan diff-nya).

| Bug | Penyebab | Perbaikan | Cara mencegah | Cara mengecek |
|---|---|---|---|---|
| Label meter di Statistik dan hasil ujian (nama domain panjang) terpotong jadi "..." di layar sempit (`d0d4dea`) | Label `Meter` memakai class `truncate` | Class `truncate` dihapus supaya label turun baris | Jangan pakai `truncate` untuk teks yang harus terbaca utuh (nama domain, unit, konsep) | Buka Statistik dan hasil ujian di lebar 320px: tidak ada label yang berakhir "..." |
| Hearts habis di lesson pertama, lalu tombol "Latihan untuk isi hearts" membuka layar kosong "Belum ada yang bisa dilatih" (`b946494`) | `practicePlan` hanya mengambil soal review yang sudah jatuh tempo dan soal dari lesson yang sudah selesai. Soal yang baru salah jatuh tempo besok, dan belum ada lesson yang selesai | Latihan juga mengambil soal yang pernah salah walau belum jatuh tempo, sebagai latihan biasa (jadwal 1/3/7 hari tidak bergeser) | Setiap tombol yang membuka layar lain harus dicoba dari progres kosong | Tes e2e "running out of hearts on the very first lesson can still be refilled in practice" dan `src/lesson/plans.test.ts` |
| Kartu match yang teksnya berisi singkatan (misalnya SMB, NFS) berantakan: kata menumpuk dan keluar dari kartu, dan di satu soal tombol Lanjut tertutup (`55b1652`) | `GlossaryText` mengembalikan potongan teks lepas. Di dalam tombol ber-`flex`, setiap potongan teks dan `<abbr>` jadi flex item sendiri | `GlossaryText` membungkus semuanya dalam satu `<span class="wrap-anywhere">`; kartu soal memakai `hyphens-auto` | Komponen yang merender teks campuran selalu mengembalikan satu elemen pembungkus. Uji kartu yang teksnya berisi singkatan di lebar 320px | Tes e2e "match cards with abbreviations keep their text inside the card" |
| Tombol back (gestur back Android) di tengah lesson langsung keluar tanpa bertanya, dan progres lesson hilang (`55b1652`) | Router memakai hash. Back mengubah hash, jadi layar lesson langsung dilepas tanpa cek ada progres atau tidak | `blockBack()` di `src/lib/router.ts` menahan perubahan hash dan membuka sheet "Yakin mau berhenti?". `navigate()` dan `leaveFlow()` melepas penahannya | Setiap alur layar penuh yang punya progres belum tersimpan memakai `blockBack()` | Tes e2e "the back button mid-lesson asks first, and pressing it again keeps playing" |
| Soal ujian yang tidak dijawab ikut masuk antrean latihan dan statistik konsep sebagai "salah", sampai 50 soal sekaligus kalau waktu habis (`55b1652`) | `submitExam` memanggil `recordAnswer` untuk semua soal, termasuk yang kosong | Hanya soal yang dijawab yang masuk statistik dan antrean. Di skor, soal kosong tetap dihitung salah | Bedakan "salah" dan "tidak dijawab" di setiap data statistik | Tes e2e mini ujian: setelah kumpul dengan 14 soal kosong, antrean review tetap kosong |
| Judul kartu konsep yang panjang ("Shared responsibility") keluar layar di lebar 320px (`55b1652`) | Judul adalah flex item yang tidak bisa menyusut di bawah panjang kata terpanjang. Terlihat saat font Fredoka belum selesai dimuat (font cadangan lebih lebar) | Judul memakai ukuran `clamp`, `min-w-0`, `hyphens-auto`, dan `wrap-break-word` | Teks di dalam flex diberi `min-w-0`. Pengukuran layout di tes menunggu `document.fonts.ready` | Tes e2e "long intro titles fit next to Awan" |
| axe menemukan pelanggaran aksesibilitas: `aria-label` di `div`/`span` tanpa role (streak, XP, hearts di header, hearts di lesson, XP di layar selesai, mahkota di path map), dan `svg` grafik ber-`role="img"` yang berisi elemen yang bisa disentuh (`8f13f0e`) | `aria-label` tidak diizinkan di elemen generik tanpa role (aturan aria-prohibited-attr). Elemen `role="img"` tidak boleh punya anak interaktif (aturan nested-interactive) | Elemen berlabel diberi `role="img"`. Grafik yang bisa disentuh memakai `role="group"` | Setiap `aria-label` dipasang di elemen dengan role yang mengizinkannya | `tests/e2e/a11y.spec.ts` (axe WCAG 2.1 AA di semua layar) |
| Di ujian, soal urutan (order) yang belum disentuh dihitung "sudah dijawab": ringkasan sebelum kumpul salah hitung, dan soal itu masuk statistik dan antrean latihan. Tes e2e mini ujian gagal kira-kira 1 dari 3 kali karenanya | Urutan awal soal order sudah berupa urutan lengkap, jadi `isComplete` selalu benar | `isAnswered` membandingkan jawaban dengan urutan yang ditampilkan (`optionOrder`); belum berubah berarti belum dijawab | Tipe soal yang jawaban awalnya sudah "lengkap" butuh cara sendiri untuk tahu sudah disentuh atau belum. Tes yang gagal kadang-kadang selalu diselidiki, jangan diulang saja | Unit test "counts an order question as answered only once the player moved something" dan tes e2e mini ujian dengan `--repeat-each=12` |
| Jawaban bisa ditebak dari pola: 76% soal benar/salah jawabannya "Benar", soal yes/no hampir selalu punya tepat satu "No", 21 soal pilihan punya pengecoh asal-asalan yang jauh lebih pendek dari jawaban benar, dan penjelasan diawali "Salah." tepat di bawah "Tepat sekali!" (`b45875a`) | Soal ditulis tanpa mengecek sebaran jawaban | 19 pernyataan benar/salah ditulis ulang (jadi 37/37), 23 pernyataan yes/no ditulis ulang (62/61, 7 pola), pengecoh diganti yang masuk akal, penjelasan diawali "Pernyataan ini benar/salah." | Cek sebaran jawaban setiap selesai menulis atau mengubah unit | Bagian "Sebaran jawaban" di `npm run content:coverage` |

## 2. Operasional

| Bug | Penyebab | Perbaikan | Cara mencegah | Cara mengecek |
|---|---|---|---|---|
| Workflow "Deploy to GitHub Pages" gagal di langkah deploy untuk commit `8f13f0e` sampai `b45875a` | GitHub Pages belum diaktifkan di repo | Pemilik repo mengaktifkan Settings > Pages > Source: GitHub Actions. Deploy berhasil sejak `83e2d06` | Langkah 1 di `PANDUAN.md` | Tab Actions: workflow Deploy hijau |

## 3. Ditemukan saat pengembangan, sebelum di-commit

Bug di bawah ini diperbaiki di dalam commit fitur, jadi tidak punya commit perbaikan sendiri. Sumbernya
catatan sesi pengembangan.

| Bug | Penyebab | Perbaikan | Cara mencegah | Cara mengecek |
|---|---|---|---|---|
| Diagram SharedResponsibility: label baris menimpa kotak | Teks label baris terlalu panjang untuk kolom labelnya | Label diperpendek (misalnya "Hardware fisik") | Setiap visual dicek dengan screenshot di lebar 390px dan 320px | Screenshot kartu konsep u01-l2 |
| Grafik batang di Statistik: label garis target bertumpuk dengan batang | Label ditaruh di area batang | Label dipindah ke sisi kiri | Sama seperti di atas | Screenshot tab Statistik dengan data 7 hari |
| Soal sort/place: baki kartu yang sudah kosong tetap tampil setelah jawaban dikunci | Baki tidak mengecek status terkunci | Baki disembunyikan saat terkunci | Cek tampilan setiap tipe soal sesudah Periksa | Screenshot soal sort setelah dijawab |
| Diagram DefenseLayers: label "Data" di tengah bertumpuk | Posisi vertikal label salah | Posisi label diperbaiki | Screenshot setiap visual | Screenshot kartu konsep defense in depth |
| Label checkpoint di path map terpotong turun baris | Teks label boleh turun baris di lingkaran yang sempit | `whitespace-nowrap` | Screenshot path map di 320px | Screenshot home |
| Konten melanggar aturan: singkatan tanpa kepanjangan, singkatan belum ada di glosarium, nama visual tidak dikenal, nama lama "Azure AD" | Konten ditulis sebelum dicek validator | Konten diperbaiki, 14 istilah ditambahkan ke glosarium, 4 visual dibuat | Validator konten dijalankan setiap selesai menulis unit | `npm run validate:content` |
| Tautan "Pelajari lagi" di panel feedback kontrasnya 4,42:1 di atas latar hijau muda (batas AA 4,5:1) | Warna Biru dalam (#1c6fd8) dipakai di atas `mint-muda` | Tautan di panel feedback memakai warna Tinta | Teks berwarna di atas latar berwarna selalu dicek kontrasnya | `tests/e2e/a11y.spec.ts` (layar feedback) |
| Label "Panduan unit" di header halaman Panduan kontrasnya 4,44:1 di atas latar Langit | Warna Biru dalam dipakai untuk teks kecil di atas `bg-langit` | Label memakai Tinta lembut; ikonnya tetap biru | Sama seperti baris di atas: Biru dalam hanya untuk teks di atas putih | `tests/e2e/a11y.spec.ts` ("panduan unit") |
| Sinkron: perangkat yang pernah di-reset lalu baru disambungkan bisa menghapus progres perangkat lain | Aturan reset "sisi dengan reset lebih baru diambil utuh" berlaku juga di penggabungan pertama | Penggabungan pertama setelah menyambung (`joining`) selalu menyimpan kedua sisi | Setiap aturan penggabungan diuji juga untuk perangkat yang baru menyambung | `src/sync/merge.test.ts` ("never wipes progress when a device first joins") |
| Sinkron: isi ulang hearts di hari baru bisa menimpa heart yang hilang hari itu di perangkat lain | Isi ulang harian ikut diberi cap waktu, jadi dianggap perubahan terbaru | Isi ulang harian tidak diberi cap waktu (`heartsAt` kosong) | Bedakan perubahan otomatis dan tindakan pemain di data yang disinkron | `src/sync/merge.test.ts` ("lets a heart lost today beat another device's refill") |

## 4. Lingkungan pengembangan

| Bug | Penyebab | Perbaikan | Cara mencegah | Cara mengecek |
|---|---|---|---|---|
| Vite dev server menjawab 504 "Outdated Optimize Dep" setelah memasang dependency baru | Cache pre-bundle Vite masih versi lama | Restart dev server | Restart dev server setiap selesai `npm install` | Halaman dev terbuka tanpa error 504 |
| Tes Playwright untuk tombol back menggantung sampai timeout | `page.goBack()` menunggu event load yang tidak pernah datang pada navigasi hash | Pakai `page.evaluate(() => history.back())` | Untuk navigasi hash di tes, pakai History API lewat `evaluate` | Tes back di `tests/e2e/lesson.spec.ts` selesai dalam hitungan detik |
| `pkill -f <pola>` ikut mematikan shell yang menjalankannya | Pola yang dicari juga ada di command line shell itu sendiri | Hentikan proses lewat ID tugas atau pola yang tidak ikut tertulis di perintah | Jangan menulis pola `pkill -f` di command line yang sama | - |
