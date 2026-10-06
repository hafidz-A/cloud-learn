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

## AZ-900: tambahan untuk kisi-kisi 20 Juli 2026 (6 Oktober 2026)

Semua 57 butir kisi-kisi AZ-900 dibawa ke standar di `docs/RENCANA_LULUS_UJIAN.md` bagian 2: setiap butir
punya kartu materi, minimal 8 soal, 6 soal siap ujian, dan 3 soal skenario. Hasilnya 42 fakta baru,
204 soal baru, dan satu lesson "Latihan soal ujian" di akhir setiap unit (144 soal bergaya ujian).

Setiap fakta baru dicocokkan ke kalimat di file Markdown resmi (repo `MicrosoftDocs`), kecuali
`f-u04-dc-choose` dan `f-u04-az-types` (halaman reliability) serta tiga fakta Purview, yang dicocokkan
lewat pencarian terbatas ke learn.microsoft.com karena repo-nya tidak publik. Lapisan defense in depth
kini punya contoh kontrol dari dokumentasi (perimeter: DDoS protection dan firewall; network: subnet dan
NSG; data: enkripsi at rest), bukan hanya urutan lapisannya.

| Unit | Fakta | Sumber (learn.microsoft.com/en-us/...) |
|---|---|---|
| 4 | `f-u04-dc-def` | azure/security/fundamentals/physical-security |
| 4 | `f-u04-dc-security` | azure/security/fundamentals/physical-security |
| 4 | `f-u04-dc-choose` | azure/reliability/availability-zones-overview |
| 4 | `f-u04-az-types` | azure/reliability/availability-zones-overview |
| 4 | `f-u04-rg-metadata` | azure/azure-resource-manager/management/overview |
| 4 | `f-u04-rg-move` | azure/azure-resource-manager/management/overview |
| 4 | `f-u04-sub-trust` | entra/fundamentals/how-subscriptions-associated-directory |
| 4 | `f-u04-mg-root` | azure/governance/management-groups/overview |
| 4 | `f-u04-mg-limit` | azure/governance/management-groups/overview |
| 5 | `f-u05-vm-parts` | azure/virtual-machines/overview |
| 5 | `f-u05-vm-nsg` | azure/virtual-machines/overview |
| 5 | `f-u05-vm-data-disk` | azure/virtual-machines/overview |
| 5 | `f-u05-vm-size` | azure/virtual-machines/overview |
| 7 | `f-u07-sa-types` | azure/storage/common/storage-account-overview |
| 7 | `f-u07-sa-premium` | azure/storage/common/storage-account-overview |
| 7 | `f-u07-sa-type-fixed` | azure/storage/common/storage-account-overview |
| 8 | `f-u08-extid-def` | entra/external-id/external-identities-overview |
| 8 | `f-u08-b2b-guest` | entra/external-id/external-identities-overview |
| 8 | `f-u08-extid-customers` | entra/external-id/external-identities-overview |
| 8 | `f-u08-ca-decisions` | entra/identity/conditional-access/overview |
| 8 | `f-u08-ca-zt` | entra/identity/conditional-access/overview |
| 8 | `f-u08-did-perimeter` | azure/security/fundamentals/network-best-practices |
| 8 | `f-u08-did-network` | azure/security/fundamentals/network-best-practices |
| 8 | `f-u08-did-data` | azure/security/fundamentals/data-encryption-best-practices |
| 9 | `f-u09-calc-plans` | azure/cost-management-billing/costs/pricing-calculator |
| 9 | `f-u09-anomaly` | azure/cost-management-billing/costs/overview-cost-management |
| 9 | `f-u09-budget-scopes` | azure/cost-management-billing/costs/overview-cost-management |
| 9 | `f-u09-tags-no-mg` | azure/azure-resource-manager/management/tag-resources |
| 9 | `f-u09-tags-plaintext` | azure/azure-resource-manager/management/tag-resources |
| 10 | `f-u10-purview-map` | azure/cloud-adoption-framework/data/governance-security-baselines-purview-data-estate-unify-data-platform |
| 10 | `f-u10-purview-labels` | purview/information-protection |
| 10 | `f-u10-purview-dlp` | purview/dlp-learn-about-dlp |
| 11 | `f-u11-portal-resilient` | azure/azure-portal/azure-portal-overview |
| 11 | `f-u11-portal-create` | azure/azure-portal/azure-portal-overview |
| 11 | `f-u11-portal-dashboards` | azure/azure-portal/azure-portal-overview |
| 11 | `f-u11-mobile` | azure/azure-portal/mobile-app/overview |
| 11 | `f-u11-arm-auth` | azure/azure-resource-manager/management/overview |
| 11 | `f-u11-arm-benefits` | azure/azure-resource-manager/management/overview |
| 11 | `f-u11-iac-why` | azure/azure-resource-manager/templates/overview |
| 11 | `f-u11-declarative` | azure/azure-resource-manager/templates/overview |
| 11 | `f-u11-orchestration` | azure/azure-resource-manager/templates/overview |
| 11 | `f-u11-what-if` | azure/azure-resource-manager/templates/overview |

Yang perlu diketahui untuk ujian dan pekerjaan:
- **Zone itu logis.** Zone 1 di satu subscription belum tentu datacenter yang sama dengan zone 1 di
  subscription lain. Customer memilih region dan nomor zone, tidak pernah gedung datacenter.
- **Tipe storage account tidak bisa diubah** setelah dibuat. Premium hanya mendukung LRS atau ZRS.
- **Private endpoint tidak otomatis menutup akses publik**; akses publik harus dimatikan terpisah.
- **Microsoft Entra External ID**: tamu B2B tinggal di directory karyawan, sedangkan aplikasi untuk
  konsumen memakai tenant external terpisah. Azure AD B2C kini berstatus legacy.

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

**Total (30 September 2026):** 15 unit, 548 fakta, 245 kartu materi, 662 soal (597 examReady), ditambah 6 studi kasus
(30 soal) dan 72 tips serta 15 misi unit. Satu fakta masih bertanda `verify` (lisensi group-based licensing di Unit 1, lihat catatan Unit 1). Rincian per unit ada di bawah.

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

### Unit 5: Akses aman ke virtual network (30 September 2026)

33 fakta, 17 kartu learn, 42 soal (36 examReady), 5 visual baru (`NsgRuleTable`, `NsgEvaluationOrder`, `AsgTiers`,
`BastionArchitecture`, `ServiceVsPrivateEndpoint`). Sumber: `azure-docs/articles/virtual-network`, `bastion`,
`private-link`, dan `network-watcher`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Prioritas 100 sampai 4096, berhenti di aturan pertama yang cocok; aturan default 65000, 65001, 65500 untuk masuk dan keluar; tidak bisa dihapus | Diajarkan, dua soal rules | `network-security-groups-overview.md` |
| NSG stateful; menghapus aturan tidak memutus koneksi yang sudah ada | Diajarkan (sering keliru dipahami) | `network-security-groups-overview.md` |
| Masuk: NSG subnet lalu NSG network interface; keluar dibalik; yang ditolak NSG pertama tidak dilihat NSG kedua; Microsoft menyarankan satu lapis saja | Diajarkan, dengan soal rules dan soal fix dari Effective security rules | `network-security-group-how-it-works.md` |
| Service tag regional (Storage.WestUS); VirtualNetwork termasuk peering dan on-premises | Diajarkan | `service-tags-overview.md` |
| ASG: anggota network interface, bisa ikut beberapa ASG, semua anggota di VNet yang sama; pola izinkan lalu tolak karena AllowVNetInBound | Diajarkan, soal config aturan ASG | `application-security-groups.md` |
| Bastion: AzureBastionSubnet /26 atau lebih, VNet dan resource group sama, tanpa resource lain, UDR tidak didukung; public IP Standard static kecuali Developer dan Private-only; tabel lengkap empat SKU; downgrade tidak didukung | Diajarkan, termasuk soal rules pemilihan SKU | `bastion/configuration-settings.md`, `bastion-faq.md`, `bastion-sku-comparison.md` |
| Service endpoint: sumber trafik jadi IP privat, layanan tetap publik, DNS tidak berubah, tidak untuk on-premises | Diajarkan | `virtual-network-service-endpoints-overview.md` |
| Private endpoint: satu subresource per endpoint (blob dan file terpisah), harus Approved, bisa dari peering dan on-premises; private DNS zone privatelink | Diajarkan, soal fix dari hasil nslookup | `private-link/private-endpoint-overview.md`, `private-endpoint-dns.md` |

Tidak ada fakta bertanda `verify`.

### Unit 6: DNS dan load balancing (30 September 2026)

27 fakta, 13 kartu learn, 32 soal (30 examReady), 4 visual baru (`DnsDelegation`, `PrivateDnsAutoReg`,
`LoadBalancerAnatomy`, `HealthProbeBlocked`). Sumber: `azure-docs/articles/dns` dan `load-balancer`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Azure DNS tidak menjual domain; NS dan SOA di apex otomatis dan tidak bisa dihapus; CNAME tidak boleh di apex atau berbagi nama; TTL per record set | Diajarkan dan diuji | `dns-faq.yml`, `dns-zones-records.md` |
| Alias record (A, AAAA, CNAME) menunjuk resource Azure, ikut berubah, mencegah record menggantung, dan bisa di apex | Soal apex ke public IP load balancer | `dns-alias.md` |
| Delegasi: pakai keempat name server Azure di registrar | Soal fix dan order (urutan dipersempit ke tiga langkah yang pasti) | `dns-delegate-domain-azure-dns.md` |
| Auto registration: hanya VM, hanya NIC utama, tanpa PTR, satu zone registrasi per VNet, record dihapus saat VM dihapus atau dihentikan; link tanpa auto registration = resolution saja | Diajarkan persis | `private-dns-autoregistration.md`, `private-dns-virtual-network-links.md` |
| Load Balancer layer 4; SKU Standard dan Gateway, Basic pensiun 30 September 2025; VM di backend pool tidak butuh public IP | Diajarkan | `load-balancer-overview.md`, `components.md` |
| Inbound NAT rule tidak butuh health probe (kalimat eksplisit); versi 2 memetakan rentang port ke seluruh pool | Diajarkan dan diuji | `load-balancer-custom-probe-overview.md`, `inbound-nat-rules.md` |
| Probe dari 168.63.129.16 (service tag AzureLoadBalancer); semua probe down berarti tidak ada flow baru, tapi koneksi TCP yang ada tetap jalan di Standard; probe HTTP langsung down untuk respons selain 200 | Diajarkan, soal fix dari aturan NSG | `load-balancer-custom-probe-overview.md` |
| Metrik Health Probe Status dan Data Path Availability, agregasi Average | Kartu cara mendiagnosis | `load-balancer-standard-diagnostics.md` |

