import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { name: 'Data', parts: [{ t: 'Data aplikasi', w: 120, kind: 'data' }] },
  { name: 'Segmen', parts: [{ t: 'TCP', w: 40, kind: 'head' }, { t: 'Data', w: 120, kind: 'data' }] },
  { name: 'Paket', parts: [{ t: 'IP', w: 36, kind: 'head' }, { t: 'TCP', w: 40, kind: 'head' }, { t: 'Data', w: 120, kind: 'data' }] },
  { name: 'Frame', parts: [{ t: 'Eth', w: 36, kind: 'head' }, { t: 'IP', w: 36, kind: 'head' }, { t: 'TCP', w: 40, kind: 'head' }, { t: 'Data', w: 76, kind: 'data' }, { t: 'FCS', w: 36, kind: 'trail' }] },
]
const FILL: Record<string, string> = { data: 'var(--color-mint-muda)', head: 'var(--color-biru-muda)', trail: 'var(--color-matahari-muda)' }

/** Each layer adds its header on the way down: data, segment, packet, frame (with the FCS trailer), then bits. */
export const Encapsulation: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Enkapsulasi: data aplikasi diberi header TCP menjadi segmen, lalu header IP menjadi paket, lalu header Ethernet di depan dan FCS di belakang menjadi frame, yang dikirim sebagai bit di kabel."
    className="w-full font-display"
  >
    {ROWS.map((row, i) => {
      const y = 12 + i * 40
      const total = row.parts.reduce((n, p) => n + p.w, 0)
      let x = 296 - total
      return (
        <g key={row.name}>
          <text x={4} y={y + 18} fontSize={13} {...label}>
            {row.name}
          </text>
          {row.parts.map((p) => {
            const px = x
            x += p.w
            return (
              <g key={p.t + px}>
                <rect x={px} y={y} width={p.w - 2} height={26} rx={4} fill={FILL[p.kind]} stroke="var(--color-tinta-lembut)" strokeWidth={1.2} />
                <text x={px + (p.w - 2) / 2} y={y + 17} fontSize={12} textAnchor="middle" {...label}>
                  {p.t}
                </text>
              </g>
            )
          })}
        </g>
      )
    })}
    <text x={4} y={188} fontSize={13} {...label}>
      Bit
    </text>
    <text x={296} y={188} fontSize={12} textAnchor="end" {...quiet}>
      0101 1010 ... di kabel atau udara
    </text>
  </svg>
)
