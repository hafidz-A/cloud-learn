import type { FC } from 'react'
import { Mark } from './parts'
import { label, quiet } from './styles'

function Scope({ x, y, w, text, ok, assigned = false }: { x: number; y: number; w: number; text: string; ok: boolean; assigned?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={26}
        rx={8}
        fill={assigned ? 'var(--color-mint-muda)' : '#fff'}
        stroke={assigned ? 'var(--color-mint-dalam)' : 'var(--color-biru)'}
        strokeWidth={2}
      />
      <text x={x + (w - 20) / 2} y={y + 17} fontSize={12} textAnchor="middle" {...label}>
        {text}
      </text>
      <Mark cx={x + w - 13} cy={y + 13} ok={ok} />
    </g>
  )
}

/**
 * One role assignment at resource group scope: it applies to that resource
 * group and everything in it (inherited), but not to the parents above it or
 * to a sibling resource group.
 */
export const RoleScopeTree: FC = () => {
  const line = { stroke: 'var(--color-kabut-dalam)', strokeWidth: 2, fill: 'none' }
  return (
    <svg
      viewBox="0 0 300 222"
      role="img"
      aria-label="Diagram scope role: Ani diberi role Contributor di resource group rg-web. Role itu berlaku di rg-web serta VM dan storage di dalamnya karena diwariskan ke bawah. Role itu tidak berlaku di subscription dan management group di atasnya, dan tidak berlaku di resource group lain, rg-data."
      className="w-full font-display"
    >
      <path d="M150 30 V50 M150 76 V88 M75 88 H225 M75 88 V100 M225 88 V100 M75 126 V140 M34 140 H107 M34 140 V152 M107 140 V152" {...line} />
      <Scope x={70} y={4} w={160} text="Management group" ok={false} />
      <Scope x={80} y={50} w={140} text="Subscription" ok={false} />
      <Scope x={6} y={100} w={138} text="rg-web" ok assigned />
      <Scope x={156} y={100} w={138} text="rg-data" ok={false} />
      <Scope x={4} y={152} w={60} text="VM" ok />
      <Scope x={68} y={152} w={80} text="Storage" ok />
      <text x={225} y={160} fontSize={12} textAnchor="middle" {...quiet}>
        diwariskan
      </text>
      <text x={225} y={176} fontSize={12} textAnchor="middle" {...quiet}>
        ke bawah saja
      </text>
      <text x={0} y={200} fontSize={12} {...label}>
        Assignment: Ani, Contributor, scope rg-web
      </text>
      <text x={0} y={216} fontSize={12} {...quiet}>
        Tidak naik ke atas, tidak ke samping
      </text>
    </svg>
  )
}
