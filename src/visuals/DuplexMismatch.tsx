import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** One side full duplex, the other half duplex: late collisions on the half side, CRC errors and runts on the full side. */
export const DuplexMismatch: FC = () => (
  <svg
    viewBox="0 0 300 170"
    role="img"
    aria-label="Duplex mismatch. SW1 di-set full duplex secara manual, sedangkan server memakai auto dan jatuh ke half duplex. Sisi half duplex mencatat late collision, sedangkan sisi full duplex mencatat error CRC dan runt. Solusinya: kedua sisi auto, atau kedua sisi di-set sama."
    className="w-full font-display"
  >
    <DeviceIcon kind="switch" x={50} y={44} />
    <text x={50} y={78} fontSize={13} textAnchor="middle" {...label}>
      SW1
    </text>
    <text x={50} y={94} fontSize={12} textAnchor="middle" {...quiet}>
      duplex full
    </text>
    <DeviceIcon kind="server" x={250} y={44} />
    <text x={250} y={78} fontSize={13} textAnchor="middle" {...label}>
      SRV1
    </text>
    <text x={250} y={94} fontSize={12} textAnchor="middle" {...quiet}>
      auto, jadi half
    </text>
    <path d="M76 44 H224" stroke="var(--color-koral-dalam)" strokeWidth={3} strokeDasharray="7 5" />
    <rect x={6} y={108} width={140} height={44} rx={8} fill="var(--color-koral-muda)" />
    <text x={14} y={126} fontSize={12} {...label}>
      Sisi full duplex:
    </text>
    <text x={14} y={143} fontSize={12} {...label}>
      CRC dan runt naik
    </text>
    <rect x={154} y={108} width={140} height={44} rx={8} fill="var(--color-koral-muda)" />
    <text x={162} y={126} fontSize={12} {...label}>
      Sisi half duplex:
    </text>
    <text x={162} y={143} fontSize={12} {...label}>
      late collision naik
    </text>
  </svg>
)
