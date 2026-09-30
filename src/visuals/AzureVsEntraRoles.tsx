import type { FC } from 'react'
import { label, quiet } from './styles'

const COLUMNS: { x: number; w: number; title: string; lines: string[]; dashed?: boolean }[] = [
  {
    x: 0,
    w: 138,
    title: 'Azure roles',
    lines: ['Resource Azure:', 'VM, storage, VNet', 'Owner, Contributor,', 'Reader', 'Scope: management', 'group s.d. resource', 'Access control', '(IAM)'],
  },
  {
    x: 146,
    w: 154,
    title: 'Microsoft Entra roles',
    lines: ['Direktori:', 'user, group, lisensi', 'Global Administrator,', 'User Administrator', 'Scope: tenant, unit', 'administratif, objek', 'Roles and', 'administrators'],
    dashed: true,
  },
]

/**
 * Azure roles (RBAC) and Microsoft Entra roles are separate systems: what each
 * one manages, examples, scopes, and where they are assigned. The only bridge is
 * a Global Administrator elevating access to User Access Administrator at root.
 */
export const AzureVsEntraRoles: FC = () => (
  <svg
    viewBox="0 0 300 256"
    role="img"
    aria-label="Perbandingan Azure roles dan Microsoft Entra roles. Azure roles mengatur resource Azure seperti VM, storage, dan VNet; contohnya Owner, Contributor, dan Reader; scope-nya management group sampai resource; diatur di Access control (IAM). Microsoft Entra roles mengatur direktori: user, group, dan lisensi; contohnya Global Administrator dan User Administrator; scope-nya tenant, unit administratif, atau satu objek; diatur di Roles and administrators. Keduanya terpisah. Global Administrator bisa elevate access sehingga mendapat User Access Administrator di root scope."
    className="w-full font-display"
  >
    {COLUMNS.map((c) => (
      <g key={c.title}>
        <rect
          x={c.x + 1}
          y={1}
          width={c.w - 2}
          height={188}
          rx={12}
          fill={c.dashed ? '#fff' : 'var(--color-biru-muda)'}
          stroke="var(--color-biru-dalam)"
          strokeWidth={2}
          strokeDasharray={c.dashed ? '5 4' : undefined}
        />
        <text x={c.x + c.w / 2} y={20} fontSize={12} textAnchor="middle" {...label}>
          {c.title}
        </text>
        {/* Pairs of lines: what it manages, examples, scope, and where it is assigned. */}
        {c.lines.map((t, i) => (
          <text key={t} x={c.x + 10} y={40 + Math.floor(i / 2) * 40 + (i % 2) * 16} fontSize={12} {...(i % 2 ? quiet : label)}>
            {t}
          </text>
        ))}
      </g>
    ))}
    <rect x={1} y={200} width={298} height={54} rx={10} fill="var(--color-matahari-muda)" stroke="var(--color-matahari-dalam)" strokeWidth={2} />
    <text x={150} y={218} fontSize={12} textAnchor="middle" {...label}>
      Terpisah. Jembatannya hanya elevate access:
    </text>
    <text x={150} y={234} fontSize={12} textAnchor="middle" {...quiet}>
      Global Administrator jadi User Access
    </text>
    <text x={150} y={248} fontSize={12} textAnchor="middle" {...quiet}>
      Administrator di root scope (/)
    </text>
  </svg>
)
