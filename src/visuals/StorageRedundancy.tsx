import type { FC } from 'react'
import { label } from './styles'

function Copies({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x + i * 12} cy={y} r={4.5} fill="var(--color-biru)" />
      ))}
    </g>
  )
}

/** LRS, ZRS, and GRS side by side: where the copies of your data live. */
export const StorageRedundancy: FC = () => {
  const box = { fill: '#fff', stroke: 'var(--color-biru)', strokeWidth: 1.5, rx: 6 }
  const region = { fill: 'var(--color-biru-muda)', stroke: 'var(--color-biru-dalam)', strokeWidth: 1.5, strokeDasharray: '5 4', rx: 10 }
  return (
    <svg viewBox="0 0 300 186" role="img" aria-label="Diagram redundancy: LRS tiga salinan di satu datacenter, ZRS satu salinan di tiap tiga zone, GRS tiga salinan di region utama dan tiga salinan di region kedua." className="w-full font-display">
      <text x={0} y={14} fontSize={12} {...label}>
        LRS · 11 nines
      </text>
      <rect x={0} y={20} width={120} height={36} {...region} />
      <rect x={30} y={27} width={60} height={22} {...box} />
      <Copies x={48} y={38} n={3} />

      <text x={0} y={76} fontSize={12} {...label}>
        ZRS · 12 nines
      </text>
      <rect x={0} y={82} width={170} height={36} {...region} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={10 + i * 53} y={89} width={44} height={22} {...box} />
          <Copies x={32 + i * 53} y={100} n={1} />
        </g>
      ))}

      <text x={0} y={138} fontSize={12} {...label}>
        GRS · 16 nines
      </text>
      <rect x={0} y={144} width={120} height={36} {...region} />
      <rect x={30} y={151} width={60} height={22} {...box} />
      <Copies x={48} y={162} n={3} />
      <path d="M126 162 H168" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd="url(#copy-arrow)" />
      <rect x={176} y={144} width={120} height={36} {...region} />
      <rect x={206} y={151} width={60} height={22} {...box} />
      <Copies x={224} y={162} n={3} />
      <text x={236} y={138} fontSize={11} textAnchor="middle" fill="var(--color-tinta-lembut)">
        region kedua
      </text>
      <defs>
        <marker id="copy-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="var(--color-biru-dalam)" />
        </marker>
      </defs>
    </svg>
  )
}