Tidak ada fakta bertanda `verify`.


### Unit 7: Storage account (30 September 2026)

54 fakta, 19 kartu learn, 56 soal (49 examReady), 2 visual baru (`ObjectReplication`, `AccountFailover`) dan
`StorageRedundancy` dari AZ-900. Sumber: `azure-docs/articles/storage/common`, `storage/blobs`, dan
`storage/storage-explorer`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Jenis akun: Standard general-purpose v2 (semua layanan, semua redundancy), Premium block blobs, Premium file shares, Premium page blobs; general-purpose v1 dan Blob Storage lama tidak direkomendasikan | Diajarkan dan diuji | `storage-account-overview.md` (16 Juli 2026) |
| Jenis akun tidak bisa diganti setelah dibuat; upgrade general-purpose v1 ke v2 tidak bisa dibatalkan | Soal pindah ke Premium file shares: akun baru dan salin data | `storage-account-overview.md` |
| File share NFS di Azure Files butuh Premium file shares; akun premium tanpa geo-redundancy | Diajarkan | `storage-account-overview.md`, `storage-redundancy.md` |
| Premium page blobs: halaman overview menulis LRS dan ZRS, tabel di `storage-redundancy.md` hanya LRS | Materi hanya bilang "LRS atau ZRS, tanpa geo-redundancy", tanpa mengklaim ZRS untuk page blob | kedua halaman |
| LRS "tiga salinan": `storage-redundancy.md` (11 Agustus 2026) tidak lagi menyebut jumlah salinan, tapi `storage-disaster-recovery-guidance.md` masih menulis "three copies ... within a single datacenter" | Fakta LRS mengutip halaman disaster recovery | `storage-disaster-recovery-guidance.md` |
| ZRS sekarang "three or more" availability zone; GRS dan GZRS 16 nines; region kedua tidak bisa diubah; salinan ke region kedua asinkron | Diajarkan persis | `storage-redundancy.md` |
| Region kedua hanya bisa dibaca dengan RA-GRS atau RA-GZRS (endpoint `-secondary`); Azure Files tidak mendukung keduanya | Diajarkan, soal jebakan | `storage-redundancy.md` |
| Tier Archive hanya didukung di LRS, GRS, dan RA-GRS, tidak di ZRS, GZRS, atau RA-GZRS | Dipakai di soal place dan yesno | `storage-redundancy.md` |
| Mengubah geo-replication langsung; mengubah zone butuh conversion | Diajarkan | `redundancy-migration.md` |
| Planned failover: region bertukar, geo tetap, tanpa data hilang. Unplanned: akun jadi LRS, salinan di region lama dihapus, data setelah Last Sync Time bisa hilang, replikasi ulang berbayar. Microsoft-managed failover jangan diandalkan | Diajarkan, visual `AccountFailover` | `storage-disaster-recovery-guidance.md` |
| Object replication butuh versioning di kedua akun dan change feed di akun sumber; hanya general-purpose v2 dan premium block blob; hanya block blob; tanpa hierarchical namespace; versioning tidak bisa dimatikan selama ada policy | Diajarkan, soal fix | `object-replication-overview.md` (10 September 2026) |
| Object replication dan customer-managed failover: dua kalimat eksplisit bilang tidak didukung untuk akun sumber maupun tujuan, tapi tabel fitur di halaman disaster recovery menulis "Supported" untuk unplanned | Materi mengikuti kalimat eksplisit ("tidak didukung") dan tidak menguji beda planned dan unplanned | `object-replication-overview.md`, `storage-disaster-recovery-guidance.md` |
| Policy dibuat di akun tujuan lalu dikaitkan ke sumber dengan policy ID yang sama; maksimal dua akun tujuan; default hanya blob baru; container tujuan menolak tulis dengan 409 | Diajarkan dan diuji | `object-replication-overview.md` |
| Enkripsi AES 256-bit selalu aktif, tidak bisa dimatikan, gratis, termasuk Archive dan region kedua; default Microsoft-managed keys | Diajarkan | `storage-service-encryption.md` (11 Agustus 2026) |
| Customer-managed key di Key Vault atau Managed HSM, pelanggan yang merotasi; soft delete dan purge protection wajib; izin get, wrapkey, unwrapkey; akun baru wajib user-assigned managed identity; versi dicek sekali sehari; kunci dinonaktifkan berarti 403 | Diajarkan, soal fix purge protection | `customer-managed-keys-overview.md` (18 Agustus 2026) |
| Infrastructure encryption hanya saat akun dibuat | Soal akun lama: buat akun baru | `infrastructure-encryption-enable.md` |
| AzCopy: Owner tidak otomatis punya akses data; upload butuh Storage Blob Data Contributor atau Owner, download Storage Blob Data Reader; role bisa butuh sampai lima menit | Soal fix error 403 | `storage-use-azcopy-authorize-user-identity.md` (8 Januari 2026) |
| `azcopy copy ... --recursive` untuk folder; antar akun memakai API server-to-server; `azcopy sync` membandingkan nama dan waktu modifikasi, `--delete-destination` untuk menghapus | Soal shell dan choice | `storage-use-azcopy-blobs-upload.md`, `storage-use-azcopy-blobs-copy.md`, `storage-use-azcopy-blobs-synchronize.md` |
| Storage Explorer: cara terhubung (akun Azure, Microsoft Entra ID, account name dan key, SAS, emulator), Microsoft Entra direkomendasikan, account key akses tanpa batas. Halaman sumbernya lama (2019 dan 2020) | Hanya fakta dasar yang stabil yang dipakai | `vs-azure-tools-storage-manage-with-storage-explorer.md`, `storage-explorer-security.md` |

Tidak ada fakta bertanda `verify`.

### Unit 8: Akses ke storage (30 September 2026)

43 fakta, 13 kartu learn, 44 soal (40 examReady), 3 visual baru (`SasTypes`, `StoredAccessPolicy`,
`FilesPermissionLayers`). Sumber: `azure-docs/articles/storage/common`, `storage/blobs`, dan `storage/files`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Default storage account menerima semua jaringan; pilihan Public network access sekarang Enabled from all networks, Enabled from selected networks, Disabled (hanya private endpoint), dan Secured by perimeter | Soal config memakai nama pilihan persis | `storage-network-security.md`, `storage-network-security-set-default-access.md` (25 Agustus 2025) |
| Firewall tidak memengaruhi private endpoint; sumber yang diizinkan tetap harus lolos otorisasi; firewall hanya untuk data plane | Diajarkan, soal yesno dari rumah | `storage-network-security-overview.md`, `storage-network-security-limitations.md` |
| Virtual network rule butuh service endpoint Microsoft.Storage (portal membuatnya otomatis, CLI tidak) | Soal fix | `storage-network-security.md` |
| IP rule hanya IPv4 publik, tanpa rentang privat, dan tidak berpengaruh untuk sumber di region yang sama | Soal choice kantor dan VM satu region | `storage-network-security-limitations.md` |
| Pengecualian layanan tepercaya (Azure Backup, Azure Monitor, Event Grid, Azure Site Recovery, dan lainnya) | Diajarkan | `storage-network-security-trusted-azure-services.md` |
| Tiga jenis SAS: user delegation (Microsoft Entra; Blob, Queue, Table, Files; disarankan), service (account key, satu layanan), account (account key, satu atau lebih layanan). SAS tidak dicatat dan pembuatannya tidak bisa diaudit | Diajarkan persis, fakta rencana terkonfirmasi | `storage-sas-overview.md` (27 Februari 2026) |
| User delegation SAS paling lama 7 hari (batas user delegation key). Halaman sumbernya dari 2019, tapi batas ini masih berlaku di referensi REST | Diajarkan | `storage-blob-user-delegation-sas-create-cli.md` |
| Stored access policy hanya untuk service SAS, bisa mengubah atau mencabut SAS yang sudah dibagikan, maksimal lima per container | Fakta rencana terkonfirmasi, soal fix link bocor | `storage-sas-overview.md`, `storage-stored-access-policy-define-dotnet.md` |
| Rotasi key tanpa downtime: aplikasi ke key2, buat ulang key1, aplikasi ke key1 baru, buat ulang key2. Membuat ulang key membatalkan service SAS dan account SAS dari key itu; user delegation SAS tidak terpengaruh | Soal order dan choice | `storage-account-keys-manage.md` (11 Agustus 2026) |
| Melihat key: Owner, Contributor, Storage Account Key Operator Service Role; Reader tidak | Soal choice role | `storage-account-keys-manage.md` |
| Allow storage account key access Disabled menolak Shared Key, termasuk service SAS dan account SAS ke Blob Storage; user delegation SAS tetap diterima | Diajarkan | `shared-key-authorization-prevent.md` (11 Agustus 2026) |
| Azure Files: tiga identity source (AD DS, Microsoft Entra Domain Services, Microsoft Entra Kerberos), satu per akun, hanya SMB. **Microsoft Entra Kerberos kini juga untuk identitas cloud-only**, tidak untuk user Linux | Diajarkan; soal laptop Microsoft Entra joined tanpa domain controller | `storage-files-active-directory-overview.md` (18 September 2026) |
| Izin share memakai RBAC (SMB Share Reader, Contributor, Elevated Contributor), izin folder dan file memakai Windows ACL, dan yang paling ketat yang berlaku; perubahan izin share biasanya berlaku dalam 30 menit | Diajarkan, visual `FilesPermissionLayers` | `storage-files-identity-assign-share-level-permissions.md`, `storage-files-identity-configure-file-level-permissions.md` |

