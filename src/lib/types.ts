// Data model from LANGIT_AZ900_PLAN.md section 8 ("Model data"), with the
// intro cards and lesson items from section 11.

export type PathId = 1 | 2 | 3

export type Unit = {
  id: string // "u04-core-architecture"
  path: PathId
  title: string // "Komponen inti"
  lessons: Lesson[]
}

export type Lesson = {
  id: string // "u04-l1"
  title: string
  items: LessonItem[] // intro cards and exercises, easiest first (section 11.2)
}

/** Introduces one new concept before it is tested. No answer, no XP, never reviewed. */
export type IntroCard = {
  id: string // "u04-l1-i1"
  type: 'intro'
  concept: string // same concept tag as the exercises that test it
  title: string // "Availability zone"
  body: string // at most 2 sentences, Indonesian
  visual?: string // diagram component name, e.g. "ZonesInRegion"
}

export type LessonItem = IntroCard | Exercise

export type ExerciseBase = {
  id: string
  concept: string // "availability-zones"
  prompt: string // English, like the real exam
  explanation: string // Indonesian, shown after answering
  verify?: boolean // true when the fact still needs to be double-checked
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
export type PlaceExercise = ExerciseBase & {
  type: 'place'
  zones: string[]
  pieces: { text: string; validZones: number[] }[]
  rule: string
}
export type FixExercise = ExerciseBase & {
  type: 'fix'
  scene: { kind: 'portal' | 'error'; title: string; message: string }
  options: string[]
  answer: number
}
export type ShellExercise = ExerciseBase & { type: 'shell'; tokens: string[]; answer: string[] }

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

export type ExerciseType = Exercise['type']

export type DailyGoal = 20 | 50 | 100

export type Progress = {
  xp: number
  /** XP earned per local day ("YYYY-MM-DD"). Not in the plan's model; the header needs today's XP. */
  xpByDay: Record<string, number>
  dailyGoal: DailyGoal
  streak: { current: number; best: number; lastDay: string }
  hearts: number
  lessonsDone: Record<string, { bestAccuracy: number; completedAt: string }>
  unitLevel: Record<string, 0 | 1 | 2 | 3>
  review: Record<string, { dueDay: string; correctStreak: number }> // key: exercise id
  conceptStats: Record<string, { right: number; wrong: number }>
}
