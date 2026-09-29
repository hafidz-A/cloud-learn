# Langit: game belajar AZ-900 ala Duolingo

Rencana ini ditulis untuk dikerjakan di Claude Code. Taruh file ini di root project, lalu mulai dengan prompt di bagian paling bawah.

---

## 1. Konsep

Langit adalah web app belajar AZ-900 (Microsoft Azure Fundamentals) dengan gaya Duolingo: pelajaran pendek 5 menit, langsung latihan tanpa bacaan panjang, umpan balik instan setiap menjawab, dan progres yang terlihat naik setiap hari.

Prinsip utamanya: **konsep diajarkan lewat soal, bukan lewat bacaan.** Setiap soal punya penjelasan singkat yang muncul setelah dijawab, baik benar maupun salah. Pemain belajar dari mencoba, salah, lalu langsung tahu kenapa.

Tidak ada mode mengajar, membuat konten, atau fitur sosial. Murni main dan belajar.

**Pemain:** satu orang (saya sendiri), belajar di HP 1,5 jam per hari, sedang menyiapkan AZ-900 lalu AZ-104.

---

## 2. Struktur konten

Mengikuti 3 jalur belajar resmi Microsoft Learn untuk AZ-900. Setiap modul jadi satu **unit**, setiap unit berisi 3–5 **lesson**, setiap lesson berisi 8–12 **exercise**.

| Jalur | Unit | Topik inti |
|---|---|---|
| 1. Cloud concepts | 1. Cloud computing | Shared responsibility, public/private/hybrid/multi-cloud, CapEx vs OpEx, consumption-based model |
| | 2. Manfaat cloud | High availability, scalability (vertical vs horizontal), elasticity, reliability, predictability, security, governance, manageability |
| | 3. Jenis layanan | IaaS, PaaS, SaaS, serverless |
| 2. Arsitektur dan layanan | 4. Komponen inti | Region, availability zone, region pair, sovereign region, management group, subscription, resource group, resource |
| | 5. Compute | VM, VM Scale Sets, availability sets, Azure Virtual Desktop, container (ACI, Container Apps, AKS), Azure Functions, App Service |
| | 6. Networking | VNet, subnet, NSG, VNet peering, VPN Gateway, ExpressRoute, Azure DNS, public vs private endpoint |
| | 7. Storage | Storage account, LRS/ZRS/GRS/GZRS, blob tiers, Blob/Files/Queues/Tables/Disks, Azure Migrate, Data Box, AzCopy, File Sync |
| | 8. Identitas dan keamanan | Entra ID, Entra Connect, Entra Domain Services, SSO, MFA, passwordless, Conditional Access, RBAC, Zero Trust, defense in depth, Defender for Cloud |
| 3. Manajemen dan governance | 9. Biaya | Faktor biaya, Pricing Calculator vs TCO Calculator, Cost Management, budget, tag |
| | 10. Governance | Azure Policy, initiative, resource lock, Microsoft Purview, Service Trust Portal |
| | 11. Mengelola dan deploy | Portal, Cloud Shell, Azure CLI, PowerShell, Azure Arc, ARM, ARM template, Bicep |
| | 12. Monitoring | Azure Advisor, Service Health, Azure Monitor, Log Analytics, alerts, Application Insights |

Di akhir setiap jalur ada **checkpoint** (boss lesson) berisi 20 soal campuran. Skor minimal 80% untuk membuka jalur berikutnya.

### Aturan konten (wajib)

- Setiap singkatan ditulis kepanjangannya dalam kurung saat pertama kali muncul di setiap exercise dan penjelasan. Contoh: NSG (Network Security Group).
- Soal (prompt) dalam bahasa Inggris, sama seperti ujian aslinya. Penjelasan setelah menjawab dalam bahasa Indonesia yang santai dan to the point.
- Pakai nama terbaru: Microsoft Entra ID (dulu Azure AD), bukan Azure Active Directory.
- Setiap exercise punya `concept` tag supaya bisa dipakai untuk mode latihan ulang dan statistik penguasaan.
- Fakta yang sering salah dan harus akurat:
  - Customer selalu bertanggung jawab atas data, device, serta account dan identity, di semua jenis layanan termasuk SaaS.
  - Zone-enabled region punya minimal 3 availability zone.
  - Durability: LRS 11 nines, ZRS 12 nines, GRS dan GZRS 16 nines.
  - Minimum storage period blob tier: Cool 30 hari, Cold 90 hari, Archive 180 hari. Archive offline, harus di-rehydrate.
  - Resource lock: Delete (CanNotDelete) masih bisa diubah tapi tidak bisa dihapus; ReadOnly tidak bisa diubah dan tidak bisa dihapus. Lock berlaku juga untuk Owner.
  - Management group: maksimal 6 level kedalaman (tidak termasuk root dan subscription).
  - Resource group tidak bisa di-nest. Menghapus resource group menghapus semua isinya.
  - Conditional Access butuh lisensi Entra ID P1 atau lebih.
  - Pricing Calculator untuk estimasi resource Azure baru; TCO Calculator untuk membandingkan on-premises dengan Azure.
