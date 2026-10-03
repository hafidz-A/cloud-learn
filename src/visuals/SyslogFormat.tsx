import type { FC } from 'react'
import { label, quiet } from './styles'

const PARTS = [
  { text: '%LINK', note: 'facility', w: 62 },
  { text: '-3-', note: 'severity', w: 40 },
  { text: 'UPDOWN', note: 'mnemonic', w: 70 },
  { text: ': Interface ...', note: 'teks pesan', w: 116 },
]

/** The parts of a Cisco IOS system message. */
export const SyslogFormat: FC = () => (
  <svg
    viewBox="0 0 300 100"
    role="img"
    aria-label="Format pesan sistem IOS: persen, facility, tanda minus, severity, tanda minus, mnemonic, titik dua, lalu teks pesan. Contoh: %LINK-3-UPDOWN: Interface GigabitEthernet0/0/1, changed state to down. LINK adalah facility, 3 adalah severity errors, UPDOWN adalah mnemonic."
    className="w-full font-display"
  >
    {PARTS.map((p, i) => {
      const x = 4 + PARTS.slice(0, i).reduce((sum, q) => sum + q.w, 0)
      return (
        <g key={p.note}>
          <rect x={x} y={14} width={p.w - 2} height={32} rx={4} fill={i % 2 ? 'var(--color-matahari-muda)' : 'var(--color-biru-muda)'} />
          <text x={x + (p.w - 2) / 2} y={35} fontSize={12} textAnchor="middle" {...label}>
            {p.text}
          </text>
          <text x={x + (p.w - 2) / 2} y={66} fontSize={12} textAnchor="middle" {...quiet}>
            {p.note}
          </text>
        </g>
      )
    })}
  </svg>
)
