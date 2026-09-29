import type { FC } from 'react'
import { useSvgId } from './ids'
import { Hatch } from './parts'
import { label } from './styles'

const COLS = ['IaaS', 'PaaS', 'SaaS', 'Serverless']
const ROWS: { label: string; you: boolean[] }[] = [
  { label: 'Data', you: [true, true, true, true] },
  { label: 'Kode aplikasi', you: [true, true, false, true] },
  { label: 'Runtime', you: [true, false, false, false] },
  { label: 'Sistem operasi', you: [true, false, false, false] },
  { label: 'Hardware', you: [false, false, false, false] },
]

/** Who manages each layer in IaaS, PaaS, SaaS, and serverless. Your cells say "Kamu"; provider cells are striped. */
export const ServiceModelsStack: FC = () => {
  const stackProvider = useSvgId('stack-provider')
  const x0 = 92
  const cw = 51
  const rh = 26
  const top = 24
  return (
    <svg
      viewBox="0 0 300 204"
      role="img"
      aria-label="Diagram siapa mengelola apa: di IaaS kamu mengelola sistem operasi sampai data; di PaaS kamu mengelola kode aplikasi dan data; di SaaS kamu hanya mengelola data; di serverless kamu mengelola kode dan data; hardware selalu diurus penyedia."
      className="w-full font-display"
    >
      <defs>
        <Hatch id={stackProvider} />
      </defs>
      {COLS.map((c, i) => (
        <text key={c} x={x0 + i * cw + cw / 2} y={16} fontSize={12} textAnchor="middle" {...label}>
          {c}
        </text>
      ))}
      {ROWS.map((r, ri) => (
        <g key={r.label}>
          <text x={0} y={top + ri * rh + rh / 2 + 4} fontSize={12} {...label}>
            {r.label}
          </text>
          {r.you.map((you, ci) => {
            const x = x0 + ci * cw + 2
            const y = top + ri * rh + 2
            return (
              <g key={ci}>
                <rect x={x} y={y} width={cw - 4} height={rh - 4} rx={5} fill={you ? 'var(--color-biru-muda)' : `url(#${stackProvider})`} stroke={you ? 'var(--color-biru)' : 'var(--color-kabut-dalam)'} strokeWidth={1.5} />
                {you && (
                  <text x={x + (cw - 4) / 2} y={y + 15} fontSize={12} textAnchor="middle" {...label}>
                    Kamu
                  </text>
                )}
              </g>
            )
          })}
        </g>
      ))}
      <g transform={`translate(0 ${top + ROWS.length * rh + 12})`}>
        <rect x={0} y={4} width={16} height={16} rx={3} fill="var(--color-biru-muda)" stroke="var(--color-biru)" strokeWidth={1.5} />
        <text x={22} y={17} fontSize={12} {...label}>
          Kamu yang mengelola
        </text>
        <rect x={160} y={4} width={16} height={16} rx={3} fill={`url(#${stackProvider})`} stroke="var(--color-kabut-dalam)" strokeWidth={1.5} />
        <text x={182} y={17} fontSize={12} {...label}>
          Penyedia
        </text>
      </g>
    </svg>
  )
}
