import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Mark } from './parts'
import { label, quiet } from './styles'

/**
 * Azure Policy from rule to result: definitions (grouped in an initiative) are
 * assigned to a scope, minus its exclusions; resources are evaluated on create
 * or update and every 24 hours; a non-compliant result gets the effect.
 */
export const PolicyFlow: FC = () => {
  const arrow = useSvgId('policy-arrow')
  const line = { stroke: 'var(--color-biru-dalam)', strokeWidth: 2, markerEnd: `url(#${arrow})` }
  return (
    <svg
      viewBox="0 0 300 224"
      role="img"
      aria-label="Alur Azure Policy: policy definition Allowed locations dan Require a tag digabung dalam sebuah initiative. Initiative itu di-assign ke subscription Production dengan exclusion resource group rg-lab. Resource dievaluasi saat dibuat atau diubah, dan setiap 24 jam. Hasilnya compliant, atau non-compliant sehingga effect seperti deny, audit, atau modify berlaku."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      {/* Initiative with two definitions */}
      <rect x={1} y={1} width={128} height={100} rx={12} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} strokeDasharray="5 4" />
      <text x={65} y={20} fontSize={12} textAnchor="middle" {...label}>
        Initiative
      </text>
      {['Allowed locations', 'Require a tag'].map((t, i) => (
        <g key={t}>
          <rect x={9} y={30 + i * 36} width={112} height={28} rx={8} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
          <text x={65} y={48 + i * 36} fontSize={12} textAnchor="middle" {...label}>
            {t}
          </text>
        </g>
      ))}
      <path d="M130 51 H146" {...line} />
      {/* Assignment */}
      <rect x={150} y={1} width={149} height={100} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={224} y={22} fontSize={12} textAnchor="middle" {...label}>
        Assignment
      </text>
      {['Scope: Production', 'Exclusion: rg-lab', 'Enforcement: Enabled'].map((t, i) => (
        <text key={t} x={160} y={46 + i * 18} fontSize={12} {...quiet}>
          {t}
        </text>
      ))}
      <path d="M224 102 V116" {...line} />
      {/* Evaluation */}
      <rect x={1} y={120} width={298} height={44} rx={10} fill="#fff" stroke="var(--color-kabut-dalam)" strokeWidth={2} />
      <text x={150} y={138} fontSize={12} textAnchor="middle" {...label}>
        Evaluasi resource
      </text>
      <text x={150} y={155} fontSize={12} textAnchor="middle" {...quiet}>
        saat dibuat atau diubah, dan tiap 24 jam
      </text>
      <path d="M75 165 V174" {...line} />
      <path d="M225 165 V174" {...line} />
      {/* Results */}
      <rect x={1} y={178} width={144} height={44} rx={10} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" strokeWidth={2} />
      <Mark cx={20} cy={200} ok />
      <text x={38} y={204} fontSize={12} {...label}>
        Compliant
      </text>
      <rect x={155} y={178} width={144} height={44} rx={10} fill="var(--color-koral-muda)" stroke="var(--color-koral)" strokeWidth={2} />
      <Mark cx={174} cy={200} ok={false} />
      <text x={192} y={196} fontSize={12} {...label}>
        Non-compliant
      </text>
      <text x={192} y={213} fontSize={12} {...quiet}>
        effect: deny, audit
      </text>
    </svg>
  )
}
