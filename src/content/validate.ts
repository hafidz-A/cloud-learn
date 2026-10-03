import { PORTAL_NAMES, type CaseStudy, type CourseId, type Exercise, type Fact, type IntroCard, type LearnCard, type Lesson, type LessonItem, type Unit } from '../lib/types'
import { courseCoverage } from './coverage'
import { EXAM_TYPES } from './examTypes'
import { isVisualName, VISUAL_NAMES, VISUALS_BY_CONCEPT } from './visuals'

// Checks the content rules from LANGIT_AZ900_PLAN.md section 2 ("Aturan konten"),
// the shape rules from section 3, the lesson order rules from section 11.2, and
// the material rules from LANGIT_AZ900_PERBAIKAN_MATERI.md sections 3 and 4.
// Errors break the app, the answer key, or the "no exercise without material"
// rule; warnings are content-quality notes to fix before a unit is called done.

export type Issue = {
  level: 'error' | 'warn'
  where: string
  message: string
  /** The unit the issue belongs to. */
  unit?: string
  /** A material-coverage rule (section 4). Enforced once the unit has its facts list. */
  coverage?: boolean
}

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
  'rules',
  'config',
  'template',
  'topology',
  'kql',
])

const PLACE_RULES = new Set(['valid', 'one-per-zone', 'spread'])

const COUNT_WORDS = ['', 'one', 'two', 'three', 'four', 'five']

/** Mixed-case abbreviations the all-caps pattern would miss. */
const MIXED_CASE_ABBREVIATIONS = ['IaaS', 'PaaS', 'SaaS', 'CapEx', 'OpEx', 'VNet', 'vCPU', 'IaC', 'DDoS']

/**
 * Tokens that look like abbreviations but are names or labels: exam and plan
 * names (AZ, P1, E3, the App Service Free plan F1), region names (East US), HTTP
 * methods (DELETE, POST), and the DNS record type AAAA.
 */
