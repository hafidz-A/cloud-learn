# Langit: rancangan course AZ-104

File ini adalah rancangan course AZ-104 (Microsoft Azure Administrator Associate) di Langit. AZ-104 adalah **course sendiri yang independen dari AZ-900**, tapi ada di aplikasi yang sama (bagian 3).

File lain yang wajib dibaca bersama file ini:
- `LANGIT_AZ900_PLAN.md`: mesin game, desain, tipe soal, halaman Ujian, tips praktik.
- `LANGIT_AZ900_PERBAIKAN_MATERI.md`: sistem kartu materi, fakta, dan validator cakupan. **Di AZ-104, sistem ini dipakai sejak awal**, bukan sebagai perbaikan.
- `docs/BUGS_LOG.md`: daftar bug yang pernah ditemukan saat membangun AZ-900 (bagian 11).

Semua fakta di file ini sudah dicek ke dokumentasi Microsoft pada September 2026. Daftar pengecekannya ada di bagian 15.

---

## 1. Tentang ujian AZ-104

| Hal | Isi |
|---|---|
| Daftar materi | Study guide AZ-104 di Microsoft Learn, versi materi yang berlaku sejak 17 April 2026. Beberapa situs pihak ketiga menyebut pembaruan lagi pada 17 September 2026; study guide resmi tidak bisa dibaca dari lingkungan pengembangan, jadi cek bagian change log-nya sebelum ujian |
| Nilai lulus | 700 dari skala 1.000 |
| Waktu menjawab | 100 menit, dengan total waktu di kursi sekitar 120 menit. Ini standar Microsoft untuk ujian role-based tanpa lab. Kalau ujiannya memuat lab, waktu menjawab jadi 120 menit |
| Jumlah soal | Tidak tetap. Microsoft menyebut kebanyakan ujian berisi sekitar 40–60 soal |
| Format soal | Pilihan ganda, pilihan ganda lebih dari satu jawaban, drag and drop, build list (menyusun urutan), hot area, dan studi kasus |
| Studi kasus | Dikelompokkan di bagian sendiri. Jumlahnya terlihat di layar pembuka. Setelah bagian studi kasus ditinggalkan, tidak bisa dibuka lagi |
| Masa berlaku | 12 bulan, diperpanjang lewat tes online gratis di Microsoft Learn |
| Latihan resmi | Practice Assessment AZ-104 gratis di Microsoft Learn, dan exam sandbox untuk mencoba format soal |

Lima domain dan bobotnya:

| Domain | Bobot |
|---|---|
| 1. Manage Azure identities and governance | 20–25% |
| 2. Implement and manage storage | 15–20% |
| 3. Deploy and manage Azure compute resources | 20–25% |
| 4. Implement and manage virtual networking | 15–20% |
| 5. Monitor and maintain Azure resources | 10–15% |

---

## 2. Bedanya dengan course AZ-900

| | AZ-900 | AZ-104 |
|---|---|---|
| Pertanyaan utama | "Layanan apa ini dan untuk apa?" | "Bagaimana mengonfigurasinya, dan kenapa tidak jalan?" |
| Tingkat detail | Konsep | Pengaturan, batasan, urutan evaluasi, SKU (Stock Keeping Unit), dan lisensi |
| Porsi soal praktik | Pelengkap | Porsi utama |
| Kartu materi | Ditambahkan lewat perbaikan | Ada sejak awal, lebih banyak per lesson |
| Tips praktik | 1–2 per unit | Di hampir setiap lesson yang bisa dipraktikkan |
| Target bank soal ujian | ±150 soal | ±300 soal |

Konsekuensinya:
- Tahap menerapkan dan mengingat sendiri mendapat porsi lebih besar.
- Setiap unit punya minimal satu lesson troubleshooting: sesuatu rusak, pemain mencari penyebabnya.
- Banyak jebakan AZ-104 ada di syarat fitur (butuh tier apa, lisensi apa, pengaturan apa lebih dulu). Syarat seperti ini diajarkan di kartu materi dan diuji berulang kali.

---

## 3. Satu aplikasi, dua course independen

```
Langit
|
|-- Pemilih course di header home:  [ AZ-900 ]  [ AZ-104 ]
|
|-- Course AZ-900: path map sendiri, Unit 1-12
|
|-- Course AZ-104: path map sendiri, Unit 1-15
      Jalur 1 Identitas dan governance      (Unit 1-3)
      Jalur 2 Jaringan                      (Unit 4-6)
      Jalur 3 Storage                       (Unit 7-9)
      Jalur 4 Compute                       (Unit 10-13)
      Jalur 5 Monitoring dan pemeliharaan   (Unit 14-15)
```

- AZ-104 tidak mensyaratkan AZ-900 dan bisa dibuka kapan saja.
- App membuka course yang terakhir dimainkan.
- **Placement test opsional** 30 soal di awal AZ-104. Unit dengan skor minimal 80% boleh ditandai selesai.

**Urutan jalur belajar** (berbeda dari urutan domain resmi):
1. Identitas dan governance, karena paling dekat dengan dasar Azure.
2. Jaringan, karena service endpoint dan private endpoint dibutuhkan di materi storage.
3. Storage
4. Compute
5. Monitoring dan pemeliharaan, karena memantau dan mem-backup resource dari semua jalur sebelumnya.

**Terpisah per course:** path map, progres lesson, level unit, checkpoint, antrean review, statistik konsep, riwayat ujian, dan indikator siap ujian.

**Dipakai bersama di seluruh aplikasi:** XP total, streak, target harian, hearts, glosarium (dengan label course), pengaturan, dan desain.

**Aturan id (penting untuk Supabase):** semua id di course AZ-104 diberi awalan `az104-`, misalnya `az104-u04-l1-e2`. Tanpa awalan, id AZ-104 bisa bentrok dengan id AZ-900 (`u04-l1-e2` ada di kedua course), dan progres keduanya bisa tercampur di database.

---

## 4. Materi dan cakupan soal

Masalah di AZ-900 (soal menguji fakta yang tidak pernah diajarkan) tidak boleh terulang. Karena itu AZ-104 memakai sistem dari `LANGIT_AZ900_PERBAIKAN_MATERI.md` **sejak lesson pertama ditulis**:

- **Tidak ada soal tanpa materi.** Setiap fakta yang dibutuhkan untuk menjawab soal, termasuk untuk menyingkirkan pengecoh, harus sudah diajarkan di kartu `learn` sebelum soal itu muncul.
- **Setiap unit punya daftar `facts`**, dan setiap fakta wajib punya `source` berupa URL Microsoft Learn. Daftar "Fakta wajib akurat" di bagian 5 adalah titik awal daftar ini, dan semuanya sudah dicek.
- **Setiap soal punya `requires`**, dan setiap kartu `learn` punya `teaches`. Validator menolak konten yang cakupannya bolong.
- **Visual wajib** untuk konsep posisi, struktur, alur, dan perbandingan. Katalognya ada di bagian 5 (kolom Visual di setiap unit).

Kepadatan materi untuk AZ-104 lebih tinggi dari AZ-900:
- Satu lesson berisi 3–5 kartu `learn` dan 8–12 soal.
- Setiap lesson troubleshooting diawali kartu `learn` tentang **cara mendiagnosis** (alat apa yang dipakai dan apa yang dilihat), bukan hanya fakta konfigurasi.
- Tombol "Lihat materi", tautan "Pelajari lagi", dan Panduan unit (dibangun otomatis dari kartu `learn`) berlaku juga di AZ-104.

