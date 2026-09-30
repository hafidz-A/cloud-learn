// Data model from LANGIT_AZ900_PLAN.md section 8 ("Model data"), with the
// intro cards and lesson items from section 11.

/** The two courses in one app (LANGIT_AZ104_PLAN.md section 3). Every AZ-104 id starts with "az104-". */
export type CourseId = 'az900' | 'az104'

/** A learning path, which is also an exam domain: 1-3 in AZ-900, 1-5 in AZ-104. */
export type PathId = number

export type Unit = {
  id: string // "u04-core-architecture", "az104-u04-virtual-networks"
  path: PathId
  title: string // "Komponen inti"
  lessons: Lesson[]
  /**
   * Every fact the unit teaches (LANGIT_AZ900_PERBAIKAN_MATERI.md section 3).
   * Units written before that rework have none yet.
   */
  facts?: Fact[]
}

export type Lesson = {
  id: string // "u04-l1"
  title: string
  items: LessonItem[] // learn cards and exercises, easiest first (section 11.2)
}

/** One checked fact that an exercise may need. Learn cards teach facts; exercises require them. */
export type Fact = {
  id: string // "f-u07-zrs"
  statement: string // one sentence, Indonesian
  source: string // the Microsoft Learn page the fact comes from
  verify?: boolean // true while the fact is not checked against the source yet
}

/** Teaches facts before any exercise needs them. No answer, no XP, never reviewed. */
export type LearnCard = {
  id: string // "u07-l2-m1" (cards turned from intro cards keep their "-i1" id)
  type: 'learn'
  concepts: string[] // concept tags, the same ones exercises use
  title: string // the concept's name, short
  body: string // 3-6 short sentences, at most about 100 words
  keyPoints: string[] // 2-4 things to remember
  example?: string
  visual?: string // component name from the visual catalog
  trap?: string // what the exam likes to mix up, one sentence
  link?: string // a Microsoft Learn page for further reading
  teaches: string[] // Fact ids
}

/** The older, smaller teaching card (plan section 11.1). Still playable; new material uses learn cards. */
export type IntroCard = {
  id: string // "u04-l1-i1"
  type: 'intro'
  concept: string // same concept tag as the exercises that test it
  title: string // "Availability zone"
  body: string // at most 2 sentences, Indonesian
  visual?: string // diagram component name, e.g. "ZonesInRegion"
}

/** A card that teaches instead of asking. */
export type TeachingCard = LearnCard | IntroCard

export type LessonItem = LearnCard | IntroCard | Exercise

export type ExerciseBase = {
  id: string
  concept: string // "availability-zones"
  prompt: string // English, like the real exam
  explanation: string // Indonesian, shown after answering
  verify?: boolean // true when the fact still needs to be double-checked
  examReady?: boolean // may be used on the exam page (section 12.3)
  difficulty?: 1 | 2 | 3
  /** Facts needed to answer and to rule out every wrong option. Taught by an earlier learn card. */
  requires?: string[]
  /** No longer played anywhere, but kept so saved progress that points at it stays valid. */
  retired?: boolean
  /** Why the exercise was retired. */
  retiredReason?: string
}

export type ChoiceExercise = ExerciseBase & { type: 'choice'; options: string[]; answer: number }
export type TrueFalseExercise = ExerciseBase & { type: 'truefalse'; answer: boolean }
export type MatchExercise = ExerciseBase & { type: 'match'; pairs: [string, string][] }
export type SortExercise = ExerciseBase & {
  type: 'sort'
  buckets: string[]
  items: { text: string; bucket: number }[]
}
export type OrderExercise = ExerciseBase & { type: 'order'; items: string[] } // items in the correct order
export type FillExercise = ExerciseBase & {
  type: 'fill'
  sentence: string // "___" marks each blank
  bank: string[]
  answers: string[]
}
/**
 * valid:        every piece sits in one of its validZones
 * one-per-zone: valid, and no two pieces share a zone
 * spread:       valid, and the pieces use at least 2 different zones
 */
export type PlaceRule = 'valid' | 'one-per-zone' | 'spread'

export type PlaceExercise = ExerciseBase & {
  type: 'place'
  zones: string[]
  pieces: { text: string; validZones: number[] }[]
  rule: PlaceRule
}
export type FixExercise = ExerciseBase & {
  type: 'fix'
  scene: { kind: 'portal' | 'error'; title: string; message: string; portal?: PortalName }
  options: string[]
  answer: number
}
export type ShellExercise = ExerciseBase & { type: 'shell'; tokens: string[]; answer: string[] }
/** Pick more than one. The prompt always says how many ("Choose two."). Right only when all picks are right. */
export type MultiExercise = ExerciseBase & { type: 'multi'; options: string[]; answers: number[] }
/** One scenario, usually three statements, each answered Yes or No and scored on its own. */
export type YesNoExercise = ExerciseBase & {
  type: 'yesno'
  scenario: string
  statements: { text: string; answer: boolean }[]
}

// Admin exercise types from LANGIT_AZ104_PLAN.md section 6. Tables, portal
// forms, template code, and diagrams are data the player reads, like a portal
// screen, so the abbreviation rule only applies to the prompt and options.

/** A table as the portal shows it, for example the inbound rules of one NSG. */
export type RuleTable = {
  title: string // "NSG-Web (subnet Web) · inbound"
  columns: string[] // ["Priority", "Name", "Source", "Port", "Action"]
  rows: string[][]
}

/** Read one or more rule tables (NSG, storage firewall, role assignments), then answer: "hot area" on the exam. */
export type RulesExercise = ExerciseBase & { type: 'rules'; tables: RuleTable[]; options: string[]; answer: number }