Tidak ada fakta bertanda `verify`.

### Unit 9: Azure Files dan Blob Storage (30 September 2026)

41 fakta, 15 kartu learn, 44 soal (42 examReady), 2 visual baru (`BlobLifecycleTimeline`, `SoftDeleteVsVersioning`)
dan `BlobTiers` dari AZ-900. Sumber: `azure-docs/articles/storage/blobs`, `storage/files`, dan `includes`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Akses anonim tidak pernah diizinkan secara default; level container Private (default), Blob (baca tanpa list), Container (baca dan list); pengaturan akun Allow Blob anonymous access mengalahkan level container | Soal rencana (baca publik tanpa list = Blob) terkonfirmasi | `anonymous-read-access-configure.md` (20 Agustus 2026) |
| **Azure Files kini memakai istilah media tier SSD (premium) dan HDD (standard)**; NFS hanya di SSD; share tidak bisa dipindah media tier langsung; HDD pay-as-you-go punya tier transaction optimized, hot, cool dengan hardware sama; migrasi dimulai di transaction optimized; provisioned v2 disarankan untuk share baru | Kartu tier file share memakai istilah baru | `storage-files-planning.md` (17 Agustus 2026), `understanding-billing.md`, include `storage-files-tiers-overview.md` |
| Tier blob Hot, Cool (30 hari), Cold (90), Archive (180, offline); early deletion proporsional; tier hanya untuk block blob; default tier Hot/Cool/Cold, tidak bisa Archive | Diajarkan dan diuji | `access-tiers-overview.md` (2 April 2026) |
| **Smart tier** (baru): memindahkan blob antara Hot, Cool, Cold otomatis; GA untuk akun zone-redundant (ZRS, GZRS, RA-GZRS), diaktifkan sebagai default access tier | Satu kartu dan satu soal | `access-tiers-smart.md` (13 April 2026) |
| Rehydrate lewat Set Blob Tier atau Copy Blob ke nama baru (copy menghindari early deletion); Standard sampai 15 jam, High bisa kurang dari 1 jam untuk objek di bawah 10 GB; Standard bisa dinaikkan ke High, tidak sebaliknya | Soal fix rencana terkonfirmasi | `archive-rehydrate-overview.md` (31 Agustus 2026) |
| Lifecycle: jalan sekali sehari, perubahan sampai 24 jam; beberapa action berlaku = yang paling murah dijalankan (delete, lalu archive, lalu cool); tidak bisa rehydrate; tierToArchive tidak didukung di ZRS, GZRS, RA-GZRS; `daysAfterLastTierChangeGreaterThan` mencegah arsip ulang; kondisi akses terakhir butuh access time tracking | Soal config rencana, soal template JSON, soal fix arsip ulang | `lifecycle-management-overview.md`, `lifecycle-management-policy-structure.md`, `lifecycle-management-policy-configure.md` |
| Blob soft delete 1–365 hari; versioning membuat versi di setiap tulis dan tidak tersedia dengan hierarchical namespace; Microsoft menyarankan keduanya untuk data penting | Diajarkan | `soft-delete-blob-overview.md`, `versioning-overview.md`, `soft-delete-vs-versioning-options.md` |
| Halaman perbandingan menulis soft delete dan versioning "disabled by default", padahal wizard portal biasanya mencentang soft delete | Materi tidak mengklaim default untuk blob soft delete | `soft-delete-vs-versioning-options.md` |
| Container soft delete 1–365 hari, default 7; hanya container utuh; harus dipulihkan dengan nama asli | Fakta rencana terkonfirmasi | `soft-delete-container-overview.md` |
| Share snapshot read-only, incremental, per share tapi dipulihkan per file, maksimal 200 per share, disimpan sampai 10 tahun; menghapus share ikut menghapus snapshot; langkah Restore di portal | Soal order rencana | `storage-snapshots-files.md` (16 Juli 2026) |
| File share soft delete hanya level share, 1–365 hari default 7, aktif default di akun baru | Diajarkan | `storage-files-prevent-file-share-deletion.md` (20 Juli 2026) |

Tidak ada fakta bertanda `verify`.

### Unit 10: ARM template dan Bicep (30 September 2026)

31 fakta, 12 kartu learn, 36 soal (33 examReady), 2 visual baru (`ArmStructure`, `IncrementalVsComplete`).
Sumber: `azure-docs/articles/azure-resource-manager/templates`, `azure-resource-manager/bicep`, dan `includes`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Bagian wajib ARM template: $schema, contentVersion, resources; parameters, variables, functions, outputs opsional; batas 256 parameter dan 64 output; secureString untuk password | Diajarkan, soal template membaca storage account dan virtual network | `syntax.md` (13 Januari 2026), `parameters.md`, `outputs.md` |
| Bicep: kemampuan sama dengan ARM template, deklaratif (urutan elemen tidak berpengaruh), otomatis diubah ke JSON saat deploy; targetScope default resourceGroup; decorator @allowed, @minLength, @secure(); file parameter `.bicepparam` dengan `using` | Diajarkan, soal template memilih baris yang salah | `file.md` (3 Juli 2026), `parameters.md`, `parameter-files.md` |
| Empat scope deployment dan perintahnya (`az deployment group/sub/mg/tenant create`); resource group dibuat dari level subscription | Soal choice dan shell | `deploy-cli.md` (27 Mei 2026), `deploy-to-subscription.md` |
| Mode default incremental; complete menghapus yang tidak ada di template; di incremental properti yang tidak ditulis kembali ke default; portal dan deployment subscription tidak mendukung complete; resource group yang dikunci tidak dihapus; mengubah location atau type resource lama gagal | Semua fakta rencana terkonfirmasi kata per kata | `deployment-modes.md` (26 Juni 2026) |
| Mode complete "not recommended" dan "will be gradually deprecated"; hapus lewat template dengan deployment stacks | Diajarkan sebagai catatan, dengan soal pilihan cara yang disarankan | `deployment-modes.md`, `deployment-stacks.md` |
| What-if: pratinjau tanpa perubahan (`az deployment group what-if`, `-WhatIf`), jenis perubahan Create, Delete (hanya complete), Modify, NoChange, Ignore | Soal match | `deploy-what-if.md` (26 Juni 2026) |
| Export dari resource group (kondisi saat ini, nilai hard-coded) vs dari riwayat deployment (template asli, hanya JSON); batas 200 resource; password bisa hilang; portal bisa export langsung ke Bicep | Diajarkan dan diuji | `export-template-portal.md`, include `resource-manager-export-template-*.md`, `export-bicep-portal.md` |
| `az bicep decompile --file main.json` membuat main.bicep (`--force` untuk menimpa), hasilnya tidak dijamin sempurna; `az bicep build` ke arah sebaliknya | Soal shell rencana | `decompile.md` (14 Juli 2026), `bicep-cli.md` |

Tidak ada fakta bertanda `verify`.

### Unit 11: Virtual machine (30 September 2026)

40 fakta, 16 kartu learn, 49 soal (44 examReady), 2 visual baru (`VmResizeFlow`, `FaultUpdateDomains`).
Sumber: `azure-compute-docs/articles/virtual-machines`, `virtual-machine-scale-sets`, dan
`azure-docs/articles/azure-resource-manager/management`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Keluarga ukuran: general purpose (A, B burstable, D), compute optimized (F), memory optimized (E), storage optimized (L), GPU (N); ukuran dengan huruf s untuk Premium Storage | Soal match rencana | `sizes/overview.md` (24 September 2026), `sizes/resize-vm.md` |
| Resize VM yang berjalan selalu restart; ukuran yang tidak ada di cluster saat ini butuh deallocate; di availability set semua VM di-deallocate; resize gagal tetap menampilkan ukuran yang diminta | Fakta rencana terkonfirmasi, soal fix | `sizes/resize-vm.md` (10 November 2025) |
| Halaman resize menulis deallocate "melepas dynamic IP address". Di Unit 4, private IP dinamis terbukti tidak dilepas saat deallocate; kalimat ini merujuk public IP dinamis (SKU Basic yang sudah pensiun) | Tidak diajarkan di Unit 11 supaya tidak bertentangan | `sizes/resize-vm.md`, `virtual-network` (Unit 4) |
| Temporary disk bukan managed disk, data bisa hilang saat maintenance, redeploy, atau stop; drive D di Windows; tidak terenkripsi kecuali ukuran v5 ke atas, encryption at host, atau ADE semua volume | Diajarkan, soal data hilang di drive D | `managed-disks-overview.md` (20 Agustus 2026) |
| Lima jenis managed disk; Ultra Disk dan Premium SSD v2 tidak bisa jadi OS disk; Standard HDD sebagai OS disk pensiun 8 September 2028 | Diajarkan | `disks-types.md` (15 September 2026) |
| Server-side encryption tidak mengenkripsi temp disk dan cache; encryption at host mengenkripsinya tanpa memakai CPU VM; ADE pensiun 15 September 2028 | Fakta rencana terkonfirmasi | `disk-encryption-overview.md` (11 September 2026) |
| Encryption at host: daftarkan fitur EncryptionAtHost; tidak bisa di VM yang pernah memakai ADE; VM lama harus di-deallocate untuk mengaktifkan dan mematikannya | Soal fix dan order | `disk-encryption.md`, `disks-enable-host-based-encryption-portal.md`, include restrictions |
| Availability set: maksimal 3 fault domain dan 20 update domain, tidak bisa diubah; VM keenam masuk update domain yang sama dengan VM pertama (dengan 5 update domain); SLA 99,95%; tidak melindungi dari kegagalan aplikasi. Microsoft menyarankan scale set Flexible | Diajarkan. **Default 5 update domain dan aturan "VM hanya bisa masuk availability set saat dibuat" tidak tertulis di halaman lokal**, jadi tidak diklaim | `availability-set-overview.md` |
| Pindah resource group atau subscription: region tetap, resource ID berubah, kedua resource group dikunci sampai 4 jam tanpa downtime, read-only lock memblokir, provider harus terdaftar, tenant harus sama; VM di availability set tidak bisa dipindah sendirian; VM dengan ADE harus dimatikan enkripsinya untuk pindah subscription; pindah region lewat Azure Resource Mover | Soal sort rencana | `move-resource-group-and-subscription.md`, `move-limitations/virtual-machines-move-limitations.md`, `move-resources-overview.md` |
| Scale set: Flexible disarankan, mode tidak bisa diubah; upgrade policy Automatic, Manual, Rolling (Flexible butuh Application Health Extension); aturan autoscale dan batas instance; scale-in default: seimbangkan zone, fault domain, lalu instance ID tertinggi | Soal config rencana (CPU di atas 70%) | `virtual-machine-scale-sets-*.md` (19 Mei 2026) |

