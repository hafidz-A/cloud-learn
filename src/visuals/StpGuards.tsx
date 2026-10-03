import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { name: 'PortFast', where: 'Port ke PC, printer', does: 'Langsung forwarding' },
  { name: 'BPDU guard', where: 'Port PortFast', does: 'Terima BPDU: err-disabled' },
  { name: 'Root guard', where: 'Port ke switch bawahan', does: 'BPDU lebih baik: blokir' },
  { name: 'Loop guard', where: 'Root dan alternate port', does: 'BPDU hilang: blokir' },
]

/** Where each spanning tree protection goes and what it does. */
export const StpGuards: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Fitur pelindung spanning tree. PortFast dipasang di port ke PC atau printer dan membuat port langsung forwarding. BPDU guard dipasang di port PortFast dan mematikan port menjadi err-disabled kalau menerima BPDU. Root guard dipasang di port ke switch bawahan dan memblokir port kalau menerima BPDU yang lebih baik. Loop guard dipasang di root port dan alternate port dan memblokir port kalau BPDU berhenti datang."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r.name}>
        <rect x={4} y={6 + i * 48} width={292} height={42} rx={8} fill={['var(--color-mint-muda)', 'var(--color-koral-muda)', 'var(--color-biru-muda)', 'var(--color-matahari-muda)'][i]} />
        <text x={12} y={24 + i * 48} fontSize={13} {...label}>
          {r.name}
        </text>
        <text x={12} y={40 + i * 48} fontSize={12} {...quiet}>
          {r.where}
        </text>
        <text x={290} y={24 + i * 48} fontSize={12} textAnchor="end" {...label}>
          {r.does}
        </text>
      </g>
    ))}
  </svg>
)
