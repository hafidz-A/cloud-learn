import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Pill } from './parts'
import { label, quiet } from './styles'

const LEVELS = ['Management group', 'Subscription', 'Resource group', 'Resource']

/** A role assigned at the subscription flows down to its resource groups and resources, but not up. */
export const RbacScope: FC = () => {
  const rbacArrow = useSvgId('rbac-arrow')
  const rh = 42
  return (
    <svg
      viewBox="0 0 300 172"
      role="img"
      aria-label="Diagram scope RBAC: role Reader yang diberikan di subscription diwariskan ke resource group dan resource di bawahnya, tapi tidak berlaku di management group di atasnya."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={rbacArrow} />
      </defs>
      {LEVELS.map((l, i) => {
        const y = 4 + i * rh
        return (
          <g key={l}>
            <Pill x={0} y={y} w={138} lines={[l]} fill={i === 1 ? 'var(--color-biru-muda)' : '#fff'} stroke={i === 0 ? 'var(--color-kabut-dalam)' : 'var(--color-biru)'} />
            {i > 0 && <line x1={69} y1={y - 16} x2={69} y2={y} stroke="var(--color-kabut-dalam)" strokeWidth={2} />}
          </g>
        )
      })}
      <text x={150} y={21} fontSize={12} {...quiet}>
        tidak berlaku ke atas
      </text>
      <rect x={150} y={4 + rh} width={96} height={26} rx={13} fill="var(--color-biru-dalam)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={198} y={21 + rh} fontSize={12} textAnchor="middle" fill="#fff" fontWeight={700}>
        Reader
      </text>
      <text x={252} y={21 + rh} fontSize={12} {...label}>
        diberi
      </text>
      {[2, 3].map((i) => (
        <g key={i}>
          <rect x={150} y={4 + i * rh} width={96} height={26} rx={13} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} strokeDasharray="5 4" />
          <text x={198} y={21 + i * rh} fontSize={12} textAnchor="middle" {...label}>
            Reader
          </text>
          <text x={252} y={21 + i * rh} fontSize={12} {...quiet}>
            warisan
          </text>
        </g>
      ))}
      <path d={`M246 ${34 + rh} C262 ${40 + rh} 262 ${rh * 2} 248 ${rh * 2 + 6}`} fill="none" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${rbacArrow})`} />
    </svg>
  )
}