Tidak ada fakta bertanda `verify`.

### Unit 12: Container (30 September 2026)

25 fakta, 12 kartu learn, 33 soal (30 examReady), 3 visual baru (`AciRestartPolicy`, `ContainerAppsScale`,
`ContainerOptions`). Sumber: `azure-management-docs/articles/container-registry`,
`azure-compute-docs/articles/container-instances`, dan `azure-docs/articles/container-apps`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| ACR tiga tier; geo-replication dan private endpoint hanya Premium; zone redundancy default di semua tier; ganti tier tanpa downtime (turun dari Premium: hapus geo-replication dulu) | Fakta rencana terkonfirmasi | `container-registry-skus.md` (25 Maret 2026), `container-registry-geo-replication.md` |
| `az acr login` memakai identitas Microsoft Entra, token 3 jam; admin user nonaktif default dan punya izin penuh | Diajarkan | `container-registry-authentication.md` (2 Februari 2026) |
| **Role ACR kini tergantung mode izin registry**: mode RBAC biasa memakai AcrPull dan AcrPush; mode dengan izin per repository (ABAC) memakai Container Registry Repository Reader, Writer, dan Contributor | Materi mengajarkan AcrPull/AcrPush dan menyebut padanan barunya | `container-registry-rbac-built-in-roles-overview.md` |
| `az acr build` membangun image di ACR dan mendorongnya secara default | Satu kartu | `container-registry-tasks-overview.md` |
| Container group mirip pod: satu host, berbagi lifecycle, resource, jaringan, volume; multi-container hanya Linux; resource group = jumlah request; limit ≥ request dan ≤ total group; maks. 60 container | Soal choice dan yesno | `container-instances-container-groups.md`, `container-instances-resource-and-quota-limits.md` |
| Restart policy Always (default), Never, OnFailure; Never hanya menjamin tidak restart setelah exit 0; IP bisa berubah saat restart; container group di virtual network wajib keluar lewat NAT gateway | Fakta rencana terkonfirmasi, soal config dan shell | `container-instances-restart-policy.md` (25 Juli 2026), `container-instances-overview.md` |
| Container Apps: replica default min 0 max 10 (sampai 1.000); rule HTTP, TCP, custom; tanpa biaya pemakaian di 0 replica, tarif idle untuk replica menganggur; min 1 untuk selalu jalan; jobs tanpa rule HTTP; tanpa ingress dan tanpa rule custom, app di 0 tidak bisa hidup lagi | Fakta rencana terkonfirmasi, soal fix | `scale-app.md` (19 Mei 2026) |
| Revision tidak bisa diubah, mode Single (default) dan Multiple (bagi trafik); ingress external vs internal tanpa load balancer tambahan | Diajarkan | `revisions.md`, `ingress-overview.md` |

Tidak ada fakta bertanda `verify`.

### Unit 13: Azure App Service (30 September 2026)

22 fakta, 15 kartu learn, 40 soal (37 examReady), 3 visual baru (`AppServiceTierLadder`,
`VnetIntegrationVsPrivateEndpoint`, `SlotSwap`). Sumber: `azure-docs/articles/app-service` dan
`includes/azure-websites-limits.md`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Plan menentukan OS, region, jumlah dan ukuran instance, tier; app di satu plan berbagi instance dan scale bersama; tier dedicated ditagih per instance | Diajarkan | `overview-hosting-plans.md` (24 Agustus 2026) |
| Tabel batas tier: custom domain mulai Shared; TLS binding, managed certificate, backup, VNet integration, private endpoint mulai Basic; autoscale mulai Standard; slot Standard 5, Premium dan Isolated 20; scale out Basic 3, Standard 10, Premium 30 (Premium v1: 20), Isolated 100 | Soal sort rencana; semua angka rencana terkonfirmasi | `includes/azure-websites-limits.md`, `manage-scale-up.md` |
| Tiga cara scale out: manual (Basic+), autoscale aturan dan jadwal (Standard+), automatic scaling trafik HTTP (Premium v2–v4) dengan instance prewarmed default 1 | Soal config jadwal jam kerja, soal match | `manage-automatic-scaling.md` (16 April 2026) |
| Custom domain butuh tier berbayar (bukan F1); A untuk root, CNAME untuk subdomain; TXT `asuid`/`asuid.<sub>`; TXT untuk CNAME "highly recommended" demi mencegah subdomain takeover | Fakta rencana terkonfirmasi, soal order | `app-service-web-tutorial-custom-domain.md` (7 April 2026) |
| Managed certificate gratis, diperbarui otomatis, butuh Basic+, tanpa wildcard | Diajarkan | `configure-ssl-certificate.md` (4 Juni 2026) |
| Backup di Basic, Standard, Premium, Isolated; di Basic hanya slot production; automatic backup tanpa storage account, simpan 30 hari; custom backup butuh storage account, maksimal 10 GB. Backup linked database berhenti didukung mulai 31 Maret 2028 | Diajarkan (catatan 2028 tidak diuji) | `manage-backup.md` |
| VNet integration Basic+ dan hanya trafik keluar; private endpoint hanya trafik masuk; access restriction berprioritas dengan deny all implisit dan HTTP 403 | Soal sort rencana dan soal fix | `overview-vnet-integration.md`, `networking-features.md`, `app-service-ip-restrictions.md` |
| Slot butuh Standard, Premium, Isolated; tanpa biaya tambahan; swap tanpa downtime dan bisa diulang; swap with preview; app setting dan connection string ikut swap kecuali ditandai slot setting; custom domain, TLS, scale, managed identity, VNet integration tetap di slot | Soal fix rencana (database staging) | `deploy-staging-slots.md`, include `app-service-deployment-slots-settings.md` |

Tidak ada fakta bertanda `verify`.

### Unit 14: Azure Monitor (30 September 2026)

28 fakta, 16 kartu learn, 42 soal (39 examReady), 2 visual baru (`KqlPipe`, `AlertFlow`) dan `MonitorPipeline`
dari AZ-900. Rencana belum punya daftar "fakta wajib akurat" untuk unit ini; semua fakta ditulis dari sumber
berikut. Sumber: `azure-monitor-docs/articles/azure-monitor`, `azure-docs/articles/network-watcher`, dan
`azure-docs/articles/storage/common`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Platform metrics otomatis tanpa konfigurasi, umumnya tiap menit; disimpan 93 hari; satu grafik maks. 30 hari | Diajarkan | `metrics/data-platform-metrics.md` (21 Agustus 2026) |
| Agregasi Sum, Count, Average, Min, Max; granularity lebih besar menghaluskan lonjakan dan mengurangi alert palsu | Soal rencana (Max untuk lonjakan sesaat) | `metrics/metrics-aggregation-explained.md` (7 Agustus 2026) |
| Activity log: operasi control plane, otomatis, gratis, 90 hari; lebih lama lewat diagnostic setting | Diajarkan | `fundamentals/activity-log.md` (4 Mei 2026) |
| Resource logs tidak otomatis; diagnostic setting per resource; tujuan workspace, storage, Event Hubs, partner; tujuan harus sudah ada; storage dan Event Hubs satu region dengan resource regional; maks. 5 setting per resource, satu tujuan per jenis | Soal fix rencana (log tidak sampai ke workspace) | `data-collection/diagnostic-settings.md` (31 Maret 2026) |
| Log Analytics workspace: query KQL, retensi sampai 12 tahun, bayar data masuk dan masa simpan | Diajarkan | `logs/log-analytics-workspace-overview.md` |
| KQL: tabel dulu, pipe meneruskan hasil, take tanpa urutan, sort/top default descending, where, `ago()`, summarize count() by, `bin(TimeGenerated, 1h)`, project | Dua soal KQL (rencana: error per jam) | `logs/get-started-queries.md` (29 April 2026) |
| Alert rule (resource, sinyal, kondisi), alert disimpan 30 hari; jenis metric, log search, activity log (Service Health, Resource Health); action group untuk notifikasi dan otomasi | Diajarkan | `alerts/alerts-overview.md` (8 Juli 2026), `alerts/action-groups.md` |
| Alert processing rule: suppress atau tambah action group; scope resource, resource group, subscription; jadwal Always, waktu tertentu, Recurring; lebih baik dari mematikan alert rule untuk maintenance; alert yang ditekan tetap tercatat; suppress menang; tidak memengaruhi Service Health | Soal config rencana (maintenance Minggu 01:00–05:00) | `alerts/alerts-processing-rules.md` (24 April 2026) |
| Monitoring VM: host metrics otomatis; data tamu butuh Azure Monitor Agent dan data collection rule; skala besar lewat Azure Policy. Istilah "VM insights" kini bagian dari "enhanced monitoring" | Materi memakai istilah baru | `vm/vm-enable-monitoring.md` (25 Agustus 2026), `vm/monitor-vm.md` |
| Storage insights tanpa konfigurasi; Network insights dan Topology | Diajarkan | `storage-insights-overview.md`, `visualize/insights-overview.md`, `network-watcher-overview.md` |
| Connection monitor: pemantauan terus-menerus latensi dan packet loss, endpoint sumber butuh Network Watcher extension; IP flow verify, Next hop, Connection troubleshoot (satu waktu), Packet capture | Soal rencana (latensi VM ke on-premises) | `connection-monitor-overview.md`, `network-watcher-overview.md` (25 Februari 2026) |
| NSG flow logs pensiun 30 September 2027, tidak bisa dibuat baru; ganti ke virtual network flow logs | Fakta rencana terkonfirmasi | include `network-watcher-nsg-flow-logs-retirement.md`, `vnet-flow-logs-overview.md` |