- Kalau ada fakta yang ragu, tandai dengan `"verify": true` di data, jangan dikarang.

---

## 3. Jenis exercise

Variasi jenis soal adalah yang membuat ini terasa seperti game, bukan kuis biasa. Targetkan setiap lesson memakai minimal 4 jenis berbeda.

| Tipe | Cara main | Cocok untuk |
|---|---|---|
| `choice` | Skenario, pilih 1 dari 4 jawaban | Semua topik, terutama "layanan mana yang tepat" |
| `match` | Cocokkan 4–5 pasang kartu (tap kiri, tap kanan) | Layanan dengan fungsinya, singkatan dengan kepanjangannya |
| `sort` | Seret kartu ke 2–3 keranjang | IaaS/PaaS/SaaS, tanggung jawab customer vs Microsoft, CapEx vs OpEx, stateful vs stateless |
| `order` | Susun kartu dari atas ke bawah | Hierarki management group sampai resource, urutan tier blob dari termurah |
| `fill` | Lengkapi kalimat dari bank kata | Definisi dan istilah kunci |
| `truefalse` | Geser kanan untuk benar, kiri untuk salah, cepat | Pemanasan di awal lesson |
| `place` | Seret resource ke dalam diagram (zone, region, subnet) sampai memenuhi syarat | Availability zone, redundancy storage, subnet publik vs private |
| `fix` | Tampilan portal atau pesan error palsu, pilih tindakan yang memperbaikinya | Resource lock menolak delete, NSG memblokir port 80, policy menolak region |
| `shell` | Terminal Cloud Shell palsu, susun perintah dari potongan kata | Azure CLI dasar: `az group create`, `az vm create`, `az group delete` |

Tipe `place`, `fix`, dan `shell` adalah pengganti praktik langsung di Azure. Pemain merasakan "melakukan" tanpa biaya dan tanpa takut salah.

---

## 4. Mekanik game

- **XP (experience points):** +10 per lesson selesai, +5 bonus kalau tanpa kesalahan, +20 per checkpoint lulus.
- **Streak:** hitung hari berturut-turut minimal satu lesson selesai. Tampilkan api kecil dengan angka di header.
- **Target harian:** pilih 20, 50, atau 100 XP per hari. Ada cincin progres di home.
- **Hearts:** 5 nyawa, berkurang 1 setiap salah. Kalau habis, lesson berhenti dan pemain diarahkan ke mode latihan ulang untuk mengisi ulang. Hearts juga terisi penuh setiap hari. Bisa dimatikan di pengaturan kalau terasa menghambat.
- **Level unit (crown):** setiap unit punya level 0–3. Level naik setelah semua lesson di unit diulang dengan soal yang diacak ulang.
- **Latihan kesalahan:** semua soal yang pernah salah masuk antrean review dengan spaced repetition sederhana: muncul lagi setelah 1 hari, 3 hari, lalu 7 hari. Kalau benar 3 kali berturut-turut, keluar dari antrean.
- **Penguasaan konsep:** halaman statistik menampilkan persentase benar per `concept` tag, supaya kelihatan topik mana yang masih lemah.
- **Glosarium:** semua singkatan dan kepanjangannya, bisa dicari. Terbuka otomatis saat pemain menahan tap pada singkatan di dalam soal.

---

## 5. Layar

