import type { FC } from 'react'
import { label, quiet } from './styles'

/** Site-to-site joins two networks through gateways; remote access joins one device. */
export const VpnTypes: FC = () => (
  <svg
    viewBox="0 0 300 180"
    role="img"
    aria-label="Dua jenis VPN. Atas, site-to-site: LAN kantor pusat dan LAN cabang masing-masing di belakang router atau firewall, dan terowongan terenkripsi melintasi internet di antara kedua gateway itu; host tidak perlu software khusus. Bawah, remote access: satu laptop dengan software klien VPN membangun terowongan melintasi internet ke gateway kantor pusat."
    className="w-full font-display"
  >
    <text x={4} y={16} fontSize={12} {...label}>
      Site-to-site
    </text>
    <rect x={4} y={26} width={60} height={34} rx={6} fill="var(--color-mint-muda)" />
    <text x={34} y={47} fontSize={12} textAnchor="middle" {...label}>
      LAN A
    </text>
    <rect x={236} y={26} width={60} height={34} rx={6} fill="var(--color-mint-muda)" />
    <text x={266} y={47} fontSize={12} textAnchor="middle" {...label}>
      LAN B
    </text>
    <rect x={72} y={30} width={30} height={26} rx={4} fill="var(--color-matahari-muda)" />
    <rect x={198} y={30} width={30} height={26} rx={4} fill="var(--color-matahari-muda)" />
    <path d="M102 43 H198" stroke="var(--color-koral-dalam)" strokeWidth={6} strokeOpacity={0.35} />
    <path d="M102 43 H198" stroke="var(--color-koral-dalam)" strokeWidth={1.5} strokeDasharray="4 3" />
    <text x={150} y={76} fontSize={12} textAnchor="middle" {...quiet}>
      gateway ke gateway
    </text>
    <text x={4} y={108} fontSize={12} {...label}>
      Remote access
    </text>
    <rect x={4} y={118} width={60} height={34} rx={6} fill="var(--color-kabut)" />
    <text x={34} y={139} fontSize={12} textAnchor="middle" {...label}>
      Laptop
    </text>
    <rect x={198} y={122} width={30} height={26} rx={4} fill="var(--color-matahari-muda)" />
    <rect x={236} y={118} width={60} height={34} rx={6} fill="var(--color-mint-muda)" />
    <text x={266} y={139} fontSize={12} textAnchor="middle" {...label}>
      LAN A
    </text>
    <path d="M64 135 H198" stroke="var(--color-koral-dalam)" strokeWidth={6} strokeOpacity={0.35} />
    <path d="M64 135 H198" stroke="var(--color-koral-dalam)" strokeWidth={1.5} strokeDasharray="4 3" />
    <text x={130} y={170} fontSize={12} textAnchor="middle" {...quiet}>
      klien VPN ke gateway
    </text>
  </svg>
)
