import type { FC } from 'react'
import { useSvgId } from './ids'
import { Hatch } from './parts'
import { label } from './styles'

type Owner = 'customer' | 'microsoft' | 'shared'

// Rows follow the diagram in Microsoft's "Shared responsibility in the cloud"
// article, with the three physical rows joined into one.
const COLS = ['On-prem', 'IaaS', 'PaaS', 'SaaS']
const ROWS: { label: string[]; owner: Owner[] }[] = [
  { label: ['Data, device,', 'dan akun'], owner: ['customer', 'customer', 'customer', 'customer'] },
  { label: ['Infrastruktur', 'identitas'], owner: ['customer', 'customer', 'shared', 'shared'] },
  { label: ['Aplikasi'], owner: ['customer', 'customer', 'shared', 'microsoft'] },
  { label: ['Kontrol', 'jaringan'], owner: ['customer', 'customer', 'shared', 'microsoft'] },
  { label: ['Sistem operasi'], owner: ['customer', 'customer', 'microsoft', 'microsoft'] },
  { label: ['Host, jaringan,', 'gedung fisik'], owner: ['customer', 'microsoft', 'microsoft', 'microsoft'] },
]

/**
 * Who looks after each layer in each service type. Customer cells say "Kamu",
 * Microsoft cells are striped, and shared cells are half of each.
 */
export const SharedResponsibility: FC = () => {
  const sharedMicrosoft = useSvgId('shared-microsoft')
  const x0 = 100
  const cw = 50
  const rh = 32
  const top = 24
  const legendY = top + ROWS.length * rh + 10

  const cell = (owner: Owner, x: number, y: number, w: number, h: number, key: string, r = 5) => {
    if (owner === 'shared') {
      // The customer half is the lower-right triangle, cut along the diagonal and kept inside the rounded corners.
      const d = r * (1 - Math.SQRT1_2)
      const half = `M${x + w - d} ${y + d} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x + d} ${y + h - d} Z`
      return (
        <g key={key}>
          <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${sharedMicrosoft})`} />
          <path d={half} fill="var(--color-biru-muda)" />
          <path d={`M${x + w - d} ${y + d} L${x + d} ${y + h - d}`} stroke="var(--color-biru)" strokeWidth={1.5} />
          <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke="var(--color-biru)" strokeWidth={1.5} />
        </g>
      )
    }
    const isCustomer = owner === 'customer'
    return <rect key={key} x={x} y={y} width={w} height={h} rx={r} fill={isCustomer ? 'var(--color-biru-muda)' : `url(#${sharedMicrosoft})`} stroke={isCustomer ? 'var(--color-biru)' : 'var(--color-kabut-dalam)'} strokeWidth={1.5} />
  }

  return (
    <svg
      viewBox={`0 0 300 ${legendY + 26}`}
      role="img"
      aria-label="Diagram shared responsibility: data, device, dan akun selalu milik customer; host, jaringan, dan gedung datacenter fisik milik Microsoft kecuali on-premises; di IaaS customer juga mengurus sistem operasi, kontrol jaringan, aplikasi, dan infrastruktur identitas; di PaaS sistem operasi milik Microsoft, sedangkan infrastruktur identitas, aplikasi, dan kontrol jaringan dibagi; di SaaS infrastruktur identitas dibagi, dan aplikasi, kontrol jaringan, serta sistem operasi milik Microsoft."
      className="w-full font-display"
    >
      <defs>
        <Hatch id={sharedMicrosoft} />
      </defs>
      {COLS.map((c, i) => (
        <text key={c} x={x0 + i * cw + cw / 2} y={16} fontSize={12} textAnchor="middle" {...label}>
          {c}
        </text>
      ))}
      {ROWS.map((r, ri) => {
        const mid = top + ri * rh + rh / 2
        return (
          <g key={r.label.join(' ')}>
            {r.label.map((line, li) => (
              <text key={line} x={2} y={mid + 4 + (li - (r.label.length - 1) / 2) * 14} fontSize={12} {...label}>
                {line}
              </text>
            ))}
            {r.owner.map((owner, ci) => {
              const x = x0 + ci * cw + 2
              return (
                <g key={ci}>
                  {cell(owner, x, top + ri * rh + 2, cw - 4, rh - 4, 'cell')}
                  {owner === 'customer' && (
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
      <g transform={`translate(0 ${legendY})`}>
        {cell('customer', 0, 4, 16, 16, 'customer', 3)}
        <text x={22} y={17} fontSize={12} {...label}>
          Customer
        </text>
        {cell('microsoft', 96, 4, 16, 16, 'microsoft', 3)}
        <text x={118} y={17} fontSize={12} {...label}>
          Microsoft
        </text>
        {cell('shared', 196, 4, 16, 16, 'shared', 3)}
        <text x={218} y={17} fontSize={12} {...label}>
          Bersama
        </text>
      </g>
    </svg>
  )
}
