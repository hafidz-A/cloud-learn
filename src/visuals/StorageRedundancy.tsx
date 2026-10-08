import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker } from './parts'
import { label, quiet } from './styles'

function Copies({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x + i * 12} cy={y} r={4.5} fill="var(--color-biru)" stroke="var(--color-biru-dalam)" strokeWidth={1} />
      ))}
    </g>
  )
}

const box = { fill: '#fff', stroke: 'var(--color-biru)', strokeWidth: 1.5, rx: 6 }
const region = { fill: 'var(--color-biru-muda)', stroke: 'var(--color-biru-dalam)', strokeWidth: 1.5, strokeDasharray: '5 4', rx: 10 }

/** One datacenter holding 3 copies. */
function OneDatacenter({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={120} height={36} {...region} />
      <rect x={x + 30} y={y + 7} width={60} height={22} {...box} />
      <Copies x={x + 48} y={y + 18} n={3} />
    </g>
  )
}

/** Three zones, one copy each. */
function ThreeZones({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={120} height={36} {...region} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={x + 6 + i * 38} y={y + 7} width={32} height={22} {...box} />
          <Copies x={x + 22 + i * 38} y={y + 18} n={1} />
        </g>
      ))}
    </g>
  )
}

/** LRS, ZRS, GRS, and GZRS: where the copies of your data live. The dashed boxes are regions. */
export const StorageRedundancy: FC = () => {
  const copyArrow = useSvgId('copy-arrow')
  const rows = [
    { name: 'LRS · 11 nines', primary: OneDatacenter, geo: false },
    { name: 'ZRS · 12 nines', primary: ThreeZones, geo: false },
    { name: 'GRS · 16 nines', primary: OneDatacenter, geo: true },
    { name: 'GZRS · 16 nines', primary: ThreeZones, geo: true },
  ]
  return (
    <svg
      viewBox="0 0 300 262"
      role="img"
      aria-label="Diagram redundancy: LRS menyimpan tiga salinan di satu datacenter, ZRS menyalin ke tiga atau lebih zone, GRS memakai LRS lalu menyalin ke region kedua, dan GZRS memakai ZRS lalu menyalin ke region kedua."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={copyArrow} />
      </defs>
      <text x={236} y={14} fontSize={12} textAnchor="middle" {...quiet}>
        region kedua
      </text>
      {rows.map((r, i) => {
        const y = 22 + i * 60
        const Primary = r.primary
        return (
          <g key={r.name}>
            <text x={0} y={y + 12} fontSize={12} {...label}>
              {r.name}
            </text>
            <Primary x={0} y={y + 18} />
            {r.geo && (
              <>
                <path d={`M126 ${y + 36} H168`} stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${copyArrow})`} />
                <OneDatacenter x={176} y={y + 18} />
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}
