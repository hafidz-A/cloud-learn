# Langit: rancangan course CCNA

File ini adalah rancangan course CCNA (Cisco Certified Network Associate, ujian 200-301 v2.0) di Langit.
CCNA adalah course ketiga dan **independen dari AZ-900 dan AZ-104**: punya path map, progres, dan halaman
Ujian sendiri di aplikasi yang sama.

Yang membedakannya dari dua course Azure:
- Path map CCNA berbentuk **pohon**: batang utama turun ke bawah, dan cabang (prasyarat, hands-on,
  pendukung) hanya muncul kalau dibutuhkan. Cabang boleh bercabang lagi (bagian 4).
- Hands-on memakai **simulator CLI IOS di dalam app** (bisa di HP) dan **lab Packet Tracer** langkah demi
  langkah (di laptop) (bagian 7 dan 8).

File lain yang wajib dibaca bersama file ini:
- `LANGIT_AZ900_PLAN.md`: mesin game, desain, tipe soal, halaman Ujian.
- `LANGIT_AZ900_PERBAIKAN_MATERI.md`: kartu materi, fakta, dan validator cakupan. Dipakai sejak lesson pertama.
- `docs/BUGS_LOG.md`: bug yang pernah ditemukan. Baca sebelum mengerjakan setiap tahap.
- `docs/VERIFIKASI_MATERI.md`: cara dan hasil pengecekan fakta, termasuk bagian CCNA.

---

## 1. Tentang ujian CCNA 200-301 v2.0

Sumber utama: PDF exam topics resmi `200-301_CCNA_v2.0_Exam_Topics_PDF.pdf` (Cisco, 2026), yang dikirim
pemilik repo.

| Hal | Isi |
|---|---|
| Durasi | 120 menit (tertulis di PDF exam topics) |
| Jumlah soal | Tidak dipublikasikan Cisco. Diskusi di Cisco Learning Network memperkirakan sekitar 100 soal |
| Format | Pilihan ganda, drag and drop, dan soal berbasis performa (simulasi/lab). Menurut PDF, peserta juga bisa diminta **menilai output dan rekomendasi dari agentic AI dan asisten jaringan digital** |
| Nilai lulus | Tidak dipublikasikan Cisco. Langit tidak mengklaim angka lulus untuk CCNA |
| Berlaku | Menurut halaman ujian CCNA di cisco.com: v1.1 bisa diambil sampai 2 Februari 2027, v2.0 mulai 3 Februari 2027. **Kalau ujian diambil sebelum 3 Februari 2027, yang keluar adalah v1.1**, bukan materi di course ini |

Lima domain dan bobotnya (PDF exam topics):

| Domain | Bobot | Butir |
|---|---|---|
| 1.0 Network Infrastructure and Connectivity | 25% | 1.1–1.7 |
| 2.0 Switching and Network Access | 25% | 2.1–2.5 |
| 3.0 IP Routing | 20% | 3.1–3.4 |
| 4.0 Network Services and Security | 20% | 4.1–4.7 |
| 5.0 AI, and Network Operations and Management | 10% | 5.1–5.6 |

Setiap domain jadi satu **jalur** di path map, dengan urutan yang sama dengan domainnya. Urutan itu juga
urutan belajar yang masuk akal: infrastruktur dan alamat dulu, lalu switching, routing, layanan dan keamanan,
terakhir operasi dan AI.

---

## 2. Bedanya dengan course Azure

| | AZ-900 / AZ-104 | CCNA |
|---|---|---|
| Path map | Satu jalur berliku | Pohon: batang + cabang (bagian 4) |
| Praktik | Tips "Coba di Azure" dan misi unit | Simulator CLI IOS di app + lab Packet Tracer per cabang hands-on |
| Sumber fakta | Microsoft Learn | Dokumentasi Cisco (cisco.com, developer.cisco.com), RFC (rfc-editor.org, datatracker.ietf.org), IEEE, dokumentasi Ansible |
| Placement test | AZ-104: satu tes di awal course | Tes lompat per cabang prasyarat |
| Tipe soal baru | `rules`, `config`, `template`, `topology`, `kql` | `ios` (simulator), `exhibit` (diagram dan/atau output CLI, "Refer to the exhibit"), `template` dengan bahasa `yaml` |

