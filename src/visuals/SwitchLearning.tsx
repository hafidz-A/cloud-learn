import type { FC } from 'react'
import { ArrowMarker } from './parts'
import { useSvgId } from './ids'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** A switch learns the source MAC of a frame, then floods it because the destination is not in its table yet. */
export const SwitchLearning: FC = () => {
  const arrow = useSvgId('learn-arrow')
  const flood = useSvgId('learn-flood')
  return (
    <svg
      viewBox="0 0 300 210"
      role="img"
      aria-label="PC A mengirim frame ke PC B lewat switch. Switch mencatat MAC sumber A di port Fa0/1 ke tabel MAC. Karena MAC B belum ada di tabel, switch mem-flood frame ke semua port lain di VLAN yang sama, yaitu Fa0/2 dan Fa0/3, kecuali port asalnya."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
        <ArrowMarker id={flood} color="var(--color-koral-dalam)" />
      </defs>
      <DeviceIcon kind="switch" x={150} y={70} />
      <text x={150} y={102} fontSize={13} textAnchor="middle" {...label}>
        SW1
      </text>
      {[
        { x: 40, name: 'PC A', port: 'Fa0/1' },
        { x: 150, name: 'PC B', port: 'Fa0/2' },
        { x: 260, name: 'PC C', port: 'Fa0/3' },
      ].map((pc) => (
        <g key={pc.name}>
          <DeviceIcon kind="pc" x={pc.x} y={160} />
          <text x={pc.x} y={192} fontSize={13} textAnchor="middle" {...label}>
            {pc.name}
          </text>
          <text x={pc.x + (pc.x === 150 ? 26 : pc.x < 150 ? 22 : -22)} y={125} fontSize={12} textAnchor="middle" {...quiet}>
            {pc.port}
          </text>
        </g>
      ))}
      <path d="M48 144 L132 86" stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${arrow})`} />
      <path d="M150 86 V140" stroke="var(--color-koral-dalam)" strokeWidth={2} strokeDasharray="5 4" markerEnd={`url(#${flood})`} />
      <path d="M168 86 L250 142" stroke="var(--color-koral-dalam)" strokeWidth={2} strokeDasharray="5 4" markerEnd={`url(#${flood})`} />
      <rect x={196} y={8} width={100} height={46} rx={6} fill="#fff" stroke="var(--color-kabut-dalam)" strokeWidth={1.5} />
      <text x={246} y={24} fontSize={12} textAnchor="middle" {...quiet}>
        Tabel MAC
      </text>
      <text x={246} y={44} fontSize={12} textAnchor="middle" {...label}>
        MAC A → Fa0/1
      </text>
      <text x={4} y={20} fontSize={12} {...label}>
        1. Catat MAC sumber
      </text>
      <text x={4} y={38} fontSize={12} {...label}>
        2. Tujuan belum dikenal:
      </text>
      <text x={4} y={54} fontSize={12} {...label}>
        flood ke port lain
      </text>
    </svg>
  )
}