---

## 5. Kurikulum lengkap

15 unit, 4–6 lesson per unit. Kolom "Konsep" berisi concept tag. Kolom "Soal khas" berisi soal yang paling mencerminkan pekerjaan admin. Kolom "Visual" berisi komponen visual yang dibutuhkan kartu materinya.

Semua butir di daftar materi resmi AZ-104 sudah tercakup (lihat bagian 15).

### Jalur 1: Identitas dan governance (domain 1, 20–25%)

**Unit 1. User dan group di Microsoft Entra ID**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Jenis dan properti user | `entra-users`, `member-vs-guest`, `user-properties` | Sort: properti milik user member vs user guest | `EntraObjects` |
| 2. Group | `security-vs-m365-group`, `assigned-vs-dynamic-membership` | Choice: group yang otomatis berisi semua user dengan department Finance | `GroupTypes` |
| 3. Lisensi | `license-assignment`, `group-based-licensing`, `usage-location` | Fix: lisensi gagal di-assign karena usage location kosong | `LicenseFlow` |
| 4. User eksternal | `b2b-guest-invite`, `external-collaboration-settings` | Config: undang partner dan batasi yang bisa dilihat guest | |
| 5. Reset password mandiri | `sspr`, `sspr-licensing`, `sspr-scope` | Choice: aktifkan SSPR (Self-Service Password Reset) untuk satu group | `SsprLicensing` |

Fakta wajib akurat:
- Dynamic group (sekarang disebut *dynamic membership group*) butuh lisensi Microsoft Entra ID P1 (atau Intune for Education) untuk setiap user unik di dalamnya; device tidak butuh lisensi. Satu dynamic group berisi user saja atau device saja, tidak keduanya. Anggotanya tidak bisa ditambah atau dihapus manual.
- Security group bisa berisi user, device, service principal, dan group lain (nested). Microsoft 365 group hanya bisa berisi user.
- Group-based licensing butuh Entra ID P1 atau lebih tinggi, atau paket Office 365 tertentu seperti E3.
- User harus punya usage location sebelum diberi lisensi. Lewat group-based licensing, user tanpa usage location memakai lokasi direktori.
- Lisensi SSPR: di Entra ID Free, user cloud-only hanya bisa **mengganti** password yang masih diingat, dan SSPR berlaku untuk administrator. **Reset** password untuk user cloud-only butuh Microsoft 365 Business Standard ke atas, atau Entra ID P1/P2. Reset dengan writeback ke on-premises butuh Microsoft 365 Business Premium, atau Entra ID P1/P2.

Tips praktik: buat user dan group, lalu undang email pribadimu sebagai guest. Dynamic group butuh trial P1 (label "hati-hati").

**Unit 2. Akses ke resource Azure (RBAC/Role-Based Access Control)**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Role bawaan | `builtin-roles`, `owner-contributor-reader`, `user-access-admin` | Match: role dengan yang bisa dilakukannya | |
| 2. Scope dan pewarisan | `rbac-scope`, `rbac-inheritance` | Place: taruh assignment di scope tersempit yang masih memenuhi kebutuhan | `RoleScopeTree` |
| 3. Membaca akses | `interpret-access`, `check-access`, `effective-permissions` | Rules: dari tabel assignment di beberapa scope, apakah user X bisa menghapus VM Y? | |
| 4. Azure role vs Entra role | `azure-vs-entra-roles` | Sort: role untuk resource Azure vs role untuk direktori | `AzureVsEntraRoles` |

Fakta wajib akurat:
- Azure role (RBAC) mengatur akses ke resource Azure. Microsoft Entra role (misalnya Global Administrator) mengatur direktori. Keduanya sistem terpisah.
- Role assignment diwariskan dari scope atas ke bawah: management group, subscription, resource group, resource.

Tips praktik: beri role Reader ke user di satu resource group, lalu login sebagai user itu dan coba membuat resource.

**Unit 3. Subscription dan governance**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Azure Policy | `policy-definition`, `initiative`, `policy-assignment`, `policy-scope-exclusion` | Config: assign "Allowed locations" ke subscription, kecualikan satu resource group | `PolicyFlow` |
| 2. Efek policy dan remediasi | `policy-effects`, `remediation-task`, `managed-identity-for-remediation` | Match: deny, audit, append, modify, deployIfNotExists dengan hasilnya | |
| 3. Lock dan tag | `resource-locks`, `tags`, `tag-inheritance-policy` | Fix: tag di resource group tidak muncul di resource di dalamnya | `PolicyRbacLock` |
| 4. Resource group, subscription, management group | `move-resources`, `subscription-management`, `management-group-hierarchy` | Order: susun hierarki dan tentukan tempat policy dipasang | `ResourceHierarchy` |
| 5. Kontrol biaya | `budgets`, `cost-alerts`, `advisor-cost` | Choice: budget yang memberi peringatan di 80% dan 100% | |

Fakta wajib akurat:
- Tag tidak diwariskan dari resource group secara default. Azure Policy bisa menambahkan atau mewariskan tag.
- Efek policy: append, audit, auditIfNotExists, deny, denyAction, deployIfNotExists, disabled, manual, modify (plus addToNetworkGroup dan mutate untuk kasus khusus). Remediation untuk deployIfNotExists dan modify berjalan dengan managed identity milik policy assignment, yang harus diberi role RBAC secukupnya.
- Lock tipe Delete (tampil sebagai CanNotDelete) masih mengizinkan perubahan tapi memblokir penghapusan. Lock ReadOnly memblokir keduanya. Lock berlaku untuk semua orang, termasuk Owner.

Tips praktik: pasang policy "Allowed locations" lalu coba melanggarnya; buat budget $5 dengan alert.

### Jalur 2: Jaringan (domain 4, 15–20%)

**Unit 4. Virtual network dan subnet**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Perencanaan alamat | `vnet-address-space`, `subnet-sizing`, `reserved-ips` | Fill: jumlah IP (Internet Protocol) terpakai di subnet /27 di Azure | `VNetAddressPlan` |
| 2. Public IP | `public-ip-sku`, `static-vs-dynamic-ip` | Choice: opsi public IP untuk VM baru | |
| 3. VNet peering | `vnet-peering`, `peering-non-transitive`, `gateway-transit`, `global-peering` | Topology: A peering ke B, B peering ke C. Bisakah A menjangkau C? | `PeeringNonTransitive` |
| 4. User-defined route | `udr`, `system-routes`, `next-hop-types` | Config: arahkan semua trafik internet dari subnet lewat firewall virtual | `UdrNextHop` |
| 5. Troubleshooting koneksi | `ip-flow-verify`, `next-hop`, `connection-troubleshoot` | Fix: pakai hasil IP flow verify untuk menemukan aturan yang memblokir VM | |

