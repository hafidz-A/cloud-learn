import type { FC } from 'react'
import { Server } from './parts'
import { label, quiet } from './styles'

function VNet({ x, name, region }: { x: number; name: string; region: string }) {
  return (
    <g>
      <rect x={x} y={20} width={104} height={84} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={x + 52} y={40} fontSize={13} textAnchor="middle" {...label}>
        {name}
      </text>
      <Server x={x + 22} y={52} w={24} h={30} />
      <Server x={x + 58} y={52} w={24} h={30} />
      <text x={x + 52} y={124} fontSize={12} textAnchor="middle" {...quiet}>
        {region}
      </text>
    </g>
  )
}

/** Two virtual networks joined by peering over the Microsoft backbone. */
export const VNetPeering: FC = () => (
  <svg
    viewBox="0 0 300 152"
    role="img"
    aria-label="Diagram VNet peering: VNet A dan VNet B di region berbeda terhubung langsung dengan alamat privat lewat backbone Microsoft, tidak lewat internet."
    className="w-full font-display"
  >
    <VNet x={0} name="VNet A" region="region 1" />
    <VNet x={196} name="VNet B" region="region 2" />
    <path d="M106 58 H194 M106 66 H194" stroke="var(--color-biru-dalam)" strokeWidth={3} />
    <text x={150} y={50} fontSize={12} textAnchor="middle" {...label}>
      peering
    </text>
    <text x={150} y={86} fontSize={12} textAnchor="middle" {...quiet}>
      alamat privat
    </text>
    <text x={150} y={146} fontSize={12} textAnchor="middle" {...label}>
      Lewat backbone Microsoft, bukan internet
    </text>
  </svg>
)
