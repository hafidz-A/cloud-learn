import type { FC } from 'react'
import { label, quiet } from './styles'

/** DHCP snooping trusts only the uplink to the real server and drops server messages elsewhere. */
export const SnoopTrust: FC = () => (
  <svg
    viewBox="0 0 300 170"
    role="img"
    aria-label="DHCP snooping di switch. Port uplink ke server DHCP asli ditandai trusted, jadi offer dan ack dari server itu diteruskan. Port akses ke PC dan ke server DHCP palsu tetap untrusted, bawaannya. Offer dari server palsu di port untrusted dibuang. Dari pertukaran yang sah, switch membangun tabel binding berisi MAC, IP, VLAN, dan port."
    className="w-full font-display"
  >
    <rect x={110} y={66} width={80} height={36} rx={6} fill="var(--color-matahari-muda)" />
    <text x={150} y={89} fontSize={12} textAnchor="middle" {...label}>
      Switch
    </text>
    <rect x={110} y={4} width={80} height={30} rx={6} fill="var(--color-mint-muda)" />
    <text x={150} y={24} fontSize={12} textAnchor="middle" {...label}>
      DHCP asli
    </text>
    <path d="M150 34 V66" stroke="var(--color-mint-dalam)" strokeWidth={2} />
    <text x={158} y={54} fontSize={12} {...quiet}>
      trusted
    </text>
    <rect x={4} y={130} width={70} height={30} rx={6} fill="var(--color-kabut)" />
    <text x={39} y={150} fontSize={12} textAnchor="middle" {...label}>
      PC
    </text>
    <path d="M74 140 L118 102" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <rect x={208} y={130} width={88} height={30} rx={6} fill="var(--color-koral-muda)" />
    <text x={252} y={150} fontSize={12} textAnchor="middle" {...label}>
      DHCP palsu
    </text>
    <path d="M226 130 L182 102" stroke="var(--color-koral-dalam)" strokeWidth={1.5} strokeDasharray="4 3" />
    <text x={80} y={124} fontSize={12} {...quiet}>
      untrusted
    </text>
    <text x={210} y={118} fontSize={12} {...quiet}>
      offer dibuang
    </text>
  </svg>
)
