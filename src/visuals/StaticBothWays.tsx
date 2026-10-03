import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** Static routes are needed in both directions: R1 to the LAN behind R2, and R2 back to the LAN behind R1. */
export const StaticBothWays: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="R1 dengan LAN 192.168.1.0/24 tersambung ke R2 lewat link 10.0.12.0/30. Di belakang R2 ada LAN 192.168.2.0/24. R1 butuh static route ke 192.168.2.0/24 via 10.0.12.2, dan R2 butuh route balik ke 192.168.1.0/24 via 10.0.12.1. Tanpa route balik, ping tetap gagal."
    className="w-full font-display"
  >
    <DeviceIcon kind="pc" x={24} y={50} />
    <DeviceIcon kind="router" x={100} y={50} />
    <DeviceIcon kind="router" x={200} y={50} />
    <DeviceIcon kind="pc" x={276} y={50} />
    <line x1={44} y1={50} x2={78} y2={50} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <line x1={122} y1={50} x2={178} y2={50} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <line x1={222} y1={50} x2={256} y2={50} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <text x={100} y={80} fontSize={12} textAnchor="middle" {...label}>
      R1
    </text>
    <text x={200} y={80} fontSize={12} textAnchor="middle" {...label}>
      R2
    </text>
    <text x={24} y={80} fontSize={12} textAnchor="middle" {...quiet}>
      .1.0/24
    </text>
    <text x={276} y={80} fontSize={12} textAnchor="middle" {...quiet}>
      .2.0/24
    </text>
    <text x={150} y={38} fontSize={12} textAnchor="middle" {...quiet}>
      10.0.12.0/30
    </text>
    <rect x={4} y={100} width={292} height={40} rx={8} fill="var(--color-biru-muda)" />
    <text x={12} y={117} fontSize={12} {...label}>
      R1: ip route 192.168.2.0 255.255.255.0
    </text>
    <text x={12} y={133} fontSize={12} {...quiet}>
      via 10.0.12.2
    </text>
    <rect x={4} y={146} width={292} height={40} rx={8} fill="var(--color-mint-muda)" />
    <text x={12} y={163} fontSize={12} {...label}>
      R2: ip route 192.168.1.0 255.255.255.0
    </text>
    <text x={12} y={179} fontSize={12} {...quiet}>
      via 10.0.12.1 (route balik)
    </text>
  </svg>
)
