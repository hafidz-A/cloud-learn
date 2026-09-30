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

## AZ-104: fakta di rencana (29 September 2026)

Semua "Fakta wajib akurat" di `LANGIT_AZ104_PLAN.md` bagian 5 dan info ujian di bagian 1 dicek dengan
cara yang sama. Materi AZ-104 di app akan ditulis dari fakta yang sudah dicek ini; setiap fakta baru saat
menulis materi dicek dengan cara yang sama dan dicatat di bawah per unit.

### Info ujian

| Klaim | Hasil | Bukti |
|---|---|---|
| Lima domain dan bobotnya (20–25, 15–20, 20–25, 15–20, 10–15) | Benar | Hasil pencarian halaman study guide dan halaman training di learn.microsoft.com |
| 100 menit tanpa lab (seat time 120), 120 menit dengan lab (seat time 140) | Benar | Halaman "Exam duration and exam experience" |
| Versi study guide | Belum pasti | Teks study guide tidak bisa dibaca dari sini; beberapa situs menyebut pembaruan 17 September 2026. Cek change log resminya sebelum ujian |

### Per unit

| Unit | Fakta | Hasil | Sumber (file di MicrosoftDocs) |
|---|---|---|---|
| 1 | Dynamic group butuh P1 atau Intune for Education per user unik; tidak bisa diubah manual | Benar. Tambahan: device tidak butuh lisensi; user saja atau device saja | entra `groups-dynamic-membership.md`, `concept-learn-about-groups.md` |
| 1 | Security group: user atau device; Microsoft 365 group: user saja | Benar, dipertajam: security group juga service principal dan nested group | entra `concept-learn-about-groups.md` |
| 1 | Group-based licensing butuh P1+ atau paket seperti Office 365 E3 | Benar (juga Microsoft 365 Business Premium, A3, G3). Halaman aslinya dihapus 1 Juli 2026 dan dialihkan ke dokumentasi Microsoft 365; isinya dicek dari versi terakhir di riwayat git entra-docs | entra `concept-group-based-licensing.md` (commit sebelum `ee4e287`) |
| 1 | Usage location wajib; di group licensing user tanpa usage location memakai lokasi direktori | Benar | microsoft-365-docs `admin/manage/manage-group-licenses.md` |
| 1 | Lisensi SSPR (change di Free; reset di Business Standard+ atau P1/P2; writeback di Business Premium atau P1/P2) | Benar, sama persis dengan tabel sumber. Kebijakan two-gate untuk admin benar; apakah SSPR admin aktif secara default, dua halaman Microsoft saling bertentangan, jadi materi tidak mengklaimnya | entra `concept-sspr-licensing.md`, `concept-sspr-policy.md` |
| 2 | Azure role dan Entra role terpisah; pewarisan management group > subscription > resource group > resource | Benar | `rbac-and-directory-admin-roles.md`, `scope-overview.md` |
| 3 | Tag tidak diwariskan; lock Delete vs ReadOnly, berlaku juga untuk Owner | Benar | `tag-resources.md`, `lock-resources.md` |
| 3 | Efek policy dan remediation | Benar, dilengkapi daftar efek, urutan evaluasi, dan managed identity | `effect-basics.md`, `remediate-resources.md` |
| 4 | 5 IP dicadangkan per subnet, /27 = 27 terpakai | Benar; subnet terkecil /29 | `virtual-networks-faq.md` |
| 4 | Public IP Basic pensiun 30 September 2025; Standard statis dan tertutup | Benar | `public-ip-addresses.md` |
| 4 | Peering tidak transitif | Benar | `virtual-networks-faq.md` |
| 4 | (baru) Subnet privat default di VNet baru | Ditambahkan | `default-outbound-access.md` |
| 5 | Prioritas dan aturan default NSG; subnet dulu lalu NIC untuk masuk, dibalik untuk keluar | Benar | `network-security-groups-overview.md`, `network-security-group-how-it-works.md` |
| 5 | Syarat AzureBastionSubnet dan SKU Developer | Benar, dilengkapi pengecualian public IP (Developer, Private-only) | `configuration-settings.md`, `bastion-faq.md`, `bastion-sku-comparison.md` |
| 6 | Auto-registration private DNS zone | Benar, sama persis | `private-dns-autoregistration.md` |
| 6 | Probe dari 168.63.129.16, tag AzureLoadBalancer; Load Balancer Basic pensiun | Benar | `load-balancer-custom-probe-overview.md`, `load-balancer-overview.md` |
| 6 | Inbound NAT rule vs load-balancing rule | Dipertajam (port forwarding, tanpa probe, versi 2) | `inbound-nat-rules.md` |
| 7 | Prasyarat object replication | Benar, sama persis | `object-replication-overview.md` |
| 8 | Jenis SAS, stored access policy (maks 5 per container), dua access key, sumber identitas Azure Files | Benar | `storage-sas-overview.md`, `storage-account-keys-manage.md`, `storage-files-active-directory-overview.md` |
| 9 | Soft delete 1–365 hari, container default 7 hari, container soft delete hanya utuh | Benar | `soft-delete-container-overview.md`, `soft-delete-blob-overview.md` |
| 10 | Mode incremental dan complete, what-if, batasan complete | Benar; tambahan: complete tidak direkomendasikan dan akan dihentikan bertahap | `deployment-modes.md` |
| 11 | Resize, deallocate, availability set | Benar | `sizes/resize-vm.md`, `availability-set-overview.md` |
| 11 | Encryption at host | Benar; tambahan: ADE pensiun 15 September 2028 | `disk-encryption-overview.md` |
| 12 | Tier ACR, restart policy ACI, scaling Container Apps | Benar; nuansa Never; zone redundancy ACR | `container-registry-skus.md`, `container-instances-restart-policy.md`, `scale-app.md` |
| 13 | Custom domain, managed certificate, backup, VNet integration, slot, autoscale | Benar, dipertajam (tier Shared, TXT asuid, Automatic scaling Premium v2–v4) | `app-service-web-tutorial-custom-domain.md`, `manage-backup.md`, `overview-vnet-integration.md`, `deploy-staging-slots.md`, `manage-automatic-scaling.md` |
| 15 | Recovery Services vault vs Backup vault | Benar, sama persis dengan tabel FAQ | `backup-azure-backup-faq.yml` |
| 15 | Urutan Site Recovery: failover, commit, re-protect | Benar; commit menghapus recovery point lain | `azure-to-azure-tutorial-failover-failback.md` |

