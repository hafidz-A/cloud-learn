# Langit: perbaikan materi course AZ-900

File ini adalah rencana perbaikan untuk course AZ-900 yang sudah berjalan. Taruh di root project bersama `LANGIT_AZ900_PLAN.md`, lalu kerjakan dengan prompt di bagian 10.

---

## 1. Masalahnya

Dari pemakaian course AZ-900 sejauh ini:

- Materi di setiap lesson hanya sedikit (kartu intro 1–2 kalimat), sedangkan soalnya jauh lebih banyak.
- Banyak soal menguji fakta yang **tidak pernah diajarkan** di game. Kalau belum membaca Microsoft Learn sendiri, pemain hanya bisa menebak, lalu baru tahu jawabannya dari penjelasan setelah salah.
- Pilihan jawaban pengecoh sering berisi istilah yang belum pernah diperkenalkan, jadi pemain tidak bisa menyingkirkannya dengan nalar.
- Hampir tidak ada visual, padahal banyak konsep Azure soal posisi dan struktur (zone di dalam region, hierarki resource, lapisan tanggung jawab).

Akibatnya game terasa seperti kuis tebak-tebakan, bukan tempat belajar.

---

## 2. Prinsip baru: tidak ada soal tanpa materi

**Setiap fakta yang dibutuhkan untuk menjawab sebuah soal harus sudah diajarkan di kartu materi sebelum soal itu muncul**, di lesson yang sama atau di lesson sebelumnya dalam course yang sama.

"Dibutuhkan untuk menjawab" termasuk fakta untuk **menyingkirkan pilihan yang salah**. Kalau sebuah soal menawarkan ZRS sebagai pengecoh, ZRS harus sudah diajarkan.

Penjelasan setelah menjawab tetap ada, tapi fungsinya mengingatkan dan meluruskan, bukan tempat pertama kali pemain bertemu fakta tersebut.

Prinsip ini dicek otomatis oleh validator (bagian 4), bukan hanya diandalkan pada kehati-hatian saat menulis.

---

## 3. Kartu materi (`learn`)

Kartu `learn` menggantikan kartu `intro` sebagai tempat mengajar. Kartu `intro` yang sudah ada boleh tetap dipakai, tapi semua materi baru ditulis sebagai `learn`.

### Isi kartu

| Bagian | Aturan |
|---|---|
| Judul | Nama konsep, singkat |
| Isi | 3–6 kalimat pendek, maksimal sekitar 100 kata. Satu kartu, satu ide |
| Poin kunci | 2–4 poin yang wajib diingat |
| Contoh | Opsional. Satu situasi nyata yang singkat |
| Visual | **Wajib** kalau konsepnya soal posisi, struktur, alur, atau perbandingan. Opsional untuk definisi murni |
| Jebakan ujian | Opsional. Satu kalimat tentang hal yang sering tertukar |
| Tautan | Opsional. Link ke unit Microsoft Learn terkait, sebagai bacaan lanjutan |

### Gaya bahasa

Sama seperti aturan konten di `LANGIT_AZ900_PLAN.md`:
- Bahasa Indonesia yang santai dan to the point, istilah teknis tetap bahasa Inggris.
- Setiap singkatan ditulis kepanjangannya dalam kurung saat pertama muncul di setiap kartu.
- Kalimat pendek. Jelaskan "kenapa", bukan hanya "apa".

### Tampilan

- Kartu besar dengan visual di atas dan teks di bawah. Bisa digeser kalau lebih panjang dari layar.
- Tombol "Paham, lanjut" di bawah. Tidak ada XP dan tidak memengaruhi hearts.
- Kartu materi bisa dibuka lagi kapan saja (bagian 7).

### Model data

```ts
type Fact = {
  id: string;            // "f-u07-zrs"
  statement: string;     // satu kalimat fakta, bahasa Indonesia
  source: string;        // URL halaman Microsoft Learn yang jadi dasar fakta ini
  verify?: boolean;      // true kalau belum dicek ke sumber
};

type LearnCard = {
  id: string;            // "u07-l2-m1"
  type: "learn";
  concepts: string[];    // concept tag, sama dengan yang dipakai soal
  title: string;
  body: string;
  keyPoints: string[];
  example?: string;
  visual?: string;       // nama komponen visual di katalog (bagian 5)
  trap?: string;
  link?: string;
  teaches: string[];     // daftar Fact.id yang diajarkan kartu ini
};

// Tambahan di setiap Exercise
requires: string[];      // daftar Fact.id yang dibutuhkan untuk menjawab DAN menyingkirkan pengecoh

// Tambahan di setiap Unit
facts: Fact[];

// LessonItem sekarang
type LessonItem = LearnCard | IntroCard | Exercise;
```

