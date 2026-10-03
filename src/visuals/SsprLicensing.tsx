import type { FC } from 'react'
import { Mark } from './parts'
import { label, quiet } from './styles'

const FEATURES = ['Ganti', 'Reset', 'Writeback']

const LICENSES: { name: string; ok: [boolean, boolean, boolean] }[] = [
  { name: 'Entra ID Free', ok: [true, false, false] },
  { name: 'M365 Business Standard', ok: [true, true, false] },
  { name: 'M365 Business Premium', ok: [true, true, true] },
  { name: 'Entra ID P1 atau P2', ok: [true, true, true] },
]

/** Which license gives which self-service password feature (concept-sspr-licensing). */
export const SsprLicensing: FC = () => (
  <svg
    viewBox="0 0 300 204"
    role="img"
    aria-label="Tabel lisensi SSPR: mengganti password yang masih diingat untuk user cloud tersedia di semua lisensi termasuk Entra ID Free. Reset password untuk user cloud butuh Microsoft 365 Business Standard, Business Premium, atau Entra ID P1 atau P2. Reset dengan writeback ke on-premises butuh Microsoft 365 Business Premium atau Entra ID P1 atau P2."
    className="w-full font-display"
  >
    {FEATURES.map((f, i) => (
      <text key={f} x={i === 2 ? 296 : 174 + i * 50} y={16} fontSize={12} textAnchor={i === 2 ? 'end' : 'middle'} {...label}>
        {f}
      </text>
    ))}
    {LICENSES.map((l, r) => {
      const y = 24 + r * 34
      return (
        <g key={l.name}>
          <rect x={0} y={y} width={300} height={30} rx={8} fill={r % 2 ? '#fff' : 'var(--color-biru-muda)'} />
          <text x={6} y={y + 19} fontSize={12} {...label}>
            {l.name}
          </text>
          {l.ok.map((ok, i) => (
            <Mark key={i} cx={174 + i * 50} cy={y + 15} ok={ok} />
          ))}
        </g>
      )
    })}
    <text x={0} y={176} fontSize={12} {...quiet}>
      Ganti = password lama masih diingat. Writeback = ke AD
    </text>
    <text x={0} y={194} fontSize={12} {...quiet}>
      on-premises. Akun admin punya kebijakan dua bukti.
    </text>
  </svg>
)
