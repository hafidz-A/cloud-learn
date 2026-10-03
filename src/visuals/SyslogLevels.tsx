import type { FC } from 'react'
import { label, quiet } from './styles'

const LEVELS = ['emergencies', 'alerts', 'critical', 'errors', 'warnings', 'notifications', 'informational', 'debugging']

/** The eight syslog severity levels; a threshold sends its level and every lower number. */
export const SyslogLevels: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Delapan level severity syslog, dari 0 paling parah sampai 7: 0 emergencies, 1 alerts, 2 critical, 3 errors, 4 warnings, 5 notifications, 6 informational, 7 debugging. Contoh logging trap warnings mengirim level 0 sampai 4, yang ditandai, dan tidak mengirim level 5 sampai 7."
    className="w-full font-display"
  >
    {LEVELS.map((name, i) => (
      <g key={name}>
        <rect x={4} y={4 + i * 24} width={200} height={21} rx={4} fill={i <= 4 ? 'var(--color-koral-muda)' : 'var(--color-kabut)'} />
        <text x={12} y={19 + i * 24} fontSize={12} {...label}>
          {i}
        </text>
        <text x={32} y={19 + i * 24} fontSize={12} {...quiet}>
          {name}
        </text>
      </g>
    ))}
    <path d="M212 6 V122" stroke="var(--color-koral-dalam)" strokeWidth={2} />
    <text x={220} y={56} fontSize={12} {...label}>
      logging trap
    </text>
    <text x={220} y={72} fontSize={12} {...quiet}>
      warnings
    </text>
    <text x={220} y={88} fontSize={12} {...quiet}>
      = 0 sampai 4
    </text>
  </svg>
)