1. **Home (path map):** jalur vertikal berkelok berisi lingkaran lesson. Lesson terkunci berwarna pudar, lesson aktif memantul pelan, checkpoint berbentuk lebih besar. Header berisi streak, XP hari ini, dan hearts.
2. **Lesson player:** progress bar di atas, soal di tengah, tombol "Periksa" besar di bawah.
3. **Feedback sheet:** panel yang naik dari bawah setelah "Periksa". Hijau untuk benar, merah untuk salah. Berisi penjelasan singkat dan tombol "Lanjut".
4. **Lesson selesai:** XP yang didapat, akurasi, waktu, dan maskot bereaksi. Satu-satunya momen perayaan dengan animasi besar.
5. **Latihan:** daftar soal di antrean review dan tombol mulai.
6. **Statistik:** XP total, streak terpanjang, penguasaan per unit dan per konsep.
7. **Glosarium.**
8. **Pengaturan:** target harian, hearts on/off, suara on/off, reset progres.

Wireframe home:

```
+--------------------------------+
|  [api] 12   [XP] 30/50   [hati] 5 |
+--------------------------------+
|  Unit 4: Komponen inti          |
|                                 |
|          ( 1 )                  |
|              ( 2 )              |
|          ( 3 )   <- aktif       |
|      ( 4 )                      |
|          [ CHECKPOINT ]         |
|                                 |
|  Unit 5: Compute                |
|              ( 1 ) terkunci     |
+--------------------------------+
| Home | Latihan | Statistik | ... |
+--------------------------------+
```

---

## 6. Arah desain

Temanya **langit dan awan**, karena ini soal cloud, dan supaya tidak terlihat seperti tiruan Duolingo yang serba hijau. Terasa ceria dan ringan, seperti main game di HP, bukan dashboard kantor.

### Palet

| Nama | Hex | Dipakai untuk |
|---|---|---|
| Langit pagi | `#EEF5FF` | Latar belakang utama |
| Tinta | `#1B2A41` | Teks utama |
| Biru langit | `#2F8CFF` | Tombol utama, lesson aktif, progress bar |
| Biru dalam | `#1C6FD8` | Sisi bawah tombol (efek 3D), teks tautan |
| Matahari | `#FFC53D` | XP, streak, bintang |
| Mint | `#2BC48A` | Jawaban benar, feedback sheet benar |
| Koral | `#FF6B6B` | Jawaban salah, hearts |
| Kabut | `#D6E2F0` | Border, lesson terkunci, kartu nonaktif |

Semua kombinasi teks dan latar harus lolos kontras WCAG (Web Content Accessibility Guidelines) AA. Teks putih di atas Mint dan Matahari kemungkinan tidak lolos, jadi pakai Tinta sebagai warna teks di atas keduanya.

### Tipografi

- **Fredoka** untuk judul, angka XP, dan tombol. Bentuknya bulat dan tebal, cocok untuk nuansa game.
- **Nunito** untuk isi soal dan penjelasan, supaya tetap nyaman dibaca lama.
- Skala: 28 / 20 / 17 / 15 / 13 px. Sentence case di semua tempat, tanpa huruf kapital semua untuk label.

### Komponen khas

- **Tombol tebal 3D:** sudut membulat, border bawah 4px dengan warna lebih gelap. Saat ditekan, tombol turun 4px dan border bawahnya hilang. Ini sumber rasa "mainan" paling kuat.
- **Kartu jawaban:** border 2px Kabut. Saat dipilih jadi Biru langit dengan latar biru sangat muda.
- **Maskot Awan:** awan kecil dengan dua mata dan mulut sederhana, dibuat dengan SVG (Scalable Vector Graphics). Punya 4 ekspresi: netral, senang (benar), sedih (salah), dan gembira (lesson selesai). Ini satu-satunya elemen dekoratif; sisanya dibuat tenang dan rapi.

### Gerak

- Animasi hanya sebagai respons aksi pemain: feedback sheet naik, kartu bergoyang saat salah, progress bar bertambah, hearts pecah saat berkurang.
- Satu perayaan besar di layar lesson selesai.
- Tidak ada animasi masuk di setiap elemen. Hormati `prefers-reduced-motion`.

### Tata letak

- Mobile first, lebar konten maksimal 480px di tengah layar, termasuk di desktop.
- Area sentuh minimal 44px. Tombol "Periksa" selalu menempel di bawah layar.
- Rata kiri untuk teks soal dan penjelasan; hanya path map dan layar selesai yang rata tengah.

---

## 7. Stack teknis

- **Vite + React + TypeScript**
- **Tailwind CSS** dengan token warna dan font di atas didefinisikan di config
- **Framer Motion** untuk feedback sheet dan animasi respons
- **dnd-kit** untuk exercise `sort`, `order`, dan `place` (harus bisa dipakai dengan sentuhan di HP)
- **Zustand** untuk state, dengan persistence ke `localStorage` untuk progres
- **PWA (Progressive Web App)** supaya bisa dipasang di home screen HP dan jalan offline
- Tahap lanjut: **Supabase** untuk sinkron progres antar-perangkat (opsional, bukan untuk MVP/Minimum Viable Product)

