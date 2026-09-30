import type { FC } from 'react'
import { Mark } from './parts'
import { label, quiet } from './styles'

const ROWS: [string, boolean, boolean][] = [
  ['User', true, true],
  ['Device', true, false],
  ['Service principal', true, false],
  ['Group lain (nested)', true, false],
]

/**
 * Security group vs Microsoft 365 group (who can be a member), and the three
 * membership types. Check and cross marks carry the answer, not color alone.
 */
export const GroupTypes: FC = () => (
  <svg
    viewBox="0 0 300 214"
    role="img"
    aria-label="Diagram jenis group: security group bisa berisi user, device, service principal, dan group lain; Microsoft 365 group hanya berisi user. Jenis keanggotaan: Assigned (manual), Dynamic user, dan Dynamic device (lewat aturan, butuh lisensi Microsoft Entra ID P1 untuk user)."
    className="w-full font-display"
  >
    <text x={180} y={16} fontSize={12} textAnchor="middle" {...label}>
      Security
    </text>
    <text x={254} y={16} fontSize={12} textAnchor="middle" {...label}>
      Microsoft 365
    </text>
    {ROWS.map(([name, security, m365], i) => {
      const y = 26 + i * 26
      return (
        <g key={name}>
          <rect x={0} y={y} width={300} height={24} rx={6} fill={i % 2 ? '#fff' : 'var(--color-biru-muda)'} />
          <text x={6} y={y + 16} fontSize={12} {...label}>
            {name}
          </text>
          <Mark cx={180} cy={y + 12} ok={security} />
          <Mark cx={254} cy={y + 12} ok={m365} />
        </g>
      )
    })}
    <text x={0} y={150} fontSize={12} {...label}>
      Jenis keanggotaan
    </text>
    {[
      ['Assigned', 'ditambah manual'],
      ['Dynamic user', 'aturan, butuh P1'],
      ['Dynamic device', 'aturan device'],
    ].map(([name, note], i) => (
      <g key={name}>
        <rect x={i * 101} y={158} width={97} height={52} rx={10} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} strokeDasharray={i ? '5 4' : undefined} />
        <text x={i * 101 + 48.5} y={180} fontSize={12} textAnchor="middle" {...label}>
          {name}
        </text>
        <text x={i * 101 + 48.5} y={198} fontSize={12} textAnchor="middle" {...quiet}>
          {note}
        </text>
      </g>
    ))}
  </svg>
)
