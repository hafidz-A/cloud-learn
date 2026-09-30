import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Person } from './parts'
import { label, quiet } from './styles'

/**
 * Azure Bastion (Basic and up): the browser connects over TLS on 443 to Bastion
 * in AzureBastionSubnet (/26 or larger, Standard static public IP), and Bastion
 * opens RDP or SSH to the VMs on their private IPs. The VMs need no public IP.
 */
export const BastionArchitecture: FC = () => {
  const arrow = useSvgId('bastion-arrow')
  const line = { stroke: 'var(--color-biru-dalam)', strokeWidth: 2, fill: 'none', markerEnd: `url(#${arrow})` }
  return (
    <svg
      viewBox="0 0 300 230"
      role="img"
      aria-label="Arsitektur Azure Bastion: admin membuka portal Azure di browser dan terhubung lewat TLS port 443 ke Bastion. Bastion berada di subnet khusus AzureBastionSubnet berukuran minimal /26, dengan public IP Standard static. Dari sana Bastion membuka RDP atau SSH ke VM lewat IP privatnya, jadi VM di subnet lain tidak butuh public IP."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      <Person x={14} y={10} />
      <text x={26} y={52} fontSize={12} textAnchor="middle" {...label}>
        Admin
      </text>
      <text x={26} y={68} fontSize={12} textAnchor="middle" {...quiet}>
        browser
      </text>
      <path d="M52 30 H92" {...line} />
      <text x={72} y={20} fontSize={12} textAnchor="middle" {...quiet}>
        443
      </text>
      {/* VNet */}
      <rect x={96} y={1} width={203} height={228} rx={14} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={108} y={20} fontSize={12} {...label}>
        VNet
      </text>
      <rect x={106} y={28} width={184} height={70} rx={10} fill="var(--color-matahari-muda)" stroke="var(--color-matahari-dalam)" strokeWidth={2} />
      <text x={198} y={47} fontSize={12} textAnchor="middle" {...label}>
        AzureBastionSubnet
      </text>
      <text x={198} y={65} fontSize={12} textAnchor="middle" {...quiet}>
        /26 atau lebih besar
      </text>
      <text x={198} y={83} fontSize={12} textAnchor="middle" {...quiet}>
        Bastion + public IP static
      </text>
      <path d="M150 99 V124" {...line} />
      <text x={160} y={116} fontSize={12} {...quiet}>
        RDP/SSH, IP privat
      </text>
      <rect x={106} y={128} width={184} height={92} rx={10} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} />
      <text x={198} y={148} fontSize={12} textAnchor="middle" {...label}>
        snet-app
      </text>
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x={122 + i * 86} y={158} width={66} height={30} rx={6} fill="var(--color-biru-muda)" stroke="var(--color-biru)" strokeWidth={1.5} />
          <text x={155 + i * 86} y={177} fontSize={12} textAnchor="middle" {...label}>
            {`vm${i + 1}`}
          </text>
        </g>
      ))}
      <text x={198} y={208} fontSize={12} textAnchor="middle" {...quiet}>
        tanpa public IP
      </text>
    </svg>
  )
}