Tidak perlu backend untuk MVP. Semua konten berupa file JSON (JavaScript Object Notation) di dalam project.

---

## 8. Model data

```ts
type Unit = {
  id: string;            // "u04-core-architecture"
  path: 1 | 2 | 3;
  title: string;         // "Komponen inti"
  lessons: Lesson[];
};

type Lesson = {
  id: string;            // "u04-l1"
  title: string;
  exercises: Exercise[];
};

type ExerciseBase = {
  id: string;
  concept: string;       // "availability-zones"
  prompt: string;        // bahasa Inggris
  explanation: string;   // bahasa Indonesia, muncul setelah menjawab
  verify?: boolean;      // true kalau faktanya perlu dicek ulang
};

type Exercise =
  | (ExerciseBase & { type: "choice"; options: string[]; answer: number })
  | (ExerciseBase & { type: "truefalse"; answer: boolean })
  | (ExerciseBase & { type: "match"; pairs: [string, string][] })
  | (ExerciseBase & { type: "sort"; buckets: string[]; items: { text: string; bucket: number }[] })
  | (ExerciseBase & { type: "order"; items: string[] })          // urutan benar
  | (ExerciseBase & { type: "fill"; sentence: string; bank: string[]; answers: string[] }) // "___" sebagai blank
  | (ExerciseBase & { type: "place"; zones: string[]; pieces: { text: string; validZones: number[] }[]; rule: string })
  | (ExerciseBase & { type: "fix"; scene: { kind: "portal" | "error"; title: string; message: string }; options: string[]; answer: number })
  | (ExerciseBase & { type: "shell"; tokens: string[]; answer: string[] });

type Progress = {
  xp: number;
  dailyGoal: 20 | 50 | 100;
  streak: { current: number; best: number; lastDay: string };
  hearts: number;
  lessonsDone: Record<string, { bestAccuracy: number; completedAt: string }>;
  unitLevel: Record<string, 0 | 1 | 2 | 3>;
  review: Record<string, { dueDay: string; correctStreak: number }>; // key: exercise id
  conceptStats: Record<string, { right: number; wrong: number }>;
};
```

### Contoh lesson (untuk format dan tingkat kesulitan)

```json
{
  "id": "u04-l1",
  "title": "Region dan zone",
  "exercises": [
    {
      "id": "u04-l1-e1",
      "type": "truefalse",
      "concept": "availability-zones",
      "prompt": "An availability zone is a separate datacenter (or group of datacenters) inside one Azure region.",
      "answer": true,
      "explanation": "Benar. Availability zone ada di dalam satu region, masing-masing punya listrik, pendingin, dan jaringan sendiri. Jadi kalau satu gedung mati, zone lain tetap jalan."
    },
    {
      "id": "u04-l1-e2",
      "type": "place",
      "concept": "availability-zones",
      "prompt": "Place 3 VMs (Virtual Machines) so your app survives the loss of any single datacenter in the region.",
      "zones": ["Zone 1", "Zone 2", "Zone 3"],
      "pieces": [
        { "text": "VM A", "validZones": [0, 1, 2] },
        { "text": "VM B", "validZones": [0, 1, 2] },
        { "text": "VM C", "validZones": [0, 1, 2] }
      ],
      "rule": "one-per-zone",
      "explanation": "Satu VM di setiap zone. Kalau ketiganya ditaruh di zone yang sama, satu gedung mati berarti aplikasimu ikut mati."
    },
    {
      "id": "u04-l1-e3",
      "type": "choice",
      "concept": "region-pairs",
      "prompt": "Which statement about region pairs is correct?",
      "options": [
        "Both regions share one datacenter",
        "Planned Azure updates roll out to one region of the pair at a time",
        "Data transfer between paired regions is always free",
        "Region pairs remove the need for backups"
      ],
      "answer": 1,
      "explanation": "Microsoft memperbarui satu region dalam pasangan secara bergantian, supaya kalau update bermasalah, region pasangannya tetap aman. Region pair biasanya berjarak minimal sekitar 480 km, bukan satu gedung."
    },
    {
      "id": "u04-l1-e4",
      "type": "match",
      "concept": "physical-infrastructure",
      "prompt": "Match each term with its meaning.",
      "pairs": [
        ["Region", "Geographic area with one or more datacenters"],
        ["Availability zone", "Separate datacenter inside a region"],
        ["Region pair", "Two regions in the same geography for disaster recovery"],
        ["Sovereign region", "Isolated Azure instance for government or legal needs"]
      ],
      "explanation": "Urutan dari kecil ke besar: datacenter, availability zone, region, lalu region pair."
    }
  ]
}
```