Fakta wajib akurat:
- Azure mencadangkan 5 alamat IP di setiap subnet (4 pertama dan 1 terakhir), jadi subnet /27 punya 27 alamat terpakai. Subnet IPv4 terkecil adalah /29.
- VNet baru memakai subnet privat secara default (portal sudah lebih dulu; lewat API untuk versi setelah 31 Maret 2026). VM di subnet privat butuh metode outbound eksplisit, misalnya NAT gateway, untuk menjangkau internet; tanpa itu, misalnya Windows Update dan aktivasi Windows tidak berjalan.
- Public IP SKU Basic sudah pensiun pada 30 September 2025. Public IP baru memakai SKU Standard, yang hanya statis dan tertutup untuk trafik masuk kecuali diizinkan network security group.
- VNet peering tidak transitif.

Tips praktik: buat dua VNet dengan peering dan ping antar-VM, lalu tambahkan VNet ketiga untuk membuktikan peering tidak transitif.

**Unit 5. Akses aman ke virtual network**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Aturan NSG | `nsg-rules`, `nsg-priority`, `nsg-default-rules`, `service-tags` | Rules: dari tabel aturan, apakah trafik dari X ke port 443 lolos? | `NsgRuleTable` |
| 2. NSG di subnet dan NIC | `nsg-subnet-vs-nic`, `effective-security-rules` | Rules: dua NSG berlaku sekaligus, apa hasil akhirnya? | `NsgEvaluationOrder` |
| 3. Application security group | `asg` | Config: izinkan web tier ke database tier tanpa menulis alamat IP | `AsgTiers` |
| 4. Azure Bastion | `bastion`, `bastion-subnet`, `bastion-skus` | Fix: Bastion gagal di-deploy karena nama atau ukuran subnet salah | `BastionArchitecture` |
| 5. Service endpoint vs private endpoint | `service-endpoint`, `private-endpoint`, `private-dns-zone` | Sort: ciri service endpoint vs private endpoint | `ServiceVsPrivateEndpoint` |

Fakta wajib akurat:
- Aturan NSG (Network Security Group) diproses berdasarkan nomor prioritas, angka terkecil lebih dulu. Aturan buatan sendiri memakai prioritas 100–4096. Aturan default tidak bisa dihapus: AllowVNetInBound (65000), AllowAzureLoadBalancerInBound (65001), dan DenyAllInBound (65500), dengan pasangan aturan default untuk arah keluar.
- Untuk trafik masuk, NSG subnet diproses lebih dulu, lalu NSG NIC (Network Interface Card). Keduanya harus mengizinkan. Untuk trafik keluar, urutannya dibalik.
- Untuk Bastion selain SKU Developer: subnet wajib bernama AzureBastionSubnet, berukuran minimal /26, di VNet dan resource group yang sama dengan Bastion, dan tidak boleh berisi resource lain. User-defined route tidak didukung di subnet itu. Public IP-nya harus SKU Standard dan statis (kecuali deployment Private-only di SKU Premium). Ada empat SKU: Developer, Basic, Standard, Premium; host scaling dan custom port butuh Standard ke atas.
- Bastion SKU Developer gratis, tidak butuh AzureBastionSubnet (memakai resource bersama milik Microsoft), hanya bisa menyambung ke satu VM dalam satu waktu, tidak mendukung VNet peering, hanya tersedia di region tertentu, dan tidak cocok untuk production.

Tips praktik: blokir port 80 di NIC tapi izinkan di subnet, lalu lihat hasilnya di Effective security rules. Untuk mencoba Bastion tanpa biaya, pakai SKU Developer di region yang mendukungnya (cek daftar region di dokumentasi Bastion). Bastion SKU lain berlabel "hati-hati".

**Unit 6. DNS dan load balancing**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Azure DNS publik | `dns-zone`, `record-sets`, `dns-delegation` | Order: langkah memindahkan domain ke Azure DNS (Domain Name System) sampai delegasi NS (Name Server) di registrar | `DnsDelegation` |
| 2. Private DNS zone | `private-dns-zone`, `vnet-link`, `auto-registration` | Choice: agar VM otomatis punya nama DNS internal | `PrivateDnsAutoReg` |
| 3. Dasar load balancer | `lb-public-vs-internal`, `lb-components`, `health-probe`, `lb-rules`, `inbound-nat` | Match: komponen load balancer dengan fungsinya | `LoadBalancerAnatomy` |
| 4. Troubleshooting load balancer | `lb-troubleshoot`, `probe-blocked-by-nsg` | Fix: semua VM di backend dianggap mati karena NSG memblokir health probe | `HealthProbeBlocked` |

Fakta wajib akurat:
- Auto-registration di private DNS zone hanya untuk VM, dan hanya untuk NIC utama VM. Satu VNet hanya bisa di-link ke satu private DNS zone dengan auto-registration aktif, tapi banyak VNet boleh di-link ke satu zone. Auto-registration tidak membuat record PTR (pointer untuk reverse DNS). Record dihapus otomatis saat VM dihapus atau dihentikan.
- Health probe load balancer berasal dari alamat 168.63.129.16. Aturan default NSG AllowAzureLoadBalancerInBound mengizinkannya lewat service tag AzureLoadBalancer. Aturan deny dengan prioritas lebih tinggi bisa memblokir probe dan membuat semua backend dianggap mati.
- Inbound NAT (Network Address Translation) rule adalah port forwarding: satu port frontend diteruskan ke VM tertentu, tanpa health probe (versi 2 memetakan satu rentang port ke seluruh backend pool, satu port per VM). Load-balancing rule membagi trafik ke seluruh backend pool dan memakai health probe.
- Load Balancer SKU Basic sudah pensiun pada 30 September 2025. Pakai SKU Standard.

Catatan: Application Gateway tidak ada di daftar materi resmi AZ-104, jadi tidak dijadikan lesson. Boleh disebut di penjelasan sebagai pembanding layer 4 (Load Balancer) dengan layer 7.

Tips praktik: buat load balancer publik dengan dua VM berisi halaman web berbeda, lalu refresh browser. Label "hati-hati" karena Standard Load Balancer ditagih per jam.

### Jalur 3: Storage (domain 2, 15–20%)

**Unit 7. Storage account**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Jenis dan performa | `storage-account-types`, `standard-vs-premium` | Choice: jenis akun untuk file share berlatensi rendah | |
| 2. Redundancy dan failover | `storage-redundancy`, `read-access-secondary`, `storage-failover` | Place: pilih redundancy yang memenuhi syarat biaya dan ketahanan | `StorageRedundancy` |
| 3. Object replication | `object-replication`, `blob-versioning-prereq`, `change-feed` | Fix: object replication tidak bisa diaktifkan karena versioning mati | `ObjectReplication` |
| 4. Enkripsi | `storage-encryption`, `microsoft-vs-customer-managed-keys`, `key-vault` | Choice: perusahaan wajib memegang dan merotasi kunci enkripsinya sendiri | |
| 5. Storage Explorer dan AzCopy | `storage-explorer`, `azcopy`, `azcopy-auth` | Shell: susun perintah AzCopy untuk menyalin folder ke container | |

Fakta wajib akurat:
- Object replication butuh blob versioning aktif di akun sumber dan tujuan, serta change feed aktif di akun sumber.
- Kedua akun harus general-purpose v2 atau premium block blob. Hanya block blob yang direplikasi. Akun dengan hierarchical namespace tidak didukung. Customer-managed failover tidak didukung di kedua akun.

