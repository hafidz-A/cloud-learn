import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Server } from './parts'
import { label, quiet } from './styles'

/** Scaling up makes one machine bigger; scaling out adds more machines. */
export const ScaleUpVsOut: FC = () => {
  const scaleArrow = useSvgId('scale-arrow')
  return (
    <svg
      viewBox="0 0 300 150"
      role="img"
      aria-label="Diagram scaling: scale up atau vertical membuat satu mesin makin besar, scale out atau horizontal menambah jumlah mesin."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={scaleArrow} />
      </defs>
      <text x={0} y={16} fontSize={14} {...label}>
        Scale up
      </text>
      <text x={0} y={32} fontSize={12} {...quiet}>
        vertical
      </text>
      <Server x={8} y={70} w={24} h={30} />
      <path d="M40 85 H62" stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${scaleArrow})`} />
      <Server x={72} y={44} w={48} h={62} />
      <text x={66} y={134} fontSize={12} textAnchor="middle" {...label}>
        satu mesin makin besar
      </text>

      <line x1={148} y1={8} x2={148} y2={140} stroke="var(--color-kabut)" strokeWidth={2} />

      <text x={160} y={16} fontSize={14} {...label}>
        Scale out
      </text>
      <text x={160} y={32} fontSize={12} {...quiet}>
        horizontal
      </text>
      <Server x={164} y={70} w={24} h={30} />
      <path d="M196 85 H216" stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${scaleArrow})`} />
      {[0, 1, 2].map((i) => (
        <Server key={i} x={224 + i * 25} y={70} w={22} h={30} />
      ))}
      <text x={228} y={134} fontSize={12} textAnchor="middle" {...label}>
        mesin makin banyak
      </text>
    </svg>
  )
}
