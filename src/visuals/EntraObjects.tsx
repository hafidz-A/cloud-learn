import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Person } from './parts'
import { label, quiet } from './styles'

/**
 * A Microsoft Entra tenant holds users (members and guests), groups, and
 * devices. A guest keeps signing in with the account of their own organization.
 */
export const EntraObjects: FC = () => {
  const arrow = useSvgId('entra-arrow')
  return (
    <svg
      viewBox="0 0 300 196"
      role="img"
      aria-label="Diagram tenant Microsoft Entra: di dalam tenant Contoso ada user member (karyawan, UserType Member), user guest (UserType Guest), group, dan device. User guest login dengan akun dari organisasinya sendiri, Fabrikam."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      <rect x={2} y={2} width={206} height={190} rx={14} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={14} y={22} fontSize={13} {...label}>
        Tenant Contoso
      </text>
      {/* Member */}
      <rect x={14} y={32} width={88} height={70} rx={10} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} />
      <Person x={51} y={40} />
      <text x={58} y={72} fontSize={12} textAnchor="middle" {...label}>
        Member
      </text>
      <text x={58} y={88} fontSize={12} textAnchor="middle" {...quiet}>
        karyawan
      </text>
      {/* Guest */}
      <rect x={110} y={32} width={88} height={70} rx={10} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} strokeDasharray="5 4" />
      <Person x={147} y={40} color="var(--color-tinta-lembut)" />
      <text x={154} y={72} fontSize={12} textAnchor="middle" {...label}>
        Guest
      </text>
      <text x={154} y={88} fontSize={12} textAnchor="middle" {...quiet}>
        tamu (B2B)
      </text>
      {/* Group */}
      <rect x={14} y={112} width={88} height={70} rx={10} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} />
      <Person x={36} y={124} />
      <Person x={51} y={120} />
      <Person x={66} y={124} />
      <text x={58} y={158} fontSize={12} textAnchor="middle" {...label}>
        Group
      </text>
      {/* Device */}
      <rect x={110} y={112} width={88} height={70} rx={10} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} />
      <rect x={138} y={120} width={32} height={22} rx={3} fill="var(--color-kabut)" stroke="var(--color-tinta-lembut)" strokeWidth={2} />
      <rect x={133} y={143} width={42} height={5} rx={2} fill="var(--color-tinta-lembut)" />
      <text x={154} y={168} fontSize={12} textAnchor="middle" {...label}>
        Device
      </text>
      {/* Home organization of the guest */}
      <rect x={222} y={36} width={74} height={62} rx={10} fill="#fff" stroke="var(--color-kabut-dalam)" strokeWidth={2} />
      <text x={259} y={58} fontSize={12} textAnchor="middle" {...label}>
        Fabrikam
      </text>
      <text x={259} y={74} fontSize={12} textAnchor="middle" {...quiet}>
        akun asli
      </text>
      <text x={259} y={88} fontSize={12} textAnchor="middle" {...quiet}>
        si tamu
      </text>
      <path d="M222 67 H202" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />
      <text x={259} y={124} fontSize={12} textAnchor="middle" {...quiet}>
        login
      </text>
      <text x={259} y={140} fontSize={12} textAnchor="middle" {...quiet}>
        dengan
      </text>
      <text x={259} y={156} fontSize={12} textAnchor="middle" {...quiet}>
        akun sendiri
      </text>
    </svg>
  )
}
