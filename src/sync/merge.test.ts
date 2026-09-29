import { describe, expect, it } from 'vitest'
import type { ExamAttempt } from '../lib/types'
import { initialProgress } from '../store/progress'
import { mergeProgress, readSyncData, stableJson, toSyncData, type SyncData } from './merge'

const base = toSyncData(initialProgress)
const data = (patch: Partial<SyncData>): SyncData => ({ ...base, ...patch })

const exam = (id: string, finishedAt: string): ExamAttempt => ({
  id,
  mode: 'full',
  startedAt: finishedAt,
  finishedAt,
  timeLimitSec: 2700,
  elapsedSec: 60,
  current: 0,
  questionIds: [],
  responses: {},
  flagged: [],
  optionOrder: {},
  score: 800,
})

// A phone and a PC that each did different things.
const phone = data({
  xp: 30,
  xpByDay: { '2026-09-28': 15, '2026-09-29': 15 },
  streak: { current: 2, best: 2, lastDay: '2026-09-29' },
  lessonsDone: { 'u01-l1': { bestAccuracy: 0.8, completedAt: '2026-09-28T08:00:00Z', count: 1 } },
  checkpoints: { cp1: { bestScore: 0.7 } },
  unitLevel: { u01: 0 },
  review: { 'u01-l1-e2': { dueDay: '2026-09-30', correctStreak: 0, at: '2026-09-29T08:00:00Z' } },
  conceptStats: { iaas: { right: 3, wrong: 1 } },
  examHistory: [exam('exam-a', '2026-09-28T09:00:00Z')],
  hearts: 2,
  heartsDay: '2026-09-29',
  heartsAt: '2026-09-29T08:30:00Z',
})
const pc = data({
  xp: 25,
  xpByDay: { '2026-09-28': 15, '2026-09-27': 10 },
  streak: { current: 1, best: 4, lastDay: '2026-09-28' },
  lessonsDone: {
    'u01-l1': { bestAccuracy: 1, completedAt: '2026-09-27T08:00:00Z', count: 2 },
    'u01-l2': { bestAccuracy: 0.9, completedAt: '2026-09-27T09:00:00Z', count: 1 },
  },
  checkpoints: { cp1: { bestScore: 0.85, passedAt: '2026-09-27T10:00:00Z' } },
  unitLevel: { u01: 1 },
  conceptStats: { iaas: { right: 2, wrong: 4 }, paas: { right: 1, wrong: 0 } },
  examHistory: [exam('exam-b', '2026-09-27T09:00:00Z'), exam('exam-a', '2026-09-28T09:00:00Z')],
  dailyGoal: 100,
  settingsAt: '2026-09-27T07:00:00Z',
})

