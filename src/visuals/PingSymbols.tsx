import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { sym: '!!!!!', text: 'Semua balasan diterima' },
  { sym: '.!!!!', text: 'Paket pertama hilang (ARP)' },
  { sym: '.....', text: 'Timeout, tanpa balasan' },
  { sym: 'U.U.U', text: 'Unreachable: tidak ada jalan' },
]

/** What the characters in IOS ping output mean. */
export const PingSymbols: FC = () => (
  <svg
    viewBox="0 0 300 180"
    role="img"
    aria-label="Arti karakter output ping IOS. Lima tanda seru: semua balasan diterima. Titik lalu empat tanda seru: paket pertama hilang, biasanya karena menunggu ARP. Lima titik: timeout, tidak ada balasan sama sekali. Huruf U: unreachable, ada router yang mengirim ICMP unreachable karena tidak ada jalan ke tujuan."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r.sym}>
        <rect x={4} y={6 + i * 42} width={292} height={36} rx={6} fill={['var(--color-mint-muda)', 'var(--color-matahari-muda)', 'var(--color-koral-muda)', 'var(--color-koral-muda)'][i]} />
        <text x={12} y={29 + i * 42} fontSize={14} fontFamily="monospace" {...label}>
          {r.sym}
        </text>
        <text x={74} y={29 + i * 42} fontSize={12} {...quiet}>
          {r.text}
        </text>
      </g>
    ))}
  </svg>
)
