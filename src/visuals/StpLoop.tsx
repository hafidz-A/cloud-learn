import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** Three switches in a triangle without STP: a broadcast circles forever. */
export const StpLoop: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Tiga switch tersambung membentuk segitiga. Tanpa spanning tree, broadcast dari PC berputar terus di segitiga itu dan tergandakan di setiap switch, karena frame Ethernet tidak punya TTL. Akibatnya broadcast storm, tabel MAC terus berubah, dan PC menerima frame ganda. STP memblokir satu port, ditandai X, sehingga hanya ada satu jalur aktif."
    className="w-full font-display"
  >
    <DeviceIcon kind="switch" x={150} y={30} />
    <DeviceIcon kind="switch" x={50} y={130} />
    <DeviceIcon kind="switch" x={250} y={130} />
    <text x={150} y={14} fontSize={12} textAnchor="middle" {...label}>
      SW1
    </text>
    <text x={50} y={160} fontSize={12} textAnchor="middle" {...label}>
      SW2
    </text>
    <text x={250} y={160} fontSize={12} textAnchor="middle" {...label}>
      SW3
    </text>
    <line x1={136} y1={44} x2={64} y2={116} stroke="var(--color-koral-dalam)" strokeWidth={2.5} />
    <line x1={164} y1={44} x2={236} y2={116} stroke="var(--color-koral-dalam)" strokeWidth={2.5} />
    <line x1={74} y1={130} x2={226} y2={130} stroke="var(--color-koral-dalam)" strokeWidth={2.5} strokeDasharray="6 4" />
    <text x={150} y={124} fontSize={16} textAnchor="middle" fill="var(--color-koral-dalam)" fontWeight={700}>
      X
    </text>
    <text x={150} y={92} fontSize={12} textAnchor="middle" {...quiet}>
      broadcast berputar
    </text>
    <text x={4} y={184} fontSize={12} {...label}>
      Tanpa STP: storm, MAC berubah-ubah
    </text>
    <text x={4} y={198} fontSize={12} {...quiet}>
      STP memblokir satu port (X)
    </text>
  </svg>
)
