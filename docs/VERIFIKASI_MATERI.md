# Verifikasi materi dan soal

Catatan pengecekan ulang semua materi, soal, dan jawaban terhadap dokumentasi resmi Microsoft,
supaya tidak ada yang menyesatkan untuk ujian maupun pekerjaan sehari-hari.

## Cara mengecek

- **Sumber utama:** teks asli halaman Microsoft Learn, yaitu file Markdown di repo resmi
  `MicrosoftDocs` (azure-docs, azure-compute-docs, azure-monitor-docs, azure-management-docs,
  entra-docs, azure-aks-docs, architecture-center, cloud-adoption-framework). Isinya sama dengan yang
  tampil di learn.microsoft.com, lengkap dengan tanggal pembaruan (`ms.date`).
- **Setiap fakta:** URL sumbernya dicocokkan ke file aslinya (termasuk mengikuti halaman yang sudah
  dipindah), lalu kalimat yang mendukung fakta itu dicari dan dibaca.
- **Setiap soal:** jawaban benar, setiap pengecoh, dan penjelasannya dibaca dan dicocokkan dengan fakta
  yang sudah dicek.
- **Sumber kedua:** pencarian web terbatas ke learn.microsoft.com, untuk halaman yang repo-nya tidak
  publik (misalnya reliability, Defender for Cloud, Zero Trust, dan modul training).
- **Yang tidak bisa dicek langsung** (teks modul training Microsoft Learn tidak publik) tetap diberi
  tanda `verify: true` di data fakta, supaya jelas mana yang belum dicocokkan kalimat per kalimat.

## AZ-900: hasil (29 September 2026)

Semua 12 unit dicek: 253 fakta, 142 kartu materi, 391 soal. Domain ujian masih sama dengan tiga jalur
di app (cloud concepts 25–30%, architecture and services 35–40%, management and governance 30–35%).

### Yang diperbaiki

| Unit | Temuan | Perbaikan |
|---|---|---|
| 2 | Penjelasan soal menyebut "aplikasi mobile" sebagai alat management in the cloud, padahal materinya mengajarkan portal, CLI, REST API, dan PowerShell | Diganti PowerShell, sesuai materi |
| 3, 5 | Consumption plan Azure Functions sekarang berstatus **legacy**. Microsoft merekomendasikan **Flex Consumption** untuk app baru, dan Linux Consumption pensiun 30 September 2028 | Fakta dan kartu materi memakai Flex Consumption; prinsip "bayar saat kode berjalan" tetap |
| 4 | Materi region pair belum menyebut bahwa **banyak region, terutama region baru, tidak punya pasangan** dan mengandalkan availability zone | Fakta baru, kartu materi diperbarui, soal baru `u04-l1-e9` (benar/salah), dan soal pemulihan bencana kini menyebut region-nya punya pasangan |
| 6 | Kalimat "Azure DNS tidak bisa dipakai membeli domain" sudah pindah ke halaman Azure Public DNS, yang juga menyebut **App Service domains** sebagai cara membeli domain di Azure | Sumber dipindah, materi dan penjelasan menyebut App Service domains |
| 7 | ZRS sekarang disebut menyalin ke **tiga atau lebih** availability zone | Fakta dan kartu materi diperbarui |
| 8 | Dua sumber Entra sudah pindah halaman | URL diperbarui |
| 9 | Halaman CAF yang dijadikan sumber TCO Calculator tidak lagi membahasnya. TCO Calculator masih ada dan masih materi AZ-900 | Sumber diarahkan ke modul training AZ-900, diberi tanda `verify` |

### Yang sudah dipastikan benar (contoh angka dan aturan penting)

- Shared responsibility (halaman diperbarui Agustus 2026): data, endpoint/device, akun, dan pengelolaan
  akses selalu tanggung jawab customer; host, jaringan, dan datacenter fisik tanggung jawab Microsoft.
- Management group: maksimal 6 level, tidak termasuk root dan subscription; satu parent.
- Availability zone: minimal tiga zone di region yang mendukungnya.
- Storage redundancy: LRS 11 nines, ZRS 12 nines, GRS dan GZRS 16 nines; hanya opsi geo yang punya
  salinan di region kedua.
- Blob tier: Cool minimal 30 hari, Cold 90 hari, Archive 180 hari dan offline; biaya early deletion.
- VM: Stopped tetap ditagih compute, Stopped (deallocated) tidak; disk tetap ditagih.
- Availability set: sampai 3 fault domain, 20 update domain, gratis, satu update domain di-restart dalam satu waktu.
- NSG: prioritas 100–4096, angka kecil diproses dulu, berhenti di aturan pertama yang cocok; default
  AllowVNetInBound 65000, AllowAzureLoadBalancerInBound 65001, DenyAllInbound 65500.
- Resource lock: Delete (CanNotDelete) vs Read-only; berlaku untuk semua user termasuk Owner; diwariskan.
- Budget hanya memberi notifikasi, tidak menghentikan resource. Tag tidak diwariskan otomatis.
- Reservations 1 atau 3 tahun. Conditional Access butuh Entra ID P1. Advisor: lima kategori, gratis.

### Masih bertanda `verify` (tidak bisa dicocokkan kalimat per kalimat)

| Fakta | Alasan |
|---|---|
| `f-u02-perf-predictability`, `f-u02-mgmt-of-cloud`, `f-u02-mgmt-in-cloud` | Bersumber dari modul training AZ-900 yang teksnya tidak publik. Isinya sesuai materi modul tersebut |
| `f-u08-did-layers` | Urutan lapisan defense in depth berasal dari modul training AZ-900 |
| `f-u09-tco` | TCO Calculator tidak lagi dijelaskan di halaman dokumentasi; hanya ditautkan dari dokumentasi Cost Management |

### Perubahan yang perlu diketahui untuk ujian dan pekerjaan

- **Entra ID:** mulai 1 September 2026 passkey menjadi metode login default. SMS dan telepon untuk MFA
  yang disediakan Microsoft pensiun 1 Februari 2027 (Global Administrator dan user eksternal 1 Juli 2027).
- **Blob Storage** punya fitur baru *smart tier* (pindah otomatis antara hot, cool, dan cold). Belum
  masuk daftar materi AZ-900, jadi tidak dimasukkan ke soal.
- **Availability set:** Microsoft kini merekomendasikan VM Scale Sets mode Flexible untuk ketersediaan tinggi.

## AZ-104

Lihat bagian AZ-104 di bawah (diisi saat rencana dan materi AZ-104 dicek).