**Unit 8. Akses ke storage**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Firewall storage dan virtual network | `storage-firewall`, `selected-networks`, `trusted-services` | Config: izinkan hanya satu subnet dan IP kantor | |
| 2. Jenis SAS | `sas-types`, `user-delegation-sas`, `sas-permissions-expiry` | Sort: account SAS, service SAS, user delegation SAS dengan cirinya | `SasTypes` |
| 3. Stored access policy | `stored-access-policy`, `revoke-sas` | Fix: link SAS bocor, cabut tanpa merotasi access key | `StoredAccessPolicy` |
| 4. Access key | `access-keys`, `key-rotation` | Order: rotasi key tanpa downtime (pindahkan aplikasi ke key2, lalu buat ulang key1) | |
| 5. Akses berbasis identitas untuk Azure Files | `files-identity-auth`, `share-vs-file-permissions` | Choice: sumber identitas untuk PC yang tergabung domain | |

Fakta wajib akurat:
- User delegation SAS (Shared Access Signature) diamankan dengan kredensial Microsoft Entra, dan didukung untuk Blob Storage, Queue Storage, Table Storage, dan Azure Files. Service SAS dan account SAS diamankan dengan storage account key. Service SAS hanya untuk satu layanan storage; account SAS bisa untuk satu atau lebih layanan.
- Stored access policy hanya bisa dipakai dengan service SAS, tidak dengan account SAS maupun user delegation SAS. Stored access policy bisa mengubah atau mencabut SAS yang sudah diterbitkan. Satu resource maksimal punya 5 stored access policy.
- Setiap storage account punya dua access key, supaya satu bisa dirotasi sementara aplikasi memakai yang lain.
- Azure Files mendukung akses berbasis identitas lewat SMB (Server Message Block) dengan Kerberos, dari AD DS (Active Directory Domain Services) on-premises, Microsoft Entra Domain Services, atau Microsoft Entra Kerberos. Aksesnya butuh izin RBAC di level share plus Windows ACL (Access Control List) untuk folder dan file.

Tips praktik: buat SAS untuk satu blob yang berlaku 10 menit, buka di browser, lalu coba lagi setelah kedaluwarsa.

**Unit 9. Azure Files dan Blob Storage**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Container dan file share | `blob-container`, `container-access-level`, `file-share-tiers` | Choice: level akses agar blob bisa dibaca publik tapi tidak bisa di-list | |
| 2. Tier dan rehydrate | `blob-tiers`, `rehydrate-priority` | Fix: file di tier Archive tidak bisa dibaca segera | `BlobTiers` |
| 3. Lifecycle management | `lifecycle-rules` | Config: pindah ke Cool setelah 30 hari, Archive setelah 90 hari, hapus setelah 365 hari | `BlobLifecycleTimeline` |
| 4. Versioning dan soft delete | `blob-versioning`, `blob-soft-delete`, `container-soft-delete` | Choice: memulihkan blob yang tertimpa, bukan terhapus | `SoftDeleteVsVersioning` |
| 5. Snapshot dan soft delete Azure Files | `share-snapshots`, `share-soft-delete` | Order: langkah memulihkan file yang terhapus dari share | |

Fakta wajib akurat:
- Blob soft delete dan container soft delete sama-sama memakai masa simpan 1 sampai 365 hari. Default container soft delete adalah 7 hari.
- Container soft delete hanya memulihkan container utuh. Untuk memulihkan satu blob di container yang masih ada, pakai blob soft delete atau versioning.

Tips praktik: aktifkan versioning, timpa sebuah file dua kali, lalu pulihkan versi pertamanya. Buat satu aturan lifecycle sederhana.

### Jalur 4: Compute (domain 3, 20–25%)

**Unit 10. ARM template dan Bicep**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Membaca ARM template | `arm-structure`, `parameters-variables-outputs` | Template: potongan JSON (JavaScript Object Notation), resource apa yang dibuat? | `ArmStructure` |
| 2. Membaca dan mengubah Bicep | `bicep-syntax`, `bicep-params` | Template: ubah SKU storage lewat parameter, pilih baris yang benar | |
| 3. Deploy | `deployment-scope`, `incremental-vs-complete`, `what-if` | Choice: mode deploy yang menghapus resource yang tidak ada di template | `IncrementalVsComplete` |
| 4. Export dan konversi | `export-template`, `arm-to-bicep` | Shell: susun perintah konversi ARM template ke Bicep | |

Fakta wajib akurat:
- Mode deploy default adalah incremental: resource yang tidak ada di template dibiarkan. Mode complete menghapus resource di resource group yang tidak ada di template.
- Di mode incremental, semua properti resource yang di-deploy ulang diterapkan ulang. Properti yang tidak ditulis di template kembali ke nilai default, bukan dipertahankan.
- Portal Azure tidak mendukung mode complete. Deployment di level subscription juga tidak mendukung mode complete. Mode complete tidak menghapus resource di resource group yang dikunci.
- Jalankan what-if sebelum deploy mode complete untuk melihat apa yang akan terhapus.
- Microsoft kini menyebut mode complete "tidak direkomendasikan" dan akan dihentikan bertahap; untuk menghapus resource lewat template, pakai deployment stacks. Materi tetap mengajarkan mode complete (masih bisa keluar di ujian), dengan catatan ini.

Tips praktik: export template dari resource group lab sebelumnya, ubah jadi Bicep, lalu deploy ke resource group baru.

**Unit 11. Virtual machine**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Membuat VM | `vm-create`, `vm-images`, `vm-sizes` | Match: keluarga ukuran VM dengan kegunaannya | |
| 2. Ukuran dan disk | `vm-resize`, `managed-disks`, `disk-types`, `data-disk` | Fix: resize gagal karena ukuran tidak tersedia di cluster hardware saat ini | `VmResizeFlow` |
| 3. Enkripsi di host | `encryption-at-host` | Choice: mengenkripsi disk sementara dan cache disk | |
| 4. Ketersediaan | `availability-set`, `fault-update-domain`, `availability-zones-vm` | Place: sebar VM supaya tahan maintenance dan kerusakan rak | `FaultUpdateDomains` |
| 5. Memindahkan VM | `move-vm-rg-sub`, `move-vm-region` | Sort: metode pindah resource group, subscription, dan region | |
| 6. Virtual Machine Scale Sets | `vmss`, `vmss-orchestration`, `vmss-autoscale`, `upgrade-policy` | Config: aturan autoscale tambah instance saat CPU (Central Processing Unit) di atas 70% | |

Fakta wajib akurat:
- Kalau ukuran baru tersedia di cluster hardware saat ini, resize hanya butuh restart. Kalau tidak, VM harus di-deallocate dulu. Di availability set, semua VM dalam set harus di-deallocate sebelum resize ke ukuran yang butuh hardware berbeda.
- Availability set punya maksimal 3 fault domain dan maksimal 20 update domain (default 5). Pengaturan ini tidak bisa diubah setelah availability set dibuat.
- Fault domain berbagi sumber listrik dan switch jaringan. Update domain di-restart bergantian saat maintenance terencana.
- Encryption at host mengenkripsi temp disk dan cache disk; server-side encryption biasa tidak. Azure Disk Encryption (ADE) pensiun 15 September 2028; untuk VM baru pakai encryption at host.

