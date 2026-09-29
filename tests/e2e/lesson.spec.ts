import { expect, test, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'

type Exercise =
  | { id: string; type: 'truefalse'; answer: boolean }
  | { id: string; type: 'choice'; options: string[]; answer: number }
  | { id: string; type: 'match'; pairs: [string, string][] }
  | { id: string; type: string }

const unit = JSON.parse(readFileSync('src/content/units/u04-core-architecture.json', 'utf8'))
const PLAYABLE = new Set(['choice', 'truefalse', 'match'])
const exercises: Exercise[] = unit.lessons[0].exercises.filter((e: Exercise) => PLAYABLE.has(e.type))
const PRAISE = /Benar!|Mantap!|Tepat sekali!|Keren!/

test.use({ reducedMotion: 'reduce' })

async function openLesson(page: Page) {
  await page.goto('/')
  const node = page.locator('[data-node="u04-l1"]')
  await expect(node).toHaveAttribute('data-node-state', 'active')
  await node.click()
  await page.getByRole('button', { name: 'Mulai', exact: true }).click()
}

/** Answers the current exercise, on purpose wrong when `wrong` is set. Returns whether it was right. */
async function answer(page: Page, ex: Exercise, wrong: boolean): Promise<boolean> {
  if (ex.type === 'truefalse' && 'answer' in ex && typeof ex.answer === 'boolean') {
    const pick = wrong ? !ex.answer : ex.answer
    await page.getByRole('button', { name: pick ? 'Benar' : 'Salah', exact: true }).click()
    return !wrong
  }
  if (ex.type === 'choice' && 'options' in ex) {
    const pick = wrong ? (ex.answer + 1) % ex.options.length : ex.answer
    await page.getByRole('button', { name: ex.options[pick], exact: true }).click()
    await page.getByRole('button', { name: 'Periksa' }).click()
    return !wrong
  }
  if (ex.type === 'match' && 'pairs' in ex) {
    if (wrong) {
      await page.getByRole('button', { name: ex.pairs[0][0], exact: true }).click()
      await page.getByRole('button', { name: ex.pairs[1][1], exact: true }).click()
    }
    for (const [left, right] of ex.pairs) {
      await page.getByRole('button', { name: left, exact: true }).click()
      await page.getByRole('button', { name: right, exact: true }).click()
    }
    return !wrong
  }
  throw new Error(`unexpected exercise type ${ex.type}`)
}

test('plays Unit 4 lesson 1 from the path map to the finish screen', async ({ page }) => {
  await openLesson(page)

  const wrongOnPurpose = new Set([exercises[1].id]) // one miss, so accuracy is not 100%
  let right = 0
  for (const ex of exercises) {
    await expect(page.locator('main[data-exercise-id]')).toHaveAttribute('data-exercise-id', ex.id)
    const ok = await answer(page, ex, wrongOnPurpose.has(ex.id))
    if (ok) right++
    const sheet = page.getByRole('region', { name: ok ? PRAISE : 'Kurang tepat' })
    await expect(sheet).toBeVisible()
    await sheet.getByRole('button', { name: 'Lanjut' }).click()
  }

  await expect(page.getByRole('heading', { name: 'Lesson selesai!' })).toBeVisible()
  const accuracy = Math.round((right / exercises.length) * 100)
  await expect(page.getByText(`${accuracy}%`)).toBeVisible()
  await expect(page.getByLabel('10 XP')).toBeVisible() // no flawless bonus

  await page.getByRole('button', { name: 'Lanjut' }).click()
  await expect(page.locator('[data-node="u04-l1"]')).toHaveAttribute('data-node-state', 'done')
  await expect(page.getByLabel('XP hari ini 10 dari target 50')).toBeVisible()
})

test('a flawless run earns the +5 XP bonus and survives a reload', async ({ page }) => {
  await openLesson(page)
  for (const ex of exercises) {
    await answer(page, ex, false)
    await page.getByRole('button', { name: 'Lanjut' }).click()
  }
  await expect(page.getByLabel('15 XP')).toBeVisible()
  await expect(page.getByText('100%')).toBeVisible()
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await page.reload()
  await expect(page.getByLabel('XP hari ini 15 dari target 50')).toBeVisible()
})

test('true/false cards can be swiped', async ({ page }) => {
  await openLesson(page)
  const first = exercises[0]
  expect(first.type).toBe('truefalse')
  const card = page.getByRole('heading', { name: /availability zone is a separate datacenter/ })
  const box = (await card.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, { steps: 5 })
  await page.mouse.move(box.x + box.width / 2 + 200, box.y + box.height / 2, { steps: 5 })
  await page.mouse.up()
  await expect(page.getByText('Jawabanmu: Benar')).toBeVisible()
  await expect(page.getByRole('region', { name: PRAISE })).toBeVisible()
})

test('choice works from the keyboard: number to pick, Enter to check', async ({ page }) => {
  await openLesson(page)
  // Skip to the first choice exercise.
  for (const ex of exercises) {
    if (ex.type === 'choice' && 'options' in ex) {
      const position = await page
        .locator('[data-option]')
        .evaluateAll((els, text) => els.findIndex((el) => el.textContent?.endsWith(text)), ex.options[ex.answer])
      await page.keyboard.press(String(position + 1))
      await page.keyboard.press('Enter')
      await expect(page.getByRole('region', { name: PRAISE })).toBeVisible()
      return
    }
    await answer(page, ex, false)
    await page.getByRole('button', { name: 'Lanjut' }).click()
  }
  throw new Error('no choice exercise found')
})

test('leaving mid-lesson asks first and saves nothing', async ({ page }) => {
  await openLesson(page)
  await answer(page, exercises[0], false)
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await page.getByRole('button', { name: 'Keluar dari lesson' }).click()
  await expect(page.getByRole('dialog', { name: 'Yakin mau berhenti?' })).toBeVisible()
  await page.getByRole('button', { name: 'Keluar', exact: true }).click()
  await expect(page.locator('[data-node="u04-l1"]')).toHaveAttribute('data-node-state', 'active')
  await expect(page.getByLabel('XP hari ini 0 dari target 50')).toBeVisible()
})