Aturan konten AZ tetap berlaku: soal dalam bahasa Inggris seperti ujian aslinya, materi dan penjelasan dalam
bahasa Indonesia, singkatan ditulis kepanjangannya saat pertama muncul di setiap soal dan penjelasan, setiap
soal punya `requires`, dan setiap fakta punya `source`.

Penulisan teknis khusus CCNA:
- Alamat IPv6 di teks ditulis huruf kecil sesuai RFC 5952 (`2001:db8::1`, `fe80::1`). Output perangkat di
  soal `ios` dan `exhibit` ditulis persis seperti yang dicetak perangkat (IOS mencetak huruf besar).
- Nama perangkat di soal: R1, R2, SW1, SW2, PC1, SRV1. Nama interface lengkap di teks penjelasan
  (GigabitEthernet0/0/0), boleh disingkat di perintah (g0/0/0).
- Jangan pakai singkatan STP untuk kabel shielded twisted pair; STP di course ini selalu Spanning Tree Protocol.

---

## 3. Satu aplikasi, tiga course

```
Langit
|-- Pemilih course di home:  [ AZ-900 ]  [ AZ-104 ]  [ CCNA ]
|-- Course CCNA: pohon lesson sendiri, Unit 1-28 di 5 jalur
```

- CCNA tidak mensyaratkan course lain.
- **Aturan id:** semua id di course CCNA diberi awalan `ccna-`, misalnya `ccna-u04-l3-e2` dan
  `ccna-f-u04-rfc1918`. Tanpa awalan, progres bisa tercampur dengan course lain saat sinkron.
- **Progres CCNA disimpan di kunci tingkat atas `ccna`** pada data progres dan data sinkron, bukan di dalam
  `courses`. Alasannya sama dengan bug sinkron AZ-104 di `docs/BUGS_LOG.md`: aplikasi versi lama mengirim ulang
  kunci `courses` tanpa CCNA. Kunci tingkat atas yang tidak dikenal versi lama tidak pernah dikirim olehnya, dan
  `sync_push` di server menyimpan kunci yang tidak dikirim (`s.data || p_data`).
- Glosarium dipakai bersama. Singkatan yang artinya beda per course (misalnya ACL di Azure Files vs ACL di
  router) boleh punya entri khusus course (`course: "ccna"`); entri itu dipakai saat course CCNA aktif.

---

## 4. Pohon lesson

### 4.1 Jenis node

Setiap lesson CCNA adalah satu node. Lesson tanpa `branch` adalah **batang**. Lesson dengan `branch` adalah
**cabang**:

```json
{ "id": "ccna-u04-l2", "title": "Bilangan biner", "branch": { "kind": "prereq", "from": "ccna-u04-l1" }, "items": [...] }
```

| Jenis | Ikon | Aturan |
|---|---|---|
| Batang | bintang | Jalur utama. Wajib, berurutan |
| `prereq` (prasyarat) | kunci | **Wajib.** Terbuka setelah node `from` selesai. Node batang berikutnya baru terbuka setelah semua prasyarat yang tumbuh dari batang sebelumnya selesai. Bisa dilewati dengan **tes lompat** |
| `handson` | terminal | **Opsional.** Latihan simulator IOS, lalu lab Packet Tracer. Terbuka setelah node `from` selesai |
| `support` (pendukung) | buku | **Opsional.** Materi pendalaman atau latihan tambahan. Terbuka setelah node `from` selesai |

`from` adalah node tempat cabang tumbuh, dan cabang terbuka setelah node itu selesai. Prasyarat diletakkan di
batang **sebelum** materi yang membutuhkannya: misalnya "Bilangan biner" tumbuh dari "Alamat IPv4" dan
mengunci "Subnet mask dan prefix".

### 4.2 Aturan yang dicek validator

- `from` menunjuk lesson yang ada **sebelumnya di unit yang sama**. Urutan lesson di file JSON adalah urutan
  main, jadi cakupan materi (fakta diajarkan sebelum diuji) tetap dihitung dengan urutan file.
