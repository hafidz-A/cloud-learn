import type { FC, ReactNode } from 'react'
import { Padlock, Person } from './parts'
import { label, quiet } from './styles'

function Column({ x, title, question, example, fill, stroke, icon }: { x: number; title: string; question: string[]; example: string[]; fill: string; stroke: string; icon: ReactNode }) {
  return (
    <g>
      <rect x={x} y={0} width={96} height={176} rx={12} fill={fill} stroke={stroke} strokeWidth={2} />
      {icon}
      <text x={x + 48} y={62} fontSize={14} textAnchor="middle" {...label}>
        {title}
      </text>
      {question.map((q, i) => (
        <text key={q} x={x + 48} y={84 + i * 15} fontSize={12} textAnchor="middle" {...label}>
          {q}
        </text>
      ))}
      <rect x={x + 6} y={116} width={84} height={50} rx={8} fill="#fff" stroke={stroke} strokeWidth={1.5} />
      {example.map((e, i) => (
        <text key={e} x={x + 48} y={136 + i * 15} fontSize={12} textAnchor="middle" {...quiet}>
          {e}
        </text>
      ))}
    </g>
  )
}

/** RBAC controls who, Azure Policy controls which settings, and a lock prevents accidents. */
export const PolicyRbacLock: FC = () => (
  <svg
    viewBox="0 0 300 176"
    role="img"
    aria-label="Diagram tiga alat governance: RBAC mengatur siapa boleh berbuat apa, Azure Policy mengatur konfigurasi resource yang boleh, dan resource lock mencegah hapus atau ubah yang tidak disengaja, bahkan untuk Owner."
    className="w-full font-display"
  >
    <Column
      x={0}
      title="RBAC"
      question={['Siapa boleh', 'berbuat apa']}
      example={['Reader:', 'hanya lihat']}
      fill="var(--color-biru-muda)"
      stroke="var(--color-biru)"
      icon={<Person x={41} y={16} />}
    />
    <Column
      x={102}
      title="Policy"
      question={['Konfigurasi', 'yang boleh']}
      example={['Hanya region', 'Eropa']}
      fill="var(--color-mint-muda)"
      stroke="var(--color-mint-dalam)"
      icon={
        <g>
          <rect x={141} y={14} width={18} height={22} rx={3} fill="#fff" stroke="var(--color-mint-dalam)" strokeWidth={2} />
          <path d="M145 22 H155 M145 28 H155" stroke="var(--color-mint-dalam)" strokeWidth={2} strokeLinecap="round" />
        </g>
      }
    />
    <Column
      x={204}
      title="Lock"
      question={['Cegah hapus', 'tak sengaja']}
      example={['Berlaku juga', 'untuk Owner']}
      fill="var(--color-matahari-muda)"
      stroke="var(--color-matahari-dalam)"
      icon={<Padlock x={244} y={16} color="var(--color-tinta-lembut)" />}
    />
  </svg>
)