describe('mergeProgress', () => {
  const merged = mergeProgress(phone, pc)

  it('keeps everything from both devices', () => {
    expect(merged.xpByDay).toEqual({ '2026-09-27': 10, '2026-09-28': 15, '2026-09-29': 15 })
    expect(merged.xp).toBe(40)
    expect(merged.lessonsDone['u01-l1']).toEqual({ bestAccuracy: 1, completedAt: '2026-09-28T08:00:00Z', count: 2 })
    expect(merged.lessonsDone['u01-l2']).toBeDefined()
    expect(merged.checkpoints.cp1).toEqual({ bestScore: 0.85, passedAt: '2026-09-27T10:00:00Z' })
    expect(merged.unitLevel.u01).toBe(1)
    expect(merged.conceptStats).toEqual({ iaas: { right: 3, wrong: 4 }, paas: { right: 1, wrong: 0 } })
    expect(merged.review['u01-l1-e2']).toBeDefined()
    expect(merged.examHistory.map((e) => e.id)).toEqual(['exam-b', 'exam-a'])
  })

  it('takes the newest streak, settings, and hearts', () => {
    expect(merged.streak).toEqual({ current: 2, best: 4, lastDay: '2026-09-29' })
    expect(merged.dailyGoal).toBe(100)
    expect(merged.hearts).toBe(2)
  })

  it('gives the same result in either order, and merging again changes nothing', () => {
    expect(stableJson(mergeProgress(pc, phone))).toBe(stableJson(merged))
    expect(stableJson(mergeProgress(merged, phone))).toBe(stableJson(merged))
    expect(stableJson(mergeProgress(merged, merged))).toBe(stableJson(merged))
  })

  it('removes a review item on every device once it leaves the queue on one', () => {
    const cleared = data({ ...phone, review: {}, reviewRemoved: { 'u01-l1-e2': '2026-09-30T08:00:00Z' } })
    const stale = data({ ...phone })
    const m = mergeProgress(stale, cleared)
    expect(m.review).toEqual({})
    expect(m.reviewRemoved).toEqual({ 'u01-l1-e2': '2026-09-30T08:00:00Z' })
  })

  it('brings a review item back when it is missed again after it was removed', () => {
    const cleared = data({ review: {}, reviewRemoved: { x: '2026-09-30T08:00:00Z' } })
    const missedLater = data({ review: { x: { dueDay: '2026-10-02', correctStreak: 0, at: '2026-10-01T08:00:00Z' } } })
    const m = mergeProgress(cleared, missedLater)
    expect(m.review.x).toBeDefined()
    expect(m.reviewRemoved).toEqual({})
  })

  it("lets a heart lost today beat another device's refill for today", () => {
    const refilled = data({ hearts: 5, heartsDay: '2026-09-29', heartsAt: undefined })
    expect(mergeProgress(refilled, phone).hearts).toBe(2)
    const tomorrow = data({ hearts: 5, heartsDay: '2026-09-30', heartsAt: undefined })
    expect(mergeProgress(tomorrow, phone).hearts).toBe(5)
  })

  it('spreads a reset: the newer reset wins over older progress', () => {
    const reset = data({ resetAt: '2026-09-30T08:00:00Z' })
    expect(mergeProgress(phone, reset)).toEqual(reset)
    expect(mergeProgress(reset, phone)).toEqual(reset)
  })

  it('never wipes progress when a device first joins, even after an old reset', () => {
    const oldReset = data({ ...pc, resetAt: '2026-09-01T08:00:00Z' })
    const m = mergeProgress(phone, oldReset, { joining: true })
    expect(Object.keys(m.lessonsDone)).toEqual(['u01-l1', 'u01-l2'])
    expect(m.xp).toBe(40)
    expect(m.resetAt).toBe('2026-09-01T08:00:00Z')
  })

  it('merges AZ-104 progress with the same rules, apart from AZ-900 (LANGIT_AZ104_PLAN.md section 3)', () => {
    const az104 = (lessons: Record<string, number>, concept: { right: number; wrong: number }) => ({
      az104: {
        lessonsDone: Object.fromEntries(Object.entries(lessons).map(([id, count]) => [id, { bestAccuracy: 1, completedAt: '2026-10-01T08:00:00Z', count }])),
        checkpoints: {},
        unitLevel: {},
        review: {},
        reviewRemoved: {},
        conceptStats: { rbac: concept },
        examHistory: [],
      },
    })
    const a = data({ ...phone, courses: az104({ 'az104-u01-l1': 1 }, { right: 2, wrong: 1 }) })
    const b = data({ ...pc, courses: az104({ 'az104-u01-l1': 2, 'az104-u01-l2': 1 }, { right: 1, wrong: 3 }) })
    const m = mergeProgress(a, b)
    expect(m.courses.az104?.lessonsDone['az104-u01-l1'].count).toBe(2)
    expect(Object.keys(m.courses.az104!.lessonsDone)).toEqual(['az104-u01-l1', 'az104-u01-l2'])
    expect(m.courses.az104?.conceptStats.rbac).toEqual({ right: 2, wrong: 3 })
    // AZ-900 merges exactly as it did without AZ-104, and neither course leaks into the other.
    const { courses: _, ...az900 } = m
    const { courses: __, ...before } = mergeProgress(phone, pc)
    expect(az900).toEqual(before)
    expect(m.lessonsDone['az104-u01-l1']).toBeUndefined()
    expect(stableJson(mergeProgress(b, a))).toBe(stableJson(m))
  })

  it('keeps AZ-104 progress when the other device runs an app version without it', () => {
    const withAz104 = data({ ...phone, courses: { az104: { lessonsDone: { 'az104-u01-l1': { bestAccuracy: 1, completedAt: '2026-10-01T08:00:00Z', count: 1 } }, checkpoints: {}, unitLevel: {}, review: {}, reviewRemoved: {}, conceptStats: {}, examHistory: [] } } })
    const old = { ...pc } as Partial<SyncData>
    delete old.courses
    const m = mergeProgress(withAz104, readSyncData(old, base)!)
    expect(m.courses.az104?.lessonsDone['az104-u01-l1']).toBeDefined()
    expect(mergeProgress(phone, pc).courses).toEqual({})
  })

  it('keeps at most 100 finished exams', () => {
    const many = (prefix: string) => Array.from({ length: 80 }, (_, i) => exam(`${prefix}${i}`, `2026-09-${String(1 + (i % 28)).padStart(2, '0')}T0${i % 10}:00:00Z`))
    expect(mergeProgress(data({ examHistory: many('a') }), data({ examHistory: many('b') })).examHistory).toHaveLength(100)
  })
})

describe('toSyncData and readSyncData', () => {
  it('leaves a running exam on its own device', () => {
    const withExam = { ...initialProgress, activeExam: exam('running', '2026-09-29T08:00:00Z') }
    expect('activeExam' in toSyncData(withExam)).toBe(false)
  })

  it('fills fields that older saved data does not have, and rejects junk', () => {
    const old = { ...phone } as Partial<SyncData>
    delete old.reviewRemoved
    expect(readSyncData(old, base)?.reviewRemoved).toEqual({})
    expect(readSyncData('nope', base)).toBeNull()
    expect(readSyncData({ xp: 'lots' }, base)).toBeNull()
  })
})
