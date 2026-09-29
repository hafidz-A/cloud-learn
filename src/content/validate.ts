import type { Exercise, IntroCard, Unit } from '../lib/types'
import { EXAM_TYPES } from './examTypes'
import { VISUAL_NAMES } from './visuals'

// Checks the content rules from LANGIT_AZ900_PLAN.md section 2 ("Aturan konten"),
// the shape rules from section 3, and the lesson order rules from section 11.2.
// Errors break the app or the answer key; warnings are content-quality notes to
// fix before a unit is called done.

export type Issue = { level: 'error' | 'warn'; where: string; message: string }

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/

const KNOWN_TYPES = new Set([
  'choice',
  'truefalse',
  'match',
  'sort',
  'order',
  'fill',
  'place',
  'fix',
  'shell',
  'multi',
  'yesno',
])

const PLACE_RULES = new Set(['valid', 'one-per-zone', 'spread'])

const COUNT_WORDS = ['', 'one', 'two', 'three', 'four', 'five']

/** Mixed-case abbreviations the all-caps pattern would miss. */
const MIXED_CASE_ABBREVIATIONS = ['IaaS', 'PaaS', 'SaaS', 'CapEx', 'OpEx', 'VNet', 'vCPU']

/** Tokens that look like abbreviations but are names or labels. */
const NOT_ABBREVIATIONS = new Set(['AZ', 'P1', 'P2'])

const ABBREVIATION = new RegExp(`\\b(${MIXED_CASE_ABBREVIATIONS.join('|')}|[A-Z][A-Z0-9]+)s?\\b`, 'g')