### Contoh kartu dan soal

```json
{
  "facts": [
    { "id": "f-u07-lrs", "statement": "LRS (Locally Redundant Storage) menyimpan 3 salinan data di satu datacenter di region utama.", "source": "https://learn.microsoft.com/azure/storage/common/storage-redundancy" },
    { "id": "f-u07-zrs", "statement": "ZRS (Zone-Redundant Storage) menyalin data secara sinkron ke 3 availability zone di region utama.", "source": "https://learn.microsoft.com/azure/storage/common/storage-redundancy" },
    { "id": "f-u07-grs", "statement": "GRS (Geo-Redundant Storage) memakai LRS di region utama, lalu menyalin data ke region sekunder.", "source": "https://learn.microsoft.com/azure/storage/common/storage-redundancy" },
    { "id": "f-u07-gzrs", "statement": "GZRS (Geo-Zone-Redundant Storage) memakai ZRS di region utama, lalu menyalin data ke region sekunder.", "source": "https://learn.microsoft.com/azure/storage/common/storage-redundancy" }
  ],
  "items": [
    {
      "id": "u07-l2-m1",
      "type": "learn",
      "concepts": ["storage-redundancy"],
      "title": "Empat cara Azure menyimpan salinan datamu",
      "body": "Azure selalu menyimpan beberapa salinan datamu. Yang membedakan adalah seberapa jauh salinan itu disebar. Makin jauh disebar, makin besar kerusakan yang bisa kamu tahan, tapi biayanya juga makin mahal.",
      "keyPoints": [
        "LRS (Locally Redundant Storage): 3 salinan di satu datacenter",
        "ZRS (Zone-Redundant Storage): disebar ke 3 availability zone di region yang sama",
        "GRS (Geo-Redundant Storage): LRS di region utama + salinan di region lain",
        "GZRS (Geo-Zone-Redundant Storage): ZRS di region utama + salinan di region lain"
      ],
      "visual": "StorageRedundancy",
      "trap": "GRS tahan kalau satu region mati, tapi salinan di region utamanya tetap numpuk di satu datacenter. Kalau butuh tahan zone mati DAN region mati, jawabannya GZRS.",
      "link": "https://learn.microsoft.com/azure/storage/common/storage-redundancy",
      "teaches": ["f-u07-lrs", "f-u07-zrs", "f-u07-grs", "f-u07-gzrs"]
    },
    {
      "id": "u07-l2-e1",
      "type": "choice",
      "concept": "storage-redundancy",
      "prompt": "Your data must survive both a single zone failure and a full region outage. Which redundancy option should you choose?",
      "options": ["LRS (Locally Redundant Storage)", "ZRS (Zone-Redundant Storage)", "GRS (Geo-Redundant Storage)", "GZRS (Geo-Zone-Redundant Storage)"],
      "answer": 3,
      "requires": ["f-u07-lrs", "f-u07-zrs", "f-u07-grs", "f-u07-gzrs"],
      "explanation": "GZRS menyebar data ke 3 zone di region utama dan juga menyalinnya ke region lain. ZRS tidak tahan region mati, sedangkan GRS tidak tahan zone mati karena salinan di region utamanya ada di satu datacenter."
    }
  ]
}
```

---

## 4. Validator cakupan materi

Tambahkan pengecekan ini ke `npm run validate:content`:

| Cek | Hasil kalau gagal |
|---|---|
| Setiap exercise punya `requires` yang tidak kosong | Error |
| Setiap id di `requires` ada di daftar `facts` unit mana pun di course yang sama | Error |
| Setiap fakta di `requires` sudah diajarkan (`teaches`) oleh kartu `learn` yang muncul **lebih dulu**: di lesson yang sama sebelum soal itu, atau di lesson/unit sebelumnya | Error |
| Setiap fakta di `facts` diajarkan oleh minimal satu kartu `learn` | Error |
| Setiap fakta punya `source` berupa URL Microsoft Learn | Error, kecuali `verify: true` |
| Kartu `learn` untuk concept tag yang ditandai butuh visual tidak punya `visual` | Error |
| Kartu `learn` lebih dari 100 kata di `body` | Peringatan |
| Lesson punya lebih dari 4 soal berturut-turut tanpa kartu `learn` di antaranya, padahal ada fakta baru | Peringatan |

