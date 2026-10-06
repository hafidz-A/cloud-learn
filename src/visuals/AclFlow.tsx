import type { FC } from 'react'
import { label, quiet } from './styles'

const LINES = [
  { text: '10 deny host 192.168.1.66', fill: 'var(--color-koral-muda)' },
  { text: '20 permit 192.168.1.0 /24', fill: 'var(--color-mint-muda)' },
  { text: '(deny any, tidak terlihat)', fill: 'var(--color-kabut)' },
]

/** An ACL is read top-down; the first match decides, and an unseen deny ends every list. */
export const AclFlow: FC = () => (
  <svg
    viewBox="0 0 300 160"
    role="img"
    aria-label="ACL dibaca dari atas ke bawah. Baris 10 deny host 192.168.1.66. Baris 20 permit 192.168.1.0/24. Di akhir ada deny any yang tidak terlihat. Paket dicocokkan baris demi baris; baris pertama yang cocok menentukan nasibnya dan sisanya tidak dibaca. Paket yang tidak cocok dengan baris mana pun ditolak oleh deny tersembunyi."
    className="w-full font-display"
  >
    {LINES.map((l, i) => (
      <g key={l.text}>
        <rect x={40} y={8 + i * 46} width={256} height={34} rx={6} fill={l.fill} />
        <text x={50} y={30 + i * 46} fontSize={12} {...(i === 2 ? quiet : label)}>
          {l.text}
        </text>
      </g>
    ))}
    <path d="M18 14 V138" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <path d="M12 130 L18 140 L24 130" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} fill="none" />
    <text x={4} y={156} fontSize={12} {...quiet}>
      Cocok pertama menang; sisanya tidak dibaca
    </text>
  </svg>
)