## AZ-104: materi per unit

Setiap fakta di file unit punya `source`. Kalimatnya dicocokkan dengan file Markdown halaman itu di repo MicrosoftDocs
(`entra-docs`, `azure-docs`, `microsoft-365-docs`), lalu semua URL dicek dengan `learn.mjs --check` (ada, tidak
dialihkan). Soal dan jawabannya dibaca ulang satu per satu: jawaban benar harus didukung fakta, dan setiap pengecoh harus
bisa disingkirkan dengan fakta yang sudah diajarkan sebelumnya.

### Unit 1: User dan group di Microsoft Entra ID (30 September 2026)

48 fakta, 22 kartu learn, 53 soal (44 examReady), 4 visual (`EntraObjects`, `GroupTypes`, `LicenseFlow`, `SsprLicensing`).
Tipe soal baru yang dipakai: config (3 soal) dan rules (2 soal). Semua lesson dimainkan sampai selesai di e2e.

Temuan yang mengubah materi:

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Sejak 1 September 2024, portal Azure dan Microsoft Entra admin center tidak lagi menyediakan UI untuk assign lisensi; pakai Microsoft 365 admin center (API dan PowerShell tetap bisa) | Lesson Lisensi mengajarkan Microsoft 365 admin center, dengan catatan "Jebakan ujian" bahwa materi lama masih menyebut portal Entra | entra `includes/licensing-change.md`, microsoft-365-docs `manage-group-licenses.md` |
| Nested group tidak ikut mendapat aplikasi group induk (dokumentasi Entra), **tapi** role assignment Azure RBAC transitif untuk nested group (dokumentasi Azure RBAC) | Kartu nested group menjelaskan keduanya, plus satu soal khusus supaya tidak tertukar di Unit 2 | entra `how-to-manage-groups.md`, azure `role-based-access-control/overview.md` |
| Security questions untuk SSPR dipensiunkan Maret 2027; admin tidak bisa memakainya | Diajarkan sebagai metode yang akan pensiun, tidak pernah jadi jawaban yang disarankan | entra `concept-authentication-security-questions.md` |
| Halaman error group-based licensing Entra dihapus; yang tersisa daftar error di Microsoft 365 admin center (Errors & issues, lalu Reprocess) | Materi memakai istilah dan langkah yang masih berlaku; klaim lama "satu lisensi gagal, semua lisensi group tidak di-assign" tidak dipakai, dan visual `LicenseFlow` disesuaikan | microsoft-365-docs `assign-licenses-to-users.md` |
| Dynamic group: satu group user saja atau device saja; anggota tidak bisa diubah manual; group yang bisa diberi role Entra selalu Assigned | Diajarkan dan diuji | entra `concept-learn-about-groups.md`, `groups-dynamic-membership.md`, `how-to-manage-groups.md` |
| License Administrator hanya mengelola lisensi dan usage location, tidak bisa membuat user atau group | Dipakai untuk soal least privilege | entra `permissions-reference.md` |

