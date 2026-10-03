import type { FC } from 'react'
import { label } from './styles'

const PLAIN = 'var(--color-kabut)'
const ESP = 'var(--color-matahari-muda)'
const SEALED = 'var(--color-koral-muda)'

const MODES = [
  { name: 'Asli', y: 22, parts: [['IP asli', 70, PLAIN], ['Data', 90, PLAIN]] },
  { name: 'Transport', y: 82, parts: [['IP asli', 70, PLAIN], ['ESP', 40, ESP], ['Data', 90, SEALED], ['Trailer', 60, ESP]] },
  { name: 'Tunnel', y: 142, parts: [['IP baru', 60, PLAIN], ['ESP', 34, ESP], ['IP asli', 62, SEALED], ['Data', 70, SEALED], ['Trailer', 54, ESP]] },
] as const

/** ESP in transport mode keeps the original header; tunnel mode wraps the whole packet. */
export const TunnelTransport: FC = () => (
  <svg
    viewBox="0 0 300 190"
    role="img"
    aria-label="Paket ESP dalam dua mode. Paket asli: header IP asli lalu data. Transport mode: header IP asli tetap di depan, lalu header ESP, data yang dienkripsi, dan trailer ESP. Tunnel mode: header IP baru di depan, lalu header ESP, header IP asli dan data yang keduanya dienkripsi, lalu trailer ESP. Bagian yang dienkripsi ditandai warna koral."
    className="w-full font-display"
  >
    {MODES.map((m) => (
      <g key={m.name}>
        <text x={4} y={m.y - 6} fontSize={12} {...label}>
          {m.name}
        </text>
        {m.parts.map(([text, w, fill], i) => {
          const x = 4 + m.parts.slice(0, i).reduce((sum, p) => sum + p[1], 0)
          return (
            <g key={text}>
              <rect x={x} y={m.y} width={w - 2} height={28} rx={4} fill={fill} />
              <text x={x + (w - 2) / 2} y={m.y + 18} fontSize={12} textAnchor="middle" {...label}>
                {text}
              </text>
            </g>
          )
        })}
      </g>
    ))}
  </svg>
)
