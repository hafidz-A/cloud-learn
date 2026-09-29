import type { FC } from 'react'
import { Building, Cloud, Padlock } from './parts'
import { label, quiet } from './styles'

/** Two ways from an office to a VNet: VPN through the internet, or ExpressRoute over a private line. */
export const HybridConnectivity: FC = () => (
  <svg
    viewBox="0 0 300 196"
    role="img"
    aria-label="Diagram koneksi hybrid: VPN Gateway mengirim traffic terenkripsi dari on-premises ke VNet lewat internet publik, sedangkan ExpressRoute memakai jalur privat lewat penyedia konektivitas tanpa melewati internet."
    className="w-full font-display"
  >
    <Building x={20} y={70} />
    <text x={37} y={128} fontSize={12} textAnchor="middle" {...label}>
      On-premises
    </text>

    <rect x={226} y={70} width={70} height={52} rx={10} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
    <text x={261} y={92} fontSize={13} textAnchor="middle" {...label}>
      VNet
    </text>
    <text x={261} y={110} fontSize={12} textAnchor="middle" {...quiet}>
      Azure
    </text>

    {/* VPN: dashed, through the internet */}
    <path d="M54 80 H66 C92 80 96 40 118 40 M182 40 C230 40 261 44 261 70" fill="none" stroke="var(--color-biru-dalam)" strokeWidth={2.5} strokeDasharray="6 4" />
    <Cloud x={120} y={20} w={62} fill="#fff" stroke="var(--color-tinta-lembut)" />
    <text x={151} y={48} fontSize={12} textAnchor="middle" {...label}>
      Internet
    </text>
    <Padlock x={143} y={60} color="var(--color-biru-dalam)" />
    <text x={150} y={14} fontSize={12} textAnchor="middle" {...label}>
      VPN: terenkripsi, lewat internet
    </text>

    {/* ExpressRoute: solid, private line through a provider */}
    <path d="M54 104 H70 C96 104 98 152 118 152 M182 152 C232 152 261 148 261 122" fill="none" stroke="var(--color-mint-dalam)" strokeWidth={4} />
    <rect x={118} y={140} width={64} height={24} rx={6} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" strokeWidth={2} />
    <text x={150} y={156} fontSize={12} textAnchor="middle" {...label}>
      penyedia
    </text>
    <text x={150} y={186} fontSize={12} textAnchor="middle" {...label}>
      ExpressRoute: jalur privat
    </text>
  </svg>
)