Tidak ada fakta bertanda `verify`.

### Unit 15: Backup dan pemulihan (30 September 2026)

39 fakta, 22 kartu learn, 55 soal (52 examReady), 2 visual baru (`VaultTypes`, `SiteRecoveryFlow`). Fakta wajib
dari rencana (daftar workload tiap vault) terkonfirmasi. Sumber: `azure-docs/articles/backup` dan
`azure-docs/articles/site-recovery`.

| Temuan | Dampak ke materi | Sumber |
|---|---|---|
| Recovery Services vault: VM Azure, SQL di VM, Azure Files, SAP HANA di VM, agen MARS, MABS, DPM; juga dipakai Site Recovery. Backup vault: Azure Disks, Azure Blobs, PostgreSQL, Kubernetes | Fakta rencana terkonfirmasi; soal sort rencana | `backup-azure-backup-faq.yml` (17 Maret 2026), `backup-azure-recovery-services-vault-overview.md` |
| FAQ masih menulis Kubernetes "(preview)", sementara halaman immutable vault (9 September 2026) mendaftar AKS sebagai workload Backup vault yang didukung | Materi hanya menyebut "Kubernetes", tanpa status preview | `backup-azure-backup-faq.yml`, `backup-azure-immutable-vault-concept.md` |
| Backup dalam satu region: vault harus satu region dengan VM; VM dan vault boleh beda subscription dalam satu tenant; vault bisa pindah resource group atau subscription, tidak pindah region; data tidak bisa dipindah antar vault; maks. 100 VM per policy, 1.000 VM per vault | Diajarkan, termasuk kontras dengan Site Recovery | `backup-support-matrix.md` (25 Maret 2026), `backup-azure-arm-vms-prepare.md` |
| Replikasi vault default GRS, pilihan LRS dan ZRS, hanya bisa diubah sebelum backup dikonfigurasi. Cross Region Restore hanya untuk vault GRS, restore ke paired region tanpa menunggu bencana dinyatakan, mendukung Create a VM dan Restore disk, tidak Replace existing | Diajarkan | `backup-create-recovery-services-vault.md` (10 Desember 2025), `backup-azure-arm-restore-vms.md` (27 Mei 2026) |
| Soft delete: 14 hari tambahan tanpa biaya, bisa diatur 14–180 hari; vault dengan item soft delete tidak bisa dihapus | Soal fix (vault gagal dihapus) | `backup-azure-recovery-services-vault-overview.md` (10 November 2025), `backup-azure-enhanced-soft-delete-configure-manage.md`, `backup-azure-delete-vault.md` |
| Immutable vault memblokir hapus data sebelum kedaluwarsa dan pengurangan retensi; tambah retensi dan stop protection sambil menyimpan data tetap boleh; locked tidak bisa dibatalkan | Diajarkan | `backup-azure-immutable-vault-concept.md` (9 September 2026) |
| Policy default VM: sekali sehari, simpan 30 hari, snapshot instant restore 2 hari. Standard: jadwal harian atau mingguan, snapshot 1–5 hari. Enhanced: tiap 4/6/8/12/24 jam, snapshot 1–30 hari (default 7), Ultra Disk dan Premium SSD v2 hanya di Enhanced, tidak bisa kembali ke Standard | Soal config rencana (harian 30 hari + mingguan 12 minggu) | `backup-azure-arm-vms-prepare.md`, `backup-instant-restore-capability.md` (1 April 2026), `backup-azure-vms-enhanced-policy.md` (27 Februari 2026) |
| Agen MARS: file, folder, system state Windows, sampai tiga kali sehari, Linux tidak didukung; MABS dan DPM menyimpan lokal lalu ke vault | Diajarkan | `backup-support-matrix.md` |
| Pilihan restore: Create a new VM (region sama), Restore disk (plus template), Replace existing (VM harus masih ada, snapshot dulu). File Recovery: script (executable Windows, Python Linux), mount volume, Unmount disks, berlaku 12 jam, VM terenkripsi tidak didukung | Soal rencana (restore satu file tanpa restore VM) | `backup-azure-arm-restore-vms.md`, `backup-azure-restore-files-from-vm.md` (17 Maret 2026) |
| Azure Files backup: tier snapshot dan vaulted; replikasi vault hanya berlaku untuk vaulted | Diajarkan | `azure-file-share-backup-overview.md` (17 Februari 2026) |
| Site Recovery: vault di region mana pun kecuali region sumber; Mobility service extension; cache storage account di region sumber; hanya koneksi keluar; crash-consistent tiap 5 menit (tetap); app-consistent default mati; retensi default satu hari | Diajarkan | `azure-to-azure-architecture.md` (11 September 2026), `azure-to-azure-tutorial-enable-replication.md` (17 September 2026) |
| Test failover ke VNet non-produksi lalu Cleanup; Latest processed (RTO rendah), Latest (RPO terendah), Latest app-consistent, Custom; Commit menghapus recovery point lain; Re-protect lalu failback; recovery plan maks. 100 instance | Soal order rencana (test failover, failover, commit, re-protect, failback) | `azure-to-azure-tutorial-dr-drill.md`, `azure-to-azure-tutorial-failover-failback.md` (11 September 2026), `recovery-plan-overview.md` |
| Backup center kini hanya legacy: penggantinya Azure Business Continuity Center, yang di dokumentasi 2026 disebut **Resiliency** | Materi memakai "Resiliency" dan menyebut dua nama lamanya, karena soal ujian bisa memakai nama lama | `backup-center-overview.md` (25 Agustus 2026), include `backup-center-deprecation.md`, `monitoring-and-alerts-overview.md` |
| Alert bawaan Azure Monitor: security alert (hapus data, soft delete dimatikan) tidak bisa dimatikan; alert job gagal aktif default dan bisa dimatikan; notifikasi lewat alert processing rule dan action group; classic alerts dihentikan 31 Maret 2026 | Soal rencana (email saat job gagal) | `monitoring-and-alerts-overview.md` (30 Januari 2026) |
| Backup Reports: Log Analytics dan workbooks, diagnostic setting vault, data pertama sampai 24 jam, workspace boleh beda region dan subscription, retensi default 30 hari | Soal rencana (lihat semua job gagal minggu ini) memakai tampilan jobs di Resiliency; Backup Reports untuk tren jangka panjang | `configure-reports.md` (26 November 2025) |
| Role Backup Contributor, Backup Operator (tanpa hapus backup dan kelola policy, tetap bisa restore), Backup Reader | Diajarkan | `backup-rbac-rs-vault.md` (30 April 2026) |

Tidak ada fakta bertanda `verify`. `SAP` dan `HANA` ditambahkan ke daftar nama merek yang bukan singkatan; MARS,
MABS, DPM, RPO, dan RTO ditambahkan ke glosarium.

### Studi kasus AZ-104 (30 September 2026)

Enam studi kasus, masing-masing 5 soal (30 soal, semua examReady), di `src/content/az104/casestudies/`.
Perusahaannya fiktif (nama-nama yang juga dipakai Microsoft di dokumentasinya). Setiap soal hanya memakai
fakta yang sudah diverifikasi di unit 1–15 lewat `requires`, dan validator (`validateCaseStudies`) menolak
soal yang fakta-nya tidak ada atau tidak diajarkan kartu materi mana pun. Jadi tidak ada klaim baru di luar
tabel unit di atas.

| Studi kasus | Domain soal | Topik |
|---|---|---|
| Contoso, Ltd. | 1, 1, 1, 3, 2 | Dynamic group, Virtual Machine Contributor, policy deny di management group, RA-GZRS, gateway transit |
| Fabrikam, Inc. | 3, 3, 3, 5, 3 | Lifecycle management, identity source Azure Files, soft delete + versioning, Enhanced policy, stored access policy |
| Litware, Inc. | 4, 4, 4, 4, 4 | Slot setting, ACI OnFailure, ACR Premium untuk geo-replication, resize di availability set, autoscale Standard |
| A. Datum Corporation | 2, 2, 2, 2, 2 | AzureBastionSubnet /26, link private DNS tanpa auto registration, UDR ke NVA + IP forwarding, ASG, private endpoint |
| Tailspin Toys | 1, 1, 5, 5, 5 | Budget forecast, policy tag inheritance + remediation, Azure Monitor Agent + DCR, alert processing rule, retensi activity log dan Delete lock |
| Woodgrove Bank | 5, 5, 5, 1, 5 | Vault Site Recovery di region target, recovery plan + test failover, File Recovery, guest invite settings, immutable vault |

Keputusan desain halaman Ujian AZ-104 yang perlu diketahui:

- **Kunci bagian.** Rencana bagian 9.2 meminta peringatan "You can't return to this section after you continue."
  sebelum meninggalkan bagian studi kasus. Di ujian asli, setiap bagian terkunci setelah kamu pindah ke bagian
  berikutnya. Karena studi kasus ada di akhir, bagian yang ditinggalkan adalah bagian soal biasa: peringatan
  muncul saat pindah ke studi kasus, lalu soal 1 sampai sebelum studi kasus terkunci. Di dalam studi kasus,
  soal-soalnya bebas dibuka sampai dikumpulkan.
- **Batas soal benar/salah.** Sepertiga bank AZ-104 adalah soal benar/salah tunggal, format yang jarang di ujian
  asli. Simulasi penuh dan mini ujian per domain AZ-104 memakai paling banyak sekitar 20% soal benar/salah
  selama soal lain cukup. Ujian titik lemah dan AZ-900 tidak dibatasi.
- **Latihan resmi.** Layar hasil menautkan halaman sertifikasi Microsoft Learn (Azure Administrator untuk
  AZ-104), tempat Practice Assessment gratis berada. Alamat halaman Practice Assessment-nya sendiri tidak
  bisa dicek dari lingkungan pengembangan, jadi yang ditautkan halaman sertifikasinya.

