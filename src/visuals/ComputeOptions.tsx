import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Pill } from './parts'
import { label, quiet } from './styles'

const OPTIONS = [
  { name: 'Virtual machine', hint: 'kamu atur sistem operasi' },
  { name: 'VM Scale Sets', hint: 'VM identik + autoscale' },
  { name: 'ACI · AKS', hint: 'aplikasi di container' },
  { name: 'App Service', hint: 'web app dan API' },
  { name: 'Azure Functions', hint: 'kode per event' },
]

/** Compute options on a scale from most control (VM) to least to manage (Functions). */
export const ComputeOptions: FC = () => {
  const computeArrow = useSvgId('compute-arrow')
  const top = 26
  const rh = 32
  return (
    <svg
      viewBox="0 0 300 214"
      role="img"
      aria-label="Diagram pilihan compute dari kontrol paling besar ke paling sedikit yang diurus: virtual machine, VM Scale Sets, container dengan ACI atau AKS, App Service, lalu Azure Functions."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={computeArrow} color="var(--color-tinta-lembut)" />
      </defs>
      <text x={0} y={14} fontSize={12} {...label}>
        Kontrol paling besar
      </text>
      <path d={`M8 ${top + 4} V${top + OPTIONS.length * rh - 8}`} stroke="var(--color-tinta-lembut)" strokeWidth={2.5} markerStart={`url(#${computeArrow})`} markerEnd={`url(#${computeArrow})`} />
      {OPTIONS.map((o, i) => {
        const y = top + i * rh + 3
        return (
          <g key={o.name}>
            <Pill x={20} y={y} w={112} lines={[o.name]} fill={i === 0 ? 'var(--color-biru-muda)' : '#fff'} />
            <text x={140} y={y + 17} fontSize={12} {...quiet}>
              {o.hint}
            </text>
          </g>
        )
      })}
      <text x={0} y={top + OPTIONS.length * rh + 16} fontSize={12} {...label}>
        Paling sedikit yang diurus
      </text>
    </svg>
  )
}
