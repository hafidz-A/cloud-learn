// Data model from LANGIT_AZ900_PLAN.md section 8 ("Model data"), with the
// intro cards and lesson items from section 11.

export type PathId = 1 | 2 | 3

export type Unit = {
  id: string // "u04-core-architecture"
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
  scene: { kind: 'portal' | 'error'; title: string; message: string }
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

export type ExerciseType = Exercise['type']

export type DailyGoal = 20 | 50 | 100

export type ExamMode = 'full' | 'domain' | 'weak'

/** Section 12.4. `elapsedSec` and `current` are extra: they let a closed exam resume where it stopped. */
export type ExamAttempt = {
  id: string
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
}