Tips praktik: buat VM kecil, tambahkan data disk, resize, lalu deallocate dan hapus.

**Unit 12. Container**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Azure Container Registry | `acr`, `acr-sku`, `acr-geo-replication` | Choice: tier yang mendukung geo-replication | |
| 2. Azure Container Instances | `aci`, `container-group`, `restart-policy`, `aci-sizing` | Config: container yang berjalan sekali lalu berhenti | `AciRestartPolicy` |
| 3. Azure Container Apps | `container-apps`, `revisions`, `ingress`, `scale-rules`, `scale-to-zero` | Choice: container app yang turun ke 0 replica saat tidak ada trafik | `ContainerAppsScale` |
| 4. Sizing dan scaling container | `container-scaling` | Sort: pengaturan scaling milik Container Instances vs Container Apps | `ContainerOptions` |

Fakta wajib akurat:
- ACR (Azure Container Registry) punya tiga tier: Basic, Standard, Premium. Geo-replication dan private endpoint hanya di Premium. Zone redundancy aktif default di semua tier (di region yang mendukung), dan ganti tier tidak menimbulkan downtime.
- Restart policy ACI (Azure Container Instances) ada tiga: Always (default kalau tidak ditentukan), Never, dan OnFailure. OnFailure me-restart container hanya kalau prosesnya gagal (exit code bukan nol), dan container berjalan minimal sekali. Never hanya menjamin container tidak di-restart kalau selesai dengan sukses (exit code 0). Alamat IP container group bisa berubah saat di-restart.
- Di Container Apps, jumlah replica minimal default adalah 0 dan maksimal default 10. Scale rule bisa berbasis HTTP, TCP (Transmission Control Protocol), atau custom (CPU, memori, atau event). Tidak ada biaya pemakaian saat app berada di 0 replica, tapi replica yang tetap di memori tanpa memproses bisa ditagih dengan tarif idle yang lebih rendah. Untuk memastikan selalu ada instance yang berjalan, set replica minimal ke 1 atau lebih. Container Apps jobs tidak mendukung scale rule HTTP.

Tips praktik: jalankan image contoh di Container Instances, lalu deploy image yang sama ke Container Apps dan amati scale-to-zero.

**Unit 13. Azure App Service**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. App Service plan | `app-service-plan`, `plan-tiers`, `scale-up-vs-out` | Sort: fitur dengan tier minimal yang dibutuhkan | `AppServiceTierLadder` |
| 2. Membuat dan scaling app | `web-app-create`, `app-autoscale` | Config: autoscale berdasarkan jadwal jam kerja | |
| 3. Custom domain dan TLS | `custom-domain`, `domain-verification`, `app-certificates` | Order: langkah memasang domain sendiri sampai HTTPS aktif | |
| 4. Backup dan jaringan | `app-backup`, `vnet-integration`, `access-restrictions`, `app-private-endpoint` | Sort: fitur untuk trafik masuk vs trafik keluar | `VnetIntegrationVsPrivateEndpoint` |
| 5. Deployment slot | `deployment-slots`, `slot-swap`, `slot-settings` | Fix: setelah swap, production memakai database staging karena setting tidak ditandai slot setting | `SlotSwap` |

Fakta wajib akurat:
- Custom domain butuh tier berbayar (bukan Free F1; tier Shared boleh). Portal meminta dua record DNS di penyedia domain: satu untuk pemetaan (A untuk root domain, CNAME untuk subdomain) dan satu TXT `asuid` untuk verifikasi domain; untuk subdomain dengan CNAME, TXT ini "sangat direkomendasikan" untuk mencegah subdomain takeover. App Service Managed Certificate butuh tier Basic atau lebih tinggi. TLS di sini singkatan dari Transport Layer Security.
- Backup dan restore didukung di Basic, Standard, Premium, dan Isolated. Di Basic, hanya slot production yang bisa di-backup.
- VNet integration butuh tier dedicated (Basic atau lebih tinggi) dan hanya menangani trafik **keluar**. Akses privat untuk trafik masuk memakai private endpoint.
- Deployment slot butuh Standard, Premium, atau Isolated. Standard mendukung sampai 5 slot.
- Tiga cara scale out App Service: manual (Basic ke atas), autoscale berbasis aturan dan jadwal (Standard ke atas), dan Automatic scaling berbasis trafik HTTP (Premium v2 sampai v4, dengan instance prewarmed). Basic, Standard, dan Premium bisa sampai 3, 10, dan 30 instance.

Tips praktik: deploy web app di tier gratis F1 dan lihat fitur apa saja yang terkunci. Deployment slot berlabel "hati-hati" (tier berbayar).

### Jalur 5: Monitoring dan pemeliharaan (domain 5, 10–15%)

**Unit 14. Azure Monitor**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Metrik | `metrics`, `metric-aggregation` | Choice: agregasi yang tepat untuk melihat lonjakan CPU sesaat | `MonitorPipeline` |
| 2. Log dan diagnostic settings | `diagnostic-settings`, `log-analytics-workspace`, `activity-log` | Fix: log tidak pernah sampai ke workspace karena diagnostic setting belum dibuat | |
| 3. Query log dengan KQL | `kql-basics`, `kql-where-summarize` | KQL: susun query untuk menghitung error per jam | `KqlPipe` |
| 4. Alert | `alert-rules`, `action-groups`, `alert-processing-rules` | Config: bungkam notifikasi alert selama jadwal maintenance | `AlertFlow` |
| 5. Insights dan Network Watcher | `vm-insights`, `storage-insights`, `network-insights`, `connection-monitor` | Choice: memantau latensi terus-menerus antara VM dan server on-premises | |

Fakta untuk unit ini ditulis saat menyusun konten, dengan aturan yang sama: setiap fakta wajib punya source URL Microsoft Learn. Sudah pasti: NSG flow logs pensiun 30 September 2027 dan sudah tidak bisa dibuat baru; penggantinya virtual network flow logs.

Tips praktik: kirim activity log ke Log Analytics workspace dan jalankan query KQL (Kusto Query Language) sederhana.

**Unit 15. Backup dan pemulihan**

| Lesson | Konsep | Soal khas | Visual |
|---|---|---|---|
| 1. Jenis vault | `recovery-services-vault`, `backup-vault` | Sort: workload yang dilindungi masing-masing vault | `VaultTypes` |
| 2. Backup policy | `backup-policy`, `retention` | Config: backup harian simpan 30 hari, plus backup mingguan simpan 12 minggu | |
| 3. Backup dan restore | `vm-backup`, `restore-options`, `file-recovery` | Choice: memulihkan satu file dari backup VM tanpa me-restore seluruh VM | |
| 4. Site Recovery | `site-recovery`, `test-failover`, `failover-commit-reprotect` | Order: test failover, failover, commit, lalu re-protect | `SiteRecoveryFlow` |
| 5. Laporan dan alert backup | `backup-reports`, `backup-alerts` | Choice: melihat semua job backup yang gagal minggu ini | |

Fakta wajib akurat:
- Recovery Services vault melindungi Azure VM, SQL di Azure VM, Azure Files, SAP HANA di Azure VM, dan workload on-premises lewat Azure Backup agent, Azure Backup Server, dan DPM (Data Protection Manager). Vault ini juga dipakai Azure Site Recovery.
- Backup vault melindungi Azure Disks, Azure Blobs, Azure Database for PostgreSQL, dan layanan Kubernetes.

