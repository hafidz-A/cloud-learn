import type { FC } from 'react'
import { label, quiet } from './styles'

const VALUES = [128, 64, 32, 16, 8, 4, 2, 1]
const BITS = [1, 1, 0, 0, 0, 0, 0, 0]

/** The place values of one octet, with 192 = 128 + 64 as the example. */
export const OctetBits: FC = () => (
  <svg
    viewBox="0 0 300 150"
    role="img"
    aria-label="Nilai posisi delapan bit dalam satu oktet: 128, 64, 32, 16, 8, 4, 2, dan 1. Contohnya 192 ditulis 11000000, karena 128 ditambah 64 sama dengan 192. Oktet bernilai 0 sampai 255."
    className="w-full font-display"
  >
    <text x={4} y={18} fontSize={12} {...quiet}>
      Nilai posisi
    </text>
    {VALUES.map((v, i) => (
      <g key={v}>
        <rect x={4 + i * 37} y={26} width={33} height={30} rx={6} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={1.2} />
        <text x={20 + i * 37} y={46} fontSize={12} textAnchor="middle" {...label}>
          {v}
        </text>
        <rect x={4 + i * 37} y={66} width={33} height={30} rx={6} fill={BITS[i] ? 'var(--color-mint)' : '#fff'} stroke="var(--color-mint-dalam)" strokeWidth={1.2} />
        <text x={20 + i * 37} y={86} fontSize={13} textAnchor="middle" {...label}>
          {BITS[i]}
        </text>
      </g>
    ))}
    <text x={4} y={120} fontSize={13} {...label}>
      11000000 = 128 + 64 = 192
    </text>
    <text x={4} y={140} fontSize={12} {...quiet}>
      Satu oktet: 0 sampai 255
    </text>
  </svg>
)
