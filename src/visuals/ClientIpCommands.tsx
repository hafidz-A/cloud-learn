import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { os: 'Windows', cmd: 'ipconfig /all', note: '/release, /renew untuk DHCP' },
  { os: 'macOS', cmd: 'System Settings', note: 'Network > Details > TCP/IP' },
  { os: 'Linux', cmd: 'ip address show', note: 'ip route show: default via' },
]

/** Where to read IP settings on each client OS. */
export const ClientIpCommands: FC = () => (
  <svg
    viewBox="0 0 300 180"
    role="img"
    aria-label="Tempat melihat setelan IP di tiap OS klien. Windows: ipconfig /all, dengan /release dan /renew untuk DHCP. macOS: System Settings, lalu Network, Details, dan TCP/IP. Linux: ip address show untuk alamat, dan ip route show, di mana baris default via menunjukkan default gateway."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r.os}>
        <rect x={4} y={6 + i * 56} width={292} height={50} rx={8} fill={['var(--color-biru-muda)', 'var(--color-kabut)', 'var(--color-mint-muda)'][i]} />
        <text x={12} y={27 + i * 56} fontSize={13} {...label}>
          {r.os}
        </text>
        <text x={90} y={27 + i * 56} fontSize={12} fontFamily="monospace" {...label}>
          {r.cmd}
        </text>
        <text x={90} y={45 + i * 56} fontSize={12} {...quiet}>
          {r.note}
        </text>
      </g>
    ))}
  </svg>
)