Tips praktik: backup VM kecil lalu pulihkan satu file. Site Recovery berlabel "hati-hati".

---

## 6. Tipe soal baru untuk AZ-104

Semua tipe soal dari course AZ-900 tetap dipakai. Tambahan khusus pekerjaan admin:

| Tipe | Cara main | Dipakai di |
|---|---|---|
| `rules` | Tabel aturan (NSG, firewall storage, RBAC), lalu pertanyaan apakah suatu akses lolos | Unit 2, 5, 8 |
| `config` | Formulir palsu mirip portal. Pemain mengisi field, game mengecek hasilnya terhadap syarat soal | Hampir semua unit |
| `template` | Potongan ARM template atau Bicep. Pemain menjawab apa yang dibuat, atau memilih baris yang harus diubah | Unit 10, sesekali unit lain |
| `topology` | Diagram VNet, peering, dan route. Pemain menjawab apakah A bisa menjangkau B, atau menambah koneksi yang kurang | Unit 4, 5 |
| `kql` | Susun query KQL dari potongan kata, lalu lihat tabel hasil palsunya | Unit 14 |
| `casestudy` | Satu skenario perusahaan yang panjang, diikuti 4–6 soal. Hanya di halaman Ujian | Halaman Ujian |

```ts
| (ExerciseBase & {
    type: "rules";
    table: { priority?: number; name: string; source: string; destination: string; port: string; action: "Allow" | "Deny" }[];
    question: string;
    options: string[];
    answer: number;
  })
| (ExerciseBase & {
    type: "config";
    fields: { label: string; kind: "select" | "text" | "number" | "toggle"; choices?: string[] }[];
    answer: Record<string, string | number | boolean>;   // hanya field yang dinilai
  })
| (ExerciseBase & {
    type: "template";
    language: "json" | "bicep";
    code: string;
    options: string[];
    answer: number;
  })
| (ExerciseBase & {
    type: "topology";
    nodes: { id: string; label: string; cidr?: string }[];
    links: { from: string; to: string; kind: "peering" | "vpn" | "route" }[];
    question: string;
    options: string[];
    answer: number;
  })
| (ExerciseBase & {
    type: "kql";
    tokens: string[];
    answer: string[];
    sampleResult: string[][];   // tabel hasil yang ditampilkan setelah benar
  })
| (ExerciseBase & {
    type: "casestudy";
    scenario: string;           // markdown, boleh panjang
    questionIds: string[];      // soal-soal yang terikat ke skenario ini
  })
```

Semua tipe ini tetap wajib punya `requires` (bagian 4).

---

## 7. Aturan konten

**Bahasa, sama persis seperti course AZ-900:**
- Soal (prompt) dalam bahasa Inggris, seperti ujian aslinya.
- Kartu materi dan penjelasan setelah menjawab dalam bahasa Indonesia yang santai dan to the point. Istilah teknis tetap bahasa Inggris.
- Nama menu portal ditulis apa adanya dalam bahasa Inggris, misalnya "Settings > Locks".
- Setiap singkatan ditulis kepanjangannya dalam kurung saat pertama muncul di setiap soal, kartu materi, dan penjelasan.

Contoh gaya penjelasan:

> Trafiknya sudah diblokir NSG (Network Security Group) di subnet sebelum sampai ke VM. Untuk trafik masuk, Azure mengecek NSG subnet dulu, baru NSG NIC (Network Interface Card), dan dua-duanya harus mengizinkan. Aturan di NIC sudah benar, tapi tidak pernah kebagian giliran.

**Aturan lain:**
- Setiap soal tentang fitur berbayar atau bertier menyebut syarat tier atau lisensinya di penjelasan.
- Soal troubleshooting punya satu penyebab yang jelas. Penjelasannya menjelaskan cara menemukannya, bukan hanya jawabannya.
- Fitur atau SKU yang sudah pensiun tidak boleh jadi jawaban benar.
- Setiap fakta baru di luar daftar "Fakta wajib akurat" wajib punya source URL Microsoft Learn yang benar-benar dicek. Kalau tidak bisa dicek, tandai `verify: true`.

---

## 8. Tips praktik

Mengikuti bagian 13 di rencana AZ-900, dengan perbedaan:
- Targetnya satu tips di setiap lesson yang bisa dipraktikkan.
- Setiap unit punya satu **misi unit**: tips lebih panjang (20–40 menit) yang menggabungkan semua lesson di unit itu. Contoh Unit 5: buat VNet dengan dua subnet, pasang NSG dan ASG (Application Security Group), lalu buktikan web tier bisa menjangkau database tier sedangkan internet tidak bisa.
- Berlabel "hati-hati": Azure Bastion selain SKU Developer, VPN Gateway, Standard Load Balancer, Site Recovery, tier App Service berbayar, dan lisensi Entra ID P1/P2.
- Catatan di layar misi: kerjakan beberapa misi "hati-hati" di hari yang sama, lalu langsung hapus resource-nya.

---

## 9. Halaman Ujian AZ-104

Cara kerjanya **sama persis dengan halaman Ujian AZ-900**. Halaman Ujian mengikuti course yang sedang aktif: saat AZ-104 aktif, hanya soal dan riwayat AZ-104 yang dipakai. Selalu terbuka tanpa syarat.

### 9.1 Mode

| Mode | Soal | Waktu | Sumber soal |
|---|---|---|---|
| Simulasi penuh | 50 | 100 menit | Semua domain sesuai bobot di 9.3, termasuk satu studi kasus |
| Mini ujian per domain | 15 | 30 menit | Satu domain pilihan pemain, tanpa studi kasus |
| Ujian titik lemah | 20 | 40 menit | Konsep dengan akurasi terendah di statistik AZ-104 |

Kalau jalur untuk domain terkait belum selesai, tampilkan peringatan singkat, tapi tetap izinkan mulai.

### 9.2 Aturan selama ujian

- Tanpa hearts, XP, kartu materi, tombol "Lihat materi", maupun penjelasan setelah setiap soal.
- Timer mundur selalu terlihat. Saat habis, ujian dikumpulkan otomatis.
- Grid nomor soal untuk pindah ke soal mana pun, dengan status belum dijawab, sudah dijawab, dan ditandai.
- Ringkasan soal yang belum dijawab dan ditandai sebelum mengumpulkan.
- Progres dan sisa waktu tersimpan (di Supabase) kalau app tertutup.
- Tampilan tenang: tanpa maskot dan animasi perayaan.
- **Studi kasus** muncul sebagai bagian terpisah di akhir simulasi penuh. Skenario tetap bisa dibaca lewat tab saat menjawab. Sebelum meninggalkan bagian itu, tampilkan: "You can't return to this section after you continue." Setelah itu soal-soalnya terkunci.

### 9.3 Pemilihan soal

| Domain | Bobot resmi | Soal di simulasi penuh |
|---|---|---|
| Identitas dan governance (Jalur 1) | 20–25% | 12 |
| Storage (Jalur 3) | 15–20% | 9 |
| Compute (Jalur 4) | 20–25% | 12 |
| Jaringan (Jalur 2) | 15–20% | 10 |
| Monitoring dan pemeliharaan (Jalur 5) | 10–15% | 7 |
| **Total** | | **50** |

