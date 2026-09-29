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
| `npm run test:e2e` | Tes Playwright di Chromium selebar 390px, termasuk scan aksesibilitas |

Sebelum `test:e2e` pertama kali, jalankan `npx playwright install chromium`, atau arahkan
`PW_CHROMIUM_PATH` ke Chromium yang sudah terpasang.

## Status tahapan

Cara memasang dan memakai Langit di HP ada di [`PANDUAN.md`](PANDUAN.md).

- [x] Tahap 1: kerangka, token desain, tombol 3D, header, navigasi bawah, path map
- [x] Tahap 2 (versi bagian 11.4): kartu intro, feedback sheet, soal salah diulang, layar selesai
- [x] Tahap 3: semua 11 tipe soal (`choice`, `truefalse`, `match`, `sort`, `order`, `fill`, `place`,
      `fix`, `shell`, `multi`, `yesno`), drag and drop yang jalan dengan sentuhan
- [x] Tahap 4: XP, streak, target harian, hearts, level unit, checkpoint yang membuka jalur berikutnya
- [x] Tahap 5: 12 unit, 48 lesson, 102 kartu intro, 390 soal (301 siap ujian)
- [x] Tahap 6: antrean latihan 1/3/7 hari, statistik per unit dan konsep, glosarium dengan tahan-tap
- [x] Tahap 7: maskot 4 ekspresi, suara, PWA offline, tes aksesibilitas (axe, WCAG 2.1 AA),
      `prefers-reduced-motion`
- [x] Halaman Ujian (bagian 12): simulasi penuh, mini ujian per domain, titik lemah, riwayat, siap ujian
- [x] Tahap 8: sinkron progres antar-perangkat lewat Supabase dengan kode sinkron, tanpa akun
      (`src/sync/`, SQL di `supabase/migrations/`)

## Struktur

```
src/
  content/units/*.json   satu file per unit; lesson berisi "items" (kartu intro + soal)
  content/validate.ts    aturan konten (bagian 2, 3, dan 11.2 di rencana)
  content/visuals.ts     nama diagram yang boleh dipakai kartu intro
  exercises/             penilaian semua tipe soal (logic.ts) dan komponen jawabannya
  lesson/                player untuk lesson, latihan, dan checkpoint; kartu intro dan diagram
  exam/                  halaman Ujian: pemilihan soal, timer, skor, pembahasan
  charts/                grafik batang, garis, dan meter
  screens/               home (path map), latihan, statistik, glosarium, pengaturan
  store/progress.ts      progres pemain (Zustand, disimpan di localStorage)
  index.css              token warna, font, skala teks, tombol 3D
tests/e2e/               tes Playwright di lebar HP
.github/workflows/       CI dan deploy ke GitHub Pages
```

## Menulis konten

Tambah atau ubah file di `src/content/units/`, lalu jalankan `npm run check:content`. Error
berarti data rusak atau kunci jawaban salah. Peringatan menandai aturan konten yang belum
terpenuhi, misalnya singkatan tanpa kepanjangan, konsep yang diuji sebelum punya kartu
`intro`, atau jumlah soal di luar 8–12.
