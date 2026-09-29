import type { FC, ReactNode } from 'react'
import { Building, Cloud, Person } from './parts'
import { label, quiet } from './styles'

function Panel({ x, y, title, caption, children }: { x: number; y: number; title: string; caption: string; children: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={146} height={112} rx={12} fill="#fff" stroke="var(--color-kabut-dalam)" strokeWidth={2} />
      <text x={x + 10} y={y + 20} fontSize={13} {...label}>
        {title}
      </text>
      {children}
      <text x={x + 73} y={y + 102} fontSize={12} textAnchor="middle" {...quiet}>
        {caption}
      </text>
    </g>
  )
}

/** Public, private, hybrid, and multi-cloud, one small picture each. */
export const CloudModels: FC = () => (
  <svg
    viewBox="0 0 300 232"
    role="img"
    aria-label="Diagram model cloud: public cloud dipakai bersama banyak pelanggan, private cloud dipakai satu organisasi, hybrid cloud menggabungkan on-premises dengan public cloud, dan multi-cloud memakai lebih dari satu penyedia."
    className="w-full font-display"
  >
    <Panel x={0} y={0} title="Public cloud" caption="banyak pelanggan">
      <Cloud x={43} y={28} w={60} />
      {[0, 1, 2].map((i) => (
        <Person key={i} x={42 + i * 24} y={70} />
      ))}
    </Panel>
    <Panel x={154} y={0} title="Private cloud" caption="satu organisasi">
      <Building x={210} y={32} />
      <Person x={251} y={56} />
    </Panel>
    <Panel x={0} y={120} title="Hybrid cloud" caption="on-premises + public">
      <Building x={18} y={150} />
      <path d="M56 172 H80" stroke="var(--color-biru-dalam)" strokeWidth={2.5} strokeDasharray="4 3" />
      <Cloud x={80} y={152} w={52} />
    </Panel>
    <Panel x={154} y={120} title="Multi-cloud" caption="lebih dari 1 penyedia">
      <Cloud x={164} y={150} w={58} />
      <text x={193} y={178} fontSize={12} textAnchor="middle" {...label}>
        A
      </text>
      <Cloud x={228} y={150} w={58} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" />
      <text x={257} y={178} fontSize={12} textAnchor="middle" {...label}>
        B
      </text>
    </Panel>
  </svg>
)
