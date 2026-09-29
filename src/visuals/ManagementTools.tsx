import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker, Pill } from './parts'
import { quiet } from './styles'

const TOOLS = ['Portal', 'Cloud Shell', 'Azure CLI', 'PowerShell', 'ARM template', 'Bicep']

/** Every management tool sends its request through Azure Resource Manager, which then creates or changes resources. */
export const ManagementTools: FC = () => {
  const armArrow = useSvgId('arm-arrow')
  return (
    <svg
      viewBox="0 0 300 206"
      role="img"
      aria-label="Diagram alat manajemen: portal, Cloud Shell, Azure CLI, PowerShell, ARM template, dan Bicep semuanya mengirim permintaan lewat Azure Resource Manager, lalu ARM membuat atau mengubah resource."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={armArrow} />
      </defs>
      {TOOLS.map((t, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        return <Pill key={t} x={col * 101} y={row * 34} w={96} lines={[t]} />
      })}
      <path d="M48 62 L110 88 M150 62 V86 M250 62 L190 88" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${armArrow})`} />
      <Pill x={40} y={92} w={220} h={40} lines={['Azure Resource Manager', 'cek akses, lalu jalankan']} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" />
      <path d="M150 134 V152" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${armArrow})`} />
      {['VM', 'Storage', 'VNet'].map((r, i) => (
        <Pill key={r} x={52 + i * 68} y={158} w={62} lines={[r]} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" />
      ))}
      <text x={150} y={202} fontSize={12} textAnchor="middle" {...quiet}>
        Alat apa pun, hasil dan aksesnya sama
      </text>
    </svg>
  )
}
