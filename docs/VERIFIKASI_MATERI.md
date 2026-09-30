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