- `prereq` hanya boleh tumbuh dari batang atau dari `prereq` lain. Cabang opsional tidak boleh punya anak
  `prereq`.
- Satu node batang punya paling banyak dua cabang, satu di kanan dan satu di kiri (`side`, bawaan: anak pertama
  di kanan). Satu node cabang punya paling banyak dua anak: anak pertama melanjutkan cabangnya ke bawah, anak
  kedua bercabang lagi ke luar. Kedalaman maksimal dua lajur dari batang, supaya muat di layar HP.
- **Soal di lesson wajib (batang dan prasyarat) hanya boleh membutuhkan fakta yang diajarkan di lesson wajib.**
  Pemain boleh melewati cabang opsional, jadi materi yang diuji di lesson wajib atau checkpoint tidak boleh
  hanya ada di cabang opsional.
- Checkpoint jalur hanya mengambil soal dari lesson wajib.
- Level unit (mahkota) hanya menghitung lesson wajib.

### 4.3 Status node

- `active` (memantul): lesson **wajib** pertama yang bisa dimainkan. Cabang opsional tidak pernah `active`;
  kalau terbuka statusnya `open`.
- `locked`: node `from` belum selesai, atau (untuk batang) prasyarat sebelumnya belum selesai, atau jalurnya
  belum terbuka.
- Checkpoint aktif setelah semua lesson wajib di jalurnya selesai, dan seperti course lain bisa dicoba lebih awal
  untuk melompat.

### 4.4 Tes lompat prasyarat

Popover node prasyarat pertama di sebuah cabang punya tombol "Sudah paham? Tes lompat". Tesnya maksimal 8 soal
dari semua lesson prasyarat di cabang itu (2 per lesson), tanpa hearts dan tanpa pengulangan. Skor minimal 80%
menandai semua lesson di cabang itu selesai (tanpa XP). Jawaban tes tidak masuk statistik maupun antrean
Latihan, sama seperti placement test AZ-104.

### 4.5 Tata letak di layar

Lima lajur selebar layar: batang di tengah, cabang di lajur ±1, cabang dari cabang di lajur ±2. Cabang dimulai
sejajar dengan node asalnya lalu turun ke bawah. Garis wajib tebal dan utuh, garis cabang opsional putus-putus.
Setiap unit punya blok sendiri di bawah kartu unitnya, sehingga cabang tidak pernah menyeberang ke unit lain.
Di bawah node cabang ada label jenisnya, dan di atas peta ada legenda ikon.

---

## 5. Materi, fakta, dan sumber

- Satu lesson batang berisi 2–4 kartu `learn` dan 6–10 soal. Lesson hands-on berisi 1–2 kartu `learn`, lalu
  3–6 soal (minimal 2 soal `ios`).
- Setiap fakta punya `source` berupa URL dokumentasi resmi: `cisco.com`, `developer.cisco.com`,
  `learningnetwork.cisco.com`, `netacad.com`, `rfc-editor.org`, `datatracker.ietf.org`, `iana.org` (nomor port),
  `ieee.org`, `docs.ansible.com`, atau repo resmi Ansible di GitHub. Untuk perintah di OS klien (topik 1.6) dipakai
  dokumentasi vendornya sendiri: Windows commands di `learn.microsoft.com`, Mac User Guide di `support.apple.com`, dan
  Linux man-pages di `man7.org`. Validator menolak fakta tanpa sumber seperti itu kecuali
  bertanda `verify: true`.
- `verify: true` berarti fakta itu belum bisa dicocokkan ke sumbernya. Lihat bagian 10 untuk cara pengecekan yang
  dipakai dan batasannya.
- Minimal 30% soal setiap unit `examReady`.

---

## 6. Kurikulum

Kolom "Jenis": T = batang, P = prasyarat, H = hands-on, S = pendukung. "Dari" adalah node asal cabang.
Kolom "Topik" adalah butir di PDF exam topics.

### Jalur 1 · Infrastruktur dan konektivitas (domain 1.0, 25%)

**Unit 1. Fondasi jaringan** (dasar yang tidak tertulis di silabus tapi dibutuhkan semua butir)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Komponen jaringan | T | |
| 2. Model TCP/IP dan OSI | T | |
| 3. Bilangan heksadesimal | P | 2 |
| 4. Ethernet dan MAC address | T | |
| 5. ARP dan perjalanan paket | T | |
| 6. TCP, UDP, dan port | T | |

