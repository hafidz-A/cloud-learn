import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker } from './parts'
import { label, quiet } from './styles'

const STEPS = [
  { title: 'Alert rule', note: 'resource, sinyal, kondisi', fill: 'var(--color-biru-muda)' },
  { title: 'Alert fired', note: 'disimpan 30 hari', fill: 'var(--color-koral-muda)' },
  { title: 'Alert processing rule', note: 'suppress atau tambah action group, bisa terjadwal', fill: 'var(--color-matahari-muda)' },
  { title: 'Action group', note: 'email, SMS, webhook, runbook, Logic Apps', fill: 'var(--color-mint-muda)' },
]

/**
 * How an Azure Monitor alert travels: the alert rule fires an alert, alert
 * processing rules can suppress or add action groups (for example during a
 * maintenance window), and action groups notify people or start automation.
 */
export const AlertFlow: FC = () => {
  const arrow = useSvgId('alert-arrow')
  return (
    <svg
      viewBox="0 0 300 250"
      role="img"
      aria-label="Alur alert Azure Monitor. Alert rule memantau resource, sinyal, dan kondisi. Kalau kondisinya terpenuhi, alert fired dan disimpan 30 hari. Alert processing rule bisa menekan notifikasi atau menambah action group, dan bisa dijadwalkan, misalnya selama maintenance. Terakhir action group mengirim email, SMS, webhook, atau menjalankan runbook dan Logic Apps."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      {STEPS.map((s, i) => {
        const y = 1 + i * 62
        return (
          <g key={s.title}>
            <rect x={1} y={y} width={298} height={48} rx={10} fill={s.fill} stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
            <text x={12} y={y + 20} fontSize={12} {...label}>
              {s.title}
            </text>
            <text x={12} y={y + 38} fontSize={12} {...quiet}>
              {s.note}
            </text>
            {i < STEPS.length - 1 && <path d={`M150 ${y + 49} V${y + 60}`} stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />}
          </g>
        )
      })}
    </svg>
  )
}
