import type { FC } from 'react'
import { label, quiet } from './styles'

/** An SNMP manager polls agents with get and set; agents send traps and informs. */
export const SnmpRoles: FC = () => (
  <svg
    viewBox="0 0 300 160"
    role="img"
    aria-label="SNMP. Di kiri, manager atau NMS. Di kanan, router dengan agent SNMP dan MIB berisi variabel. Manager mengirim get untuk membaca dan set untuk mengubah variabel ke UDP port 161 di agent. Agent mengirim trap atau inform, pemberitahuan tanpa diminta, ke UDP port 162 di manager; inform dibalas, trap tidak."
    className="w-full font-display"
  >
    <rect x={4} y={40} width={86} height={70} rx={8} fill="var(--color-biru-muda)" />
    <text x={47} y={70} fontSize={12} textAnchor="middle" {...label}>
      Manager
    </text>
    <text x={47} y={88} fontSize={12} textAnchor="middle" {...quiet}>
      (NMS)
    </text>
    <rect x={210} y={40} width={86} height={70} rx={8} fill="var(--color-mint-muda)" />
    <text x={253} y={64} fontSize={12} textAnchor="middle" {...label}>
      Agent
    </text>
    <rect x={226} y={74} width={54} height={26} rx={4} fill="var(--color-matahari-muda)" />
    <text x={253} y={92} fontSize={12} textAnchor="middle" {...label}>
      MIB
    </text>
    <path d="M90 58 H210" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <path d="M202 53 L210 58 L202 63" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} fill="none" />
    <text x={150} y={50} fontSize={12} textAnchor="middle" {...quiet}>
      get, set → UDP 161
    </text>
    <path d="M210 94 H90" stroke="var(--color-koral-dalam)" strokeWidth={1.5} />
    <path d="M98 89 L90 94 L98 99" stroke="var(--color-koral-dalam)" strokeWidth={1.5} fill="none" />
    <text x={150} y={116} fontSize={12} textAnchor="middle" {...quiet}>
      trap, inform → UDP 162
    </text>
    <text x={150} y={148} fontSize={12} textAnchor="middle" {...quiet}>
      inform dibalas, trap tidak
    </text>
  </svg>
)