export type ConfigField =
  | { label: string; kind: 'select'; choices: string[]; value?: string }
  | { label: string; kind: 'toggle'; value?: boolean }
  | { label: string; kind: 'number'; value?: number; min?: number; max?: number; step?: number }
  | { label: string; kind: 'text'; value?: string }
export type ConfigValue = string | number | boolean
/**
 * A pretend portal form: the player fills the fields, then the answer is checked
 * against `answer` (field label -> expected value). Fields not in `answer` are
 * not judged. A `readOnly` field shows a fixed value, like a greyed-out setting.
 */
/** The admin portal a pretend portal screen belongs to (default: the Azure portal). */
export type PortalName = 'Microsoft Azure portal' | 'Microsoft Entra admin center' | 'Microsoft 365 admin center'
export const PORTAL_NAMES: readonly PortalName[] = ['Microsoft Azure portal', 'Microsoft Entra admin center', 'Microsoft 365 admin center']

export type ConfigExercise = ExerciseBase & {
  type: 'config'
  portal?: PortalName
  blade: string // portal page title, e.g. "Create budget"
  fields: (ConfigField & { readOnly?: boolean })[]
  answer: Record<string, ConfigValue>
}

/** An ARM template (JSON) or Bicep file to read, then a question about it. */
export type TemplateExercise = ExerciseBase & {
  type: 'template'
  language: 'json' | 'bicep'
  code: string
  options: string[]
  answer: number
}

export type TopologyNode = { id: string; label: string; cidr?: string }
export type TopologyLink = { from: string; to: string; kind: 'peering' | 'vpn' | 'route' }
/** A network diagram (virtual networks, peerings, VPNs, routes), then a question such as "can A reach C?". */
export type TopologyExercise = ExerciseBase & {
  type: 'topology'
  nodes: TopologyNode[]
  links: TopologyLink[]
  options: string[]
  answer: number
}

/** Build a KQL query from tokens; the pretend result table shows once it is right. */
export type KqlExercise = ExerciseBase & {
  type: 'kql'
  tokens: string[]
  answer: string[]
  sampleResult: string[][] // first row is the header
}

export type Exercise =
  | ChoiceExercise
  | TrueFalseExercise
  | MatchExercise
  | SortExercise
  | OrderExercise
  | FillExercise
  | PlaceExercise
  | FixExercise
  | ShellExercise
  | MultiExercise
  | YesNoExercise
  | RulesExercise
  | ConfigExercise
  | TemplateExercise
  | TopologyExercise
  | KqlExercise

export type ExerciseType = Exercise['type']

export type DailyGoal = 20 | 50 | 100

export type ExamMode = 'full' | 'domain' | 'weak'

/** Section 12.4. `elapsedSec` and `current` are extra: they let a closed exam resume where it stopped. */
export type ExamAttempt = {
  id: string
  /** Course the exam belongs to. Missing on attempts from before AZ-104: those are AZ-900. */
  course?: CourseId
  mode: ExamMode
  domain?: PathId
  startedAt: string
  finishedAt?: string
  timeLimitSec: number
  elapsedSec: number
  current: number
  questionIds: string[]
  /** Player's answer per question id; the shape depends on the exercise type. */
  responses: Record<string, unknown>
  flagged: string[]
  /** Option order shown to the player, per question id (choice, multi). */
  optionOrder: Record<string, number[]>
  score?: number // 0-1000
  domainScores?: Record<PathId, { right: number; total: number }>
}

/** Progress that belongs to one course (plan section 3): everything else is shared by the whole app. */
export type CourseProgress = Pick<Progress, 'lessonsDone' | 'checkpoints' | 'unitLevel' | 'review' | 'reviewRemoved' | 'conceptStats' | 'examHistory'>

export type Progress = {
  xp: number
  /** XP earned per local day ("YYYY-MM-DD"). Not in the plan's model; the header needs today's XP. */
  xpByDay: Record<string, number>
  dailyGoal: DailyGoal
  streak: { current: number; best: number; lastDay: string }
  hearts: number
  /** Day the hearts were last refilled; hearts go back to full on a new day. */
  heartsDay: string
  heartsEnabled: boolean
  soundEnabled: boolean
  lessonsDone: Record<string, { bestAccuracy: number; completedAt: string; count: number }>
  /** Checkpoint id ("cp1") -> best score (0..1) and when it was first passed. */
  checkpoints: Record<string, { bestScore: number; passedAt?: string }>
  unitLevel: Record<string, 0 | 1 | 2 | 3>
  /** Key: exercise id. `at` (ISO time of the last change) lets sync pick the newest entry. */
  review: Record<string, { dueDay: string; correctStreak: number; at?: string }>
  conceptStats: Record<string, { right: number; wrong: number }>
  examHistory: ExamAttempt[]
  activeExam?: ExamAttempt
  // Sync bookkeeping (stage 8). ISO times that let two devices merge their progress.
  /** Exercise id -> when it left the review queue, so the removal reaches other devices. */
  reviewRemoved: Record<string, string>
  /** Last change to the daily goal, hearts switch, or sound switch. */
  settingsAt?: string
  /** Last time a heart was lost or won. A new day's refill leaves it empty. */
  heartsAt?: string
  /** Last "Reset progres": everything from before it is dropped on every device. */
  resetAt?: string
  /**
   * Progress of courses other than AZ-900. AZ-900 keeps its fields at the top
   * level, where they were before AZ-104 existed, so older data needs no change.
   */
  courses: { az104?: CourseProgress }
}
