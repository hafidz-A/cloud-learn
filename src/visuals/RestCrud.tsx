import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  ['Create', 'POST', '201 Created'],
  ['Read', 'GET', '200 OK'],
  ['Update', 'PUT / PATCH', '200 OK'],
  ['Delete', 'DELETE', '204 No Content'],
]

/** CRUD actions, their HTTP methods, and a typical success code. */
export const RestCrud: FC = () => (
  <svg
    viewBox="0 0 300 178"
    role="img"
    aria-label="Operasi CRUD dan metode HTTP di REST API. Create memakai POST, biasanya dijawab 201 Created. Read memakai GET, dijawab 200 OK. Update memakai PUT atau PATCH, dijawab 200 OK. Delete memakai DELETE, sering dijawab 204 No Content."
    className="w-full font-display"
  >
    <rect x={4} y={4} width={292} height={30} rx={6} fill="var(--color-biru-muda)" />
    {['CRUD', 'HTTP', 'Berhasil'].map((h, j) => (
      <text key={h} x={[10, 96, 196][j]} y={24} fontSize={12} {...label}>
        {h}
      </text>
    ))}
    {ROWS.map((r, i) => (
      <g key={r[0]}>
        <rect x={4} y={38 + i * 34} width={292} height={30} rx={6} fill={i % 2 ? '#ffffff00' : 'var(--color-kabut)'} />
        {r.map((c, j) => (
          <text key={j} x={[10, 96, 196][j]} y={58 + i * 34} fontSize={12} {...(j === 1 ? label : quiet)}>
            {c}
          </text>
        ))}
      </g>
    ))}
  </svg>
)
