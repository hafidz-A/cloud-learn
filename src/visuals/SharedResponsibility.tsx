import type { FC } from 'react'
import { label } from './styles'

const CUSTOMER = 'var(--color-biru-muda)'
const MICROSOFT = 'var(--color-kabut)'

/** Who looks after each layer in each service type. Customer cells are blue, Microsoft cells gray. */
export const SharedResponsibility: FC = () => {
  const cols = ['On-prem', 'IaaS', 'PaaS', 'SaaS']
  const rows: { label: string; customer: boolean[] }[] = [
    { label: 'Data, device, akun', customer: [true, true, true, true] },
    { label: 'Aplikasi', customer: [true, true, true, false] },
    { label: 'Sistem operasi', customer: [true, true, false, false] },
    { label: 'Hardware fisik', customer: [true, false, false, false] },
  ]
  const x0 = 104
  const cw = 47
  const rh = 26
  return (
    <svg viewBox="0 0 300 176" role="img" aria-label="Diagram shared responsibility: data, device, dan akun selalu milik customer; host, jaringan, dan gedung fisik milik Microsoft kecuali on-premises; aplikasi dan sistem operasi tergantung jenis layanan." className="w-full font-display">
      {cols.map((c, i) => (
        <text key={c} x={x0 + i * cw + cw / 2} y={16} fontSize={12} textAnchor="middle" {...label}>
          {c}
        </text>
      ))}
      {rows.map((r, ri) => (
        <g key={r.label}>
          <text x={0} y={30 + ri * rh + rh / 2 + 4} fontSize={11} {...label}>
            {r.label}
          </text>
          {r.customer.map((isCustomer, ci) => (
            <rect key={ci} x={x0 + ci * cw + 2} y={26 + ri * rh + 2} width={cw - 4} height={rh - 4} rx={5} fill={isCustomer ? CUSTOMER : MICROSOFT} stroke={isCustomer ? 'var(--color-biru)' : 'var(--color-kabut-dalam)'} strokeWidth={1.5} />
          ))}
        </g>
      ))}
      <g transform="translate(0 150)">
        <rect x={0} y={4} width={14} height={14} rx={3} fill={CUSTOMER} stroke="var(--color-biru)" strokeWidth={1.5} />
        <text x={20} y={16} fontSize={12} {...label}>
          Customer
        </text>
        <rect x={110} y={4} width={14} height={14} rx={3} fill={MICROSOFT} stroke="var(--color-kabut-dalam)" strokeWidth={1.5} />
        <text x={130} y={16} fontSize={12} {...label}>
          Microsoft
        </text>
      </g>
    </svg>
  )
}