---

## 9. Tahapan pengerjaan

Kerjakan berurutan. Setiap tahap harus bisa dimainkan sebelum lanjut ke tahap berikutnya.

1. **Kerangka dan desain dasar.** Setup Vite, Tailwind dengan token warna dan font, tombol 3D, header, dan navigasi bawah. Home menampilkan path map dari data dummy.
2. **Lesson player dengan 3 tipe exercise:** `choice`, `truefalse`, dan `match`, lengkap dengan feedback sheet dan layar lesson selesai. Isi Unit 4 lesson 1 dari contoh di atas.
3. **Semua tipe exercise:** tambahkan `sort`, `order`, `fill`, `place`, `fix`, dan `shell`. Pastikan drag and drop lancar dengan sentuhan di HP.
4. **Mekanik game:** XP, streak, target harian, hearts, level unit, dan checkpoint yang mengunci jalur berikutnya.
5. **Konten lengkap:** isi ke-12 unit dan 3 checkpoint. Tulis per unit, cek aturan konten di bagian 2 setelah setiap unit.
6. **Latihan kesalahan dan statistik:** antrean review dengan spaced repetition, statistik per konsep, glosarium.
7. **Polish:** maskot Awan dengan 4 ekspresi, suara (opsional), PWA, uji aksesibilitas dan `prefers-reduced-motion`.
8. **Opsional:** sinkron progres lewat Supabase.

---

## 10. Prompt pembuka untuk Claude Code

```
Baca LANGIT_AZ900_PLAN.md di root project. Ini spesifikasi lengkap web app
belajar AZ-900 bergaya Duolingo bernama Langit.

Kerjakan tahap 1 dan 2 dari bagian "Tahapan pengerjaan" saja. Ikuti persis
palet, tipografi, dan komponen di bagian "Arah desain", serta model data di
bagian "Model data". Setelah selesai, jalankan app, pastikan lesson contoh
bisa dimainkan dari awal sampai layar selesai di tampilan HP (lebar 390px),
lalu berhenti dan ringkas apa yang sudah dibuat sebelum lanjut ke tahap 3.
```

Untuk tahap 5 (konten), minta Claude Code mengerjakan satu unit per sesi dan selalu mengecek ulang aturan konten, terutama aturan singkatan dan daftar fakta yang wajib akurat.

---

## 11. Kartu kenalan dan urutan lesson

Bagian ini melengkapi prinsip "konsep diajarkan lewat soal". Tanpa kartu kenalan,
soal pertama untuk konsep yang benar-benar baru hanya bisa ditebak. Bagian ini
berlaku untuk semua lesson dan mengubah bagian 3, 8, dan 9.

### 11.1 Tipe `intro` (kartu kenalan)

Kartu singkat yang memperkenalkan satu konsep baru sebelum konsep itu diuji.

Aturan:
- Judul berisi nama konsep. Isi maksimal 2 kalimat (sekitar 35 kata), dalam bahasa
  Indonesia dengan istilah teknis tetap bahasa Inggris. Singkatan wajib ditulis
  kepanjangannya.
- Boleh ada visual kecil (diagram SVG/Scalable Vector Graphics sederhana) kalau
  konsepnya soal posisi atau struktur, misalnya zone di dalam region atau hierarki
  management group.
- Tidak ada jawaban. Pemain cukup menekan "Lanjut".
- Tidak memberi XP (experience points) dan tidak memengaruhi hearts.
- Tidak ikut masuk antrean review. Di mode latihan ulang, kartu bisa dibuka lagi
  lewat tombol kecil "Lihat konsep" di layar soal.
- Tampil sebagai kartu besar di tengah layar, dengan maskot Awan berekspresi netral.

Tambahan di model data (bagian 8):

