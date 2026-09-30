import type { FC } from 'react'
import { label, quiet } from './styles'

const VAULTS = [
  {
    x: 1,
    title: ['Recovery Services', 'vault'],
    fill: 'var(--color-biru-muda)',
    items: ['VM Azure', 'SQL Server di VM', 'SAP HANA di VM', 'Azure Files', 'Server on-premises'],
    note: ['juga dipakai', 'Site Recovery'],
  },
  {
    x: 155,
    title: ['Backup vault', ''],
    fill: 'var(--color-mint-muda)',
    items: ['Azure Disks', 'Azure Blobs', 'PostgreSQL', 'Kubernetes'],
    note: [],
  },
]

/**
 * The two vault types of Azure Backup side by side, each with the workloads
 * it protects. The workload decides the vault; neither vault does both lists.
 */
export const VaultTypes: FC = () => (
  <svg
    viewBox="0 0 300 244"
    role="img"
    aria-label="Dua jenis vault di Azure Backup. Recovery Services vault melindungi VM Azure, SQL Server di VM Azure, SAP HANA di VM Azure, Azure Files, dan server on-premises lewat agen Azure Backup, Azure Backup Server, atau Data Protection Manager. Vault ini juga dipakai Azure Site Recovery. Backup vault melindungi Azure Disks, Azure Blobs, Azure Database for PostgreSQL, dan Kubernetes. Jenis resource menentukan vault yang dipakai. Untuk backup VM, vault harus berada di region yang sama dengan VM."
    className="w-full font-display"
  >
    {VAULTS.map((v) => (
      <g key={v.title[0]}>
        <rect x={v.x} y={1} width={144} height={196} rx={10} fill="#fff" stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
        <path d={`M${v.x} 11 a10 10 0 0 1 10 -10 H${v.x + 134} a10 10 0 0 1 10 10 V47 H${v.x} Z`} fill={v.fill} stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
        {v.title.map((t, i) => (
          <text key={i} x={v.x + 10} y={v.title[1] ? 20 + i * 16 : 29} fontSize={12} {...label}>
            {t}
          </text>
        ))}
        {v.items.map((item, i) => (
          <text key={item} x={v.x + 10} y={68 + i * 20} fontSize={12} {...label}>
            {item}
          </text>
        ))}
        {v.note.map((n, i) => (
          <text key={n} x={v.x + 10} y={172 + i * 16} fontSize={12} {...quiet}>
            {n}
          </text>
        ))}
      </g>
    ))}
    <text x={0} y={218} fontSize={12} {...quiet}>
      Jenis resource menentukan vault-nya.
    </text>
    <text x={0} y={236} fontSize={12} {...label}>
      Backup VM: vault harus satu region dengan VM.
    </text>
  </svg>
)
