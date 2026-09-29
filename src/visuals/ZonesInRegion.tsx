import type { FC } from 'react'
import { Bolt, ServerStack } from './parts'
import { label } from './styles'

/** One region holding three separate availability zones, each with its own datacenter and power. */
export const ZonesInRegion: FC = () => (
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
