import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** CDP and LLDP only see directly connected neighbors. */
export const NeighborScope: FC = () => (
  <svg
    viewBox="0 0 300 180"
    role="img"
    aria-label="R1 tersambung ke SW1, dan SW1 tersambung ke SW2. Dari R1, show cdp neighbors hanya menampilkan SW1, tetangga yang tersambung langsung. SW2 tidak tampil di R1, karena pesan CDP dan LLDP tidak diteruskan melewati perangkat. Untuk melihat SW2, jalankan perintah itu di SW1."
    className="w-full font-display"
  >
    <DeviceIcon kind="router" x={40} y={50} />
    <DeviceIcon kind="switch" x={150} y={50} />
    <DeviceIcon kind="switch" x={260} y={50} />
    <text x={40} y={80} fontSize={12} textAnchor="middle" {...label}>
      R1
    </text>
    <text x={150} y={80} fontSize={12} textAnchor="middle" {...label}>
      SW1
    </text>
    <text x={260} y={80} fontSize={12} textAnchor="middle" {...label}>
      SW2
    </text>
    <line x1={62} y1={50} x2={128} y2={50} stroke="var(--color-mint-dalam)" strokeWidth={3} />
    <line x1={172} y1={50} x2={238} y2={50} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <rect x={20} y={100} width={150} height={30} rx={8} fill="var(--color-mint-muda)" />
    <text x={28} y={120} fontSize={12} {...label}>
      R1 melihat SW1
    </text>
    <rect x={176} y={100} width={120} height={30} rx={8} fill="var(--color-koral-muda)" />
    <text x={184} y={120} fontSize={12} {...label}>
      SW2 tidak tampil
    </text>
    <text x={4} y={160} fontSize={12} {...quiet}>
      Hanya tetangga yang tersambung langsung
    </text>
  </svg>
)
