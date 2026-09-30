import { useState, type CSSProperties, type ReactNode } from 'react'
import { BookOpen } from 'lucide-react'
import { GlossaryText } from '../components/GlossaryText'
import type { CaseStudy } from '../lib/types'

/** Paragraphs, with runs of "- " items drawn as one bulleted list. */
function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
  const blocks: ReactNode[] = []
  let list: string[] = []
  const flush = () => {
    if (!list.length) return
    blocks.push(
      <ul key={blocks.length} className="list-disc space-y-1.5 pl-5">
        {list.map((item) => (
          <li key={item}>
            <GlossaryText text={item} />
          </li>
        ))}
      </ul>,
    )
    list = []
  }
  for (const p of paragraphs) {
    if (p.startsWith('- ')) list.push(p.slice(2))
    else {
      flush()
      blocks.push(
        <p key={blocks.length}>
          <GlossaryText text={p} />
        </p>,
      )
    }
  }
  flush()
  return <>{blocks}</>
}

/**
 * The scenario of a case study, one part at a time (Overview, Existing
 * environment, Requirements), like the tabs of the real exam (plan section 9.2).
 */
export function CaseScenario({ caseStudy }: { caseStudy: CaseStudy }) {
  const [tab, setTab] = useState(0)
  const current = caseStudy.tabs[Math.min(tab, caseStudy.tabs.length - 1)]
  return (
    <section aria-label={`Skenario ${caseStudy.title}`} data-case-scenario={caseStudy.id}>
      <h2 className="font-display text-20 font-bold">{caseStudy.title}</h2>
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Bagian skenario">
        {caseStudy.tabs.map((t, i) => {
          const on = i === tab
          return (
            <button
              key={t.title}
              type="button"
              role="radio"
              aria-checked={on}
              lang="en"
              onClick={() => setTab(i)}
              className={`btn-3d min-h-11 cursor-pointer rounded-xl border-2 px-3 font-display text-15 font-bold ${on ? 'border-biru bg-biru-muda' : 'border-kabut bg-white'}`}
              style={{ '--edge': on ? 'var(--color-biru)' : 'var(--color-kabut)' } as CSSProperties}
            >
              {t.title}
            </button>
          )
        })}
      </div>
      <div lang="en" className="mt-4 space-y-3 text-15">
        <Paragraphs paragraphs={current.paragraphs} />
      </div>
    </section>
  )
}

/** A closed scenario above a question outside the exam (review, practice), opened on demand. */
export function CaseScenarioPanel({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <details className="mb-5 rounded-2xl border-2 border-kabut bg-white p-4" data-case-panel={caseStudy.id}>
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 font-display text-15 font-bold text-biru-dalam">
        <BookOpen size={18} aria-hidden="true" className="shrink-0" />
        Studi kasus {caseStudy.title}: baca skenarionya
      </summary>
      <div className="mt-3">
        <CaseScenario caseStudy={caseStudy} />
      </div>
    </details>
  )
}
