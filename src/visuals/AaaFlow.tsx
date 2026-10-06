import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** AAA: the router asks a central server who the admin is, what they may do, and records what they did. */
export const AaaFlow: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="AAA. Admin login lewat SSH ke router. Router, sebagai klien AAA, bertanya ke server AAA pusat. Authentication: siapa kamu. Authorization: apa yang boleh kamu lakukan. Accounting: mencatat apa yang kamu lakukan. Kalau server tidak bisa dihubungi, router bisa memakai user lokal sebagai cadangan."
    className="w-full font-display"
  >
    <DeviceIcon kind="laptop" x={30} y={40} />
    <DeviceIcon kind="router" x={150} y={40} />
    <DeviceIcon kind="server" x={270} y={40} />
    <text x={30} y={70} fontSize={12} textAnchor="middle" {...label}>
      Admin
    </text>
    <text x={150} y={70} fontSize={12} textAnchor="middle" {...label}>
      R1 (klien AAA)
    </text>
    <text x={264} y={70} fontSize={12} textAnchor="middle" {...label}>
      Server AAA
    </text>
    <line x1={52} y1={40} x2={128} y2={40} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <line x1={172} y1={40} x2={248} y2={40} stroke="var(--color-biru-dalam)" strokeWidth={2} />
    <rect x={4} y={86} width={292} height={26} rx={6} fill="var(--color-biru-muda)" />
    <text x={12} y={103} fontSize={12} {...label}>
      Authentication: siapa kamu?
    </text>
    <rect x={4} y={116} width={292} height={26} rx={6} fill="var(--color-mint-muda)" />
    <text x={12} y={133} fontSize={12} {...label}>
      Authorization: apa yang boleh?
    </text>
    <rect x={4} y={146} width={292} height={26} rx={6} fill="var(--color-matahari-muda)" />
    <text x={12} y={163} fontSize={12} {...label}>
      Accounting: apa yang dilakukan?
    </text>
    <text x={4} y={192} fontSize={12} {...quiet}>
      Server mati: cadangan user lokal (local)
    </text>
  </svg>
)