Masih bertanda `verify`:
- `az104-f-u01-gbl-license-req` (syarat P1 atau paket seperti Office 365 E3 untuk group-based licensing). Kalimatnya benar di
  versi terakhir halaman Entra sebelum dihapus (Juli 2026), tapi halaman Microsoft 365 yang menggantikannya tidak menyebut
  syarat lisensi. Cek ulang di halaman lisensi Microsoft Entra kalau muncul versi baru.

### Unit 2: Akses ke resource Azure (RBAC) (30 September 2026)

34 fakta, 16 kartu learn, 41 soal (35 examReady), 2 visual (`RoleScopeTree`, `AzureVsEntraRoles`). Semua sumber dari
`azure-docs/articles/role-based-access-control`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Ada lima privileged administrator roles; Role Based Access Control Administrator memberi role tanpa bisa mengatur akses lewat Azure Policy, sedangkan User Access Administrator memegang seluruh `Microsoft.Authorization/*` | Soal least privilege untuk "hanya memberi role" menjawab Role Based Access Control Administrator | `role-assignments-steps.md`, `built-in-roles/privileged.md` |
| NotActions Contributor berisi `Microsoft.Authorization/*/Write` dan `*/Delete` | Diajarkan sebagai alasan Contributor tidak bisa memberi role (dan nanti di Unit 3: tidak bisa mengatur lock) | `built-in-roles/privileged.md` |
| Role assignment Azure transitif untuk nested group | Diajarkan, beda dengan assignment aplikasi di Unit 1 | `overview.md` |
| Perubahan role assignment butuh sampai 10 menit; sign out lalu sign in untuk refresh | Soal troubleshooting AuthorizationFailed | `troubleshooting.md` |
| Deny assignment tidak bisa dibuat langsung, kecuali lewat deny settings di deployment stack | Dipertajam dari "hanya Azure yang membuat" | `deny-assignments.md` |
| Role administrator klasik pensiun penuh Mei 2026; pemegang Service Administrator dan Co-Administrator otomatis diberi Owner | Diajarkan sebagai jebakan soal lama | `includes/classic-administrators-retirement-note.md` |
| Batas role assignment kini 5.000 per subscription (bukan 4.000) dan 500 per management group | Tidak diuji, dicatat untuk referensi | `troubleshoot-limits.md` |
| Global Administrator tidak punya akses Azure secara default; elevate access memberi User Access Administrator di root scope (/) | Diajarkan dan diuji | `rbac-and-directory-admin-roles.md`, `elevate-access-global-admin.md` |

Tidak ada fakta bertanda `verify`.

### Unit 3: Subscription dan governance (30 September 2026)