### Misi unit dan tips praktik AZ-104 (30 September 2026)

Rencana bagian 8: satu tips per lesson (72) dan satu misi per unit (15), di `src/content/az104/practice.json`
(dibuat dari `practice.py`). Setiap langkah hanya memakai fitur yang diajarkan lesson-nya, dengan nama menu
portal yang sudah ada di fakta terverifikasi (misalnya Access control (IAM) > Check access, Deleted users,
Availability + scale > Size, Properties > Backup Configuration). Tips tidak menyebut harga, karena harga tidak
bisa dicek dari dokumentasi lokal dan berubah per region.

Label **hati-hati** mengikuti daftar rencana: Bastion selain SKU Developer (tips Unit 5 lesson 4), Standard Load
Balancer (tips Unit 6 lesson 3 dan 4, misi Unit 6), Site Recovery (tips Unit 15 lesson 4, misi Unit 15), tier App
Service berbayar (tips Unit 13 lesson 2, 3, 5, misi Unit 13), dan lisensi Microsoft Entra ID P1/P2 (tips Unit 1
lesson 2, 3, 5, misi Unit 1). VPN Gateway tidak dipakai di misi mana pun. Misi yang memakai VM (virtual machine)
tidak berlabel, tapi langkah bersih-bersihnya selalu mengingatkan bahwa VM ditagih selama berjalan.

Dua hal yang sengaja ditulis di tips karena sering membuat bingung saat membersihkan: vault Recovery Services
yang berisi data soft delete baru bisa dihapus setelah masa soft delete lewat, dan blob Archive yang dihapus
sebelum 180 hari kena biaya early deletion.

## CCNA 200-301 v2.0 (3 Oktober 2026)

Course CCNA (rencana: `LANGIT_CCNA_PLAN.md`) punya 28 unit, 156 lesson, 940 soal, 338 kartu materi, 21 lab, dan
623 fakta bersumber. Bagian ini mencatat cara faktanya dicek dan apa yang masih harus dicek ulang.

### Versi ujian

Materi mengikuti exam topics resmi CCNA 200-301 **v2.0**. Menurut halaman ujian CCNA di cisco.com, v1.1 masih
dipakai sampai 2 Februari 2027 dan v2.0 mulai 3 Februari 2027. Kalau ujian diambil sebelum 3 Februari 2027,
yang keluar adalah v1.1, jadi sebagian materi (misalnya Unit 28 tentang AI) tidak akan diuji.

### Cara mengecek

- **Domain resmi tidak bisa dibuka langsung.** Dari lingkungan pengembangan, cisco.com, rfc-editor.org,
  docs.ansible.com, dan sejenisnya diblokir kebijakan jaringan. Setiap fakta dicek lewat **pencarian web yang
  dibatasi ke domain resmi** (cisco.com dan subdomainnya, rfc-editor.org, docs.ansible.com, learn.microsoft.com
  untuk perintah Windows, man7.org untuk perintah Linux, networkmanager.dev untuk nmcli). `source` setiap fakta adalah URL resmi dari hasil
  pencarian itu, dan validator menolak sumber di luar daftar domain tersebut.
- **Kalimat yang tidak bisa dipastikan** dari ringkasan hasil pencarian diberi `verify: true`. Fakta ini tetap
  dipakai karena sesuai praktik umum, tetapi belum dicocokkan kalimat per kalimat. Daftarnya ada di bawah.
- **Simulator CLI hanya memakai sintaks yang terdokumentasi.** Perintah yang diterima simulator dan pesan
  galatnya diambil dari dokumentasi Cisco: misalnya `% Bridge Priority must be in increments of 4096.`,
  `Command rejected: <interface> is a dynamic port.` untuk port security, format `show access-lists` dengan
  `wildcard bits`, dan entri static di `show ip nat translations`. Output yang tidak disimulasikan ditandai
  sebagai pesan **Langit**, bukan dikarang seolah output IOS. Contohnya entri NAT dinamis yang butuh lalu lintas.
- **Setiap perintah di langkah lab** diputar ulang di simulator oleh validator, jadi lab dan latihan di app
  memakai sintaks yang sama.
- **Bias jawaban dicek per unit:** sebaran benar/salah dan jumlah soal yang pilihan benarnya paling panjang.
  Lihat juga baris "kepanjangan singkatan membuat jawaban benar paling panjang" di `docs/BUGS_LOG.md`.

### Sebaran sumber fakta

| Domain | Fakta |
|---|---|
| cisco.com | 472 |
| rfc-editor.org | 56 |
| datatracker.ietf.org | 31 |
| docs.ansible.com | 22 |
| learn.microsoft.com | 8 |
| learningnetwork.cisco.com | 7 |
| blogs.cisco.com | 5 |
| iana.org | 5 |
| outshift.cisco.com | 4 |
| man7.org | 3 |
| support.apple.com | 3 |
| developer.cisco.com | 2 |
| netascode.cisco.com | 2 |
| standards.ieee.org | 2 |
| networkmanager.dev | 1 |

### Lab

Ke-21 lab punya label status. Semuanya masih **belum dicoba langsung** di Packet Tracer atau CML (Cisco Modeling
Labs): langkah dan perintahnya baru dicek ke dokumentasi dan diputar di simulator. Hal yang sengaja ditulis di
catatan lab karena bisa berbeda di alatnya:

- Packet Tracer bisa menampilkan pesan pembuatan kunci RSA yang sedikit berbeda dari IOS asli (Unit 19).
- Dukungan DHCP snooping dan DAI di Packet Tracer bergantung versinya (Unit 24).
- Lab Ansible (Unit 27) memakai CML Free dengan IOSv karena Packet Tracer tidak bisa menjalankan Ansible; nama
  interface IOSv berbeda dari ISR4331.

Setelah lab dicoba, isi `testedIn` di `src/content/ccna/labs.json` dengan alat dan versinya, dan catat
perbedaan di `docs/BUGS_LOG.md`.

### Masih bertanda `verify` (118 fakta)

Fakta ini perlu dicocokkan kalimat per kalimat setelah domain resmi bisa dibuka.


**Fondasi jaringan**

- `ccna-f-u01-layer-map`: Layer application TCP/IP sepadan dengan layer 5 sampai 7 OSI, transport dengan layer 4, internet dengan layer 3, dan link dengan layer 1 dan 2.
- `ccna-f-u01-pdu`: Unit data per layer disebut segmen di transport (TCP), paket di network, frame di data link, dan bit di physical.
- `ccna-f-u01-encap`: Saat mengirim, setiap layer menambahkan header miliknya ke data dari layer di atasnya (enkapsulasi); penerima melepasnya dari bawah ke atas (de-enkapsulasi).
- `ccna-f-u01-frame-fields`: Frame Ethernet berisi MAC tujuan, MAC sumber, field type/length, data, dan FCS (Frame Check Sequence) 4 byte di akhir untuk mendeteksi frame yang rusak.
- `ccna-f-u01-socket`: Satu koneksi dikenali dari alamat IP dan port sumber serta alamat IP dan port tujuan; klien memakai port sumber acak dari rentang dynamic.

**Mengenal Cisco IOS**

- `ccna-f-u02-do`: Awalan do menjalankan perintah EXEC, misalnya do show ip interface brief, tanpa keluar dari mode konfigurasi.
- `ccna-f-u02-hostname`: Perintah hostname di global configuration mengganti nama perangkat, dan prompt langsung memakai nama baru itu.
- `ccna-f-u02-erase`: erase startup-config menghapus konfigurasi tersimpan, jadi setelah reload perangkat menyala tanpa konfigurasi.
- `ccna-f-u02-history`: Panah atas (atau Ctrl+P) memanggil lagi perintah sebelumnya dari riwayat perintah.

**Kabel dan interface**

- `ccna-f-u03-pins`: Ethernet 10 dan 100 Mbps memakai dua pasang kabel di pin 1-2 dan 3-6; 1000BASE-T memakai keempat pasang.
- `ccna-f-u03-straight-cross`: Kabel straight-through menyambung pin ke pin yang sama, sedangkan kabel crossover menukar pasangan 1-2 dengan 3-6; secara klasik crossover dipakai antar perangkat sejenis, misalnya switch ke switch.
- `ccna-f-u03-emi`: Fiber membawa sinyal cahaya, jadi tidak terganggu interferensi elektromagnetik yang bisa merusak sinyal di kabel tembaga.
- `ccna-f-u03-status-cmd`: show interfaces status di switch menampilkan status (connected, notconnect, err-disabled, disabled), VLAN, duplex, speed, dan jenis port; awalan a- seperti a-full berarti hasil autonegotiation.

**IPv4 dan subnetting**

- `ccna-f-u04-and`: Alamat network didapat dari operasi AND per bit antara alamat dan subnet mask: hasilnya 1 hanya kalau kedua bit bernilai 1.
- `ccna-f-u04-vlsm-order`: Saat merencanakan VLSM, subnet dialokasikan dari kebutuhan host terbesar ke terkecil supaya setiap blok jatuh di kelipatan ukurannya dan tidak tumpang tindih.
- `ccna-f-u04-p2p-30`: Prefix /30 punya 4 alamat dan 2 alamat host, cukup untuk link point-to-point antar dua router.
- `ccna-f-u04-overlap`: IOS menolak alamat interface yang subnet-nya tumpang tindih dengan interface lain di router yang sama, dengan pesan seperti "% 10.1.1.0 overlaps with GigabitEthernet0/0/0".
- `ccna-f-u04-bad-mask`: IOS menolak alamat network atau broadcast sebagai alamat interface dengan pesan seperti "Bad mask /24 for address 192.168.1.0".

**IPv6**

