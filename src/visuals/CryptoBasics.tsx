import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { name: 'Hash', key: 'Tanpa kunci, satu arah', use: 'Integritas, simpan password', fill: 'var(--color-matahari-muda)' },
  { name: 'Simetris', key: 'Satu kunci yang sama', use: 'Enkripsi data, cepat (AES)', fill: 'var(--color-biru-muda)' },
  { name: 'Asimetris', key: 'Kunci publik + privat', use: 'Tukar kunci, tanda tangan', fill: 'var(--color-mint-muda)' },
]

/** Hashing, symmetric, and asymmetric cryptography side by side. */
export const CryptoBasics: FC = () => (
  <svg
    viewBox="0 0 300 190"
    role="img"
    aria-label="Tiga alat kriptografi. Hash tidak memakai kunci dan hanya satu arah; dipakai untuk memeriksa integritas dan menyimpan password. Enkripsi simetris memakai satu kunci yang sama untuk mengunci dan membuka; cepat, misalnya AES, untuk mengenkripsi data. Enkripsi asimetris memakai pasangan kunci publik dan privat; dipakai untuk bertukar kunci dan tanda tangan digital, misalnya RSA."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r.name}>
        <rect x={4} y={6 + i * 58} width={292} height={52} rx={8} fill={r.fill} />
        <text x={12} y={26 + i * 58} fontSize={13} {...label}>
          {r.name}
        </text>
        <text x={100} y={26 + i * 58} fontSize={12} {...label}>
          {r.key}
        </text>
        <text x={100} y={46 + i * 58} fontSize={12} {...quiet}>
          {r.use}
        </text>
      </g>
    ))}
  </svg>
)