Tambahkan juga `npm run content:coverage` yang mencetak laporan per unit:
- Jumlah fakta, kartu materi, dan soal
- Soal yang `requires`-nya kosong atau belum terpenuhi
- Fakta yang belum diajarkan
- Fakta bertanda `verify`

Urutan "lebih dulu" dihitung dari urutan unit, urutan lesson, lalu urutan item di dalam lesson. Untuk halaman Ujian, aturannya lebih longgar: fakta cukup pernah diajarkan di mana pun di course.

---

## 5. Visual

### Aturan

- Dibuat sebagai komponen React berbasis SVG (Scalable Vector Graphics) di `src/visuals/`, satu komponen satu konsep.
- Memakai token warna dan font dari arah desain Langit. Tidak ada warna di luar palet.
- Terbaca jelas di lebar 390px. Teks di dalam visual minimal 12px.
- Setiap bentuk yang punya arti diberi label. Warna tidak boleh jadi satu-satunya pembeda: tambahkan label, pola garis, atau ikon.
- Punya teks alternatif (`aria-label`) yang menjelaskan isi visual dalam satu kalimat.
- Tanpa animasi, atau animasi langkah demi langkah yang dijalankan pemain dengan tombol. Hormati `prefers-reduced-motion`.
- Visual yang sama boleh dipakai ulang di penjelasan soal dan di halaman pembahasan ujian.

### Katalog visual AZ-900

| Unit | Komponen | Isi |
|---|---|---|
| 1 | `SharedResponsibility` | Lapisan tanggung jawab (data sampai datacenter fisik) untuk on-premises, IaaS, PaaS, SaaS, termasuk sel bersama seperti di diagram resmi |
| 1 | `CloudModels` | Public, private, hybrid, multi-cloud |
| 1 | `CapexVsOpex` | Beli di depan vs bayar sesuai pemakaian |
| 2 | `ScaleUpVsOut` | Satu mesin makin besar vs mesin makin banyak |
| 2 | `AvailabilityVsReliability` | Tetap hidup sekarang vs pulih dari bencana |
| 3 | `ServiceModelsStack` | Siapa mengelola apa di on-premises, IaaS, PaaS, SaaS, dengan delapan lapisan modul AZ-900 resmi (aplikasi sampai jaringan) dan contoh layanan. Serverless ditulis sebagai bagian PaaS, bukan kolom sendiri (koreksi 8 Oktober 2026, lihat `docs/BUGS_LOG.md`) |
| 4 | `ZonesInRegion` | 3 availability zone di dalam satu region |
| 4 | `RegionPair` | Dua region berpasangan di satu geografi |
| 4 | `ResourceHierarchy` | Management group, subscription, resource group, resource |
| 5 | `ComputeOptions` | VM, scale set, container, Functions, App Service pada spektrum kontrol vs kemudahan |
| 6 | `HybridConnectivity` | VPN (lewat internet) vs ExpressRoute (jalur privat) menuju VNet |
| 6 | `VNetPeering` | Dua VNet tersambung |
| 7 | `StorageRedundancy` | Letak salinan LRS, ZRS, GRS, GZRS |
| 7 | `BlobTiers` | Hot, Cool, Cold, Archive: biaya simpan vs biaya akses |
| 7 | `StorageServices` | Blob, Files, Queues, Tables, Disks dan siapa yang mengaksesnya |
| 8 | `AuthNvsAuthZ` | Membuktikan identitas vs menentukan izin |
| 8 | `ConditionalAccessFlow` | Sinyal, keputusan, penegakan |
| 8 | `DefenseInDepth` | 7 lapisan keamanan di sekitar data |
| 8 | `RbacScope` | Role di scope atas turun ke bawah |
| 9 | `PricingVsTco` | Pricing Calculator vs TCO (Total Cost of Ownership) Calculator |
| 10 | `PolicyRbacLock` | Policy (apa boleh dibuat), RBAC (siapa boleh), lock (cegah hapus/ubah) |
| 11 | `ManagementTools` | Portal, Cloud Shell, CLI, PowerShell, ARM, Bicep lewat mesin yang sama |
| 12 | `ServiceHealthScopes` | Azure status, Service Health, Resource Health |
| 12 | `MonitorPipeline` | Sumber data, metrik dan log, lalu alert dan insight |