50 fakta, 19 kartu learn, 50 soal (45 examReady), 1 visual baru (`PolicyFlow`), ditambah `PolicyRbacLock` dan
`ResourceHierarchy` dari AZ-900. Sumber: `azure-docs` (governance/policy, governance/management-groups,
azure-resource-manager/management, cost-management-billing) dan `azure-monitor-docs` (advisor).

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Beberapa assignment dievaluasi sendiri-sendiri; hasilnya "cumulative most restrictive" (satu deny cukup memblokir) | Soal rules dengan contoh persis dari dokumentasi (deny di subscription, audit di resource group) | `concepts/effect-basics.md` |
| Urutan evaluasi effect: disabled, append/modify, deny, audit, manual, auditIfNotExists, denyAction | Diajarkan; deny sebelum audit supaya tidak tercatat dua kali | `concepts/effect-basics.md` |
| denyAction saat ini hanya mendukung DELETE | Soal "tidak boleh dihapus tapi boleh diubah" | `concepts/effect-deny-action.md` |
| Exclusion (notScopes) vs exemption (tetap tercatat Exempted, bisa kedaluwarsa); Exclusions mulai satu level di bawah scope | Diajarkan dan diuji (config, multi, choice) | `concepts/scope.md`, `tutorials/create-and-manage.md` |
| Contributor bisa memicu remediation tapi tidak bisa membuat definition atau assignment; Resource Policy Contributor untuk mengelola policy | Soal least privilege | `overview.md` |
| Lock hanya untuk control plane; Read-only juga memblokir POST (list keys, start VM); Delete lock di satu resource menggagalkan hapus resource group | Diajarkan; soal upload blob menyebut role data yang dibutuhkan supaya tidak ambigu | `lock-resources.md` |
| Owner dan User Access Administrator bisa mengelola lock; Contributor tidak (NotActions Microsoft.Authorization) | Diajarkan dan diuji | `lock-resources.md`, `built-in-roles/privileged.md` |
| Tag Contributor di portal hanya bisa memberi tag ke subscription; untuk resource lewat PowerShell atau REST API | Ditambahkan ke fakta dan penjelasan | `tag-resources.md` |
| Move: region tidak berubah, resource ID berubah, role assignment di resource tidak ikut, Read-only lock memblokir move, resource group dikunci sampai 4 jam tapi resource tetap berjalan | Diajarkan dan diuji | `move-resource-group-and-subscription.md` |
| Budget tidak menghentikan resource; sampai 5 threshold dan 5 email; evaluasi tiap 24 jam; action group untuk scope subscription dan resource group | Diajarkan dan diuji | `tutorial-acm-create-budgets.md` |
| Advisor: lima kategori; rekomendasi cost matikan atau kecilkan VM yang jarang dipakai beserta perkiraan penghematan | Diajarkan | azure-monitor-docs `advisor-overview.md`, `advisor-cost-recommendations.md` |

Dua kontradiksi kecil di dokumentasi yang sengaja dihindari: `lock-resources.md` bilang resource dengan Read-only lock
masih bisa dipindah ke resource group lain, sedangkan `move-resource-group-and-subscription.md` hanya menyebut lock di
resource group dan subscription. Materi hanya mengajarkan bagian yang disepakati keduanya.

Tidak ada fakta bertanda `verify`.

### Unit 4: Virtual network dan subnet (30 September 2026)

33 fakta, 18 kartu learn, 45 soal (41 examReady), 3 visual baru (`VNetAddressPlan`, `PeeringNonTransitive`, `UdrNextHop`)
ditambah `VNetPeering` dari AZ-900. Tipe soal baru yang dipakai: topology (2), config (1), rules (2). Sumber:
`azure-docs/articles/virtual-network` (termasuk `ip-services`) dan `network-watcher`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| 5 alamat dicadangkan per subnet (.0, .1 gateway, .2 dan .3 DNS, broadcast); subnet IPv4 terkecil /29, terbesar /2; IPv6 harus /64 | Diajarkan dengan hitungan /24, /27, /28, /29 | `virtual-networks-faq.md` |
| Subnet di VNet baru bersifat privat untuk API setelah 31 Maret 2026; VM butuh outbound eksplisit (Windows Update dan aktivasi tidak jalan tanpa itu). Default outbound IP milik Microsoft dan bisa berubah | Diajarkan. Klaim "portal lebih dulu" di rencana tidak ada di dokumen, jadi tidak dipakai | `ip-services/default-outbound-access.md` |
| IP privat dynamic tidak dilepas saat VM di-stop atau di-deallocate, hanya saat network interface dihapus, pindah subnet, atau diubah ke static | Soal khusus, karena miskonsepsi ini umum | `ip-services/private-ip-addresses.md` |
| Public IP kini Standard v1 dan v2; Standard selalu static dan tertutup untuk trafik masuk; v2 selalu zone-redundant; zona tidak bisa diubah | Diajarkan | `ip-services/public-ip-addresses.md` |
| Status peering Initiated (baru satu link), Connected, Disconnected (buat ulang kedua link); VNet yang punya peering tidak bisa dipindah; remote gateway hanya di satu peering | Diajarkan, dengan soal fix dari status Initiated | `virtual-networks-faq.md` |
| Gateway transit didukung local dan global peering; nama opsi di portal | Soal topology hub, spoke, dan on-premises | `virtual-network-peering-overview.md`, `virtual-network-manage-peering.md` |
| Satu subnet nol atau satu route table; UDR menang atas BGP dan system route untuk prefix sama; longest prefix match; NVA butuh Enable IP forwarding dan subnet terpisah | Soal config dan dua soal rules dari satu tabel route | `virtual-networks-udr-overview.md` |
| NSG flow logs pensiun 30 September 2027 dan tidak bisa dibuat baru; ganti virtual network flow logs | Diajarkan | `network-watcher/nsg-flow-logs-overview.md` |

Tidak ada fakta bertanda `verify`.

