import type { FC } from 'react'
import { label, quiet } from './styles'

/** 802.1D states against RSTP states. */
export const StpStates: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="State port 802.1D dibandingkan RSTP. Disabled, blocking, dan listening di 802.1D digabung menjadi satu state di RSTP, yaitu discarding. Learning tetap learning, dan forwarding tetap forwarding. Di 802.1D, listening dan learning masing-masing berlangsung selama forward delay, 15 detik."
    className="w-full font-display"
  >
    <text x={70} y={16} fontSize={13} textAnchor="middle" {...label}>
      802.1D
    </text>
    <text x={230} y={16} fontSize={13} textAnchor="middle" {...label}>
      RSTP
    </text>
    {['Disabled', 'Blocking', 'Listening', 'Learning', 'Forwarding'].map((s, i) => (
      <g key={s}>
        <rect x={10} y={26 + i * 30} width={120} height={24} rx={6} fill={i < 3 ? 'var(--color-koral-muda)' : i === 3 ? 'var(--color-matahari-muda)' : 'var(--color-mint-muda)'} />
        <text x={70} y={43 + i * 30} fontSize={12} textAnchor="middle" {...label}>
          {s}
        </text>
      </g>
    ))}
    <rect x={170} y={26} width={120} height={84} rx={6} fill="var(--color-koral-muda)" />
    <text x={230} y={72} fontSize={12} textAnchor="middle" {...label}>
      Discarding
    </text>
    <rect x={170} y={116} width={120} height={24} rx={6} fill="var(--color-matahari-muda)" />
    <text x={230} y={133} fontSize={12} textAnchor="middle" {...label}>
      Learning
    </text>
    <rect x={170} y={146} width={120} height={24} rx={6} fill="var(--color-mint-muda)" />
    <text x={230} y={163} fontSize={12} textAnchor="middle" {...label}>
      Forwarding
    </text>
    <path d="M130 68 H170 M130 128 H170 M130 158 H170" stroke="var(--color-tinta-lembut)" strokeWidth={1.2} />
    <text x={4} y={192} fontSize={12} {...quiet}>
      802.1D: listening dan learning 15 detik
    </text>
  </svg>
)
