import type { FC } from 'react'
import { useSvgId } from './ids'
import { Hatch } from './parts'
import { label } from './styles'

/** Who looks after each layer in each service type. Customer cells say "Kamu"; Microsoft cells are striped. */
export const SharedResponsibility: FC = () => {
  const sharedMicrosoft = useSvgId('shared-microsoft')
  const cols = ['On-prem', 'IaaS', 'PaaS', 'SaaS']
  const rows: { label: string[]; customer: boolean[] }[] = [
    { label: ['Data, device,', 'dan akun'], customer: [true, true, true, true] },
    { label: ['Aplikasi'], customer: [true, true, true, false] },
    { label: ['Sistem operasi'], customer: [true, true, false, false] },
    { label: ['Hardware fisik'], customer: [true, false, false, false] },
  ]
  const x0 = 100
  const cw = 50
  const rh = 32
  const top = 24
  return (
    <svg
      viewBox="0 0 300 186"
      role="img"
      aria-label="Diagram shared responsibility: data, device, dan akun selalu milik customer; hardware fisik milik Microsoft kecuali on-premises; aplikasi dan sistem operasi tergantung jenis layanan."
      className="w-full font-display"
    >
      <defs>
        <Hatch id={sharedMicrosoft} />
      </defs>
      {cols.map((c, i) => (
        <text key={c} x={x0 + i * cw + cw / 2} y={16} fontSize={12} textAnchor="middle" {...label}>
          {c}
        </text>
      ))}
      {rows.map((r, ri) => {
        const mid = top + ri * rh + rh / 2
        return (
          <g key={r.label.join(' ')}>
            {r.label.map((line, li) => (
              <text key={line} x={0} y={mid + 4 + (li - (r.label.length - 1) / 2) * 14} fontSize={12} {...label}>
                {line}
              </text>
            ))}
            {r.customer.map((isCustomer, ci) => {
              const x = x0 + ci * cw + 2
              return (
                <g key={ci}>
                  <rect x={x} y={top + ri * rh + 2} width={cw - 4} height={rh - 4} rx={5} fill={isCustomer ? 'var(--color-biru-muda)' : `url(#${sharedMicrosoft})`} stroke={isCustomer ? 'var(--color-biru)' : 'var(--color-kabut-dalam)'} strokeWidth={1.5} />
                  {isCustomer && (
                    <text x={x + (cw - 4) / 2} y={mid + 4} fontSize={12} textAnchor="middle" {...label}>
                      Kamu
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}
      <g transform={`translate(0 ${top + rows.length * rh + 10})`}>
        <rect x={0} y={4} width={16} height={16} rx={3} fill="var(--color-biru-muda)" stroke="var(--color-biru)" strokeWidth={1.5} />
        <text x={22} y={17} fontSize={12} {...label}>
          Customer
        </text>
        <rect x={110} y={4} width={16} height={16} rx={3} fill={`url(#${sharedMicrosoft})`} stroke="var(--color-kabut-dalam)" strokeWidth={1.5} />
        <text x={132} y={17} fontSize={12} {...label}>
          Microsoft
        </text>
      </g>
    </svg>
  )
}
