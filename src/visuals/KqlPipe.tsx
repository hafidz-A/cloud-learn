import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker } from './parts'
import { label, quiet } from './styles'

const STEPS = [
  { code: ['AppRequests'], note: 'mulai dari satu tabel', rows: '12.480 baris' },
  { code: ['| where TimeGenerated > ago(1d)'], note: 'saring baris', rows: '3.210 baris' },
  { code: ['| where Success == false'], note: 'saring lagi', rows: '96 baris' },
  { code: ['| summarize count()', 'by bin(TimeGenerated, 1h)'], note: 'hitung per jam', rows: '24 baris' },
]

/**
 * A KQL query read top to bottom: each pipe passes the rows from the step
 * above to the next operator, so the table shrinks at every step.
 */
export const KqlPipe: FC = () => {
  const arrow = useSvgId('kql-arrow')
  return (
    <svg
      viewBox="0 0 300 268"
      role="img"
      aria-label="Query KQL dibaca dari atas ke bawah. Mulai dari tabel AppRequests dengan 12.480 baris. Tanda pipe meneruskan hasil ke operator berikutnya: where TimeGenerated lebih dari ago 1d menyisakan 3.210 baris dari satu hari terakhir, where Success sama dengan false menyisakan 96 request yang gagal, lalu summarize count by bin TimeGenerated 1h menghitung jumlahnya per jam menjadi 24 baris."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      {STEPS.map((s, i) => {
        const y = 1 + i * 58
        const h = 30 + s.code.length * 16
        return (
          <g key={s.code[0]}>
            <rect x={1} y={y} width={298} height={h} rx={8} fill={i === 0 ? 'var(--color-biru-muda)' : '#fff'} stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
            {s.code.map((c, j) => (
              <text key={c} x={j === 0 ? 10 : 34} y={y + 19 + j * 16} fontSize={12} className="font-mono" {...label}>
                {c}
              </text>
            ))}
            <text x={10} y={y + h - 9} fontSize={12} {...quiet}>
              {s.note}
            </text>
            <text x={290} y={y + h - 9} fontSize={12} textAnchor="end" {...label}>
              {s.rows}
            </text>
            {i < STEPS.length - 1 && <path d={`M150 ${y + h + 1} V${y + 56}`} stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />}
          </g>
        )
      })}
      <text x={0} y={262} fontSize={12} {...label}>
        Setiap | meneruskan hasil ke langkah berikutnya.
      </text>
    </svg>
  )
}