function initials(text: string): string {
  return text
    .split(/[\s-]+/)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

/**
 * Returns abbreviations whose first appearance in `texts` is not expanded.
 * Accepted forms: "NSG (Network Security Group)" or "Network Security Group (NSG)".
 * `expandedBy` lets a match pair like ["NSG", "Network Security Group"] count as expanded.
 */
export function unexpandedAbbreviations(texts: string[], expandedBy: Set<string> = new Set()): string[] {
  const seen = new Set<string>()
  const missing: string[] = []
  for (const text of texts) {
    for (const m of text.matchAll(ABBREVIATION)) {
      const abbr = m[1]
      const start = m.index
      const end = start + m[0].length
      if (seen.has(abbr) || NOT_ABBREVIATIONS.has(abbr) || expandedBy.has(abbr)) continue
      // "Entra ID" is the product name, not an abbreviation to expand.
      if (abbr === 'ID' && /Entra\s$/.test(text.slice(0, start))) continue
      seen.add(abbr)
      const after = /^\s*\(/.test(text.slice(end))
      const inside = text[start - 1] === '(' && text[end] === ')'
      if (!after && !inside) missing.push(abbr)
    }
  }
  return missing
}

function questionTexts(e: Exercise): string[] {
  switch (e.type) {
    case 'choice':
      return [e.prompt, ...e.options]
    case 'truefalse':
      return [e.prompt]
    case 'match':
      return [e.prompt, ...e.pairs.flat()]
    case 'sort':
      return [e.prompt, ...e.buckets, ...e.items.map((i) => i.text)]
    case 'order':
      return [e.prompt, ...e.items]
    case 'fill':
      return [e.prompt, e.sentence, ...e.bank]
    case 'place':
      return [e.prompt, ...e.zones, ...e.pieces.map((p) => p.text)]
    case 'fix':
      return [e.prompt, e.scene.title, e.scene.message, ...e.options]
    case 'shell':
      return [e.prompt]
    case 'multi':
      return [e.prompt, ...e.options]
    case 'yesno':
      return [e.prompt, e.scenario, ...e.statements.map((st) => st.text)]
  }
}

function checkOptions(options: unknown, answer: unknown, push: (m: string, level?: Issue['level']) => void) {
  if (!Array.isArray(options) || options.length < 2) return push('options needs at least 2 entries')
  if (options.length !== 4) push(`choice-style exercises should have 4 options, found ${options.length}`, 'warn')
  if (new Set(options).size !== options.length) push('options contain duplicates')
  if (!Number.isInteger(answer) || (answer as number) < 0 || (answer as number) >= options.length) {
    push(`answer ${String(answer)} is not a valid option index`)
  }
}

function checkExercise(e: Exercise, where: string, issues: Issue[]) {
  const push = (message: string, level: Issue['level'] = 'error') => issues.push({ level, where, message })

  if (!KNOWN_TYPES.has(e.type)) return push(`unknown type "${String(e.type)}"`)
  if (!KEBAB.test(e.concept ?? '')) push('concept must be a kebab-case tag')
  if (!e.prompt?.trim()) push('prompt is empty')
  if (!e.explanation?.trim()) push('explanation is empty')

  switch (e.type) {
    case 'choice':
    case 'fix':
      checkOptions(e.options, e.answer, push)
      if (e.type === 'fix' && !['portal', 'error'].includes(e.scene?.kind)) push('scene.kind must be "portal" or "error"')
      break
    case 'truefalse':
      if (typeof e.answer !== 'boolean') push('answer must be true or false')
      break
    case 'match': {
      if (!Array.isArray(e.pairs) || e.pairs.some((p) => p.length !== 2 || !p[0] || !p[1])) {
        push('every pair needs two non-empty strings')
        break
      }
      if (e.pairs.length < 4 || e.pairs.length > 5) push(`match should have 4-5 pairs, found ${e.pairs.length}`, 'warn')
      const left = e.pairs.map((p) => p[0])
      const right = e.pairs.map((p) => p[1])
      if (new Set(left).size !== left.length || new Set(right).size !== right.length) push('pairs contain duplicate cards')
      break
    }
    case 'sort':
      if (e.buckets.length < 2 || e.buckets.length > 3) push(`sort should have 2-3 buckets, found ${e.buckets.length}`, 'warn')
      if (e.items.some((i) => !Number.isInteger(i.bucket) || i.bucket < 0 || i.bucket >= e.buckets.length)) {
        push('an item points to a bucket that does not exist')
      }
      if (e.buckets.some((_, b) => !e.items.some((i) => i.bucket === b))) push('a bucket has no items', 'warn')
      break
    case 'order':
      if (e.items.length < 3) push('order needs at least 3 items')
      if (new Set(e.items).size !== e.items.length) push('order items contain duplicates')
      break
    case 'fill': {
      const blanks = e.sentence.split('___').length - 1
      if (blanks !== e.answers.length) push(`sentence has ${blanks} blanks but ${e.answers.length} answers`)
      for (const a of e.answers) if (!e.bank.includes(a)) push(`answer "${a}" is missing from the word bank`)
      break
    }
    case 'place':
      if (e.zones.length < 2) push('place needs at least 2 zones')
      if (!PLACE_RULES.has(e.rule)) push(`unknown place rule "${String(e.rule)}"`)
      if (e.pieces.some((p) => p.validZones.length === 0 || p.validZones.some((z) => z < 0 || z >= e.zones.length))) {
        push('a piece has invalid validZones')
      }
      break
    case 'shell': {
      const pool = [...e.tokens]
      for (const t of e.answer) {
        const i = pool.indexOf(t)
        if (i < 0) push(`answer token "${t}" is not available in tokens`)
        else pool.splice(i, 1)
      }
      if (e.answer.length === 0) push('shell answer is empty')
      break
    }
    case 'multi': {
      if (!Array.isArray(e.options) || e.options.length < 3) push('multi needs at least 3 options')
      if (new Set(e.options).size !== e.options.length) push('options contain duplicates')
      const picks = new Set(e.answers)
      if (e.answers.length < 2 || picks.size !== e.answers.length) push('multi needs 2 or more different answers')
      if (e.answers.some((a) => !Number.isInteger(a) || a < 0 || a >= e.options.length)) push('an answer is not a valid option index')
      const word = COUNT_WORDS[e.answers.length]
      if (word && !new RegExp(`choose ${word}`, 'i').test(e.prompt)) push(`prompt should say "Choose ${word}."`)
      break
    }
    case 'yesno':
      if (!e.scenario?.trim()) push('yesno needs a scenario')
      if (!Array.isArray(e.statements) || e.statements.some((st) => !st.text?.trim() || typeof st.answer !== 'boolean')) {
        push('every statement needs text and a true/false answer')
      } else if (e.statements.length !== 3) push(`yesno should have 3 statements, found ${e.statements.length}`, 'warn')
      break
  }
  if (e.examReady && !EXAM_TYPES.has(e.type)) push(`type "${e.type}" cannot be examReady`)
  if (e.difficulty !== undefined && ![1, 2, 3].includes(e.difficulty)) push('difficulty must be 1, 2, or 3')

  const pairExpansions = new Set<string>()
  if (e.type === 'match') {
    for (const [a, b] of e.pairs) {
      if (initials(b).startsWith(a.replace(/s$/, '').toUpperCase())) pairExpansions.add(a)
      if (initials(a).startsWith(b.replace(/s$/, '').toUpperCase())) pairExpansions.add(b)
    }
  }
  const inQuestion = unexpandedAbbreviations(questionTexts(e), pairExpansions)
  if (inQuestion.length) push(`expand on first use in the question: ${inQuestion.join(', ')}`, 'warn')
  const inExplanation = unexpandedAbbreviations([e.explanation])
  if (inExplanation.length) push(`expand on first use in the explanation: ${inExplanation.join(', ')}`, 'warn')

  checkEntraName([...questionTexts(e), e.explanation], push)
  if (e.verify) push('marked verify: true, double-check this fact', 'warn')
}

function checkEntraName(texts: string[], push: (m: string) => void) {
  if (/Azure (AD|Active Directory)/.test(texts.join(' '))) {
    push('use "Microsoft Entra ID", not Azure AD / Azure Active Directory')
  }
}


function checkIntro(card: IntroCard, where: string, issues: Issue[]) {
  const push = (message: string, level: Issue['level'] = 'error') => issues.push({ level, where, message })
  if (!KEBAB.test(card.concept ?? '')) push('concept must be a kebab-case tag')
  if (!card.title?.trim()) push('title is empty')
  if (!card.body?.trim()) return push('body is empty')
  const sentences = card.body.split(/[.!?](?:\s|$)/).filter((t) => t.trim()).length
  if (sentences > 2) push(`intro body should be at most 2 sentences, found ${sentences}`, 'warn')
  const words = card.body.split(/\s+/).length
  if (words > 40) push(`intro body should be about 35 words, found ${words}`, 'warn')
  if (card.visual !== undefined && !(VISUAL_NAMES as readonly string[]).includes(card.visual)) {
    push(`unknown visual "${card.visual}", known: ${VISUAL_NAMES.join(', ')}`)
  }
  const missing = unexpandedAbbreviations([card.title, card.body])
  if (missing.length) push(`expand on first use in the intro: ${missing.join(', ')}`, 'warn')
  checkEntraName([card.title, card.body], push)
}

/** Stage 5 types (plan section 11.2) that ask the player to recall without choices. */
const RECALL_TYPES = new Set(['fill', 'order', 'shell'])

export function validateUnits(units: Unit[]): Issue[] {
  const issues: Issue[] = []
  const ids = new Set<string>()
  const introduced = new Set<string>() // concepts that already had an intro card, in course order
  const claim = (id: string, where: string) => {
    if (ids.has(id)) issues.push({ level: 'error', where, message: `duplicate id "${id}"` })
    ids.add(id)
  }

  for (const unit of units) {
    const uw = unit.id
    claim(unit.id, uw)
    if (!/^u\d{2}-[a-z0-9-]+$/.test(unit.id)) issues.push({ level: 'error', where: uw, message: 'unit id must look like "u04-core-architecture"' })
    if (![1, 2, 3].includes(unit.path)) issues.push({ level: 'error', where: uw, message: 'path must be 1, 2, or 3' })
    if (unit.lessons.length < 3 || unit.lessons.length > 5) {
      issues.push({ level: 'warn', where: uw, message: `units should have 3-5 lessons, found ${unit.lessons.length}` })
    }

    unit.lessons.forEach((lesson, li) => {
      const lw = `${uw} > ${lesson.id}`
      const warn = (message: string) => issues.push({ level: 'warn', where: lw, message })
      claim(lesson.id, lw)
      const expectedLessonId = `${unit.id.slice(0, 3)}-l${li + 1}`
      if (lesson.id !== expectedLessonId) issues.push({ level: 'error', where: lw, message: `lesson id should be "${expectedLessonId}"` })
      if (!Array.isArray(lesson.items)) {
        issues.push({ level: 'error', where: lw, message: 'lesson needs an "items" array (plan section 11)' })
        return
      }
      if (lesson.items.length === 0) return // skeleton lesson, content comes in stage 5

      const exercises = lesson.items.filter((i): i is Exercise => i.type !== 'intro')
      const intros = lesson.items.length - exercises.length
      if (exercises.length < 8 || exercises.length > 12) warn(`lessons should have 8-12 exercises, found ${exercises.length}`)
      if (intros > 3) warn(`a lesson introduces at most 3 new concepts, found ${intros} intro cards`)
      const types = new Set(exercises.map((e) => e.type))
      if (types.size < 4) warn(`lessons should use at least 4 exercise types, found ${types.size}`)

      let introCount = 0
      let exerciseCount = 0
      const easierByConcept = new Map<string, number>()
      for (const item of lesson.items) {
        if (item.type === 'intro') {
          const expectedId = `${lesson.id}-i${++introCount}`
          const iw = `${lw} > ${item.id}`
          claim(item.id, iw)
          if (item.id !== expectedId) issues.push({ level: 'error', where: iw, message: `intro id should be "${expectedId}"` })
          checkIntro(item, iw, issues)
          introduced.add(item.concept)
          continue
        }
        const expectedId = `${lesson.id}-e${++exerciseCount}`
        const ew = `${lw} > ${item.id}`
        claim(item.id, ew)
        if (item.id !== expectedId) issues.push({ level: 'error', where: ew, message: `exercise id should be "${expectedId}"` })
        checkExercise(item, ew, issues)
        if (!introduced.has(item.concept)) {
          issues.push({ level: 'warn', where: ew, message: `concept "${item.concept}" is tested before any intro card introduces it` })
          introduced.add(item.concept) // report each concept once
        }
        const easier = easierByConcept.get(item.concept) ?? 0
        if (RECALL_TYPES.has(item.type) && easier < 2) {
          issues.push({
            level: 'warn',
            where: ew,
            message: `${item.type} should only test a concept already seen in 2 easier exercises, found ${easier}`,
          })
        }
        easierByConcept.set(item.concept, easier + 1)
      }
    })
  }
  return issues
}