Soal studi kasus dihitung ke domain masing-masing berdasarkan unitnya. Soal diacak dengan prioritas soal yang tidak muncul di 3 simulasi terakhir. Pilihan jawaban diacak, kecuali pernyataan yes/no dan soal urutan.

Hanya soal `examReady: true` yang dipakai:

| Tipe | Meniru format ujian asli |
|---|---|
| `choice` | Pilihan ganda |
| `multi` | Lebih dari satu jawaban ("Choose two.") |
| `yesno` | Tiga pernyataan yes/no untuk satu skenario |
| `truefalse` | Pernyataan tunggal |
| `match` | Drag and drop |
| `order` | Build list |
| `rules`, `config` | Hot area |
| `template` | Membaca template atau perintah |
| `topology` | Soal diagram jaringan |
| `casestudy` | Studi kasus |

Tidak dipakai di halaman Ujian: `learn`, `intro`, `place`, `fix`, `fill`, `shell`, `kql`.

Target bank soal: minimal 300 soal examReady (sekitar 75 identitas dan governance, 55 storage, 75 compute, 55 jaringan, 40 monitoring), plus minimal 5 studi kasus.

### 9.4 Penilaian, hasil, dan pembahasan

- Skor = poin benar dibagi total poin, dikali 1.000, dibulatkan. Setiap pernyataan `yesno` bernilai 1 poin; soal lain 1 poin per soal. Lulus minimal 700.
- Catatan di layar hasil: "Skor ini perkiraan. Microsoft memakai skala skor sendiri yang tidak dipublikasikan."
- Layar hasil: skor besar, lulus atau tidak, bar per domain, waktu terpakai, tombol "Lihat pembahasan", dan tautan ke Practice Assessment AZ-104 resmi.
- Pembahasan: setiap soal dengan jawaban pemain, jawaban benar, penjelasan, dan tautan "Pelajari lagi" ke kartu materi terkait. Filter: semua, salah saja, ditandai. Soal studi kasus ditampilkan bersama skenarionya.
- Setiap soal yang salah masuk antrean review AZ-104 dan memperbarui statistik konsep AZ-104.

### 9.5 Riwayat dan kesiapan

- Riwayat semua percobaan dengan tanggal, mode, dan skor, plus grafik skor simulasi penuh.
- Indikator "Siap ujian" kalau rata-rata 3 simulasi penuh terakhir minimal 800. Kalau belum, tampilkan domain terlemah sebagai saran.

---

## 10. Supabase

Course AZ-900 sudah tersambung ke Supabase. **Course AZ-104 wajib memakai integrasi dan pola yang sama.** Jangan membuat penyimpanan baru yang terpisah (misalnya localStorage khusus AZ-104 atau tabel dengan pola berbeda).

Langkah wajib sebelum menulis kode:
1. Baca skema Supabase yang ada (folder migration dan kode akses data), lalu tulis ringkasannya: tabel apa saja, kolom kunci, relasi, dan aturan RLS (Row Level Security). Tunjukkan ke saya sebelum mengubah apa pun.
2. Rancang perubahan yang paling kecil untuk mendukung dua course. Biasanya berupa kolom `course` (`'az900'` atau `'az104'`) di tabel progres, review, statistik konsep, dan percobaan ujian.

Aturan perubahan skema:
- Semua perubahan lewat file migration, tidak lewat klik di dashboard.
- Baris yang sudah ada diisi `course = 'az900'` sebelum kolom dijadikan wajib.
- Unique constraint dan index yang memakai id lesson atau soal diperbarui supaya ikut memakai `course`.
- Aturan RLS tetap membatasi setiap baris hanya untuk pemiliknya. Cek ulang bahwa kolom baru tidak membuka celah.
- XP total, streak, target harian, dan hearts tetap satu per user (tidak per course), mengikuti cara penyimpanan yang sudah ada.
- Coba migration di lingkungan pengembangan atau branch dulu, dan backup data sebelum menjalankannya di production.
- Setelah migration, cek bahwa progres, XP, streak, antrean review, dan riwayat ujian AZ-900 akun saya tidak berubah.

Kalau konten soal disimpan di Supabase (bukan file JSON di repo), konten AZ-104 mengikuti tempat penyimpanan yang sama, dengan id berawalan `az104-`.

---

## 11. Bug dari AZ-900 yang tidak boleh terulang

Bug-bug yang ditemukan selama membangun AZ-900 dicatat di `docs/BUGS_LOG.md` (dibuat lewat prompt 0 di `LANGIT_AZ900_PERBAIKAN_MATERI.md`, lalu dilengkapi manual).

Aturan untuk course AZ-104:
- Claude Code **wajib membaca `docs/BUGS_LOG.md` sebelum mengerjakan setiap tahap** di bagian 13.
- Sebelum menyelesaikan tahap, Claude Code memeriksa kode baru terhadap setiap baris di log, menjalankan "cara mengecek" dari setiap bug yang relevan, dan melaporkan hasilnya.
- Setiap bug baru yang ditemukan di AZ-104 ditambahkan ke log yang sama.

Pengecekan tambahan yang khusus berisiko di AZ-104, karena sekarang ada dua course:
- Id bentrok antar-course (bagian 3). Pastikan semua id AZ-104 berawalan `az104-`.
- Progres, review, dan statistik satu course bocor ke course lain.
- XP atau streak terhitung dua kali, atau malah tidak terhitung, saat pemain berpindah course di hari yang sama.
- Halaman Ujian memakai soal atau riwayat dari course yang salah.
- Progres AZ-900 berubah setelah migration Supabase.

---

## 12. Perkiraan waktu belajar

Dengan 1,5 jam per hari termasuk akhir pekan:

| Jalur | Unit | Perkiraan |
|---|---|---|
| Identitas dan governance | 3 | ±2 minggu |
| Jaringan | 3 | ±1,5 minggu |
| Storage | 3 | ±2 minggu |
| Compute | 4 | ±2,5 minggu |
| Monitoring dan pemeliharaan | 2 | ±1 minggu |
| Simulasi ujian dan perbaikan titik lemah | | ±1–2 minggu |
| **Total** | **15** | **±2,5 bulan** |

Angka ini perkiraan perencanaan, dengan asumsi sebagian besar tips praktik dikerjakan. Kalau semua misi unit dikerjakan penuh, tambahkan 2–3 minggu.

---

## 13. Tahapan pengerjaan di Claude Code

Mulai setelah perbaikan materi AZ-900 (`LANGIT_AZ900_PERBAIKAN_MATERI.md`) selesai, supaya sistem kartu materi dan validator sudah ada.

1. **Multi-course dan Supabase.** Pemilih course, pemisahan data per course, aturan id berawalan `az104-`, dan migration Supabase sesuai bagian 10.
2. **Tipe soal baru:** `rules`, `config`, `topology`, lalu `template` dan `kql`, masing-masing dengan satu lesson contoh lengkap dengan kartu materi.
3. **Placement test** opsional.
4. **Konten per jalur** sesuai urutan di bagian 3, satu unit per sesi (prompt B di bagian 14).
5. **Komponen visual AZ-104** sesuai kolom Visual di bagian 5.
6. **Halaman Ujian AZ-104** sesuai bagian 9: mini ujian per domain dulu, lalu simulasi penuh dengan studi kasus, lalu ujian titik lemah, lalu pembahasan, riwayat, dan indikator siap ujian.
7. **Misi unit** dan tips praktik.

