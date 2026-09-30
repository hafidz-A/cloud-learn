import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker } from './parts'
import { label, quiet } from './styles'

function Step({ x, y, w, text, nsg = false }: { x: number; y: number; w: number; text: string; nsg?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={30}
        rx={8}
        fill={nsg ? 'var(--color-matahari-muda)' : '#fff'}
        stroke={nsg ? 'var(--color-matahari-dalam)' : 'var(--color-biru)'}
        strokeWidth={2}
      />
      <text x={x + w / 2} y={y + 19} fontSize={12} textAnchor="middle" {...label}>
        {text}
      </text>
    </g>
  )
}

/** Inbound traffic passes the subnet NSG first, then the NIC NSG; outbound goes the other way. Both must allow. */
export const NsgEvaluationOrder: FC = () => {
  const arrow = useSvgId('nsg-order-arrow')
  const line = { stroke: 'var(--color-biru-dalam)', strokeWidth: 2, markerEnd: `url(#${arrow})` }
  const row = (y: number, steps: [string, boolean][]) => {
    const widths = [56, 74, 74, 56]
    const xs = [0, 69, 156, 243]
    return steps.map(([t, nsg], i) => (
      <g key={t + y}>
        <Step x={xs[i]} y={y} w={widths[i]} text={t} nsg={nsg} />
        {i < 3 && <path d={`M${xs[i] + widths[i] + 1} ${y + 15} H${xs[i + 1] - 3}`} {...line} />}
      </g>
    ))
  }
  return (
    <svg
      viewBox="0 0 300 196"
      role="img"
      aria-label="Urutan NSG: trafik masuk dari internet dicek NSG subnet dulu, lalu NSG network interface, baru sampai ke VM. Trafik keluar dari VM dicek NSG network interface dulu, lalu NSG subnet. Kedua NSG harus mengizinkan; kalau NSG subnet menolak, NSG network interface tidak pernah mengecek trafik itu."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      <text x={0} y={14} fontSize={12} {...label}>
        Masuk
      </text>
      {row(22, [
        ['Internet', false],
        ['NSG subnet', true],
        ['NSG NIC', true],
        ['VM', false],
      ])}
      <text x={0} y={84} fontSize={12} {...label}>
        Keluar
      </text>
      {row(92, [
        ['VM', false],
        ['NSG NIC', true],
        ['NSG subnet', true],
        ['Internet', false],
      ])}
      <text x={0} y={152} fontSize={12} {...label}>
        Keduanya harus mengizinkan.
      </text>
      <text x={0} y={170} fontSize={12} {...quiet}>
        Ditolak di NSG pertama? NSG kedua tidak
      </text>
      <text x={0} y={188} fontSize={12} {...quiet}>
        pernah melihat trafik itu.
      </text>
    </svg>
  )
}
