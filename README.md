# Langit

Web app belajar AZ-900 (Microsoft Azure Fundamentals) ala Duolingo. Spesifikasi lengkap ada di
[`LANGIT_AZ900_PLAN.md`](LANGIT_AZ900_PLAN.md).

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:5173
```

| Perintah | Isi |
|---|---|
| `npm run build` | Typecheck lalu build ke `dist/` |
| `npm run lint` | oxlint |
| `npm test` | Unit test (Vitest): validator konten, antrean lesson, match, skor |
| `npm run check:content` | Cek aturan konten dan tampilkan semua peringatan |
| `npm run test:e2e` | Mainkan lesson di Chromium selebar 390px (Playwright) |

Sebelum `test:e2e` pertama kali, jalankan `npx playwright install chromium`, atau arahkan
`PW_CHROMIUM_PATH` ke Chromium yang sudah terpasang.

## Status tahapan

- [x] Tahap 1: kerangka, token desain, tombol 3D, header, navigasi bawah, path map
- [x] Tahap 2 (versi bagian 11.4): lesson player dengan `intro`, `choice`, `truefalse`, `match`,
      feedback sheet, soal salah diulang di akhir lesson, layar lesson selesai
- [ ] Tahap 3: `sort`, `order`, `fill`, `place`, `fix`, `shell` (sampai saat itu tipe ini
      tetap di data tapi dilewati saat main)
- [ ] Tahap 4 sampai 8
- [ ] Halaman Ujian (bagian 12), dikerjakan setelah tahap 4

## Struktur

```
src/
  content/units/*.json   satu file per unit; lesson berisi "items" (kartu intro + soal)
  content/validate.ts    aturan konten (bagian 2, 3, dan 11.2 di rencana)
  content/visuals.ts     nama diagram yang boleh dipakai kartu intro
  lesson/                lesson player, antrean soal (session.ts), kartu intro, diagram, tipe soal
  screens/               home (path map) dan layar tab lain
  store/progress.ts      progres pemain (Zustand, disimpan di localStorage)
  index.css              token warna, font, skala teks, tombol 3D
tests/e2e/               tes Playwright di lebar HP
```

## Menulis konten

Tambah atau ubah file di `src/content/units/`, lalu jalankan `npm run check:content`. Error
berarti data rusak atau kunci jawaban salah. Peringatan menandai aturan konten yang belum
terpenuhi, misalnya singkatan tanpa kepanjangan, konsep yang diuji sebelum punya kartu
`intro`, atau jumlah soal di luar 8–12.
