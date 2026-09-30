import type { FC } from 'react'
import { Mark } from './parts'
import { label, quiet } from './styles'

const ROWS: [string, boolean, boolean][] = [
  ['IP privat di subnet-mu', false, true],
  ['Menuju satu resource tertentu', false, true],
  ['Bisa dari on-premises', false, true],
  ['Butuh private DNS zone', false, true],
  ['Diaktifkan per subnet', true, false],
]

/**
 * Service endpoint vs private endpoint: what each one gives. Marks carry the
 * answer, and each column is also named in text.
 */
export const ServiceVsPrivateEndpoint: FC = () => (
  <svg
    viewBox="0 0 300 208"
    role="img"
    aria-label="Perbandingan service endpoint dan private endpoint. Private endpoint memberi IP privat di subnet-mu, menuju satu resource tertentu, bisa dipakai dari on-premises lewat VPN atau ExpressRoute, dan butuh private DNS zone. Service endpoint diaktifkan per subnet, trafiknya tetap ke alamat publik layanan lewat backbone Azure, DNS-nya tidak berubah, dan tidak berlaku untuk trafik dari on-premises."
    className="w-full font-display"
  >
    <text x={196} y={14} fontSize={12} textAnchor="middle" {...label}>
      Service
    </text>
    <text x={196} y={28} fontSize={12} textAnchor="middle" {...quiet}>
      endpoint
    </text>
    <text x={264} y={14} fontSize={12} textAnchor="middle" {...label}>
      Private
    </text>
    <text x={264} y={28} fontSize={12} textAnchor="middle" {...quiet}>
      endpoint
    </text>
    {ROWS.map(([name, se, pe], i) => {
      const y = 36 + i * 28
      return (
        <g key={name}>
          <rect x={0} y={y} width={300} height={26} rx={6} fill={i % 2 ? '#fff' : 'var(--color-biru-muda)'} />
          <text x={6} y={y + 17} fontSize={12} {...label}>
            {name}
          </text>
          <Mark cx={196} cy={y + 13} ok={se} />
          <Mark cx={264} cy={y + 13} ok={pe} />
        </g>
      )
    })}
    <text x={0} y={190} fontSize={12} {...quiet}>
      Service endpoint: tetap ke IP publik layanan,
    </text>
    <text x={0} y={206} fontSize={12} {...quiet}>
      tapi lewat backbone Azure dengan IP privat sumber.
    </text>
  </svg>
)
