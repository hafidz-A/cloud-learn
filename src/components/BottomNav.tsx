import { BookA, ChartColumn, ClipboardCheck, Dumbbell, House } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { hrefFor, type Tab } from '../lib/router'

const ITEMS: { tab: Tab; label: string; Icon: LucideIcon }[] = [
  { tab: 'home', label: 'Home', Icon: House },
  { tab: 'latihan', label: 'Latihan', Icon: Dumbbell },
  { tab: 'ujian', label: 'Ujian', Icon: ClipboardCheck },
  { tab: 'statistik', label: 'Statistik', Icon: ChartColumn },
  { tab: 'glosarium', label: 'Glosarium', Icon: BookA },
]

export function BottomNav({ active }: { active: Tab }) {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t-2 border-kabut bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map(({ tab, label, Icon }) => {
          const isActive = tab === active
          return (
            <li key={tab}>
              <a
                href={hrefFor({ name: 'tab', tab })}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-0.5 font-display text-13 font-semibold ${
                  isActive ? 'text-biru-dalam' : 'text-tinta-lembut'
                }`}
              >
                <span className={`flex h-8 w-12 items-center justify-center rounded-xl ${isActive ? 'bg-biru-muda' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-biru' : ''} />
                </span>
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
