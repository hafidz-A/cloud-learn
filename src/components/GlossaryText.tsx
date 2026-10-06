import { Fragment } from 'react'
import { TERM_PATTERN, findTerm } from '../content/glossary'
import { useActiveCourse } from '../store/course'

/**
 * Text with glossary abbreviations marked up as <abbr>. The expansion shows as
 * a tooltip on desktop; a long press opens the glossary card (see useGlossaryPress).
 */
export function GlossaryText({ text }: { text: string }) {
  const course = useActiveCourse()
  const parts: (string | { word: string; term: string })[] = []
  let last = 0
  for (const m of text.matchAll(TERM_PATTERN)) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push({ word: m[0], term: m[1] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))

  // One wrapping span keeps the text a single flex item inside flex buttons and
  // lets a long word break instead of pushing past a narrow card.
  return (
    <span className="wrap-anywhere">
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <Fragment key={i}>{p}</Fragment>
        ) : (
          <abbr
            key={i}
            data-term={p.term}
            title={findTerm(p.term, course)?.expansion}
            className="cursor-help decoration-tinta-lembut decoration-dotted underline-offset-4 [text-decoration-line:underline] [-webkit-touch-callout:none]"
          >
            {p.word}
          </abbr>
        ),
      )}
    </span>
  )
}