Concept tag yang terkait komponen di tabel ini dianggap "butuh visual" oleh validator.

---

## 6. Susunan lesson yang baru

Aturan urutan naik tingkat (bagian 11.2 di rencana AZ-900) tetap berlaku, dengan perubahan di tahap 1:

| Tahap | Isi |
|---|---|
| 1. Belajar | Kartu `learn` untuk konsep baru (menggantikan `intro`) |
| 2. Mengenali | `truefalse`, `choice` sederhana |
| 3. Mencocokkan | `match`, `sort` |
| 4. Menerapkan | `place`, `fix`, `choice` skenario |
| 5. Mengingat sendiri | `fill`, `order`, `shell` |
| 6. Ulangan | Soal dari lesson sebelumnya |

Aturan tambahan:
- Satu lesson berisi 2–4 kartu `learn` dan 8–12 soal.
- Kalau ada lebih dari satu konsep baru, kartu `learn` diselipkan: belajar A, soal A, belajar B, soal B, lalu soal campuran.
- Setiap unit punya kartu `learn` yang cukup untuk dipakai sebagai ringkasan materi seluruh unit (lihat Panduan unit di bagian 7).

---

## 7. Mengakses materi kapan saja

- **Tombol "Lihat materi"** di layar soal (hanya di journey belajar, tidak di halaman Ujian). Membuka kartu `learn` yang mengajarkan fakta di `requires` soal itu. Tidak ada penalti.
- **Penjelasan setelah menjawab** menampilkan tautan ke kartu `learn` terkait: "Pelajari lagi: Empat cara Azure menyimpan salinan datamu".
- **Panduan unit** dibuat otomatis dari semua kartu `learn` di unit tersebut, urut sesuai lesson. Bisa dibuka dari path map. Tidak perlu ditulis terpisah.
- **Halaman pembahasan ujian** menampilkan tautan "Pelajari lagi" di setiap soal yang salah.

---

## 8. Menjaga progres pemain (Supabase)

Course AZ-900 sudah tersambung ke Supabase, jadi perbaikan ini tidak boleh merusak progres yang sudah tersimpan.

- **Jangan mengubah id** lesson, exercise, atau unit yang sudah ada. Progres, antrean review, dan statistik terhubung lewat id tersebut. Item baru selalu diberi id baru.
- Jangan menghapus exercise yang sudah pernah dimainkan. Kalau ada soal yang salah fakta atau tidak bisa diberi materi, tandai `retired: true` supaya tidak dipakai lagi, tapi datanya tetap ada.
- Kartu `learn` tidak disimpan sebagai progres (tidak ada XP, tidak masuk review), jadi tidak butuh perubahan tabel kecuali kalau kamu ingin mencatat kartu yang sudah dibaca.
- Kalau ternyata konten soal disimpan di Supabase (bukan file JSON di repo), semua perubahan konten lewat migration yang bisa dijalankan ulang, dan dicoba dulu di lingkungan pengembangan sebelum ke production.
- Setelah setiap unit selesai diperbaiki, cek bahwa progres akun yang sudah ada tetap sama: lesson yang sudah selesai tetap selesai, XP dan streak tidak berubah.

---

## 9. Catatan bug

Buat file `docs/BUGS_LOG.md` di repo (lihat prompt 0 di bagian 10). Setiap bug yang pernah ditemukan dicatat di sana dengan format:

| Bug | Penyebab | Perbaikan | Cara mencegah | Cara mengecek |
|---|---|---|---|---|

Claude Code wajib membaca file ini sebelum mengerjakan setiap tahap perbaikan, dan menambahkan baris baru setiap kali menemukan dan memperbaiki bug.

---

## 10. Prompt untuk Claude Code

Kerjakan berurutan. Satu prompt per sesi.

### Prompt 0: catatan bug (sekali saja)

