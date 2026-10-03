import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['Banjir MAC', 'Port security'],
  ['Server DHCP palsu', 'DHCP snooping'],
  ['ARP palsu', 'DAI'],
  ['Badai broadcast', 'Storm control'],
  ['RA IPv6 palsu', 'RA guard'],
]

/** Each Layer 2 attack and the switch feature that stops it. */
export const L2Defenses: FC = () => (
  <svg
    viewBox="0 0 300 174"
    role="img"
    aria-label="Serangan Layer 2 dan pertahanannya. Banjir MAC dihadang port security. Server DHCP palsu dan kehabisan alamat dihadang DHCP snooping. ARP palsu dihadang Dynamic ARP Inspection. Badai broadcast dihadang storm control. Router Advertisement IPv6 palsu dihadang RA guard."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r[0]}>
        <rect x={4} y={4 + i * 34} width={130} height={30} rx={6} fill="var(--color-koral-muda)" />
        <text x={12} y={24 + i * 34} fontSize={12} {...label}>
          {r[0]}
        </text>
        <text x={142} y={24 + i * 34} fontSize={12} {...quiet}>
          →
        </text>
        <rect x={158} y={4 + i * 34} width={138} height={30} rx={6} fill="var(--color-mint-muda)" />
        <text x={166} y={24 + i * 34} fontSize={12} {...label}>
          {r[1]}
        </text>
      </g>
    ))}
  </svg>
)