**Unit 2. Mengenal Cisco IOS** (dasar untuk semua butir "configure")

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Akses dan mode CLI | T | |
| 2. Konfigurasi dasar perangkat | T | |
| 3. Menyimpan dan membaca konfigurasi | T | |
| 4. Bantuan CLI dan pesan error | S | 3 |
| 5. Lab: konfigurasi awal | H | 3 |

**Unit 3. Kabel dan interface** (1.1)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Kabel tembaga | T | |
| 2. Fiber optik | T | |
| 3. Speed dan duplex | T | |
| 4. Membaca status dan error interface | T | |
| 5. Lab: diagnosis interface | H | 4 |

**Unit 4. IPv4 dan subnetting** (1.3)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Alamat IPv4, publik dan privat | T | |
| 2. Bilangan biner | P | 1 |
| 3. Subnet mask dan prefix | T | |
| 4. Menghitung subnet | T | |
| 5. Latihan subnetting cepat | S | 4 |
| 6. VLSM dan perencanaan alamat | T | |
| 7. Troubleshoot konfigurasi IPv4 | T | |
| 8. Lab: alamat IPv4 di router | H | 7 |

**Unit 5. IPv6** (1.4)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Format dan penulisan IPv6 | T | |
| 2. Jenis alamat IPv6 | T | |
| 3. Prefix dan perencanaan | T | |
| 4. Modified EUI-64 dan SLAAC | T | |
| 5. Konfigurasi dan troubleshoot IPv6 | T | |
| 6. Lab: IPv6 di router | H | 5 |

**Unit 6. Wireless** (1.5)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Karakteristik RF | T | |
| 2. Band dan channel | T | |
| 3. Standar 802.11 | S | 2 |
| 4. Keamanan wireless | T | |
| 5. Penyebab interferensi | T | |

**Unit 7. Virtualisasi** (1.2)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Hypervisor dan VM | T | |
| 2. Container | T | |
| 3. Jaringan virtual | T | |

**Unit 8. Konektivitas klien dan DHCP** (1.6, 1.7)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Cek IP di Windows, macOS, dan Linux | T | |
| 2. Troubleshoot klien kabel dan wireless | T | |
| 3. Cara kerja DHCPv4 | T | |
| 4. Server DHCP di IOS | T | |
| 5. DHCP relay dan klien DHCP | T | |
| 6. Lab: DHCP server dan relay | H | 5 |

### Jalur 2 · Switching dan akses jaringan (domain 2.0, 25%)

**Unit 9. VLAN dan port akses** (2.2)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Konsep VLAN | T | |
| 2. Membuat VLAN dan port akses | T | |
| 3. Voice VLAN dan IP phone | T | |
| 4. Port untuk AP, IoT, host virtual, dan appliance | T | |
| 5. Power over Ethernet | T | |
| 6. Lab: VLAN dan port akses | H | 5 |

**Unit 10. Trunk dan routing antar-VLAN** (2.1.a, 2.1.b, 2.1.d)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Trunk 802.1Q | T | |
| 2. Allowed VLAN dan native VLAN | T | |
| 3. Interface Layer 2 dan Layer 3 | T | |
| 4. SVI | T | |
| 5. Router-on-a-stick | T | |
| 6. Lab: trunk dan router-on-a-stick | H | 5 |
| 7. Lab: SVI di switch Layer 3 | H | 6 (lanjutan cabang) |

**Unit 11. EtherChannel** (2.1.c)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Konsep EtherChannel | T | |
| 2. LACP dan mode negosiasi | T | |
| 3. Konfigurasi EtherChannel Layer 2 dan Layer 3 | T | |
| 4. Verifikasi dan troubleshoot | T | |
| 5. Lab: EtherChannel | H | 4 |

**Unit 12. CDP dan LLDP** (2.3)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. CDP | T | |
| 2. LLDP | T | |
| 3. Validasi dokumentasi jaringan | T | |
| 4. Lab: memetakan tetangga | H | 3 |

