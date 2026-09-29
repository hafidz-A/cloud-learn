import type { Exercise } from '../lib/types'

/** Short instruction (Indonesian) above each exercise type. */
export const INSTRUCTIONS: Record<Exercise['type'], string> = {
  choice: 'Pilih jawaban yang benar',
  fix: 'Apa tindakan yang memperbaikinya?',
  multi: 'Pilih semua jawaban yang benar',
  truefalse: 'Benar atau salah?',
  yesno: 'Jawab Yes atau No untuk setiap pernyataan',
  match: 'Cocokkan pasangannya',
  order: 'Susun dari atas ke bawah',
  sort: 'Masukkan setiap kartu ke keranjang yang tepat',
  fill: 'Lengkapi kalimatnya',
  place: 'Taruh resource di tempat yang tepat',
  shell: 'Susun perintahnya',
}
