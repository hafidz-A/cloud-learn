import type { TopologyLink, TopologyNode } from '../../lib/types'
import { label, quiet } from '../../visuals/styles'
import { LINK_LOOK, linkSentences } from '../topology'

const W = 300
const H = 230
const BOX_W = 96
const BOX_H = 44

/** Node centers on a circle (two nodes side by side), so any 2-6 node network fits a phone screen. */
function positions(n: number): { x: number; y: number }[] {
  if (n === 2) return [
    { x: 60, y: H / 2 },
    { x: W - 60, y: H / 2 },
  ]
  const rx = W / 2 - BOX_W / 2 - 4
  const ry = H / 2 - BOX_H / 2 - 4
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n
    return { x: W / 2 + rx * Math.cos(a), y: H / 2 + ry * Math.sin(a) }
  })
}

/**
 * A network diagram for topology exercises: virtual networks (or sites) as
 * boxes, and peerings (solid), VPNs (dashed), and routes (dotted) as lines.
 * Line style and a text label carry the kind, never color alone.
 */
export function TopologyDiagram({ nodes, links }: { nodes: TopologyNode[]; links: TopologyLink[] }) {
  const at = positions(nodes.length)
  const pos = (id: string) => at[nodes.findIndex((n) => n.id === id)]
  const sentences = linkSentences(nodes, links)
  return (
    <figure lang="en" className="rounded-2xl border-2 border-kabut bg-white p-3">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Diagram jaringan. ${nodes.map((n) => `${n.label}${n.cidr ? ` (${n.cidr})` : ''}`).join(', ')}. Koneksi: ${sentences.join('; ') || 'tidak ada'}.`}
        className="w-full font-display"
      >
        {links.map((l, i) => {
          const a = pos(l.from)
          const b = pos(l.to)
          const look = LINK_LOOK[l.kind]
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          const w = look.text.length * 7 + 10
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--color-biru-dalam)" strokeWidth={2.5} strokeDasharray={look.dash} strokeLinecap="round" />
              <rect x={mx - w / 2} y={my - 9} width={w} height={18} rx={9} fill="var(--color-white)" stroke="var(--color-kabut-dalam)" />
              <text x={mx} y={my + 4} fontSize={12} textAnchor="middle" {...quiet}>
                {look.text}
              </text>
            </g>
          )
        })}
        {nodes.map((n, i) => {
          const { x, y } = at[i]
          return (
            <g key={n.id}>
              <rect x={x - BOX_W / 2} y={y - BOX_H / 2} width={BOX_W} height={BOX_H} rx={10} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
              <text x={x} y={n.cidr ? y - 3 : y + 5} fontSize={13} textAnchor="middle" {...label}>
                {n.label}
              </text>
              {n.cidr && (
                <text x={x} y={y + 13} fontSize={12} textAnchor="middle" {...quiet}>
                  {n.cidr}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      {sentences.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-13 text-tinta-lembut">
          {sentences.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
    </figure>
  )
}