**Unit 13. Rapid PVST+** (2.5)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Kenapa loop Layer 2 berbahaya | T | |
| 2. Root bridge dan bridge ID | T | |
| 3. Peran dan state port | T | |
| 4. STP klasik 802.1D | S | 3 |
| 5. Konfigurasi Rapid PVST+ | T | |
| 6. PortFast | T | |
| 7. BPDU guard, root guard, loop guard | T | |
| 8. Lab: Rapid PVST+ | H | 7 |

**Unit 14. Troubleshoot Layer 2 dan Layer 3** (2.4)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Perintah show dan log | T | |
| 2. Ping dan extended ping | T | |
| 3. Traceroute | T | |
| 4. Membaca packet capture | T | |
| 5. Lab: mencari kerusakan | H | 4 |

### Jalur 3 · IP routing (domain 3.0, 20%)

**Unit 15. Tabel routing** (3.1)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Isi tabel routing | T | |
| 2. Longest prefix match | T | |
| 3. Administrative distance | T | |
| 4. Metric dan default route | T | |
| 5. Latihan menentukan next hop | S | 4 |

**Unit 16. Static route** (3.2)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Static route IPv4 | T | |
| 2. Default route dan host route | T | |
| 3. Floating static route | T | |
| 4. Static route IPv6 | T | |
| 5. Troubleshoot static route | T | |
| 6. Lab: static routing | H | 5 |

**Unit 17. OSPF** (3.3)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Konsep OSPF | T | |
| 2. Wildcard mask | P | 1 |
| 3. Router ID dan konfigurasi dasar | T | |
| 4. Neighbor dan adjacency | T | |
| 5. Network broadcast dan point-to-point | T | |
| 6. OSPFv3 untuk IPv6 | T | |
| 7. Verifikasi dan troubleshoot OSPF | T | |
| 8. Lab: OSPFv2 single area | H | 7 |
| 9. Lab: OSPFv3 | H | 8 (lanjutan cabang) |

**Unit 18. First Hop Redundancy Protocol** (3.4)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Kenapa butuh FHRP | T | |
| 2. HSRP | T | |
| 3. Konfigurasi HSRP dasar | S | 2 |
| 4. VRRP | T | |
| 5. Membaca status HSRP dan VRRP | T | |

### Jalur 4 · Layanan dan keamanan jaringan (domain 4.0, 20%)

**Unit 19. Akses manajemen perangkat** (4.1, 4.2)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. User lokal dan password | T | |
| 2. Dasar kriptografi | P | 1 |
| 3. SSH | T | |
| 4. AAA: TACACS+ dan RADIUS | T | |
| 5. Perangkat sebagai klien AAA | T | |
| 6. Transfer file dengan SCP dan SFTP | T | |
| 7. Lab: manajemen yang aman | H | 6 |

**Unit 20. NAT dan PAT** (4.3)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Kenapa NAT dan istilahnya | T | |
| 2. Static NAT | T | |
| 3. Dynamic NAT | T | |
| 4. PAT | T | |
| 5. Verifikasi dan troubleshoot NAT | T | |
| 6. Lab: NAT dan PAT | H | 5 |

**Unit 21. DNS** (4.4)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Cara kerja DNS | T | |
| 2. Jenis record | T | |
| 3. Diagnosis masalah DNS | T | |
| 4. DNS di perangkat Cisco | S | 3 |

**Unit 22. VPN IPsec** (4.5)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Site-to-site dan remote access | T | |
| 2. Protokol IPsec | T | |
| 3. Mode tunnel dan transport | T | |
| 4. Memilih solusi VPN | T | |

**Unit 23. Access control list** (4.6)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Cara kerja ACL | T | |
| 2. ACL standard | T | |
| 3. ACL extended | T | |
| 4. Named ACL dan nomor urut | T | |
| 5. Menerapkan dan troubleshoot ACL | T | |
| 6. Lab: ACL | H | 5 |

**Unit 24. Keamanan Layer 2** (4.7)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Port security | T | |
| 2. DHCP snooping | T | |
| 3. Dynamic ARP Inspection | T | |
| 4. Storm control | T | |
| 5. RA guard | T | |
| 6. Lab: keamanan Layer 2 | H | 5 |

