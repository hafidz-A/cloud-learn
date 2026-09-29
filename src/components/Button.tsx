import type { ButtonHTMLAttributes, CSSProperties } from 'react'

export type ButtonVariant = 'primary' | 'mint' | 'koral' | 'matahari' | 'putih'

// Label colors follow the WCAG AA notes in the plan: white on Biru langit only
// passes as large bold text (20px / 700), so every other filled variant uses Tinta.
const VARIANTS: Record<ButtonVariant, { className: string; edge: string }> = {
  primary: { className: 'bg-biru text-white', edge: 'var(--color-biru-dalam)' },
  mint: { className: 'bg-mint text-tinta', edge: 'var(--color-mint-dalam)' },
  koral: { className: 'bg-koral text-tinta', edge: 'var(--color-koral-dalam)' },
  matahari: { className: 'bg-matahari text-tinta', edge: 'var(--color-matahari-dalam)' },
  putih: { className: 'bg-white text-tinta border-2 border-kabut', edge: 'var(--color-kabut)' },
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  block?: boolean
}

/** Thick 3D button. Disabled buttons go flat and Kabut-colored. */
export function Button({ variant = 'primary', block = false, disabled, className = '', style, ...rest }: Props) {
  const v = VARIANTS[variant]
  const look = disabled ? 'bg-kabut text-tinta-lembut cursor-not-allowed' : `${v.className} cursor-pointer`
  return (
    <button
      type="button"
      disabled={disabled}
      className={`btn-3d min-h-[52px] rounded-2xl px-6 font-display text-20 font-bold ${look} ${block ? 'w-full' : ''} ${className}`}
      style={{ '--edge': disabled ? 'var(--color-kabut-dalam)' : v.edge, ...style } as CSSProperties}
      {...rest}
    />
  )
}
