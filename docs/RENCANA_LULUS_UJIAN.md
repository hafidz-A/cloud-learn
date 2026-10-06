# Rencana: materi dan soal yang "secara teori" cukup untuk lulus

Permintaan (6 Oktober 2026): susun ulang materi dan soal AZ-900 dan AZ-104 supaya, kalau semuanya dikuasai,
secara teori cukup untuk lulus ujian. Kisi-kisi yang dipakai harus kisi-kisi yang berlaku saat ujian diambil.

## 1. Kisi-kisi yang dipakai

| Ujian | Versi kisi-kisi | Status per 6 Oktober 2026 |
|---|---|---|
| AZ-900 | Skills measured as of **20 Juli 2026** | Berlaku. Tidak ada versi berikutnya yang diumumkan |
| AZ-104 | Skills measured as of **17 April 2026** | Berlaku. Tidak ada versi berikutnya yang diumumkan |

Sumber: study guide resmi di learn.microsoft.com. Halaman itu diblokir dari lingkungan pengembangan, jadi isinya
dikumpulkan lewat pencarian yang dibatasi ke learn.microsoft.com, butir demi butir. Klaim situs pihak ketiga
(misalnya "AZ-104 diperbarui 17 September 2026" atau "AZ-900 sekarang 12–15% AI") tidak muncul di sumber resmi,
jadi tidak dipakai. Study guide Microsoft selalu menampilkan dua versi kisi-kisi kalau ada pembaruan yang
dijadwalkan; tanda itu tidak ada untuk kedua ujian.

Kisi-kisi disimpan sebagai data di `src/content/objectives/az900.json` dan `az104.json`, lengkap dengan tanggal
versi dan tanggal terakhir dicek. **Cara memperbarui** kalau Microsoft mengumumkan versi baru: ubah butir di file
itu, jalankan `npx vitest run src/content/objectives.test.ts`, lalu tambal butir yang gagal. Tes itu juga
mengecek standar di bagian 2 untuk setiap butir, jadi butir baru langsung terlihat kalau soalnya belum cukup.

Perubahan dari versi lama yang memengaruhi materi:
- AZ-900: *Service Trust Portal* dan *TCO Calculator* tidak ada di kisi-kisi 20 Juli 2026 (cost management hanya
  menyebut pricing calculator). Materinya tetap boleh dibaca, tapi soalnya dikeluarkan dari halaman Ujian.
- AZ-104: butir enkripsi VM sekarang encryption at host (Azure Disk Encryption pensiun 15 September 2028).

## 2. Standar per butir kisi-kisi

Setiap butir kisi-kisi (57 di AZ-900, 82 di AZ-104) harus punya:

| Syarat | Minimal |
|---|---|
| Kartu materi yang mengajarkan butir itu | 1 |
| Soal (semua tipe) | 8 |
| Soal siap ujian (`examReady`) | 6 |
| Soal skenario bergaya ujian ("A company needs… What should you use?") di antara soal siap ujian | 3 |
| Porsi soal benar/salah di antara soal siap ujian | paling banyak 1/3 |

Semua fakta baru tetap mengikuti aturan lama: sumber Microsoft Learn, dicocokkan ke teks dokumentasi resmi,
dan diajarkan kartu materi sebelum diuji.

## 3. Perubahan di aplikasi

1. **Peta kisi-kisi** per course: setiap butir dengan statusnya (belum dipelajari, perlu latihan, dikuasai),
   dihitung dari lesson yang selesai dan akurasi konsep. Panduan unit menunjukkan butir kisi-kisi setiap lesson.
2. **Simulasi ujian** mengambil soal merata per butir kisi-kisi, bukan acak per domain saja, dan hanya memakai
   soal yang termasuk kisi-kisi.
3. **Siap ujian** menyala kalau rata-rata 3 simulasi penuh terakhir minimal 800 **dan** semua butir kisi-kisi
   dikuasai.

## 4. Tahapan

1. Data kisi-kisi, peta konsep, tes cakupan, dan perubahan aplikasi (bagian 3).
2. Menambal butir AZ-900 yang di bawah standar, unit demi unit.
3. Menambal butir AZ-104 yang di bawah standar, unit demi unit.
4. Tes cakupan menjadi wajib (gagal kalau ada butir di bawah standar), lalu cek akhir semua tes.

## 5. Status

| Tahap | Status |
|---|---|
| 1. Data kisi-kisi, peta, dan perubahan aplikasi | Selesai |
| 2. AZ-900 | Selesai (6 Oktober 2026): 57 dari 57 butir memenuhi standar. 42 fakta baru, 204 soal baru, dan lesson "Latihan soal ujian" di akhir setiap unit |
| 3. AZ-104 | Selesai (6 Oktober 2026): 82 dari 82 butir memenuhi standar. 48 fakta baru, 215 soal baru, 4 lesson materi baru (Unit 3, 9, 13, 15), dan lesson "Latihan soal ujian" di akhir setiap unit |
| 4. Tes cakupan wajib dan cek akhir | Selesai (6 Oktober 2026): `src/content/objectives.test.ts` gagal kalau ada butir AZ-900 atau AZ-104 di bawah standar bagian 2 |

Lesson "Latihan soal ujian" (`review: true` di data lesson) selalu menjadi lesson terakhir unit, tidak
punya kartu materi, berisi 8–15 soal siap ujian, dan tidak dihitung sebagai lesson pengajaran. Di peta
jalur, lesson ini memakai ikon papan klip. Pemain yang sudah menyelesaikan unit tetap bisa lanjut ke
lesson berikutnya; level mahkota unit tidak turun karena lesson baru.
