import type { ReactNode } from 'react'
import type { NetDevice, NetDeviceKind, NetDiagram as Diagram, NetLink } from '../lib/types'
import { Cloud } from './parts'
import { label, quiet } from './styles'

// A small network topology (LANGIT_CCNA_PLAN.md sections 7 and 8): devices on a
// grid of 5 columns, links with the interface name at each end. Used by Packet
// Tracer labs, "Refer to the exhibit" questions, and the CCNA learn card visuals.
// Like every diagram it is 300 wide, so 12px text stays readable on a phone.

const COL = 60
const ROW = 96
const X0 = 30
const Y0 = 34

const devicePoint = (d: Pick<NetDevice, 'x' | 'y'>) => ({ x: X0 + d.x * COL, y: Y0 + d.y * ROW })

const stroke = { stroke: 'var(--color-biru-dalam)', strokeWidth: 2, strokeLinejoin: 'round' as const }
const fill = 'var(--color-biru-muda)'

/** Arrows pointing both ways, the mark of a switch. */
function Arrows({ x, y }: { x: number; y: number }) {
  return (
    <g stroke="var(--color-biru-dalam)" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${x - 11} ${y - 4} H${x + 9} M${x + 5} ${y - 8} L${x + 9} ${y - 4} L${x + 5} ${y}`} />
      <path d={`M${x + 11} ${y + 4} H${x - 9} M${x - 5} ${y} L${x - 9} ${y + 4} L${x - 5} ${y + 8}`} />
    </g>
  )
}

/** One device icon centered on (x, y), about 44 wide and 30 tall. */
export function DeviceIcon({ kind, x, y }: { kind: NetDeviceKind; x: number; y: number }): ReactNode {
  switch (kind) {
    case 'router':
      return (
        <g>
          <ellipse cx={x} cy={y} rx={21} ry={14} fill={fill} {...stroke} />
          <g stroke="var(--color-biru-dalam)" strokeWidth={1.8} strokeLinecap="round">
            <path d={`M${x - 9} ${y - 6} L${x + 9} ${y + 6}`} />
            <path d={`M${x + 9} ${y - 6} L${x - 9} ${y + 6}`} />
          </g>
        </g>
      )
    case 'switch':
      return (
        <g>
          <rect x={x - 22} y={y - 13} width={44} height={26} rx={4} fill={fill} {...stroke} />
          <Arrows x={x} y={y} />
        </g>
      )
    case 'l3switch':
      return (
        <g>
          <rect x={x - 22} y={y - 13} width={44} height={26} rx={4} fill={fill} {...stroke} />
          <Arrows x={x - 4} y={y} />
          <ellipse cx={x + 15} cy={y} rx={5} ry={5} fill="#fff" {...stroke} strokeWidth={1.5} />
        </g>
      )
    case 'pc':
      return (
        <g>
          <rect x={x - 16} y={y - 14} width={32} height={22} rx={3} fill="#fff" {...stroke} />
          <path d={`M${x - 6} ${y + 14} H${x + 6} M${x} ${y + 8} V${y + 14}`} {...stroke} fill="none" />
        </g>
      )
    case 'laptop':
      return (
        <g>
          <rect x={x - 14} y={y - 13} width={28} height={19} rx={2} fill="#fff" {...stroke} />
          <path d={`M${x - 19} ${y + 10} H${x + 19} L${x + 15} ${y + 6} H${x - 15} Z`} fill={fill} {...stroke} />
        </g>
      )
    case 'server':
      return (
        <g>
          <rect x={x - 12} y={y - 16} width={24} height={32} rx={3} fill="#fff" {...stroke} />
          <path d={`M${x - 7} ${y - 7} H${x + 7} M${x - 7} ${y} H${x + 7} M${x - 7} ${y + 7} H${x + 7}`} {...stroke} strokeWidth={1.5} fill="none" />
        </g>
      )
    case 'ap':
    case 'wlc':
      return (
        <g>
          <rect x={x - 16} y={y - 2} width={32} height={14} rx={kind === 'ap' ? 7 : 3} fill={fill} {...stroke} />
          <g fill="none" stroke="var(--color-biru-dalam)" strokeWidth={1.8} strokeLinecap="round">
            <path d={`M${x - 7} ${y - 7} Q${x} ${y - 13} ${x + 7} ${y - 7}`} />
            <path d={`M${x - 12} ${y - 11} Q${x} ${y - 20} ${x + 12} ${y - 11}`} />
          </g>
        </g>
      )
    case 'phone':
      return (
        <g>
          <rect x={x - 11} y={y - 15} width={22} height={30} rx={4} fill="#fff" {...stroke} />
          <rect x={x - 6} y={y - 10} width={12} height={7} rx={1} fill={fill} />
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={x - 5 + c * 5} cy={y + 2 + r * 4} r={1.2} fill="var(--color-biru-dalam)" />))}
        </g>
      )
    case 'printer':
      return (
        <g>
          <rect x={x - 18} y={y - 6} width={36} height={16} rx={3} fill={fill} {...stroke} />
          <rect x={x - 10} y={y - 15} width={20} height={9} fill="#fff" {...stroke} strokeWidth={1.5} />
          <rect x={x - 10} y={y + 6} width={20} height={9} fill="#fff" {...stroke} strokeWidth={1.5} />
        </g>
      )
    case 'cloud':
      return <Cloud x={x - 26} y={y - 16} w={52} />
    case 'firewall':
      return (
        <g>
          <rect x={x - 20} y={y - 13} width={40} height={26} rx={2} fill="var(--color-koral-muda)" stroke="var(--color-koral-dalam)" strokeWidth={2} />
          <path
            d={`M${x - 20} ${y - 4} H${x + 20} M${x - 20} ${y + 5} H${x + 20} M${x - 6} ${y - 13} V${y - 4} M${x + 8} ${y - 4} V${y + 5} M${x - 6} ${y + 5} V${y + 13}`}
            stroke="var(--color-koral-dalam)"
            strokeWidth={1.5}
            fill="none"
          />
        </g>
      )
  }
}

/** Where a link leaves a device's icon, on the way to `toward`. */
function edgePoint(from: { x: number; y: number }, toward: { x: number; y: number }) {
  const dx = toward.x - from.x
  const dy = toward.y - from.y
  const len = Math.hypot(dx, dy) || 1
  // The icons are about 44 x 30, so leave a box of 24 x 18 around the center.
  const t = Math.min(24 / Math.abs(dx || 1e-9), 18 / Math.abs(dy || 1e-9))
  return { x: from.x + dx * Math.min(t, 1), y: from.y + dy * Math.min(t, 1), ux: dx / len, uy: dy / len }
}

/** Text with a white halo, so a label stays readable on top of a line. */
function Halo({ x, y, children, anchor = 'middle', style = label }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end'; style?: { fill: string; fontWeight: number } }) {
  return (
    <text x={x} y={y} fontSize={12} textAnchor={anchor} dominantBaseline="middle" stroke="#fff" strokeWidth={4} paintOrder="stroke" strokeLinejoin="round" {...style}>
      {children}
    </text>
  )
}

function LinkView({ link, a, b }: { link: NetLink; a: NetDevice; b: NetDevice }) {
  const pa = devicePoint(a)
  const pb = devicePoint(b)
  const s = edgePoint(pa, pb)
  const e = edgePoint(pb, pa)
  const down = link.state === 'down'
  const color = down ? 'var(--color-koral-dalam)' : 'var(--color-tinta-lembut)'
  const dash = link.style === 'dashed' || down ? '6 5' : link.style === 'wireless' ? '2 5' : undefined
  // Labels sit beside the line: to the right of a vertical line, above a horizontal one.
  const nx = -s.uy
  const ny = s.ux
  const side = Math.abs(s.uy) > Math.abs(s.ux) ? (nx >= 0 ? 1 : -1) : ny <= 0 ? 1 : -1
  const ox = nx * 10 * side
  const oy = ny * 10 * side
  const anchor = Math.abs(ox) > 3 ? (ox > 0 ? 'start' : 'end') : 'middle'
  const at = (p: { x: number; y: number }, q: { x: number; y: number }, t: number) => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t })
  const near = (p: { x: number; y: number }, q: { x: number; y: number }) => at(p, q, Math.min(0.32, 22 / Math.max(1, Math.hypot(q.x - p.x, q.y - p.y))))
  const fromLabel = near(s, e)
  const toLabel = near(e, s)
  const mid = at(s, e, 0.5)
  return (
    <g>
      <line x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke={color} strokeWidth={link.label === 'trunk' ? 3.5 : 2.2} strokeDasharray={dash} strokeLinecap="round" />
      {link.state === 'blocked' && <rect x={e.x - 5 - e.ux * 10} y={e.y - 5 - e.uy * 10} width={10} height={10} fill="var(--color-koral)" stroke="var(--color-koral-dalam)" strokeWidth={1.5} />}
      {down && <Halo x={mid.x} y={mid.y}>✕</Halo>}
      {link.fromPort && (
        <Halo x={fromLabel.x + ox} y={fromLabel.y + oy} anchor={anchor} style={quiet}>
          {link.fromPort}
        </Halo>
      )}
      {link.toPort && (
        <Halo x={toLabel.x + ox} y={toLabel.y + oy} anchor={anchor} style={quiet}>
          {link.toPort}
        </Halo>
      )}
      {link.label && !down && (
        <Halo x={mid.x - ox} y={mid.y - oy} anchor={anchor === 'start' ? 'end' : anchor === 'end' ? 'start' : 'middle'}>
          {link.label}
        </Halo>
      )}
    </g>
  )
}

/** Words for screen readers: every device and every link with its ports. */
function describeDiagram(d: Diagram): string {
  const name = new Map(d.devices.map((x) => [x.id, x.label]))
  const links = d.links.map((l) => {
    const ends = `${name.get(l.from)}${l.fromPort ? ` ${l.fromPort}` : ''} ke ${name.get(l.to)}${l.toPort ? ` ${l.toPort}` : ''}`
    const extra = [l.label, l.state === 'down' ? 'link mati' : l.state === 'blocked' ? `port di ${name.get(l.to)} diblokir` : ''].filter(Boolean).join(', ')
    return extra ? `${ends} (${extra})` : ends
  })
  return `Topologi jaringan dengan ${d.devices.map((x) => x.label + (x.note ? ` (${x.note})` : '')).join(', ')}. Sambungan: ${links.join('; ')}.`
}

/** The diagram itself. `title` overrides the generated description. */
export function NetDiagramView({ diagram, title }: { diagram: Diagram; title?: string }) {
  const byId = new Map(diagram.devices.map((d) => [d.id, d]))
  const rows = Math.max(0, ...diagram.devices.map((d) => d.y))
  const hasNote = diagram.devices.some((d) => d.y === rows && d.note)
  const height = Y0 + rows * ROW + (hasNote ? 62 : 46)
  return (
    <svg viewBox={`0 0 300 ${height}`} role="img" aria-label={title ?? describeDiagram(diagram)} className="w-full font-display">
      {diagram.links.map((l, i) => {
        const a = byId.get(l.from)
        const b = byId.get(l.to)
        return a && b ? <LinkView key={i} link={l} a={a} b={b} /> : null
      })}
      {diagram.devices.map((d) => {
        const p = devicePoint(d)
        return (
          <g key={d.id}>
            <DeviceIcon kind={d.kind} x={p.x} y={p.y} />
            <text x={p.x} y={p.y + 30} fontSize={13} textAnchor="middle" {...label}>
              {d.label}
            </text>
            {d.note && (
              <text x={p.x} y={p.y + 45} fontSize={12} textAnchor="middle" {...quiet}>
                {d.note}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
