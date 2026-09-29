# AZ-104 tahap 1: ringkasan skema Supabase dan rencana perubahan

Dokumen ini untuk gerbang persetujuan di `LANGIT_AZ104_PLAN.md` bagian 10 dan
Prompt A: ringkasan skema yang ada dan rencana perubahan, **sebelum mengubah apa pun**.
Belum ada yang diubah di database maupun di kode.

## 1. Skema yang ada sekarang

Sumber: `supabase/migrations/20260929120000_sync_progress.sql`, `src/sync/`, project Supabase "langit".

| Hal | Isi |
|---|---|
| Tabel | Satu tabel: `public.sync_progress` |
| Kolom | `code_hash text` (primary key), `data jsonb`, `version bigint`, `updated_at timestamptz` |
| Kunci baris | SHA-256 dari kode sinkron 16 karakter. Kode aslinya tidak pernah disimpan |
| Relasi | Tidak ada. Tidak ada tabel lain dan tidak ada akun pengguna (Langit tanpa login) |
| RLS | Aktif, tanpa policy, semua hak tabel dicabut dari `anon` dan `authenticated`. Tabel tertutup untuk API |
| Jalan masuk | Dua fungsi `security definer` yang hanya boleh dipanggil `anon`: `sync_pull(p_code)` dan `sync_push(p_code, p_data, p_version)` |
| Konkurensi | `sync_push` hanya menulis kalau `p_version` masih sama dengan versi di server; kalau tidak, klien pull, gabung, lalu coba lagi |
| Batas | Kode minimal 16 karakter, `data` maksimal 1 MB |
| Isi `data` | Satu JSON berisi seluruh progres: `xp`, `xpByDay`, `dailyGoal`, `streak`, `hearts`, `heartsDay`, `heartsEnabled`, `soundEnabled`, `lessonsDone`, `checkpoints`, `unitLevel`, `review`, `conceptStats`, `examHistory`, `reviewRemoved`, `settingsAt`, `heartsAt`, `resetAt` |
| Data sekarang | 1 baris (akunmu), sekitar 1,5 KB |
| Konten soal | Di file JSON di repo (`src/content/units/`), bukan di Supabase |

Artinya, saran di rencana (kolom `course` di tabel progres, review, statistik konsep,
dan percobaan ujian) tidak cocok dengan skema ini: tabel-tabel itu tidak ada. Semua
progres adalah satu dokumen JSON per kode sinkron.

## 2. Rencana: perubahan sekecil mungkin

### 2.1 Bentuk data (tanpa kolom atau tabel baru)

Data AZ-900 **tetap di tempatnya sekarang** (kunci tingkat atas), jadi tidak ada data
lama yang dipindah atau diisi ulang. Data per course AZ-104 ditambahkan di satu kunci baru:

```jsonc
{
  // bersama untuk seluruh aplikasi (tidak berubah): xp, xpByDay, dailyGoal, streak, hearts, ...
  // AZ-900 (tidak berubah): lessonsDone, checkpoints, unitLevel, review, conceptStats, examHistory, reviewRemoved
  "courses": {
    "az104": {
      "lessonsDone": {}, "checkpoints": {}, "unitLevel": {},
      "review": {}, "reviewRemoved": {}, "conceptStats": {},
      "examHistory": [], "placement": null
    }
  }
}
```

- XP total, streak, target harian, dan hearts tetap satu (bagian 10), jadi tidak bisa terhitung dua kali.
- AZ-104 perlu wadah sendiri walau id-nya berawalan `az104-`, karena ada yang bisa bentrok:
  id checkpoint (`cp1` ada di kedua course), concept tag (misalnya `rbac`), dan riwayat ujian.
- Course yang terakhir dimainkan (`activeCourse`) disimpan per perangkat, seperti pengaturan lain yang tidak disinkron.

### 2.2 Satu-satunya perubahan SQL: jaring pengaman untuk aplikasi versi lama

Masalahnya: aplikasi versi lama yang masih terbuka di perangkat lain belum mengenal kunci
`courses`. Saat sinkron, versi lama menggabungkan lalu mengirim hanya kunci yang ia kenal,
jadi **progres AZ-104 bisa terhapus** dari server. PWA memang memperbarui diri otomatis,
tapi tab lama yang masih terbuka bisa sempat sinkron dulu.

Perbaikannya satu baris di `sync_push`: saat update, gabungkan dengan data lama
(`data = s.data || p_data`) alih-alih menimpa seluruhnya. Kunci yang tidak dikirim klien
(misalnya `courses` dari versi lama) tetap tersimpan. Kunci yang dikirim tetap menang
seperti sekarang, jadi perilaku AZ-900 tidak berubah.

Migration baru: `supabase/migrations/<tanggal>_sync_push_keep_unknown_keys.sql`, berisi
`create or replace function public.sync_push ...` dengan perubahan itu saja. Tabel, RLS,
dan hak akses tidak berubah, jadi tidak ada celah baru.

### 2.3 Urutan kerja setelah disetujui

1. **Backup**: simpan salinan baris `sync_progress` (data, version, md5) ke file di scratchpad
   sebelum menjalankan migration.
2. **Uji dulu**: jalankan fungsi baru di Postgres lokal atau branch Supabase kalau tersedia.
   Uji: update dengan data tanpa `courses` mempertahankan `courses`; versi yang salah tetap ditolak.
3. **Terapkan** migration ke project "langit" (bukan project lain).
4. **Kode aplikasi**:
   - Store progres: `courses.az104` dan `activeCourse`, migration store v2 ke v3 yang hanya
     menambah kunci (data AZ-900 tidak disentuh).
   - Sinkron: `courses` ikut disinkron, dengan aturan gabung yang sama per course; unit test baru,
     termasuk "menggabungkan AZ-104 tidak mengubah data AZ-900" dan "payload versi lama tanpa `courses`".
   - Pemilih course di header home, path map dan halaman Ujian mengikuti course aktif.
   - Validator: semua id di folder AZ-104 wajib berawalan `az104-`.
5. **Cek akhir** (Prompt A): di lebar 390px pemilih course berjalan, AZ-104 terbuka tanpa syarat,
   dan progres, XP, streak, antrean review, serta riwayat ujian AZ-900 di Supabase sama
   dengan backup langkah 1. Semua "cara mengecek" yang relevan di `docs/BUGS_LOG.md` dijalankan.

## 3. Yang perlu kamu putuskan

1. Setuju bentuk data di 2.1 (AZ-900 tetap di tempat, AZ-104 di `courses.az104`)?
2. Setuju satu migration SQL di 2.2 (`sync_push` menggabung, bukan menimpa)?
3. Ujian yang sedang berjalan: rencana bagian 9.2 menyebut sisa waktu disimpan di Supabase,
   tapi di AZ-900 ujian berjalan disimpan di perangkat saja (tidak disinkron). Untuk AZ-104,
   ikut cara AZ-900 (usulanku, karena bagian 9 minta "sama persis"), atau disinkron juga?