```
Buat file docs/BUGS_LOG.md. Isi dari riwayat git project ini: cari commit yang
memperbaiki bug (kata kunci fix, bug, perbaiki, error, crash), lalu untuk setiap
bug tulis: bug, penyebab, perbaikan, cara mencegah terulang, dan cara
mengeceknya. Gabungkan bug yang sama. Kalau penyebabnya tidak jelas dari
commit, tulis "penyebab belum jelas" dan jangan menebak.
Tampilkan hasilnya ke saya untuk dicek dan ditambah sebelum disimpan final.
Mulai sekarang, setiap kali menemukan dan memperbaiki bug, tambahkan barisnya
ke file ini.
```

### Prompt A: fondasi (tanpa mengubah konten)

```
Baca LANGIT_AZ900_PLAN.md, LANGIT_AZ900_PERBAIKAN_MATERI.md, dan
docs/BUGS_LOG.md. Kerjakan bagian 3, 4, dan 7 dari file perbaikan materi,
TANPA menulis konten baru dulu:
1. Tambahkan tipe Fact, LearnCard, field requires, dan field facts di unit.
2. Tambahkan tampilan kartu learn di lesson player.
3. Tambahkan pengecekan cakupan ke validate:content dan buat
   npm run content:coverage.
4. Tambahkan tombol "Lihat materi", tautan "Pelajari lagi" di penjelasan dan
   di pembahasan ujian, dan halaman Panduan unit yang dibangun dari kartu learn.
Jangan mengubah id apa pun. Setelah selesai, jalankan content:coverage dan
tampilkan ringkasannya per unit (sekarang pasti masih banyak yang merah),
lalu pastikan progres Supabase akun saya tidak berubah.
```

### Prompt B: perbaikan satu unit (ulangi untuk Unit 1 sampai 12)

```
Perbaiki materi Unit [4] course AZ-900 mengikuti LANGIT_AZ900_PERBAIKAN_MATERI.md.
Baca docs/BUGS_LOG.md dulu.

1. Baca semua soal di unit ini. Untuk setiap soal, tulis fakta yang dibutuhkan
   untuk menjawab DAN untuk menyingkirkan setiap pilihan pengecoh.
2. Susun daftar facts unit ini. Setiap fakta harus punya source berupa URL
   Microsoft Learn yang benar-benar kamu cek isinya. Kalau tidak bisa dicek,
   tandai verify: true dan sebutkan di ringkasan.
3. Tulis kartu learn yang mengajarkan semua fakta itu, disisipkan di posisi yang
   tepat di setiap lesson sesuai bagian 6. Ikuti gaya bahasa di bagian 3.
4. Isi requires di setiap soal.
5. Kalau ada soal yang faktanya salah atau tidak bisa didukung sumber, jangan
   dihapus: tandai retired: true dan jelaskan alasannya di ringkasan.
6. Jangan mengubah id yang sudah ada.

Jalankan validate:content dan content:coverage sampai unit ini bebas error.
Lalu tampilkan: jumlah fakta, kartu learn, dan soal; daftar fakta verify;
daftar soal retired; dan visual yang dibutuhkan tapi belum ada komponennya.
```

### Prompt C: komponen visual

```
Buat komponen visual yang masih kurang sesuai katalog di bagian 5
LANGIT_AZ900_PERBAIKAN_MATERI.md, ikuti aturan visual di bagian yang sama dan
palet di LANGIT_AZ900_PLAN.md. Mulai dari yang sudah dipakai kartu learn tapi
belum ada. Setiap komponen harus terbaca di lebar 390px dan punya aria-label.
Tampilkan screenshot setiap visual di lebar 390px setelah selesai.
```

### Prompt D: pengecekan akhir

```
Jalankan validate:content dan content:coverage untuk seluruh course AZ-900 dan
pastikan tidak ada error. Lalu mainkan satu lesson dari setiap unit di lebar
390px, pastikan tombol Lihat materi dan Panduan unit berjalan, dan cek bahwa
progres, XP, streak, dan antrean review akun saya di Supabase tidak berubah
dibanding sebelum perbaikan. Cocokkan juga dengan daftar di docs/BUGS_LOG.md
supaya tidak ada bug lama yang muncul lagi. Ringkas hasilnya.
```