- `ccna-f-u05-unicast-routing`: ipv6 unicast-routing mengaktifkan penerusan paket IPv6 unicast di router Cisco; tanpa perintah ini router juga tidak mengirim RA.
- `ccna-f-u05-multi-addr`: Interface IPv6 bisa punya beberapa alamat global; perintah ipv6 address berikutnya menambah alamat, tidak menggantikan yang lama, jadi alamat yang salah dihapus dengan no ipv6 address.
- `ccna-f-u05-show-v6-br`: show ipv6 interface brief menampilkan status setiap interface beserta link-local dan alamat global-nya.

**Wireless**

- `ccna-f-u06-range`: Pada daya yang sama, sinyal 5 GHz melemah lebih cepat daripada 2,4 GHz, jadi jangkauan sel 5 GHz lebih kecil.
- `ccna-f-u06-bss-ess`: Satu AP beserta kliennya membentuk BSS (Basic Service Set) yang dikenali dari BSSID, yaitu MAC radio AP; beberapa AP dengan SSID yang sama membentuk ESS (Extended Service Set), sehingga klien bisa roaming.
- `ccna-f-u06-aci`: Adjacent channel interference terjadi saat AP yang berdekatan memakai channel yang tumpang tindih sebagian, misalnya channel 1 dan 3 di 2,4 GHz.
- `ccna-f-u06-width`: Channel bisa digabung menjadi 40, 80, atau 160 MHz untuk throughput yang lebih tinggi, tapi jumlah channel yang tidak tumpang tindih jadi berkurang.
- `ccna-f-u06-std-legacy`: 802.11b memakai 2,4 GHz sampai 11 Mbps, 802.11a memakai 5 GHz sampai 54 Mbps, dan 802.11g memakai 2,4 GHz sampai 54 Mbps.
- `ccna-f-u06-std-n-ac`: 802.11n (Wi-Fi 4) memakai 2,4 dan 5 GHz dengan MIMO (multiple-input multiple-output), sedangkan 802.11ac (Wi-Fi 5) hanya memakai 5 GHz.
- `ccna-f-u06-wep`: WEP (Wired Equivalent Privacy) memakai kunci statis bersama 64 atau 128 bit; WPA dibuat untuk menutup kelemahannya, dan WEP tidak boleh dipakai lagi.
- `ccna-f-u06-psk-len`: PSK WPA dan WPA2 berisi 8 sampai 63 karakter teks.
- `ccna-f-u06-pmf`: WPA3 mewajibkan PMF (Protected Management Frames), yang melindungi frame manajemen seperti deauthentication dari pemalsuan.
- `ccna-f-u06-wpa3-6e`: Di band 6 GHz (Wi-Fi 6E), WPA2 tidak boleh dipakai; WLAN harus memakai WPA3 atau OWE (Opportunistic Wireless Encryption).
- `ccna-f-u06-materials`: Bahan seperti beton, logam, dan air (termasuk tubuh manusia) menyerap atau memantulkan sinyal, sehingga jangkauan AP berkurang.

**Virtualisasi**

- `ccna-f-u07-container-os`: Karena berbagi kernel host, container memakai OS yang sama dengan host-nya; kalau butuh OS yang berbeda, misalnya Windows di host Linux, pakai VM.
- `ccna-f-u07-vswitch`: Hypervisor menyediakan virtual switch yang menghubungkan NIC virtual milik VM satu sama lain dan ke NIC fisik server sebagai uplink ke jaringan.
- `ccna-f-u07-vswitch-trunk`: Port VM di virtual switch bisa diberi VLAN, dan uplink NIC fisik ke switch biasanya trunk supaya beberapa VLAN VM bisa lewat.
- `ccna-f-u07-vrf-cmd`: VRF dibuat dengan vrf definition <nama>, lalu interface dimasukkan dengan vrf forwarding <nama>; IOS menghapus alamat IP interface saat VRF dipasang, jadi alamat harus diisi ulang.

**Konektivitas klien dan DHCP**

- `ccna-f-u08-conflict`: Server DHCP IOS memeriksa alamat dengan ping sebelum memberikannya; alamat yang ternyata dipakai dicatat di show ip dhcp conflict dan tidak dibagikan.
- `ccna-f-u08-dhcp-client`: ip address dhcp membuat interface router menjadi klien DHCP, misalnya di interface yang menghadap ISP.
- `ccna-f-u08-netsh-wlan`: Di Windows, netsh wlan show interfaces menampilkan detail koneksi wireless, antara lain SSID, BSSID, radio type, authentication, cipher, channel, dan signal; netsh wlan show networks menampilkan jaringan yang terlihat.
- `ccna-f-u08-mac-wifi-menu`: Di Mac, Option-klik ikon Wi-Fi di menu bar menampilkan detail koneksi seperti alamat IP, alamat router, channel, band, standar keamanan, dan protokol 802.11; menu yang sama membuka Wireless Diagnostics.
- `ccna-f-u08-nmcli-wifi`: Di Linux dengan NetworkManager, nmcli device wifi list menampilkan jaringan Wi-Fi yang terlihat dengan kolom seperti SSID, CHAN, SIGNAL, dan SECURITY; tanda * di kolom IN-USE menunjukkan jaringan yang sedang dipakai.

**VLAN dan port akses**

- `ccna-f-u09-auto-create`: Kalau VLAN akses belum ada, IOS membuatnya otomatis dan menampilkan "% Access VLAN does not exist. Creating vlan <id>".
- `ccna-f-u09-show-vlan`: show vlan brief menampilkan setiap VLAN beserta nama, status, dan port aksesnya; port trunk tidak tercantum di sana.
- `ccna-f-u09-ap-local`: AP (access point) dalam mode local membawa semua trafik klien di dalam tunnel CAPWAP ke WLC, jadi port switch-nya cukup port akses.
- `ccna-f-u09-appliance`: Perangkat yang hanya ada di satu VLAN, misalnya printer atau server biasa, memakai port akses; perangkat yang melayani banyak VLAN memakai trunk.

**Trunk dan routing antar-VLAN**

- `ccna-f-u10-auto-auto`: Dua port yang sama-sama dynamic auto tidak membentuk trunk, jadi keduanya tetap port akses.
- `ccna-f-u10-native-match`: Native VLAN di kedua ujung trunk harus sama; kalau berbeda, frame tanpa tag masuk ke VLAN yang salah, dan CDP melaporkan native VLAN mismatch.
- `ccna-f-u10-svi-up`: SVI baru berstatus up kalau VLAN-nya ada dan minimal satu port di VLAN itu up, termasuk trunk yang membawa VLAN itu.
- `ccna-f-u10-svi-mgmt`: Switch layer 2 seperti Catalyst 2960 memakai SVI hanya untuk manajemen, misalnya SSH, dan memakai ip default-gateway untuk menjangkau subnet lain.
- `ccna-f-u10-roas-parent`: Subinterface ikut mati kalau interface fisik induknya shutdown, jadi induknya harus no shutdown.
- `ccna-f-u10-roas-scale`: Semua trafik antar-VLAN di router-on-a-stick lewat satu link, jadi link itu bisa menjadi bottleneck; switch layer 3 merutekan antar-VLAN di dalam switch.

**EtherChannel**

- `ccna-f-u11-ec-stp`: STP (Spanning Tree Protocol) memperlakukan EtherChannel sebagai satu link, jadi link anggotanya tidak diblokir satu per satu.
- `ccna-f-u11-po-config`: Setelan port seperti switchport mode trunk dipasang di interface Port-channel, dan IOS menerapkannya ke semua anggotanya.
- `ccna-f-u11-standalone`: Flag I (stand-alone) biasanya berarti port tidak menerima negosiasi yang cocok dari seberang, misalnya satu sisi LACP dan sisi lain tidak menjalankan LACP.

**CDP dan LLDP**

- `ccna-f-u12-cdp-timers`: Bawaannya CDP dikirim setiap 60 detik, dan informasi tetangga disimpan selama 180 detik (holdtime).
- `ccna-f-u12-cdp-security`: CDP mengirim informasi seperti model, versi software, dan alamat, jadi sebaiknya dimatikan di interface yang menghadap jaringan yang tidak tepercaya, misalnya ke ISP.
- `ccna-f-u12-doc-check`: Output show cdp neighbors dan show lldp neighbors bisa dicocokkan dengan diagram jaringan untuk menemukan kabel, port, atau perangkat yang tidak sesuai dokumentasi.

**Rapid PVST+**

- `ccna-f-u13-loop-harm`: Tanpa STP (Spanning Tree Protocol), link redundan antar switch membentuk loop layer 2 yang menyebabkan broadcast storm, tabel MAC yang terus berubah, dan frame ganda.
- `ccna-f-u13-no-ttl`: Header Ethernet tidak punya field TTL (time to live), jadi frame yang berputar di loop layer 2 tidak dibuang dengan sendirinya.
- `ccna-f-u13-cost`: Biaya port bawaan dalam mode short adalah 100 untuk 10 Mbps, 19 untuk 100 Mbps, 4 untuk 1 Gbps, dan 2 untuk 10 Gbps; root path cost adalah jumlah biaya port menuju root.
- `ccna-f-u13-tiebreak`: Kalau biaya ke root sama, switch memilih root port lewat bridge ID tetangga yang terendah, lalu port ID tetangga yang terendah.

**Troubleshoot Layer 2 dan Layer 3**

- `ccna-f-u14-link-msgs`: %LINK-3-UPDOWN melaporkan perubahan status interface (layer 1), sedangkan %LINEPROTO-5-UPDOWN melaporkan perubahan status line protocol (layer 2).
- `ccna-f-u14-config-i`: %SYS-5-CONFIG_I mencatat bahwa konfigurasi diubah, beserta user dan sumbernya, misalnya console atau vty dengan alamat IP pengirimnya.
- `ccna-f-u14-adjchg`: %OSPF-5-ADJCHG mencatat perubahan state tetangga OSPF; alasan Dead timer expired berarti tidak ada hello dari tetangga itu selama dead interval.
- `ccna-f-u14-duplex-msg`: %CDP-4-DUPLEX_MISMATCH dilaporkan CDP saat setting duplex dua ujung link tidak sama.
- `ccna-f-u14-arp-capture`: Di capture, ARP request tampil sebagai Who has <alamat>? Tell <alamat pengirim> dengan tujuan broadcast; request yang berulang tanpa reply berarti tidak ada perangkat yang menjawab untuk alamat itu.
- `ccna-f-u14-nxdomain`: Jawaban DNS dengan RCODE 3 (Name Error, disebut NXDOMAIN) berarti nama yang ditanyakan tidak ada; Wireshark menampilkannya sebagai No such name.
- `ccna-f-u14-syn-retrans`: SYN yang dikirim ulang tanpa jawaban berarti segmen hilang atau dibuang diam-diam di jalan, misalnya oleh ACL atau firewall; ini berbeda dengan RST, yang berarti host tujuan menolak koneksi.

