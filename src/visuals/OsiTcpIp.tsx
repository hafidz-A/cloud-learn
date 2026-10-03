import type { FC } from 'react'
import { label, quiet } from './styles'

const OSI = ['7 Application', '6 Presentation', '5 Session', '4 Transport', '3 Network', '2 Data link', '1 Physical']
// TCP/IP layers (RFC 1122) and the OSI rows each one covers.
const TCPIP = [
  { name: 'Application', from: 0, to: 2 },
  { name: 'Transport', from: 3, to: 3 },
  { name: 'Internet', from: 4, to: 4 },
  { name: 'Link', from: 5, to: 6 },
]
const ROW = 26
const TOP = 30

/** OSI's seven layers next to the four TCP/IP layers, lined up by what they do. */
export const OsiTcpIp: FC = () => (
  <svg
    viewBox="0 0 300 220"
    role="img"
    aria-label="Model OSI tujuh layer di kiri dan model TCP/IP empat layer di kanan. Layer Application TCP/IP mencakup Application, Presentation, dan Session OSI. Transport sama dengan layer 4, Internet sama dengan layer 3 Network, dan Link mencakup Data link dan Physical."
    className="w-full font-display"
  >
    <text x={75} y={18} fontSize={13} textAnchor="middle" {...label}>
      OSI
    </text>
    <text x={225} y={18} fontSize={13} textAnchor="middle" {...label}>
      TCP/IP
    </text>
    {OSI.map((name, i) => (
      <g key={name}>
        <rect x={8} y={TOP + i * ROW} width={134} height={ROW - 4} rx={6} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
        <text x={18} y={TOP + i * ROW + 15} fontSize={12} {...label}>
          {name}
        </text>
      </g>
    ))}
    {TCPIP.map((l) => {
      const y = TOP + l.from * ROW
      const h = (l.to - l.from + 1) * ROW - 4
      return (
        <g key={l.name}>
          <rect x={158} y={y} width={134} height={h} rx={6} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" strokeWidth={1.5} />
          <text x={225} y={y + h / 2 + 4} fontSize={12} textAnchor="middle" {...label}>
            {l.name}
          </text>
          <path d={`M142 ${y + h / 2} H158`} stroke="var(--color-kabut-dalam)" strokeWidth={1.5} strokeDasharray="3 3" />
        </g>
      )
    })}
    <text x={150} y={214} fontSize={12} textAnchor="middle" {...quiet}>
      Model berbeda, fungsi yang sama
    </text>
  </svg>
)
