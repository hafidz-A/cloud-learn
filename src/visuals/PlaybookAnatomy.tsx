import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { x: 4, text: 'Playbook (file .yml)', note: '' },
  { x: 20, text: 'Play: hosts: routers', note: 'siapa' },
  { x: 36, text: 'Task: name', note: 'apa' },
  { x: 52, text: 'Modul: ios_config', note: 'caranya' },
]

/** A playbook holds plays; a play maps hosts to tasks; a task calls a module. */
export const PlaybookAnatomy: FC = () => (
  <svg
    viewBox="0 0 300 150"
    role="img"
    aria-label="Susunan playbook. Playbook adalah file YAML berisi satu atau beberapa play. Play memetakan host, misalnya grup routers, ke daftar task. Setiap task punya nama dan memanggil satu modul, misalnya cisco.ios.ios_config, dengan argumennya."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r.text}>
        <rect x={r.x} y={4 + i * 36} width={296 - r.x - 70} height={30} rx={6} fill={['var(--color-biru-muda)', 'var(--color-matahari-muda)', 'var(--color-mint-muda)', 'var(--color-kabut)'][i]} />
        <text x={r.x + 10} y={24 + i * 36} fontSize={12} {...label}>
          {r.text}
        </text>
        <text x={236} y={24 + i * 36} fontSize={12} {...quiet}>
          {r.note}
        </text>
      </g>
    ))}
  </svg>
)
