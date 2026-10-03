import type { CourseId } from '../lib/types'
import raw from './glossary.json'

// Every abbreviation used in the courses with its expansion (plan sections 4 and 5).
// An entry with a `course` is that course's own meaning of the term (ACL means
// something else in Azure Files than on a router); entries without one are shared.

export type GlossaryEntry = { term: string; expansion: string; description: string; course?: CourseId }

export const GLOSSARY: GlossaryEntry[] = [...(raw as GlossaryEntry[])].sort(
  (a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }) || (a.course ?? '').localeCompare(b.course ?? ''),
)

const BY_TERM = new Map<string, GlossaryEntry[]>()
for (const e of GLOSSARY) BY_TERM.set(e.term, [...(BY_TERM.get(e.term) ?? []), e])

/** The entry for a term: the course's own entry first, then the shared one. */
export function findTerm(term: string, course?: CourseId): GlossaryEntry | undefined {
  const entries = BY_TERM.get(term) ?? (term.endsWith('s') ? BY_TERM.get(term.slice(0, -1)) : undefined)
  if (!entries) return undefined
  return entries.find((e) => course && e.course === course) ?? entries.find((e) => !e.course) ?? entries[0]
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Matches any glossary term as a whole word, with an optional plural "s". Longest terms first. */
export const TERM_PATTERN = new RegExp(
  `(?<![\\w-])(${[...BY_TERM.keys()].sort((a, b) => b.length - a.length).map(escape).join('|')})s?(?![\\w-])`,
  'g',
)
