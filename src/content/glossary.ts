import raw from './glossary.json'

// Every abbreviation used in the course with its expansion (plan sections 4 and 5).

export type GlossaryEntry = { term: string; expansion: string; description: string }

export const GLOSSARY: GlossaryEntry[] = [...(raw as GlossaryEntry[])].sort((a, b) =>
  a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }),
)

const BY_TERM = new Map(GLOSSARY.map((e) => [e.term, e]))

export function findTerm(term: string): GlossaryEntry | undefined {
  return BY_TERM.get(term) ?? (term.endsWith('s') ? BY_TERM.get(term.slice(0, -1)) : undefined)
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Matches any glossary term as a whole word, with an optional plural "s". Longest terms first. */
export const TERM_PATTERN = new RegExp(
  `(?<![\\w-])(${[...BY_TERM.keys()].sort((a, b) => b.length - a.length).map(escape).join('|')})s?(?![\\w-])`,
  'g',
)
