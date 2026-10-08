import type { FC } from 'react'
import { useSvgId } from './ids'
import { Hatch } from './parts'
import { label, quiet } from './styles'

// On-premises, then the three cloud service types. Serverless is not a fourth
// type: Microsoft lists Azure Functions under PaaS, so it is named in the PaaS
// example line instead of getting a column of its own.
const COLS = ['On-prem', 'IaaS', 'PaaS', 'SaaS']
const ROWS: { label: string; you: boolean[] }[] = [
  { label: 'Data dan akun', you: [true, true, true, true] },
  { label: 'Kode aplikasi', you: [true, true, true, false] },
  { label: 'Runtime', you: [true, true, false, false] },
  { label: 'Sistem operasi', you: [true, true, false, false] },
  { label: 'Hardware', you: [true, false, false, false] },
]
const EXAMPLES = ['Contoh IaaS: Azure Virtual Machines', 'Contoh PaaS: App Service, Azure Functions', 'Serverless (Azure Functions) termasuk PaaS', 'Contoh SaaS: Microsoft 365']

/** Who manages each layer on-premises and in IaaS, PaaS, and SaaS. Your cells say "Kamu"; provider cells are striped. */
export const ServiceModelsStack: FC = () => {
  const stackProvider = useSvgId('stack-provider')
  const x0 = 92
  const cw = 51
  const rh = 26
  const top = 24
  const legendY = top + ROWS.length * rh + 12
  const examplesY = legendY + 44
  return (
    <svg
      viewBox={`0 0 300 ${examplesY + EXAMPLES.length * 16}`}
      role="img"
      aria-label="Diagram siapa mengelola apa: di on-premises kamu mengelola semuanya; di IaaS kamu mengelola sistem operasi sampai data, dan penyedia mengurus hardware; di PaaS kamu mengelola kode aplikasi serta data dan akun; di SaaS kamu hanya mengelola data dan akun. Contoh IaaS Azure Virtual Machines, contoh PaaS App Service dan Azure Functions (serverless termasuk PaaS), contoh SaaS Microsoft 365."
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
      <g transform={`translate(0 ${legendY})`}>
        <rect x={0} y={4} width={16} height={16} rx={3} fill="var(--color-biru-muda)" stroke="var(--color-biru)" strokeWidth={1.5} />
        <text x={22} y={17} fontSize={12} {...label}>
          Kamu yang mengelola
        </text>
        <rect x={160} y={4} width={16} height={16} rx={3} fill={`url(#${stackProvider})`} stroke="var(--color-kabut-dalam)" strokeWidth={1.5} />
        <text x={182} y={17} fontSize={12} {...label}>
          Penyedia
        </text>
      </g>
      {EXAMPLES.map((line, i) => (
        <text key={line} x={0} y={examplesY + i * 16} fontSize={12} {...quiet}>
          {line}
        </text>
      ))}
    </svg>
  )
}
