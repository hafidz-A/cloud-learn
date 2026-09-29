import type { FC } from 'react'
import type { VisualName } from '../content/visuals'

// Small diagrams for intro cards (plan section 11.1). Colors come from the
// palette tokens; labels use Tinta so they keep AA contrast on the light fills.

const label = { fill: 'var(--color-tinta)', fontWeight: 600 } as const

function ServerStack({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 11, 22].map((dy) => (
        <g key={dy}>
          <rect x={x} y={y + dy} width={36} height={8} rx={2.5} fill="var(--color-kabut)" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
          <circle cx={x + 6} cy={y + dy + 4} r={1.6} fill="var(--color-mint-dalam)" />
        </g>
      ))}
    </g>
  )
}

function Bolt({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x + 5} ${y} L${x} ${y + 9} H${x + 4} L${x + 2} ${y + 16} L${x + 9} ${y + 6} H${x + 5} L${x + 7} ${y} Z`}
      fill="var(--color-matahari)"
      stroke="var(--color-matahari-dalam)"
      strokeWidth={1}
      strokeLinejoin="round"
    />
  )
}

/** One region holding three separate availability zones, each with its own datacenter and power. */
const ZonesInRegion: FC = () => (
  <svg viewBox="0 0 300 128" role="img" aria-label="Diagram: satu region berisi tiga availability zone yang terpisah, masing-masing dengan datacenter dan listrik sendiri." className="w-full font-display">
    <rect x={3} y={3} width={294} height={122} rx={18} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} strokeDasharray="7 5" />
    <text x={18} y={25} fontSize={14} {...label}>
      Region
    </text>
    {[0, 1, 2].map((i) => {
      const x = 20 + i * 90
      return (
        <g key={i}>
          <rect x={x} y={36} width={80} height={76} rx={12} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} />
          <ServerStack x={x + 14} y={46} />
          <Bolt x={x + 56} y={52} />
          <text x={x + 40} y={100} fontSize={13} textAnchor="middle" {...label}>
            Zone {i + 1}
          </text>
        </g>
      )
    })}
  </svg>
)

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
const RegionPair: FC = () => (
  <svg viewBox="0 0 300 150" role="img" aria-label="Diagram: dua region dalam satu geografi, berjarak sekitar 480 kilometer, saling jadi cadangan." className="w-full font-display">
    <defs>
      <marker id="pair-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 Z" fill="var(--color-biru-dalam)" />
      </marker>
    </defs>
    <rect x={3} y={3} width={294} height={144} rx={18} fill="none" stroke="var(--color-kabut-dalam)" strokeWidth={2} strokeDasharray="7 5" />
    <text x={18} y={25} fontSize={14} {...label}>
      Geografi
    </text>
    <MiniRegion x={18} name="Region A" />
    <MiniRegion x={186} name="Region B" />
    <line x1={120} y1={92} x2={182} y2={92} stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerStart="url(#pair-arrow)" markerEnd="url(#pair-arrow)" />
    <text x={151} y={82} fontSize={12} textAnchor="middle" {...label}>
      ≥480 km
    </text>
  </svg>
)

const VISUALS: Record<VisualName, FC> = { ZonesInRegion, RegionPair }

/** Renders the diagram an intro card names in its "visual" field. */
export function IntroVisual({ name }: { name: VisualName }) {
  const Diagram = VISUALS[name]
  return <Diagram />
}
