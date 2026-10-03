import type { Exercise, Fact, LessonItem, Unit } from '../lib/types'

// Material coverage (LANGIT_AZ900_PERBAIKAN_MATERI.md section 4): every fact an
// exercise requires must be taught by a learn card that comes first, counted in
// course order (unit, lesson, then item). The validator turns the gaps found
// here into errors, and `npm run content:coverage` prints them per unit.

/**
 * optional-only: the exercise is in a required lesson, but the fact is only taught
 * in an optional branch, which the player may skip (LANGIT_CCNA_PLAN.md section 4.2).
 */
export type CoverageGap = { exercise: string; fact: string; kind: 'unknown' | 'taught-later' | 'never-taught' | 'optional-only' }

export type UnitCoverage = {
  unitId: string
  title: string
  /** The unit has a facts list, so it went through the material rework. */
  reworked: boolean
  facts: number
  learnCards: number
  introCards: number
  /** Active exercises (retired ones are listed separately). */
  exercises: number
  retired: { id: string; reason?: string }[]
  withoutRequires: string[]
  gaps: CoverageGap[]
  untaughtFacts: string[]
  verifyFacts: Fact[]
  /** Facts that are not marked verify and have no official source. */
  badSources: string[]
}

export function isMicrosoftLearnUrl(url: string | undefined): boolean {
  return !!url && /^https:\/\/learn\.microsoft\.com\/\S+$/.test(url)
}

/**
 * Official sources for CCNA facts (LANGIT_CCNA_PLAN.md section 5): Cisco, the
 * IETF and RFC Editor, IANA (port numbers), IEEE, Ansible's documentation and
 * official repositories, and, for client operating systems (exam topic 1.6), the
 * vendor's own command reference: Microsoft's Windows commands, Apple's Mac User
 * Guide, and the Linux man-pages project.
 */
const CCNA_SOURCE = /^https:\/\/(([a-z0-9-]+\.)*cisco\.com|www\.netacad\.com|(www\.)?rfc-editor\.org|datatracker\.ietf\.org|(www\.)?iana\.org|([a-z0-9-]+\.)*ieee\.org|docs\.ansible\.com|github\.com\/ansible-collections|learn\.microsoft\.com\/en-us\/windows-server\/administration\/windows-commands|support\.apple\.com\/guide\/mac-help|(www\.)?man7\.org\/linux\/man-pages)\/\S*$/

export function isCiscoCourseSource(url: string | undefined): boolean {
  return !!url && CCNA_SOURCE.test(url)
}

/** Whether a fact's source is official for its course, which its id prefix tells. */
export function isOfficialSource(factId: string, url: string | undefined): boolean {
  return factId.startsWith('ccna-') ? isCiscoCourseSource(url) : isMicrosoftLearnUrl(url)
}

const isExerciseItem = (item: LessonItem): item is Exercise => item.type !== 'learn' && item.type !== 'intro'

export function courseCoverage(units: Unit[]): UnitCoverage[] {
  const allFacts = new Map<string, Fact>()
  for (const unit of units) for (const fact of unit.facts ?? []) allFacts.set(fact.id, fact)

  const taughtAnywhere = new Set<string>()
  for (const unit of units)
    for (const lesson of unit.lessons)
      for (const item of lesson.items) if (item.type === 'learn') for (const fact of item.teaches ?? []) taughtAnywhere.add(fact)

  const taught = new Set<string>() // grows in course order
  const taughtRequired = new Set<string>() // the same, counting required lessons only
  const required = (l: { branch?: { kind: string } }) => !l.branch || l.branch.kind === 'prereq'
  return units.map((unit) => {
    const cov: UnitCoverage = {
      unitId: unit.id,
      title: unit.title,
      reworked: Array.isArray(unit.facts),
      facts: unit.facts?.length ?? 0,
      learnCards: 0,
      introCards: 0,
      exercises: 0,
      retired: [],
      withoutRequires: [],
      gaps: [],
      untaughtFacts: [],
      verifyFacts: [],
      badSources: [],
    }
    for (const lesson of unit.lessons) {
      for (const item of lesson.items) {
        if (item.type === 'learn') {
          cov.learnCards++
          for (const fact of item.teaches ?? []) {
            taught.add(fact)
            if (required(lesson)) taughtRequired.add(fact)
          }
          continue
        }
        if (item.type === 'intro') {
          cov.introCards++
          continue
        }
        if (!isExerciseItem(item)) continue
        if (item.retired) {
          cov.retired.push({ id: item.id, reason: item.retiredReason })
          continue
        }
        cov.exercises++
        const requires = item.requires ?? []
        if (requires.length === 0) cov.withoutRequires.push(item.id)
        for (const fact of requires) {
          if (!allFacts.has(fact)) cov.gaps.push({ exercise: item.id, fact, kind: 'unknown' })
          else if (!taught.has(fact)) cov.gaps.push({ exercise: item.id, fact, kind: taughtAnywhere.has(fact) ? 'taught-later' : 'never-taught' })
          else if (required(lesson) && !taughtRequired.has(fact)) cov.gaps.push({ exercise: item.id, fact, kind: 'optional-only' })
        }
      }
    }
    for (const fact of unit.facts ?? []) {
      if (!taughtAnywhere.has(fact.id)) cov.untaughtFacts.push(fact.id)
      if (fact.verify) cov.verifyFacts.push(fact)
      else if (!isOfficialSource(fact.id, fact.source)) cov.badSources.push(fact.id)
    }
    return cov
  })
}

/** How guessable the answers are (docs/BUGS_LOG.md): share of "true", "yes", and longest-is-right. */
export function answerBalance(units: Unit[]) {
  const exercises = units.flatMap((u) => u.lessons.flatMap((l) => l.items.filter(isExerciseItem))).filter((e) => !e.retired)
  let truths = 0
  let falses = 0
  let yes = 0
  let no = 0
  let longestRight = 0
  let choices = 0
  for (const e of exercises) {
    if (e.type === 'truefalse') {
      if (e.answer) truths++
      else falses++
    } else if (e.type === 'yesno') {
      for (const st of e.statements) {
        if (st.answer) yes++
        else no++
      }
    } else if (e.type === 'choice' || e.type === 'fix') {
      choices++
      const right = e.options[e.answer]?.length ?? 0
      if (e.options.every((o, i) => i === e.answer || o.length < right)) longestRight++
    }
  }
  return { truths, falses, yes, no, longestRight, choices }
}