```ts
type IntroCard = {
  id: string;            // "u04-l1-i1"
  type: "intro";
  concept: string;       // sama dengan concept tag di exercise yang mengujinya
  title: string;         // "Availability zone"
  body: string;          // maksimal 2 kalimat
  visual?: string;       // nama komponen diagram, misalnya "ZonesInRegion"
};

type LessonItem = IntroCard | Exercise;

type Lesson = {
  id: string;
  title: string;
  items: LessonItem[];   // menggantikan field "exercises"
};
```

### 11.2 Urutan naik tingkat di dalam lesson

Setiap lesson disusun dari yang paling mudah ke yang paling sulit:

| Tahap | Tujuan | Tipe yang dipakai |
|---|---|---|
| 1. Kenal | Konsep diperkenalkan | `intro` |
| 2. Mengenali | Cukup mengenali jawaban yang benar | `truefalse`, `choice` sederhana |
| 3. Mencocokkan | Membedakan konsep yang mirip | `match`, `sort` |
| 4. Menerapkan | Memakai konsep di situasi nyata | `place`, `fix`, `choice` berbentuk skenario |
| 5. Mengingat sendiri | Mengeluarkan jawaban tanpa pilihan ganda | `fill`, `order`, `shell` |
| 6. Ulangan | Menyegarkan konsep lama | 1–3 soal dari lesson sebelumnya atau dari antrean review |

Aturan penyusunan:
- Satu lesson memperkenalkan maksimal 3 konsep baru.
- Setiap konsep baru wajib punya kartu `intro` sebelum soal pertama yang mengujinya.
- Kalau ada 2–3 konsep baru, polanya: intro A, soal mudah A, intro B, soal mudah B,
  lalu soal tahap 3 ke atas yang mencampur A dan B.
- Setiap konsep baru muncul di minimal 3 tahap berbeda dalam lesson yang sama.
- Tipe tahap 5 (`fill`, `order`, `shell`) hanya boleh menguji konsep yang sudah
  muncul di minimal 2 soal yang lebih mudah sebelumnya.
- Soal yang dijawab salah dimasukkan lagi ke akhir lesson. Lesson baru selesai setelah
  semua soal pernah dijawab benar.
- Panjang lesson: 1–3 kartu `intro` ditambah 8–12 soal, sekitar 5 menit.

### 11.3 Contoh susunan lesson "Region dan zone"

```json
{
  "id": "u04-l1",
  "title": "Region dan zone",
  "items": [
    {
      "id": "u04-l1-i1",
      "type": "intro",
      "concept": "availability-zones",
      "title": "Availability zone",
      "body": "Availability zone adalah datacenter terpisah di dalam satu region, masing-masing punya listrik, pendingin, dan jaringan sendiri. Kalau satu gedung mati, zone lain tetap jalan.",
      "visual": "ZonesInRegion"
    },
    { "id": "u04-l1-e1", "type": "truefalse", "concept": "availability-zones", "...": "tahap 2" },
    {
      "id": "u04-l1-i2",
      "type": "intro",
      "concept": "region-pairs",
      "title": "Region pair",
      "body": "Region pair adalah dua region dalam satu geografi, biasanya berjarak minimal sekitar 480 km. Kalau satu region lumpuh, pasangannya jadi tempat pemulihan.",
      "visual": "RegionPair"
    },
    { "id": "u04-l1-e2", "type": "choice", "concept": "region-pairs", "...": "tahap 2" },
    { "id": "u04-l1-e3", "type": "match", "concept": "physical-infrastructure", "...": "tahap 3" },
    { "id": "u04-l1-e4", "type": "place", "concept": "availability-zones", "...": "tahap 4" },
    { "id": "u04-l1-e5", "type": "choice", "concept": "region-pairs", "...": "tahap 4, skenario disaster recovery" },
    { "id": "u04-l1-e6", "type": "fill", "concept": "availability-zones", "...": "tahap 5" }
  ]
}
```

Field `"..."` di contoh ini hanya penanda tahap. Di konten sebenarnya, isi dengan
field lengkap sesuai tipe masing-masing di bagian 8.

### 11.4 Perubahan pada tahapan pengerjaan (bagian 9)

- Tahap 2 menjadi: lesson player dengan tipe `intro`, `choice`, `truefalse`, dan
  `match`, lengkap dengan feedback sheet, soal salah yang diulang di akhir lesson,
  dan layar lesson selesai.
- Tahap 5 (konten): setiap unit disusun mengikuti aturan 11.2. Setelah menulis satu
  unit, periksa ulang bahwa setiap konsep punya kartu `intro` sebelum pertama kali diuji.