### Jalur 5 · AI, operasi, dan manajemen jaringan (domain 5.0, 10%)

**Unit 25. Pendekatan manajemen jaringan** (5.3)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Manajemen per perangkat | T | |
| 2. Manajemen berbasis controller | T | |
| 3. Manajemen berbasis cloud | T | |
| 4. Otomasi dan infrastructure as code | T | |
| 5. REST API dan JSON | S | 4 |

**Unit 26. SNMP dan syslog** (5.4, 5.6)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. SNMP | T | |
| 2. Severity syslog | T | |
| 3. Format pesan dan facility syslog | T | |
| 4. Lab: SNMP dan syslog | H | 3 |

**Unit 27. Ansible** (5.5)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Konsep Ansible | T | |
| 2. Dasar YAML | P | 1 |
| 3. Inventory dan playbook | T | |
| 4. Menjalankan perintah di IOS | T | |
| 5. Lab: Ansible ke router | H | 4 |

**Unit 28. AI dalam operasi jaringan** (5.1, 5.2)

| Lesson | Jenis | Dari |
|---|---|---|
| 1. Generative AI dan agentic AI | T | |
| 2. Peran agentic AI di operasi jaringan | T | |
| 3. Komponen prompt | T | |
| 4. Klasifikasi data dan keamanan prompt | T | |
| 5. Menilai output dan rekomendasi AI | T | |

Total: 28 unit, 156 lesson (122 batang, 5 prasyarat, 21 hands-on, 8 pendukung). Unit 10 dan 17 memberi contoh
cabang berantai: lab kedua tumbuh dari lab pertama.

---

## 7. Simulator CLI IOS (soal `ios`)

Pemain mengetik perintah di terminal tiruan, lalu menekan **Periksa**. Yang dinilai adalah **hasil akhirnya**,
seperti grader lab: baris konfigurasi yang harus ada (per konteks, misalnya per interface), perintah yang harus
dijalankan (misalnya `show ip interface brief`), dan baris yang tidak boleh ada. Urutan dan cara menulis yang
berbeda tetap benar selama hasilnya sama.

**Aturan kejujuran simulator.** Simulator hanya mengenal perintah yang dibutuhkan latihan CCNA. Supaya tidak
pernah menampilkan perilaku palsu sebagai perilaku IOS:
- Pesan IOS asli (`% Invalid input detected at '^' marker.`, `% Incomplete command.`, `Bad mask`) hanya keluar
  untuk perintah yang dikenal simulator dengan argumen yang salah atau kurang.
- Perintah yang tidak dikenal simulator dijawab dengan pesan berlabel **Langit**, bukan pesan IOS, karena di
  perangkat asli perintah itu belum tentu salah.
- Singkatan: simulator menerima kata lengkap dan singkatan baku yang dipakai luas di dokumentasi Cisco
  (`en`, `conf t`, `int g0/0/0`, `sh ip int br`, `no shut`, `sh run`, `copy run start`, `wr`, dan sejenisnya).
  IOS asli menerima singkatan apa pun yang unik; singkatan lain di simulator dijawab dengan pesan Langit yang
  menyebut kata lengkapnya, bukan dianggap salah.
- `?` dan Tab tidak didukung. Output `show` ditulis per soal mengikuti format perangkat asli, atau dibangun dari
  konfigurasi yang diketik (`show running-config` hanya menampilkan bagian yang relevan dan diberi catatan Langit).
- Setiap soal `ios` punya `solution` (urutan perintah contoh). Validator menjalankannya di simulator dan
  memastikan hasilnya memenuhi `goal`, dan bahwa terminal kosong tidak memenuhi `goal`.

Model perangkat mengikuti yang ada di Packet Tracer:

| Model | Peran | Interface |
|---|---|---|
| ISR4331 | Router IOS XE | GigabitEthernet0/0/0–0/0/2 |
| 2960-24TT | Switch Layer 2 | FastEthernet0/1–0/24, GigabitEthernet0/1–0/2 |
| 3650-24PS | Switch Layer 3 | GigabitEthernet1/0/1–1/0/24, GigabitEthernet1/1/1–1/1/4 |

---

