import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['Publik', 'Dokumentasi Cisco, RFC', 'Boleh', 'var(--color-mint-muda)'],
  ['Internal', 'Topologi tanpa alamat asli', 'Alat resmi', 'var(--color-matahari-muda)'],
  ['Rahasia', 'Password, key, data pelanggan', 'Jangan', 'var(--color-koral-muda)'],
]

/** An example classification of what may go into an AI prompt. */
export const DataClasses: FC = () => (
  <svg
    viewBox="0 0 300 146"
    role="img"
    aria-label="Contoh klasifikasi data sebelum dimasukkan ke prompt. Publik, misalnya dokumentasi Cisco dan RFC: boleh. Internal, misalnya topologi tanpa alamat asli: hanya ke alat AI yang disetujui organisasi. Rahasia, misalnya password, key, dan data pelanggan: jangan dimasukkan. Nama dan jumlah kelas mengikuti kebijakan tiap organisasi."
    className="w-full font-display"
  >
    <rect x={4} y={4} width={292} height={30} rx={6} fill="var(--color-biru-muda)" />
    {['Kelas', 'Contoh', 'Ke prompt?'].map((h, j) => (
      <text key={h} x={[10, 80, 226][j]} y={24} fontSize={12} {...label}>
        {h}
      </text>
    ))}
    {ROWS.map(([k, ex, ok, fill], i) => (
      <g key={k}>
        <rect x={4} y={38 + i * 34} width={292} height={30} rx={6} fill={fill} />
        <text x={10} y={58 + i * 34} fontSize={12} {...label}>
          {k}
        </text>
        <text x={80} y={58 + i * 34} fontSize={12} {...quiet}>
          {ex}
        </text>
        <text x={226} y={58 + i * 34} fontSize={12} {...label}>
          {ok}
        </text>
      </g>
    ))}
  </svg>
)
