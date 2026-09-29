import type { FC } from 'react'
import { useSvgId } from './ids'
import { label } from './styles'

function MiniRegion({ x, name }: { x: number; name: string }) {
  return (
    <g>
      <rect x={x} y={44} width={96} height={80} rx={14} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={x + 48} y={66} fontSize={13} textAnchor="middle" {...label}>
        {name}
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x + 15 + i * 24} y={80} width={18} height={26} rx={4} fill="#fff" stroke="var(--color-biru)" strokeWidth={1.5} />
      ))}
    </g>
  )
}

/** Two regions in one geography, far apart, backing each other up. */
export const RegionPair: FC = () => {
  const pairArrow = useSvgId('pair-arrow')
  return (
    <svg viewBox="0 0 300 150" role="img" aria-label="Diagram: dua region dalam satu geografi, berjarak sekitar 480 kilometer, saling jadi cadangan." className="w-full font-display">
      <defs>
        <marker id={pairArrow} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="var(--color-biru-dalam)" />
        </marker>
      </defs>
      <rect x={3} y={3} width={294} height={144} rx={18} fill="none" stroke="var(--color-kabut-dalam)" strokeWidth={2} strokeDasharray="7 5" />
      <text x={18} y={25} fontSize={14} {...label}>
        Geografi
      </text>
      <MiniRegion x={18} name="Region A" />
      <MiniRegion x={186} name="Region B" />
      <line x1={120} y1={92} x2={182} y2={92} stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerStart={`url(#${pairArrow})`} markerEnd={`url(#${pairArrow})`} />
      <text x={151} y={82} fontSize={12} textAnchor="middle" {...label}>
        ≥480 km
      </text>
    </svg>
  )
}
