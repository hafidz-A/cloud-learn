import type { FC } from 'react'
import { label, quiet } from './styles'

/**
 * A private DNS zone linked to two VNets: VNet1 with auto registration (its VMs
 * get A records automatically), VNet2 for resolution only (it can look names
 * up, but its VMs aren't registered).
 */
export const PrivateDnsAutoReg: FC = () => (
  <svg
    viewBox="0 0 300 230"
    role="img"
    aria-label="Private DNS zone contoso.internal di-link ke dua VNet. VNet1 di-link dengan auto registration aktif, jadi vm1 dan vm2 otomatis punya record A. VNet2 di-link tanpa auto registration, jadi VM di VNet2 bisa mencari nama di zone itu tapi tidak didaftarkan. Auto registration hanya untuk VM, hanya NIC utama, tidak membuat record PTR, dan satu VNet hanya bisa punya satu zone registrasi."
    className="w-full font-display"
  >
    <rect x={1} y={1} width={298} height={94} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
    <text x={12} y={21} fontSize={12} {...label}>
      Private DNS zone contoso.internal
    </text>
    {[
      ['vm1', 'A', '10.1.0.4'],
      ['vm2', 'A', '10.1.0.5'],
    ].map(([n, t, ip], i) => (
      <g key={n}>
        <rect x={10} y={30 + i * 29} width={280} height={25} rx={6} fill="#fff" />
        <text x={18} y={47 + i * 29} fontSize={12} {...label}>
          {n}
        </text>
        <text x={62} y={47 + i * 29} fontSize={12} {...label}>
          {t}
        </text>
        <text x={92} y={47 + i * 29} fontSize={12} {...quiet}>
          {ip} (otomatis)
        </text>
      </g>
    ))}
    <path d="M75 96 V116 M225 96 V116" stroke="var(--color-biru-dalam)" strokeWidth={2} />
    <text x={83} y={110} fontSize={12} {...quiet}>
      link
    </text>
    <text x={233} y={110} fontSize={12} {...quiet}>
      link
    </text>
    {[
      { x: 0, name: 'VNet1', note: 'auto registration', note2: 'vm1, vm2 terdaftar', dashed: false },
      { x: 154, name: 'VNet2', note: 'resolution saja', note2: 'bisa mencari nama', dashed: true },
    ].map((v) => (
      <g key={v.name}>
        <rect x={v.x + 1} y={118} width={144} height={66} rx={12} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} strokeDasharray={v.dashed ? '5 4' : undefined} />
        <text x={v.x + 73} y={138} fontSize={12} textAnchor="middle" {...label}>
          {v.name}
        </text>
        <text x={v.x + 73} y={156} fontSize={12} textAnchor="middle" {...quiet}>
          {v.note}
        </text>
        <text x={v.x + 73} y={173} fontSize={12} textAnchor="middle" {...quiet}>
          {v.note2}
        </text>
      </g>
    ))}
    <text x={0} y={204} fontSize={12} {...label}>
      Hanya VM, hanya NIC utama, tanpa PTR.
    </text>
    <text x={0} y={222} fontSize={12} {...quiet}>
      Satu VNet: maksimal satu zone registrasi.
    </text>
  </svg>
)