---

## 14. Prompt untuk Claude Code

### Prompt A: multi-course dan Supabase

```
Baca LANGIT_AZ900_PLAN.md, LANGIT_AZ900_PERBAIKAN_MATERI.md,
LANGIT_AZ104_PLAN.md, dan docs/BUGS_LOG.md.

Kerjakan tahap 1 di bagian 13 LANGIT_AZ104_PLAN.md saja.
Sebelum mengubah apa pun, baca skema Supabase dan kode akses data yang ada,
tulis ringkasannya, lalu tunjukkan rencana migration ke saya dan tunggu
persetujuan saya. Ikuti semua aturan di bagian 10 dan bagian 11.

Setelah selesai: jalankan app di lebar 390px, pastikan pemilih course
berjalan, course AZ-104 bisa dibuka tanpa syarat, dan progres, XP, streak,
antrean review, serta riwayat ujian AZ-900 akun saya tidak berubah.
Jalankan juga pengecekan dari setiap bug yang relevan di docs/BUGS_LOG.md,
lalu ringkas hasilnya.
```

### Prompt B: konten satu unit (ulangi untuk setiap unit)

```
Tulis konten Unit [4] course AZ-104 mengikuti LANGIT_AZ104_PLAN.md dan sistem
materi di LANGIT_AZ900_PERBAIKAN_MATERI.md. Baca docs/BUGS_LOG.md dulu.

1. Mulai dari daftar "Fakta wajib akurat" unit ini sebagai isi awal facts.
   Tambahkan fakta lain yang dibutuhkan, masing-masing dengan source URL
   Microsoft Learn yang benar-benar kamu cek. Kalau tidak bisa dicek, tandai
   verify: true.
2. Tulis kartu learn untuk setiap lesson (3–5 kartu per lesson), termasuk
   kartu cara mendiagnosis di lesson troubleshooting.
3. Tulis 8–12 soal per lesson dengan requires yang lengkap, termasuk fakta
   untuk menyingkirkan setiap pengecoh.
4. Ikuti aturan bahasa di bagian 7: soal bahasa Inggris, kartu materi dan
   penjelasan bahasa Indonesia, semua singkatan ditulis kepanjangannya.
5. Semua id berawalan az104-.
6. Minimal 30% soal examReady.

Jalankan validate:content dan content:coverage sampai unit ini bebas error.
Tampilkan: jumlah fakta, kartu learn, dan soal; daftar fakta verify; dan
komponen visual yang dibutuhkan tapi belum ada.
```

---

## 15. Log verifikasi

Dicek pada September 2026 ke dokumentasi Microsoft Learn, modul training Microsoft Learn, halaman harga Azure, dan pengumuman resmi Azure.

| Topik | Hasil |
|---|---|
| Daftar materi, domain, dan bobot | Terverifikasi. Semua butir materi resmi tercakup di Unit 1–15 |
| Nilai lulus dan perpanjangan | Terverifikasi |
| Waktu ujian dan format soal, termasuk studi kasus | Terverifikasi |
| Lisensi SSPR | Terverifikasi |
| Dynamic group, security vs Microsoft 365 group, group-based licensing, usage location | Terverifikasi |
| Pensiunnya public IP Basic dan Load Balancer Basic | Terverifikasi (30 September 2025) |
| Prioritas, aturan default, dan urutan evaluasi NSG | Terverifikasi |
| Syarat subnet Bastion dan SKU Developer | Terverifikasi |
| Sumber health probe load balancer | Terverifikasi |
| Auto-registration private DNS zone | Terverifikasi |
| Prasyarat object replication | Terverifikasi |
| Jenis SAS dan stored access policy | Terverifikasi |
| Sumber identitas Azure Files | Terverifikasi |
| Masa simpan soft delete blob dan container | Terverifikasi |
| Mode deploy ARM | Terverifikasi |
| Resize VM dan availability set | Terverifikasi |
| Tier ACR dan geo-replication | Terverifikasi |
| Restart policy ACI | Terverifikasi |
| Scaling dan scale-to-zero Container Apps | Terverifikasi |
| Tier App Service: slot, backup, VNet integration, custom domain, managed certificate, autoscale | Terverifikasi |
| Recovery Services vault vs Backup vault | Terverifikasi |
| RBAC vs Entra role, pewarisan role, tag, dan lock | Fakta dasar yang terdokumentasi di Azure RBAC overview dan dokumentasi governance; juga diajarkan di AZ-900 |

Unit 14 belum punya daftar "Fakta wajib akurat". Faktanya ditulis saat menyusun konten, dengan aturan source URL wajib dan tanda verify.

### Verifikasi ulang 29 September 2026

Setiap fakta di bagian 5 dicocokkan lagi ke teks sumber halaman Microsoft Learn (file Markdown di repo resmi MicrosoftDocs, lengkap dengan tanggal pembaruannya), bukan ringkasan. Semua fakta lama terbukti benar. Yang dipertajam atau ditambahkan:

| Topik | Temuan |
|---|---|
| Group | Istilah baru *dynamic membership group*; device member tidak butuh lisensi; satu dynamic group untuk user saja atau device saja; security group juga bisa berisi service principal dan group lain |
| VNet | Subnet terkecil /29. **VNet baru memakai subnet privat secara default**, jadi VM butuh NAT gateway atau metode outbound lain untuk ke internet |
| Bastion | Empat SKU; public IP tidak dibutuhkan untuk Developer dan Private-only; subnet harus di resource group yang sama |
| Load balancer | Inbound NAT rule = port forwarding ke VM tertentu, tanpa health probe; versi 2 memetakan rentang port ke seluruh backend pool |
| Policy | Daftar lengkap efek dan urutan evaluasinya; remediation memakai managed identity assignment |
| ARM | Mode complete sekarang "tidak direkomendasikan" dan akan dihentikan bertahap; penggantinya deployment stacks |
| VM | Azure Disk Encryption pensiun 15 September 2028; encryption at host untuk VM baru |
| ACI | Never hanya menjamin tidak di-restart setelah exit code 0 |
| ACR | Zone redundancy default di semua tier |
| App Service | Custom domain boleh di tier Shared; TXT `asuid`; tiga cara scale out (manual Basic+, autoscale Standard+, Automatic scaling Premium v2–v4) |
| Monitoring | NSG flow logs pensiun 30 September 2027, tidak bisa dibuat baru; pakai virtual network flow logs |
| Entra ID | Passkey jadi metode default sejak 1 September 2026; SMS dan telepon bawaan Microsoft untuk MFA pensiun 1 Februari 2027 |
| Study guide | Bobot lima domain terkonfirmasi. Teks lengkap study guide tidak bisa dibaca dari lingkungan pengembangan; ada kabar pembaruan 17 September 2026 dari situs pihak ketiga yang belum bisa dipastikan |

Rincian bukti per fakta ada di `docs/VERIFIKASI_MATERI.md`.

Detail ujian bisa berubah. Cek ulang halaman ujian resmi dan study guide tepat sebelum mendaftar ujian.