const NOT_ABBREVIATIONS = new Set(['AZ', 'P1', 'P2', 'E3', 'F1', 'SAP', 'HANA', 'US', 'GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'AAAA'])

// Hyphenated abbreviations such as RA-GRS count as one token.
const ABBREVIATION = new RegExp(`\\b(${MIXED_CASE_ABBREVIATIONS.join('|')}|[A-Z][A-Z0-9]+(?:-[A-Z][A-Z0-9]+)*)s?\\b`, 'g')

/** Learn card body limit (section 3): about 100 words. */
const LEARN_MAX_WORDS = 100
/** More exercises in a row than this, with no learn card between them, gets a warning (section 4). */
const MAX_EXERCISE_RUN = 4

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

export function questionTexts(e: Exercise): string[] {
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
    // Tables, portal fields, code, diagrams, and query tokens are screen data (like a portal page), not prose.
    case 'rules':
    case 'template':
    case 'topology':
      return [e.prompt, ...e.options]
    case 'config':
    case 'kql':
      return [e.prompt]
  }
}

/** The texts a learn card shows (the title may stay a bare abbreviation, like "IaaS"). */
export function learnTexts(card: LearnCard): string[] {
  return [card.body, ...(card.keyPoints ?? []), card.example ?? '', card.trap ?? ''].filter(Boolean)
}

/** Everything a lesson item shows on screen, for the glossary check. */
function itemTexts(item: LessonItem): string[] {
  if (item.type === 'learn') return [item.title, ...learnTexts(item)]
  if (item.type === 'intro') return [item.body]
  return [...questionTexts(item), item.explanation]
}

function checkOptions(options: unknown, answer: unknown, push: (m: string, level?: Issue['level']) => void) {
  if (!Array.isArray(options) || options.length < 2) return push('options needs at least 2 entries')
  if (options.length !== 4) push(`choice-style exercises should have 4 options, found ${options.length}`, 'warn')
  if (new Set(options).size !== options.length) push('options contain duplicates')
  if (!Number.isInteger(answer) || (answer as number) < 0 || (answer as number) >= options.length) {
    push(`answer ${String(answer)} is not a valid option index`)
  }
}

function checkExercise(e: Exercise, push: (message: string, level?: Issue['level']) => void) {
  if (!KNOWN_TYPES.has(e.type)) return push(`unknown type "${String(e.type)}"`)
  if (!KEBAB.test(e.concept ?? '')) push('concept must be a kebab-case tag')
  if (!e.prompt?.trim()) push('prompt is empty')
  if (!e.explanation?.trim()) push('explanation is empty')
  if (e.requires !== undefined && !Array.isArray(e.requires)) push('requires must be a list of fact ids')
  if (e.retired && !e.retiredReason?.trim()) push('a retired exercise should say why in retiredReason', 'warn')

  switch (e.type) {
    case 'choice':
    case 'fix':
      checkOptions(e.options, e.answer, push)
      if (e.type === 'fix' && !['portal', 'error'].includes(e.scene?.kind)) push('scene.kind must be "portal" or "error"')
      if (e.type === 'fix') checkPortal(e.scene?.portal, push)
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
    case 'rules':
      checkOptions(e.options, e.answer, push)
      if (!Array.isArray(e.tables) || e.tables.length === 0) push('rules needs at least one table')
      for (const t of e.tables ?? []) {
        if (!t.title?.trim()) push('every table needs a title')
        if (!Array.isArray(t.columns) || t.columns.length < 2) push(`table "${t.title}" needs at least 2 columns`)
        if (!Array.isArray(t.rows) || t.rows.length === 0) push(`table "${t.title}" has no rows`)
        else if (t.rows.some((row) => row.length !== t.columns.length)) push(`table "${t.title}" has a row with the wrong number of cells`)
      }
      break
    case 'template':
      checkOptions(e.options, e.answer, push)
      if (e.language !== 'json' && e.language !== 'bicep') push('language must be "json" or "bicep"')
      if (e.fileName !== undefined && !e.fileName.trim()) push('template fileName is empty')
      if (!e.code?.trim()) push('template code is empty')
      else if (e.language === 'json') {
        try {
          // The default header says "ARM template", which would mislead for other JSON such as a lifecycle policy.
          const parsed: unknown = JSON.parse(e.code)
          const isArm = typeof parsed === 'object' && parsed !== null && 'resources' in parsed
          if (!isArm && !e.fileName) push('JSON that is not an ARM template needs a fileName for its header')
        } catch {
          push('template code is not valid JSON')
        }
      }
      break
    case 'topology': {
      checkOptions(e.options, e.answer, push)
      const ids = (e.nodes ?? []).map((n) => n.id)
      if (ids.length < 2) push('topology needs at least 2 nodes')
      if (new Set(ids).size !== ids.length) push('topology node ids must be unique')
      if (ids.length > 6) push('topology should have at most 6 nodes to stay readable on a phone', 'warn')
      for (const l of e.links ?? []) {
        if (!ids.includes(l.from) || !ids.includes(l.to)) push(`link ${l.from} -> ${l.to} points to a node that does not exist`)
        if (!['peering', 'vpn', 'route'].includes(l.kind)) push(`unknown link kind "${String(l.kind)}"`)
      }
      break
    }
    case 'config': {
      checkPortal(e.portal, push)
      const labels = (e.fields ?? []).map((f) => f.label)
      if (labels.length < 2) push('config needs at least 2 fields')
      if (new Set(labels).size !== labels.length) push('config field labels must be unique')
      const graded = Object.entries(e.answer ?? {})
      if (graded.length === 0) push('config needs at least one graded field in answer')
      for (const [label, expected] of graded) {
        const f = e.fields.find((x) => x.label === label)
        if (!f) push(`answer field "${label}" does not exist`)
        else if (f.readOnly) push(`answer field "${label}" is read-only`)
        else if (f.kind === 'select' && !f.choices.includes(String(expected))) push(`answer "${String(expected)}" is not a choice of "${label}"`)
        else if (f.kind === 'toggle' && typeof expected !== 'boolean') push(`answer for toggle "${label}" must be true or false`)
        else if (f.kind === 'number' && typeof expected !== 'number') push(`answer for number "${label}" must be a number`)
      }
      for (const f of e.fields ?? []) {
        if (f.kind === 'select' && (!Array.isArray(f.choices) || f.choices.length < 2)) push(`select "${f.label}" needs at least 2 choices`)
        if (f.kind === 'select' && f.value !== undefined && !f.choices.includes(f.value)) push(`preset value of "${f.label}" is not one of its choices`)
        if (f.readOnly && f.value === undefined) push(`read-only field "${f.label}" needs a value`)
      }
      break
    }
    case 'kql': {
      const pool = [...e.tokens]
      for (const t of e.answer) {
        const i = pool.indexOf(t)
        if (i < 0) push(`answer token "${t}" is not available in tokens`)
        else pool.splice(i, 1)
      }
      if (e.answer.length === 0) push('kql answer is empty')
      if (!Array.isArray(e.sampleResult) || e.sampleResult.length < 2) push('sampleResult needs a header row and at least one data row')
      else if (e.sampleResult.some((row) => row.length !== e.sampleResult[0].length)) push('sampleResult rows must have the same number of cells')
      break
    }
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

function checkPortal(portal: string | undefined, push: (m: string) => void) {
  if (portal !== undefined && !(PORTAL_NAMES as readonly string[]).includes(portal)) push(`unknown portal "${portal}", known: ${PORTAL_NAMES.join(', ')}`)
}

function checkEntraName(texts: string[], push: (m: string) => void) {
  // Mentioning the old name as history ("dulu Azure AD", "formerly Azure AD") is fine.
  if (/(?<!(dulu|formerly|sebelumnya) )Azure (AD|Active Directory)/.test(texts.join(' '))) {
    push('use "Microsoft Entra ID", not Azure AD / Azure Active Directory')
  }
}

function checkVisual(visual: string | undefined, push: (m: string) => void) {
  if (visual !== undefined && !isVisualName(visual)) push(`unknown visual "${visual}", known: ${VISUAL_NAMES.join(', ')}`)
}

function checkIntro(card: IntroCard, push: (message: string, level?: Issue['level']) => void) {
  if (!KEBAB.test(card.concept ?? '')) push('concept must be a kebab-case tag')
  if (!card.title?.trim()) push('title is empty')
  if (!card.body?.trim()) return push('body is empty')
  const sentences = card.body.split(/[.!?](?:\s|$)/).filter((t) => t.trim()).length
  if (sentences > 2) push(`intro body should be at most 2 sentences, found ${sentences}`, 'warn')
  const words = card.body.split(/\s+/).length
  if (words > 40) push(`intro body should be about 35 words, found ${words}`, 'warn')
  checkVisual(card.visual, push)
  // The title may be the bare abbreviation ("IaaS"); the body must expand it.
  const missing = unexpandedAbbreviations([card.body])
  if (missing.length) push(`expand on first use in the intro: ${missing.join(', ')}`, 'warn')
  checkEntraName([card.title, card.body], push)
}

function checkLearn(card: LearnCard, facts: Set<string>, push: (message: string, level?: Issue['level']) => void) {
  if (!Array.isArray(card.concepts) || card.concepts.length === 0) push('a learn card needs at least one concept tag')
  else if (card.concepts.some((c) => !KEBAB.test(c))) push('concepts must be kebab-case tags')
  if (!card.title?.trim()) push('title is empty')
  if (!card.body?.trim()) return push('body is empty')
  const words = card.body.split(/\s+/).filter(Boolean).length
  if (words > LEARN_MAX_WORDS) push(`learn body should be at most about ${LEARN_MAX_WORDS} words, found ${words}`, 'warn')
  const sentences = card.body.split(/[.!?](?:\s|$)/).filter((t) => t.trim()).length
  if (sentences < 2 || sentences > 6) push(`learn body should have 3-6 short sentences, found ${sentences}`, 'warn')
  if (!Array.isArray(card.keyPoints) || card.keyPoints.length < 2 || card.keyPoints.length > 4) {
    push(`learn cards should have 2-4 key points, found ${card.keyPoints?.length ?? 0}`, 'warn')
  }
  if (!Array.isArray(card.teaches) || card.teaches.length === 0) push('a learn card should teach at least one fact', 'warn')
  for (const fact of card.teaches ?? []) if (!facts.has(fact)) push(`teaches unknown fact "${fact}"`)
  checkVisual(card.visual, push)
  const needsVisual = (card.concepts ?? []).filter((c) => VISUALS_BY_CONCEPT.has(c))
  if (needsVisual.length && !card.visual) {
    push(`"${needsVisual[0]}" needs a visual (${VISUALS_BY_CONCEPT.get(needsVisual[0])!.join(' or ')})`)
  }
  if (card.link !== undefined && !/^https:\/\/learn\.microsoft\.com\//.test(card.link)) push('link should point to Microsoft Learn', 'warn')
  const missing = unexpandedAbbreviations(learnTexts(card))
  if (missing.length) push(`expand on first use in the learn card: ${missing.join(', ')}`, 'warn')
  checkEntraName([card.title, ...learnTexts(card)], push)
}

function checkFact(fact: Fact, push: (message: string, level?: Issue['level']) => void) {
  if (!/^(az104-)?f-[a-z0-9]+(-[a-z0-9]+)+$/.test(fact.id ?? '')) push(`fact id "${fact.id}" should look like "f-u07-zrs" (AZ-104: "az104-f-u04-reserved-ips")`)
  if (!fact.statement?.trim()) push(`fact "${fact.id}" has no statement`)
  checkEntraName([fact.statement ?? ''], push)
}

/** Stage 5 types (plan section 11.2) that ask the player to recall without choices. */
const RECALL_TYPES = new Set(['fill', 'order', 'shell'])

/** Every abbreviation used in the texts, for the glossary coverage check. */
export function abbreviationsIn(texts: string[]): Set<string> {
  const found = new Set<string>()
  for (const text of texts) {
    for (const m of text.matchAll(ABBREVIATION)) {
      const start = m.index
      if (NOT_ABBREVIATIONS.has(m[1])) continue
      if (m[1] === 'ID' && /Entra\s$/.test(text.slice(0, start))) continue
      found.add(m[1])
    }
  }
  return found
}

/** Warns about abbreviations the glossary does not explain yet (they can't be long-pressed). */
export function glossaryGaps(units: Unit[], glossaryTerms: Set<string>): Issue[] {
  const used = new Map<string, string>()
  for (const unit of units)
    for (const lesson of unit.lessons)
      for (const item of lesson.items) for (const a of abbreviationsIn(itemTexts(item))) if (!used.has(a)) used.set(a, item.id)
  return [...used]
    .filter(([a]) => !glossaryTerms.has(a))
    .map(([a, where]) => ({ level: 'warn' as const, where, message: `"${a}" is not in the glossary` }))
}

/** Section 4: more than 4 exercises in a row without a learn card, in a lesson that teaches new facts. */
function longRuns(lesson: Lesson): number {
  if (!lesson.items.some((i) => i.type === 'learn' && (i.teaches ?? []).length > 0)) return 0
  let run = 0
  let longest = 0
  for (const item of lesson.items) {
    if (item.type === 'learn') run = 0
    else if (item.type !== 'intro' && !item.retired) longest = Math.max(longest, ++run)
  }
  return longest > MAX_EXERCISE_RUN ? longest : 0
}

/** Per-course shape rules: AZ-104 (LANGIT_AZ104_PLAN.md sections 3-5) has 5 paths, 4-6 lessons, and 3-5 learn cards per lesson. */
const COURSE_RULES: Record<CourseId, { prefix: string; paths: number; lessons: [number, number]; learnCards: [number, number] }> = {
  az900: { prefix: '', paths: 3, lessons: [3, 5], learnCards: [2, 4] },
  az104: { prefix: 'az104-', paths: 5, lessons: [4, 6], learnCards: [3, 5] },
  ccna: { prefix: 'ccna-', paths: 5, lessons: [3, 9], learnCards: [1, 4] },
}

export function validateUnits(units: Unit[], course: CourseId = 'az900'): Issue[] {
  const rules = COURSE_RULES[course]
  const issues: Issue[] = []
  const ids = new Set<string>()
  const introduced = new Set<string>() // concepts that already had a card, in course order
  const factIds = new Set(units.flatMap((u) => (u.facts ?? []).map((f) => f.id)))

  for (const unit of units) {
    const uw = unit.id
    const reworked = Array.isArray(unit.facts)
    const pusher = (where: string) => (message: string, level: Issue['level'] = 'error') =>
      issues.push({ level, where, message, unit: unit.id })
    const claim = (id: string, where: string) => {
      if (ids.has(id)) pusher(where)(`duplicate id "${id}"`)
      ids.add(id)
      // Plan section 3: without the prefix, AZ-104 progress would mix with AZ-900 progress in sync.
      if (rules.prefix && !id?.startsWith(rules.prefix)) pusher(where)(`AZ-104 id "${id}" must start with "${rules.prefix}"`)
      if (!rules.prefix && id?.startsWith('az104-')) pusher(where)(`AZ-900 id "${id}" must not start with "az104-"`)
    }

    claim(unit.id, uw)
    if (!new RegExp(`^${rules.prefix}u\\d{2}-[a-z0-9-]+$`).test(unit.id)) pusher(uw)(`unit id must look like "${rules.prefix}u04-core-architecture"`)
    if (!Number.isInteger(unit.path) || unit.path < 1 || unit.path > rules.paths) pusher(uw)(`path must be 1 to ${rules.paths}`)
    const [minLessons, maxLessons] = rules.lessons
    if (unit.lessons.length < minLessons || unit.lessons.length > maxLessons) pusher(uw)(`units should have ${minLessons}-${maxLessons} lessons, found ${unit.lessons.length}`, 'warn')
    if (unit.facts !== undefined && !Array.isArray(unit.facts)) pusher(uw)('facts must be a list')
    for (const fact of unit.facts ?? []) {
      claim(fact.id, `${uw} > ${fact.id}`)
      checkFact(fact, pusher(`${uw} > ${fact.id}`))
    }

    unit.lessons.forEach((lesson, li) => {
      const lw = `${uw} > ${lesson.id}`
      const warn = (message: string) => pusher(lw)(message, 'warn')
      claim(lesson.id, lw)
      const expectedLessonId = `${/^(az104-)?u\d{2}/.exec(unit.id)?.[0]}-l${li + 1}`
      if (lesson.id !== expectedLessonId) pusher(lw)(`lesson id should be "${expectedLessonId}"`)
      if (!Array.isArray(lesson.items)) {
        pusher(lw)('lesson needs an "items" array (plan section 11)')
        return
      }
      if (lesson.items.length === 0) return // skeleton lesson, content comes later

      const exercises = lesson.items.filter((i): i is Exercise => i.type !== 'intro' && i.type !== 'learn' && !i.retired)
      const learnCards = lesson.items.filter((i) => i.type === 'learn').length
      const intros = lesson.items.filter((i) => i.type === 'intro').length
      if (exercises.length < 8 || exercises.length > 12) warn(`lessons should have 8-12 exercises, found ${exercises.length}`)
      const [minCards, maxCards] = rules.learnCards
      if (reworked && (learnCards < minCards || learnCards > maxCards)) warn(`lessons should have ${minCards}-${maxCards} learn cards, found ${learnCards}`)
      if (!reworked && intros > 3) warn(`a lesson introduces at most 3 new concepts, found ${intros} intro cards`)
      const types = new Set(exercises.map((e) => e.type))
      if (types.size < 4) warn(`lessons should use at least 4 exercise types, found ${types.size}`)
      const run = longRuns(lesson)
      if (run) warn(`${run} exercises in a row without a learn card between them`)

      const easierByConcept = new Map<string, number>()
      for (const item of lesson.items) {
        const iw = `${lw} > ${item.id}`
        const push = pusher(iw)
        claim(item.id, iw)
        if (item.type === 'intro' || item.type === 'learn') {
          if (!new RegExp(`^${lesson.id}-[im]\\d+$`).test(item.id)) push(`card id should look like "${lesson.id}-m1"`)
          if (item.type === 'intro') {
            checkIntro(item, push)
            introduced.add(item.concept)
          } else {
            checkLearn(item, factIds, push)
            for (const c of item.concepts ?? []) introduced.add(c)
          }
          continue
        }
        if (!new RegExp(`^${lesson.id}-e\\d+$`).test(item.id)) push(`exercise id should look like "${lesson.id}-e1"`)
        checkExercise(item, push)
        if (item.retired) continue
        if (!reworked && !introduced.has(item.concept)) {
          push(`concept "${item.concept}" is tested before any intro card introduces it`, 'warn')
          introduced.add(item.concept) // report each concept once
        }
        const easier = easierByConcept.get(item.concept) ?? 0
        if (RECALL_TYPES.has(item.type) && easier < 2) {
          push(`${item.type} should only test a concept already seen in 2 easier exercises, found ${easier}`, 'warn')
        }
        easierByConcept.set(item.concept, easier + 1)
      }
    })
  }

  return [...issues, ...coverageIssues(units)]
}

/** Section 4 as issues. Every one is an error; the tests enforce them per reworked unit. */
export function coverageIssues(units: Unit[]): Issue[] {
  const issues: Issue[] = []
  const unitOf = new Map(units.flatMap((u) => u.lessons.flatMap((l) => l.items.map((i) => [i.id, u.id] as const))))
  for (const cov of courseCoverage(units)) {
    const push = (where: string, message: string) => issues.push({ level: 'error', where, message, unit: cov.unitId, coverage: true })
    for (const id of cov.withoutRequires) push(`${cov.unitId} > ${id}`, 'requires is empty: list the facts needed to answer and to rule out every wrong option')
    for (const gap of cov.gaps) {
      const where = `${unitOf.get(gap.exercise) ?? cov.unitId} > ${gap.exercise}`
      if (gap.kind === 'unknown') push(where, `requires unknown fact "${gap.fact}"`)
      else if (gap.kind === 'taught-later') push(where, `fact "${gap.fact}" is only taught after this exercise`)
      else push(where, `fact "${gap.fact}" is not taught by any learn card`)
    }
    for (const fact of cov.untaughtFacts) push(`${cov.unitId} > ${fact}`, `fact "${fact}" is not taught by any learn card`)
    for (const fact of cov.badSources) push(`${cov.unitId} > ${fact}`, `fact "${fact}" needs a Microsoft Learn source, or verify: true`)
  }
  return issues
}

/**
 * Case studies (LANGIT_AZ104_PLAN.md section 9): a scenario in tabs and 4-6
 * exam-ready questions, each counted toward an AZ-104 unit and requiring facts
 * that a learn card teaches, so "Pelajari lagi" always has material.
 */
export function validateCaseStudies(cases: CaseStudy[], units: Unit[]): Issue[] {
  const issues: Issue[] = []
  const ids = new Set<string>()
  const unitIds = new Set(units.map((u) => u.id))
  const facts = new Set(units.flatMap((u) => (u.facts ?? []).map((f) => f.id)))
  const taught = new Set(units.flatMap((u) => u.lessons.flatMap((l) => l.items.flatMap((i) => (i.type === 'learn' ? (i.teaches ?? []) : [])))))
  for (const cs of cases) {
    const pusher = (where: string) => (message: string, level: Issue['level'] = 'error') => issues.push({ level, where, message })
    const push = pusher(cs.id)
    const claim = (id: string, where: string) => {
      if (ids.has(id)) pusher(where)(`duplicate id "${id}"`)
      ids.add(id)
    }
    claim(cs.id, cs.id)
    if (!/^az104-cs\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/.test(cs.id)) push('case study id must look like "az104-cs01-contoso"')
    if (!cs.title?.trim()) push('title is empty')
    if (!Array.isArray(cs.tabs) || cs.tabs.length < 2) push('a case study needs at least 2 scenario tabs')
    for (const tab of cs.tabs ?? []) {
      if (!tab.title?.trim()) push('a scenario tab has no title')
      if (!Array.isArray(tab.paragraphs) || tab.paragraphs.length === 0 || tab.paragraphs.some((p) => !p.trim())) push(`tab "${tab.title}" needs non-empty paragraphs`)
    }
    const scenario = (cs.tabs ?? []).flatMap((t) => t.paragraphs ?? [])
    const missing = unexpandedAbbreviations(scenario)
    if (missing.length) push(`expand on first use in the scenario: ${missing.join(', ')}`, 'warn')
    checkEntraName(scenario, push)
    if (!Array.isArray(cs.questions) || cs.questions.length < 4 || cs.questions.length > 6) push(`a case study should have 4-6 questions, found ${cs.questions?.length ?? 0}`, 'warn')
    const prefix = cs.id.split('-').slice(0, 2).join('-')
    for (const q of cs.questions ?? []) {
      const qw = `${cs.id} > ${q.id}`
      const qpush = pusher(qw)
      claim(q.id, qw)
      if (!new RegExp(`^${prefix}-e\\d+$`).test(q.id)) qpush(`question id should look like "${prefix}-e1"`)
      checkExercise(q, qpush)
      if (!q.examReady || !EXAM_TYPES.has(q.type)) qpush('case study questions must be examReady exam types')
      if (!unitIds.has(q.unit)) qpush(`unknown unit "${q.unit}"`)
      if (!q.requires?.length) qpush('requires is empty: list the facts needed to answer and to rule out every wrong option')
      for (const f of q.requires ?? []) {
        if (!facts.has(f)) qpush(`requires unknown fact "${f}"`)
        else if (!taught.has(f)) qpush(`fact "${f}" is not taught by any learn card`)
      }
    }
  }
  return issues
}

/** Everything a case study shows, for the glossary check. */
export function caseStudyTexts(cs: CaseStudy): string[] {
  return [...cs.tabs.flatMap((t) => [t.title, ...t.paragraphs]), ...cs.questions.flatMap((q) => [...questionTexts(q), q.explanation])]
}
