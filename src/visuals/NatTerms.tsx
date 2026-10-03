import type { FC } from 'react'
import { label, quiet } from './styles'

/** Inside local and inside global for one PC behind a NAT router. */
export const NatTerms: FC = () => (
  <svg
    viewBox="0 0 300 170"
    role="img"
    aria-label="PC di jaringan dalam beralamat 192.168.1.10, itu inside local. Router NAT dengan interface inside di kiri dan outside di kanan menerjemahkannya menjadi 203.0.113.5, itu inside global, alamat yang dilihat internet. Server di internet beralamat 198.51.100.7, itu outside global."
    className="w-full font-display"
  >
    <rect x={4} y={10} width={136} height={150} rx={8} fill="var(--color-mint-muda)" />
    <rect x={160} y={10} width={136} height={150} rx={8} fill="var(--color-biru-muda)" />
    <text x={72} y={28} fontSize={12} textAnchor="middle" {...label}>
      Inside
    </text>
    <text x={228} y={28} fontSize={12} textAnchor="middle" {...label}>
      Outside (internet)
    </text>
    <rect x={14} y={44} width={70} height={30} rx={6} fill="var(--color-kabut)" />
    <text x={49} y={64} fontSize={12} textAnchor="middle" {...label}>
      PC
    </text>
    <rect x={124} y={44} width={52} height={30} rx={6} fill="var(--color-matahari-muda)" />
    <text x={150} y={64} fontSize={12} textAnchor="middle" {...label}>
      NAT
    </text>
    <rect x={216} y={44} width={70} height={30} rx={6} fill="var(--color-kabut)" />
    <text x={251} y={64} fontSize={12} textAnchor="middle" {...label}>
      Server
    </text>
    <path d="M84 59 H124 M176 59 H216" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <text x={14} y={98} fontSize={12} {...label}>
      Inside local
    </text>
    <text x={14} y={114} fontSize={12} {...quiet}>
      192.168.1.10
    </text>
    <text x={170} y={98} fontSize={12} {...label}>
      Inside global
    </text>
    <text x={170} y={114} fontSize={12} {...quiet}>
      203.0.113.5
    </text>
    <text x={170} y={138} fontSize={12} {...label}>
      Outside global
    </text>
    <text x={170} y={154} fontSize={12} {...quiet}>
      198.51.100.7
    </text>
  </svg>
)
