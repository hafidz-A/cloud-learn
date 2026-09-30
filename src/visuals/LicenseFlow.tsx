import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Mark, Person } from './parts'
import { label, quiet } from './styles'

/**
 * Group-based licensing: the license goes to a group, and every member gets it.
 * A user without a usage location takes the tenant's location. A user who
 * can't get the license (none left, conflicting service plans) shows up under
 * Errors & issues in the Microsoft 365 admin center.
 */
export const LicenseFlow: FC = () => {
  const arrow = useSvgId('license-arrow')
  return (
    <svg
      viewBox="0 0 300 206"
      role="img"
      aria-label="Diagram group-based licensing: lisensi di-assign ke group Finance, lalu setiap anggota mendapat lisensi. User tanpa usage location memakai lokasi tenant. User yang tidak kebagian lisensi, misalnya karena lisensi habis, tidak mendapat lisensi dan muncul di daftar Errors and issues."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      <rect x={0} y={20} width={84} height={52} rx={10} fill="var(--color-matahari-muda)" stroke="var(--color-matahari-dalam)" strokeWidth={2} />
      <text x={42} y={42} fontSize={12} textAnchor="middle" {...label}>
        Lisensi
      </text>
      <text x={42} y={60} fontSize={12} textAnchor="middle" {...quiet}>
        Microsoft 365
      </text>
      <path d="M84 46 H106" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />
      <rect x={110} y={8} width={86} height={76} rx={10} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={153} y={28} fontSize={12} textAnchor="middle" {...label}>
        Group
      </text>
      <text x={153} y={44} fontSize={12} textAnchor="middle" {...label}>
        Finance
      </text>
      <text x={153} y={62} fontSize={12} textAnchor="middle" {...quiet}>
        di-assign
      </text>
      <text x={153} y={76} fontSize={12} textAnchor="middle" {...quiet}>
        ke group
      </text>
      <path d="M196 46 H214" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${arrow})`} />
      <text x={258} y={38} fontSize={12} textAnchor="middle" {...label}>
        Setiap
      </text>
      <text x={258} y={54} fontSize={12} textAnchor="middle" {...label}>
        anggota
      </text>
      <text x={258} y={70} fontSize={12} textAnchor="middle" {...label}>
        dapat lisensi
      </text>
      {[
        { y: 100, ok: true, name: 'Ani', note: 'usage location: ID' },
        { y: 134, ok: true, name: 'Budi', note: 'kosong: ikut lokasi tenant' },
        { y: 168, ok: false, name: 'Citra', note: 'lisensi habis: masuk daftar error' },
      ].map((u) => (
        <g key={u.name}>
          <rect x={0} y={u.y} width={300} height={30} rx={8} fill="#fff" stroke="var(--color-kabut-dalam)" strokeWidth={1.5} />
          <Person x={8} y={u.y + 7} />
          <text x={30} y={u.y + 20} fontSize={12} {...label}>
            {u.name}
          </text>
          <text x={72} y={u.y + 20} fontSize={12} {...quiet}>
            {u.note}
          </text>
          <Mark cx={286} cy={u.y + 15} ok={u.ok} />
        </g>
      ))}
    </svg>
  )
}
