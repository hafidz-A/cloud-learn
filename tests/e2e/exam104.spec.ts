import { expect, test, type Page } from '@playwright/test'
import { CASE_STUDIES, ITEMS, answer } from './helpers'

// The AZ-104 exam page (LANGIT_AZ104_PLAN.md section 9) at phone width.

test.use({ reducedMotion: 'reduce' })

async function chooseAz104(page: Page) {
  await page.addInitScript(() => localStorage.setItem('langit-course', JSON.stringify({ state: { active: 'az104' }, version: 1 })))
}

type Saved = {
  activeExam: { course: string; questionIds: string[]; timeLimitSec: number; caseStart: number; caseStudyId: string } | null
  examHistory: unknown[]
  courses: { az104: { examHistory: unknown[]; review: Record<string, { dueDay: string }> } }
}
const saved = (page: Page): Promise<Saved> => page.evaluate(() => JSON.parse(localStorage.getItem('langit-progress')!).state)
const questionId = async (page: Page) => (await page.locator('main[data-exam-question]').getAttribute('data-exam-question'))!

test('a full AZ-104 simulation ends with a case study, and the questions before it lock', async ({ page }) => {
  await chooseAz104(page)
  await page.goto('/#/ujian')
  await expect(page.getByText('12 soal jalur 1, 10 soal jalur 2, 9 soal jalur 3, 12 soal jalur 4, 7 soal jalur 5, termasuk satu studi kasus')).toBeVisible()
  await page.getByRole('button', { name: 'Mulai' }).first().click()
  await expect(page.getByRole('timer')).toHaveAccessibleName(/Sisa waktu (100:00|99:5\d)/)

  const exam = (await saved(page)).activeExam!
  expect(exam.course).toBe('az104')
  expect(exam.questionIds).toHaveLength(50)
  expect(exam.timeLimitSec).toBe(6000)
  const start = exam.caseStart
  const cs = CASE_STUDIES.find((c) => c.id === exam.caseStudyId)!
  expect(exam.questionIds.slice(start)).toEqual(cs.questions.map((q) => q.id))

  // The grid of the main section lists only its own questions.
  await answer(page, ITEMS.get(await questionId(page))!, { submit: false })
  await page.getByRole('button', { name: 'Daftar nomor soal' }).click()
  const grid = page.getByRole('dialog', { name: 'Nomor soal' })
  await expect(grid.getByRole('button', { name: /^Soal \d+, / })).toHaveCount(start)
  await grid.getByRole('button', { name: `Soal ${start}, belum dijawab` }).click()

  // Leaving the section warns first, like the real exam.
  await page.getByRole('button', { name: 'Ke studi kasus' }).click()
  const sheet = page.getByRole('dialog', { name: 'Lanjut ke studi kasus?' })
  await expect(sheet.getByText("You can't return to this section after you continue.")).toBeVisible()
  await sheet.getByRole('button', { name: 'Lanjut ke studi kasus' }).click()

  // The scenario opens first, in tabs, and stays one tap away from the question.
  const scenario = page.locator(`[data-case-scenario="${cs.id}"]`)
  await expect(scenario.getByRole('heading', { name: cs.title })).toBeVisible()
  const lastTab = cs.tabs.at(-1)!
  await scenario.getByRole('radio', { name: lastTab.title }).click()
  await expect(scenario.getByText(lastTab.paragraphs[0].replace(/^- /, '').slice(0, 40))).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  await page.getByRole('radio', { name: 'Soal' }).click()
  const caseQuestion = await questionId(page)
  expect(caseQuestion).toBe(cs.questions[0].id)
  await answer(page, ITEMS.get(caseQuestion)!, { submit: false, wrong: true })
  await expect(page.getByRole('button', { name: 'Sebelumnya' })).toBeDisabled()

  // After a reload the case study is still the only section that opens.
  await page.reload()
  await page.getByRole('button', { name: 'Daftar nomor soal' }).click()
  const caseGrid = page.getByRole('dialog', { name: 'Nomor soal · studi kasus' })
  await expect(caseGrid.getByRole('button', { name: /^Soal \d+, / })).toHaveCount(50 - start)
  await expect(caseGrid.getByText(`Soal 1–${start} sudah terkunci.`)).toBeVisible()
  await caseGrid.getByRole('button', { name: 'Kumpulkan' }).click()
  await page.getByRole('button', { name: 'Kumpulkan sekarang' }).click()

  // The result shows the five AZ-104 domains and the official practice.
  await expect(page.getByRole('heading', { name: 'Skor kamu' })).toBeVisible()
  await expect(page.getByText(`Studi kasus: ${cs.title}.`)).toBeVisible()
  for (const p of [1, 2, 3, 4, 5]) await expect(page.getByText(new RegExp(`^Jalur ${p} · `))).toBeVisible()
  await expect(page.getByRole('link', { name: /Practice Assessment AZ-104 resmi/ })).toHaveAttribute('href', /certifications\/azure-administrator/)
  // Two answers: the first one right, the case study one wrong. Unanswered questions stay out of the queue.
  await expect(page.getByText('1 soal yang dijawab salah sudah masuk antrean Latihan.')).toBeVisible()

  // Case study questions are reviewed with their scenario.
  await page.getByRole('button', { name: 'Lihat pembahasan' }).click()
  const caseArticles = page.locator('article', { has: page.locator(`[data-case-panel="${cs.id}"]`) })
  await expect(caseArticles).toHaveCount(50 - start)
  await caseArticles.first().locator('summary').click()
  await expect(caseArticles.first().getByRole('heading', { name: cs.title })).toBeVisible()

  // The attempt belongs to AZ-104 only, and the missed case question waits in the AZ-104 review queue.
  const state = await saved(page)
  expect(state.activeExam).toBeNull()
  expect(state.examHistory).toEqual([])
  expect(state.courses.az104.examHistory).toHaveLength(1)
  expect(Object.keys(state.courses.az104.review)).toContain(caseQuestion)

  // In practice, the case question comes with its scenario.
  await page.evaluate((id) => {
    const raw = JSON.parse(localStorage.getItem('langit-progress')!)
    raw.state.courses.az104.review = { [id]: { ...raw.state.courses.az104.review[id], dueDay: '2000-01-01' } }
    localStorage.setItem('langit-progress', JSON.stringify(raw))
  }, caseQuestion)
  await page.goto('/#/latihan')
  await page.reload()
  await page.getByRole('button', { name: 'Mulai latihan' }).click()
  await expect(page.locator(`[data-case-panel="${cs.id}"]`)).toBeVisible()
  await page.locator(`[data-case-panel="${cs.id}"] summary`).click()
  await expect(page.locator(`[data-case-panel="${cs.id}"]`).getByRole('heading', { name: cs.title })).toBeVisible()
})

