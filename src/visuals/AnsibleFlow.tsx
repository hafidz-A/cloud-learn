import type { FC } from 'react'
import { label, quiet } from './styles'

/** The control node reads the inventory and playbook, then reaches routers over SSH with no agent on them. */
export const AnsibleFlow: FC = () => (
  <svg
    viewBox="0 0 300 170"
    role="img"
    aria-label="Cara kerja Ansible untuk jaringan. Control node, komputer Linux tempat Ansible dipasang, membaca inventory berisi daftar perangkat dan playbook berisi tugas. Untuk perangkat jaringan, modul berjalan di control node itu sendiri, lalu Ansible membuka SSH ke setiap router dan switch. Perangkat tidak perlu agent."
    className="w-full font-display"
  >
    <rect x={4} y={6} width={86} height={30} rx={6} fill="var(--color-kabut)" />
    <text x={47} y={26} fontSize={12} textAnchor="middle" {...label}>
      inventory
    </text>
    <rect x={4} y={44} width={86} height={30} rx={6} fill="var(--color-kabut)" />
    <text x={47} y={64} fontSize={12} textAnchor="middle" {...label}>
      playbook
    </text>
    <rect x={4} y={92} width={86} height={60} rx={8} fill="var(--color-matahari-muda)" />
    <text x={47} y={116} fontSize={12} textAnchor="middle" {...label}>
      Control
    </text>
    <text x={47} y={132} fontSize={12} textAnchor="middle" {...label}>
      node
    </text>
    <path d="M47 74 V92" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    {['R1', 'R2', 'SW1'].map((name, i) => (
      <g key={name}>
        <rect x={214} y={30 + i * 44} width={82} height={34} rx={6} fill="var(--color-mint-muda)" />
        <text x={255} y={51 + i * 44} fontSize={12} textAnchor="middle" {...label}>
          {name}
        </text>
        <path d={`M90 122 L214 ${47 + i * 44}`} stroke="var(--color-tinta-lembut)" strokeWidth={1.2} />
      </g>
    ))}
    <text x={130} y={20} fontSize={12} {...quiet}>
      SSH, tanpa agent
    </text>
  </svg>
)
