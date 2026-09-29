import type { FC } from 'react'
import { label } from './styles'

/** Seven defense-in-depth layers as nested boxes, from physical security outside to data at the core. */
export const DefenseInDepth: FC = () => {
  const layers = ['Physical security', 'Identity and access', 'Perimeter', 'Network', 'Compute', 'Application', 'Data']
  const step = 13
  return (
    <svg viewBox="0 0 300 206" role="img" aria-label="Diagram defense in depth, dari luar ke dalam: physical security, identity and access, perimeter, network, compute, application, data." className="w-full font-display">
      {layers.map((name, i) => {
        const inset = i * step
        const isData = i === layers.length - 1
        return (
          <g key={name}>
            <rect
              x={inset + 1}
              y={inset + 1}
              width={298 - inset * 2}
              height={204 - inset * 2}
              rx={14}
              fill={isData ? 'var(--color-matahari-muda)' : i % 2 === 0 ? 'var(--color-biru-muda)' : '#fff'}
              stroke={isData ? 'var(--color-matahari-dalam)' : 'var(--color-biru)'}
              strokeWidth={1.5}
            />
            <text x={isData ? 150 : inset + 10} y={isData ? 107 : inset + 11} fontSize={isData ? 14 : 10} textAnchor={isData ? 'middle' : 'start'} {...label}>
              {name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