## 8. Lab Packet Tracer

Setiap cabang hands-on punya satu lab di `src/content/ccna/labs.json`, dibuka dari layar selesai lesson dan dari
Panduan unit. Isinya: alat yang dipakai, perkiraan waktu, topologi (diagram dan tabel alamat), langkah dengan
perintahnya, cara membuktikan (perintah `show` dan apa yang harus terlihat), dan perbedaan Packet Tracer dengan
IOS XE asli yang relevan.

- **Alat:** Cisco Packet Tracer (gratis lewat akun Networking Academy; versi terbaru menurut netacad.com adalah
  9.0.1 untuk Windows, macOS, dan Ubuntu). Untuk fitur yang tidak ada di Packet Tracer, lab menyebut alat lain
  dengan jelas: CML Free (Cisco Modeling Labs, maksimal 5 node, berisi image IOL dan IOL-L2) atau Linux untuk
  Ansible.
- Semua perintah di langkah lab harus dikenal simulator (dicek validator), supaya latihan di app dan di lab
  memakai sintaks yang sama.
- **Status uji:** setiap lab menampilkan apakah sudah dicoba langsung di Packet Tracer. Lab yang langkahnya baru
  dicek ke dokumentasi Cisco diberi label "Belum dicoba di Packet Tracer". Kalau hasilnya berbeda, catat di
  `docs/BUGS_LOG.md` dan perbaiki lab, simulator, dan materinya bersama-sama.

---

## 9. Halaman Ujian CCNA

| Mode | Soal | Waktu |
|---|---|---|
| Simulasi penuh | 100, dibagi sesuai bobot domain (25/25/20/20/10) | 120 menit |
| Mini ujian per domain | 25 | 30 menit |
| Ujian titik lemah | 30 | 36 menit |

- Tipe soal ujian CCNA: `choice`, `multi`, `truefalse`, `match`, `order`, `exhibit`, `template`, dan `ios`
  (pengganti soal simulasi). Tidak ada `yesno`, karena format itu milik ujian Microsoft. Soal benar/salah
  dibatasi 20% seperti AZ-104.
- Cisco tidak memublikasikan nilai lulus, jadi hasil ujian CCNA menampilkan skor tanpa label lulus/gagal.
  Indikator **Siap ujian** memakai batas yang lebih ketat, rata-rata 850 dari 3 simulasi penuh terakhir.

---

## 10. Verifikasi dan batasannya

Pengecekan fakta CCNA memakai cara berikut, dan hasilnya dicatat di `docs/VERIFIKASI_MATERI.md`:
- Saat course ini dibuat, lingkungan pengembangan **tidak bisa membuka** cisco.com, netacad.com,
  rfc-editor.org, datatracker.ietf.org, maupun docs.ansible.com (diblokir kebijakan jaringan). Fakta dicek lewat
  **pencarian web yang dibatasi ke domain resmi** (cisco.com, ietf.org) dan repo resmi Ansible di GitHub, yang
  bisa dibuka. `source` setiap fakta adalah URL resmi yang muncul di hasil pencarian itu.
- Fakta yang tidak bisa dipastikan lewat cara di atas diberi `verify: true` dan muncul di laporan
  `npm run content:coverage`.
- Setelah domain resmi bisa dibuka, semua fakta CCNA perlu dicek ulang kalimat per kalimat seperti AZ-900, dan
  lab perlu dicoba langsung di Packet Tracer.

---

## 11. Tahapan dan status

- [ ] Tahap 1: rencana ini
- [ ] Tahap 2: course CCNA di app (pemilih course, progres, sinkron), pohon lesson, tes lompat
- [ ] Tahap 3: simulator IOS, soal `exhibit`, lab Packet Tracer
- [ ] Tahap 4: materi Jalur 1 (Unit 1–8)
- [ ] Tahap 5: materi Jalur 2 (Unit 9–14)
- [ ] Tahap 6: materi Jalur 3 (Unit 15–18)
- [ ] Tahap 7: materi Jalur 4 (Unit 19–24)
- [ ] Tahap 8: materi Jalur 5 (Unit 25–28)
- [ ] Tahap 9: halaman Ujian CCNA, dokumentasi, tes e2e
