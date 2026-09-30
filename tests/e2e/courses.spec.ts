import { expect, test, type Page } from '@playwright/test'
import { AZ104_UNITS, play, startFromMap } from './helpers'

// Two courses in one app (LANGIT_AZ104_PLAN.md section 3 and Prompt A): the
// picker switches the path map, practice, stats, and exam page; AZ-104 needs no
// AZ-900 progress; and nothing of AZ-900 changes when AZ-104 is opened.

test.use({ reducedMotion: 'reduce' })

// AZ-104 content is written unit by unit, so the expected map follows the JSON:
// a lesson with exercises is playable (or locked behind the one before it), a
// lesson without exercises waits as "segera hadir".
const AZ104_LESSONS = AZ104_UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, path: u.path })))
const hasExercises = (l: { items: { type: string }[] }) => l.items.some((i) => i.type !== 'learn' && i.type !== 'intro')
const expectedStates = (() => {
  let activeFound = false
  let previousDone = true
  let path = 1
  return AZ104_LESSONS.map((l) => {
    if (l.path !== path) [path, previousDone] = [l.path, true]
    let state: string
    if (!hasExercises(l)) state = 'soon'
    else if (l.path === 1 && previousDone && !activeFound) [state, activeFound] = ['active', true]
    else state = 'locked'
    if (state !== 'soon') previousDone = false
    return state
  })
})()
/** A checkpoint whose whole path has no exercises yet, while one is left. */
const EMPTY_PATH = [1, 2, 3, 4, 5].find((p) => !AZ104_LESSONS.some((l) => l.path === p && hasExercises(l)))
const EMPTY_LESSON = AZ104_LESSONS.find((l) => !hasExercises(l))

const picker = (page: Page) => page.getByRole('group', { name: 'Pilih course' })

/** The AZ-900 part of the saved progress, plus what the whole app shares. */
async function az900Snapshot(page: Page) {
  return page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('langit-progress')!).state
    const { xp, streak, lessonsDone, checkpoints, unitLevel, review, conceptStats, examHistory } = s
    return { xp, streak, lessonsDone, checkpoints, unitLevel, review, conceptStats, examHistory }
  })
}

async function chooseAz104(page: Page) {
  await page.addInitScript(() => localStorage.setItem('langit-course', JSON.stringify({ state: { active: 'az104' }, version: 1 })))
}

test('the course picker switches the path map, and AZ-900 progress stays as it was', async ({ page }) => {
  await startFromMap(page, 'u01-l1')
  await play(page, { wrongFirst: new Set(['u01-l1-e2']) })
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await expect(page.locator('[data-node="u01-l1"]')).toHaveAttribute('data-node-state', 'done')
  const before = await az900Snapshot(page)
  expect(Object.keys(before.review).length).toBeGreaterThan(0)

  await picker(page).getByRole('button', { name: /AZ-104/ }).click()
  await expect(picker(page).getByRole('button', { name: /AZ-104/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Langit: jalur belajar AZ-104')

  // All 15 units open without AZ-900: the first lesson with exercises is next, and
  // lessons without exercises wait as "segera hadir".
  await expect(page.getByRole('button', { name: /^Panduan unit \d+:/ })).toHaveCount(15)
  await expect(page.locator('[data-node^="az104-u"]')).toHaveCount(AZ104_LESSONS.length)
  await expect(page.locator('[data-node^="u0"], [data-node^="u1"]')).toHaveCount(0)
  expect(await page.locator('[data-node^="az104-u"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-node-state')))).toEqual(
    expectedStates,
  )

  // A checkpoint with no exercises in its path cannot be started.
  if (EMPTY_PATH) {
    const cp = page.locator(`[data-node="az104-cp${EMPTY_PATH}"]`)
    await expect(cp).toHaveAttribute('data-node-state', 'soon')
    await cp.click()
    await expect(page.getByRole('dialog')).toContainText('Soal untuk jalur ini sedang disiapkan.')
    await expect(page.getByRole('dialog').getByRole('button', { name: /Mulai/ })).toHaveCount(0)
  }

  // The choice is kept on this device.
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Langit: jalur belajar AZ-104')
  expect(await az900Snapshot(page)).toEqual(before)

  await picker(page).getByRole('button', { name: /AZ-900/ }).click()
  await expect(page.locator('[data-node="u01-l1"]')).toHaveAttribute('data-node-state', 'done')
  expect(await az900Snapshot(page)).toEqual(before)
})

test('practice, stats, exam, and the unit guide follow the chosen course', async ({ page }) => {
  await chooseAz104(page)

  await page.goto('/#/latihan')
  await expect(page.getByText('Course AZ-104')).toBeVisible()

  await page.goto('/#/statistik')
  await expect(page.getByText('konsep untuk course AZ-104')).toBeVisible()

  await page.goto('/#/ujian')
  await expect(page.getByRole('heading', { name: 'Soal ujian AZ-104 sedang disiapkan' })).toBeVisible()

  await page.goto('/#/guide/az104-u01-identity')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Microsoft Entra/)

  // Links into AZ-104 runs that have nothing to ask yet explain that instead of starting.
  if (EMPTY_PATH) {
    await page.goto(`/#/checkpoint/az104-cp${EMPTY_PATH}`)
    await expect(page.getByRole('heading', { name: 'Checkpoint belum siap' })).toBeVisible()
  }
  if (EMPTY_LESSON) {
    await page.goto(`/#/lesson/${EMPTY_LESSON.id}`)
    await expect(page.getByRole('button', { name: 'Kembali ke home' })).toBeVisible()
  }
})

test('a lesson opened from a link makes its course the active one', async ({ page }) => {
  await chooseAz104(page)
  await page.goto('/#/lesson/u01-l1')
  await expect(page.locator('main[data-item-id]')).toBeVisible()
  // Out of hearts, "Latihan untuk isi hearts" now practices AZ-900, the course being played.
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('langit-course')!).state.active)).toBe('az900')
})
