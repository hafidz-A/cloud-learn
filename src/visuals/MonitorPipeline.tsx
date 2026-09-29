import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Pill } from './parts'
import { label } from './styles'

const SOURCES = ['Azure', 'On-premises', 'Cloud lain', 'Aplikasi']
const ACTIONS = ['Dashboard', 'Alert', 'Autoscale', 'Log Analytics']

/** Azure Monitor collects metrics and logs from many sources and turns them into dashboards, alerts, autoscale, and queries. */
export const MonitorPipeline: FC = () => {
  const monitorArrow = useSvgId('monitor-arrow')
  const top = 24
  const rh = 34
  return (
    <svg
      viewBox="0 0 300 166"
      role="img"
      aria-label="Diagram Azure Monitor: data dari Azure, on-premises, cloud lain, dan aplikasi dikumpulkan sebagai metrics dan logs, lalu dipakai untuk dashboard, alert, autoscale, dan query di Log Analytics."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={monitorArrow} />
      </defs>
      <text x={42} y={14} fontSize={12} textAnchor="middle" {...label}>
        Sumber
      </text>
      <text x={150} y={14} fontSize={12} textAnchor="middle" {...label}>
        Azure Monitor
      </text>
      <text x={256} y={14} fontSize={12} textAnchor="middle" {...label}>
        Dipakai untuk
      </text>
      {SOURCES.map((s, i) => (
        <Pill key={s} x={0} y={top + i * rh} w={84} lines={[s]} />
      ))}
      <path d="M88 84 H106" stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${monitorArrow})`} />
      <rect x={110} y={top} width={80} height={4 * rh - 8} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <Pill x={118} y={top + 22} w={64} lines={['Metrics']} fill="#fff" />
      <Pill x={118} y={top + 70} w={64} lines={['Logs']} fill="#fff" />
      <path d="M194 84 H208" stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerEnd={`url(#${monitorArrow})`} />
      {ACTIONS.map((a, i) => (
        <Pill key={a} x={212} y={top + i * rh} w={88} lines={[a]} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" />
      ))}
    </svg>
  )
}