test('an AZ-104 domain mini exam has 15 questions in 30 minutes and no case study', async ({ page }) => {
  await chooseAz104(page)
  await page.goto('/#/ujian')
  await page.getByRole('radio', { name: /Jalur 5/ }).click()
  await page.getByRole('button', { name: 'Mulai' }).nth(1).click()
  await expect(page.getByRole('timer')).toHaveAccessibleName(/Sisa waktu (30:00|29:5\d)/)
  const exam = (await saved(page)).activeExam!
  expect(exam.questionIds).toHaveLength(15)
  expect(exam.caseStart).toBeUndefined()
  expect(exam.questionIds.every((id) => id.startsWith('az104-u14') || id.startsWith('az104-u15'))).toBe(true)
  await page.getByRole('button', { name: 'Daftar nomor soal' }).click()
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Kumpulkan' })).toBeVisible()
})

test('only one exam runs at a time, whichever course it belongs to', async ({ page }) => {
  await page.goto('/#/ujian')
  await page.getByRole('button', { name: 'Mulai' }).first().click()
  await expect(page.getByRole('timer')).toBeVisible()
  await page.evaluate(() => localStorage.setItem('langit-course', JSON.stringify({ state: { active: 'az104' }, version: 1 })))
  await page.goto('/#/ujian')
  await page.reload()
  await expect(page.getByText('Ujian AZ-900 yang belum selesai')).toBeVisible()
  await expect(page.getByText('Hanya satu ujian yang bisa berjalan.', { exact: false })).toBeVisible()
  for (const button of await page.getByRole('button', { name: 'Mulai' }).all()) await expect(button).toBeDisabled()
})
