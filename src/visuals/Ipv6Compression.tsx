import type { FC } from 'react'
import { label, quiet } from './styles'

const STEPS = [
  { title: 'Lengkap, 8 kelompok 16 bit', text: '2001:0db8:0000:0000:0000:00ff:0000:0001' },
  { title: '1. Buang nol di depan tiap kelompok', text: '2001:db8:0:0:0:ff:0:1' },
  { title: '2. Ganti deret nol terpanjang dengan ::', text: '2001:db8::ff:0:1' },
]

/** IPv6 shortening: drop leading zeros, then replace the longest run of zero groups with :: once. */
export const Ipv6Compression: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Menyingkat alamat IPv6. Alamat lengkap 2001:0db8:0000:0000:0000:00ff:0000:0001 punya delapan kelompok 16 bit. Langkah 1, buang nol di depan tiap kelompok menjadi 2001:db8:0:0:0:ff:0:1. Langkah 2, ganti deret kelompok nol terpanjang dengan dua titik dua, sekali saja, menjadi 2001:db8::ff:0:1."
    className="w-full font-display"
  >
    {STEPS.map((s, i) => (
      <g key={s.title}>
        <text x={6} y={18 + i * 60} fontSize={12} {...quiet}>
          {s.title}
        </text>
        <rect x={6} y={26 + i * 60} width={288} height={28} rx={6} fill={i === 2 ? 'var(--color-mint-muda)' : 'var(--color-biru-muda)'} stroke="var(--color-kabut-dalam)" strokeWidth={1} />
        <text x={150} y={45 + i * 60} fontSize={i === 0 ? 12 : 13} textAnchor="middle" fontFamily="monospace" {...label}>
          {s.text}
        </text>
      </g>
    ))}
    <text x={6} y={194} fontSize={12} {...quiet}>
      :: hanya boleh dipakai sekali
    </text>
  </svg>
)