**Tabel routing**

- `ccna-f-u15-rt-codes`: Kode di awal baris show ip route menunjukkan sumber route, misalnya C connected, L local, S static, O OSPF, D EIGRP, R RIP, dan B BGP; tanda * menandai candidate default.
- `ccna-f-u15-rt-local`: Route L (local) adalah route /32 untuk alamat interface router itu sendiri, sedangkan C (connected) adalah subnet tempat interface itu berada.
- `ccna-f-u15-rt-bracket`: Angka di dalam kurung siku, misalnya [110/20], adalah administrative distance lalu metric route itu.
- `ccna-f-u15-ecmp`: Kalau beberapa route ke prefix yang sama punya AD dan metric yang sama, router bisa memasang semuanya dan membagi beban di antaranya.

**Static route**

- `ccna-f-u16-host-route`: Host route adalah route ke satu alamat, dengan mask 255.255.255.255 (/32).
- `ccna-f-u16-v6-ll`: Kalau next hop IPv6 adalah alamat link-local, interface keluar wajib ditulis, karena link-local hanya unik di satu link; IOS menolak tanpa interface dengan pesan "% Interface has to be specified for a link-local nexthop".
- `ccna-f-u16-both-ways`: Komunikasi dua arah butuh route di kedua arah: kalau router di seberang tidak punya route balik ke subnet sumber, balasan tidak sampai.
- `ccna-f-u16-static-show`: show ip route static hanya menampilkan route statis yang terpasang; route yang next hop-nya tidak terjangkau tidak muncul.

**OSPF**

- `ccna-f-u17-rid-change`: Router ID yang diubah baru dipakai setelah proses OSPF dimulai ulang, misalnya dengan clear ip ospf process.
- `ccna-f-u17-rid-unique`: Dua router OSPF dengan router ID yang sama tidak bisa membentuk adjacency yang benar.
- `ccna-f-u17-dr-nopreempt`: Pemilihan DR tidak preemptive: router baru dengan priority lebih tinggi tidak merebut posisi DR yang sudah ada.
- `ccna-f-u17-p2p`: Network type point-to-point tidak memilih DR dan BDR; ip ospf network point-to-point di link Ethernet antar dua router membuat adjacency lebih cepat terbentuk.
- `ccna-f-u17-passive-pitfall`: Kalau interface antar router dijadikan passive, hello tidak dikirim di sana, jadi adjacency di link itu tidak terbentuk.

**First Hop Redundancy Protocol**

- `ccna-f-u18-show-vrrp`: show vrrp brief menampilkan interface, grup, priority, apakah preempt aktif, state (Master atau Backup), alamat master, dan alamat grup.

**Akses manajemen perangkat**

- `ccna-f-u19-priv15`: username <nama> privilege 15 secret <password> membuat user yang langsung masuk privileged EXEC setelah login.
- `ccna-f-u19-exec-timeout`: exec-timeout <menit> [detik] di line memutus sesi yang diam terlalu lama; bawaannya 10 menit.
- `ccna-f-u19-crypto-combo`: Protokol seperti SSH dan IPsec memakai kriptografi asimetris untuk autentikasi dan pertukaran kunci, lalu enkripsi simetris untuk data.
- `ccna-f-u19-ssh-modulus`: SSH versi 2 butuh kunci RSA minimal 768 bit; 2048 bit adalah ukuran yang umum dipakai.
- `ccna-f-u19-fallback`: Metode berikutnya, misalnya local, hanya dipakai kalau server tidak menjawab; kalau server menjawab dan menolak password, login gagal.
- `ccna-f-u19-default-list`: Daftar metode bernama default berlaku otomatis di semua line yang tidak memakai daftar lain.
- `ccna-f-u19-sftp`: SFTP (SSH File Transfer Protocol) juga berjalan di atas SSH, jadi isi file dan password terenkripsi.

**NAT dan PAT**

- `ccna-f-u20-exhaust`: Kalau semua alamat di pool sedang dipakai dan tidak ada overload, host baru tidak diterjemahkan dan paketnya dibuang.
- `ccna-f-u20-timeout`: Terjemahan dinamis yang tidak dipakai dihapus setelah timeout; bawaannya 24 jam.
- `ccna-f-u20-show-trans`: show ip nat translations menampilkan tabel terjemahan; entri static selalu ada, sedangkan entri dinamis baru muncul setelah ada lalu lintas.
- `ccna-f-u20-faults`: Penyebab NAT gagal yang umum: interface inside dan outside tertukar atau tidak ditandai, access list tidak cocok dengan alamat dalam, dan tidak ada route keluar.

**DNS**

- `ccna-f-u21-ip-not-name`: Kalau ping ke alamat IP berhasil tetapi ping ke nama gagal, jaringannya jalan dan masalahnya ada di resolusi nama.

**VPN IPsec**

- `ccna-f-u22-clientless`: SSL VPN mode clientless berjalan lewat web browser tanpa software klien, tetapi hanya untuk aplikasi tertentu seperti halaman web.
- `ccna-f-u22-gre`: IPsec biasa hanya membawa unicast, jadi GRE over IPsec dipakai kalau terowongan harus membawa multicast seperti hello protokol routing.
- `ccna-f-u22-split`: Split tunneling hanya mengirim lalu lintas ke jaringan kantor lewat terowongan, sedangkan lalu lintas internet lain keluar langsung.

**Access control list**

- `ccna-f-u23-one-per`: Satu interface hanya bisa memakai satu ACL per protokol per arah.
- `ccna-f-u23-place-ext`: ACL extended sebaiknya dipasang dekat sumber, supaya lalu lintas yang ditolak tidak melintasi jaringan.
- `ccna-f-u23-place-std`: ACL standard sebaiknya dipasang dekat tujuan, karena hanya melihat sumber dan bisa memblokir sumber itu ke semua tujuan lain.
- `ccna-f-u23-access-class`: access-class <nomor atau nama> in di line vty membatasi siapa yang boleh membuka sesi remote ke perangkat.
- `ccna-f-u23-empty-acl`: ACL yang hanya berisi deny tanpa permit menolak semua lalu lintas di interface itu karena deny tersembunyi.

**Keamanan Layer 2**

- `ccna-f-u24-psec-flood`: Port security menahan serangan banjir MAC, yang mengisi tabel MAC switch dengan alamat palsu supaya switch membanjiri frame ke semua port.

**Pendekatan manajemen jaringan**

- `ccna-f-u25-per-device`: Pada manajemen per perangkat, setiap router dan switch dikonfigurasi satu per satu, biasanya lewat CLI dengan SSH, dan setiap perangkat menjalankan control plane-nya sendiri.
- `ccna-f-u25-intent`: Pada intent-based networking, administrator menyatakan apa yang diinginkan, dan Catalyst Center menerjemahkannya menjadi konfigurasi perangkat.
- `ccna-f-u25-cloud-oob`: Di Meraki, hanya lalu lintas manajemen yang pergi ke cloud; lalu lintas data pengguna tidak melewati cloud.

**SNMP dan syslog**

- `ccna-f-u26-facility`: Di protokol syslog, facility menandai bagian sistem yang menghasilkan pesan; local0 sampai local7 disediakan untuk penggunaan lokal, dan IOS memakai local7 secara bawaan untuk server syslog.
- `ccna-f-u26-timestamps`: service timestamps log datetime msec menambahkan tanggal dan waktu sampai milidetik ke setiap pesan log.

**Ansible**

- `ccna-f-u27-agentless`: Ansible tidak butuh agent di perangkat yang dikelola; untuk perangkat jaringan, Ansible terhubung lewat SSH.
- `ccna-f-u27-yaml-indent`: YAML memakai indentasi spasi untuk menunjukkan susunan bersarang; tab tidak boleh dipakai untuk indentasi.

**AI dalam operasi jaringan**

- `ccna-f-u28-agent-roles`: Di operasi jaringan, agent bisa diberi peran tertentu, misalnya pemantauan, diagnosis, dan perbaikan, sehingga alur kerjanya bisa dilacak dan diaudit.
- `ccna-f-u28-human-loop`: Pada pendekatan Cisco, manusia tetap dalam alur: setiap langkah bisa diaudit, disetujui engineer, dan bisa ditinjau, dikonfirmasi, atau dibatalkan.
- `ccna-f-u28-net-context`: Untuk pekerjaan jaringan, berikan konteks seperti perangkat yang ada, standar yang dipakai, dan teknologi yang dipilih, supaya jawaban sesuai dengan lingkungan sendiri.
- `ccna-f-u28-classify`: Data perlu diklasifikasikan sebelum masuk ke sistem AI, supaya data sensitif tidak ikut masuk.
- `ccna-f-u28-no-secrets`: Password, kunci, dan data pelanggan tidak boleh dimasukkan ke alat AI yang tidak disetujui organisasi; hapus atau samarkan dulu dari output yang dibagikan.
- `ccna-f-u28-indirect`: Instruksi berbahaya juga bisa tersembunyi di konten yang dibaca AI, misalnya dokumen atau data, bukan hanya diketik langsung oleh pengguna.
- `ccna-f-u28-hallucination`: AI bisa menghasilkan jawaban yang meyakinkan tetapi salah atau dikarang, misalnya perintah yang tidak ada.
- `ccna-f-u28-verify-output`: Output AI harus diperiksa terhadap dokumentasi resmi dan diuji, misalnya di lab, sebelum diterapkan; engineer tetap bertanggung jawab atas perubahan.
