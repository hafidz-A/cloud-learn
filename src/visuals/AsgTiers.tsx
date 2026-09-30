import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Mark } from './parts'
import { label, quiet } from './styles'

const TIERS = [
  { x: 0, name: 'AsgWeb', nics: ['web1', 'web2'] },
  { x: 102, name: 'AsgLogic', nics: ['app1'] },
  { x: 204, name: 'AsgDb', nics: ['db1'] },
]

/**
 * NSG rules that name application security groups instead of IP addresses:
 * internet to AsgWeb on 80, AsgLogic to AsgDb on 1433, everything else to
 * AsgDb denied. New VMs just join the right group.
 */
export const AsgTiers: FC = () => {
  const arrow = useSvgId('asg-arrow')
  return (
    <svg
      viewBox="0 0 300 214"
      role="img"
      aria-label="Diagram application security group: network interface web1 dan web2 masuk AsgWeb, app1 masuk AsgLogic, dan db1 masuk AsgDb. Aturan NSG memakai nama group itu: internet ke AsgWeb port 80 diizinkan, AsgLogic ke AsgDb port 1433 diizinkan, dan sumber lain ke AsgDb ditolak. Tidak ada alamat IP yang ditulis di aturan."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      {TIERS.map((t) => (
        <g key={t.name}>
          <rect x={t.x + 1} y={30} width={94} height={86} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} strokeDasharray="5 4" />
          <text x={t.x + 48} y={50} fontSize={12} textAnchor="middle" {...label}>
            {t.name}
          </text>
          {t.nics.map((n, i) => (
            <g key={n}>
              <rect x={t.x + 12} y={60 + i * 26} width={72} height={22} rx={6} fill="#fff" stroke="var(--color-biru)" strokeWidth={1.5} />
              <text x={t.x + 48} y={75 + i * 26} fontSize={12} textAnchor="middle" {...quiet}>
                {n}
              </text>
            </g>
          ))}
        </g>
      ))}
      <text x={48} y={14} fontSize={12} textAnchor="middle" {...quiet}>
        Internet
      </text>
      <path d="M48 18 V26" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />
      <path d="M198 73 H203" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />
      {[
        { y: 134, ok: true, text: 'Internet → AsgWeb, port 80' },
        { y: 160, ok: true, text: 'AsgLogic → AsgDb, port 1433' },
        { y: 186, ok: false, text: 'Sumber lain → AsgDb, port 1433' },
      ].map((r) => (
        <g key={r.text}>
          <rect x={0} y={r.y} width={300} height={24} rx={6} fill={r.ok ? '#fff' : 'var(--color-koral-muda)'} stroke="var(--color-kabut-dalam)" strokeWidth={1} />
          <Mark cx={14} cy={r.y + 12} ok={r.ok} />
          <text x={32} y={r.y + 16} fontSize={12} {...label}>
            {r.text}
          </text>
        </g>
      ))}
    </svg>
  )
}
