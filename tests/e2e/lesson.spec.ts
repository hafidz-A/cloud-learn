import { expect, test, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'

type Item =
  | { id: string; type: 'intro'; title: string; body: string; visual?: string }
  | { id: string; type: 'truefalse'; answer: boolean }
  | { id: string; type: 'choice'; options: string[]; answer: number }
  | { id: string; type: 'match'; pairs: [string, string][] }

const unit = JSON.parse(readFileSync('src/content/units/u04-core-architecture.json', 'utf8'))
const PLAYABLE = new Set(['intro', 'choice', 'truefalse', 'match'])
const items: Item[] = unit.lessons[0].items.filter((i: Item) => PLAYABLE.has(i.type))
const byId = new Map(items.map((i) => [i.id, i]))
const exercises = items.filter((i) => i.type !== 'intro')
const PRAISE = /Benar!|Mantap!|Tepat sekali!|Keren!/

test.use({ reducedMotion: 'reduce' })

async function openLesson(page: Page) {
  await page.goto('/')
  const node = page.locator('[data-node="u04-l1"]')
  await expect(node).toHaveAttribute('data-node-state', 'active')
  await node.click()
  await page.getByRole('button', { name: 'Mulai', exact: true }).click()
}

const lessonMain = (page: Page) => page.locator('main[data-item-id]')

async function progressNow(page: Page): Promise<number> {
  return Number(await page.getByRole('progressbar').getAttribute('aria-valuenow'))
}

/** Answers the current exercise, on purpose wrong when `wrong` is set. Returns whether it was right. */
async function answer(page: Page, item: Item, wrong: boolean): Promise<boolean> {
  switch (item.type) {
    case 'truefalse': {
      const pick = wrong ? !item.answer : item.answer
      await page.getByRole('button', { name: pick ? 'Benar' : 'Salah', exact: true }).click()
      break
    }
    case 'choice': {
      const pick = wrong ? (item.answer + 1) % item.options.length : item.answer
      await page.getByRole('button', { name: item.options[pick], exact: true }).click()
      await page.getByRole('button', { name: 'Periksa' }).click()
      break
    }
    case 'match':
      if (wrong) {
        await page.getByRole('button', { name: item.pairs[0][0], exact: true }).click()
        await page.getByRole('button', { name: item.pairs[1][1], exact: true }).click()
      }
      for (const [left, right] of item.pairs) {
        await page.getByRole('button', { name: left, exact: true }).click()
        await page.getByRole('button', { name: right, exact: true }).click()
      }
      break
    case 'intro':
      throw new Error('intro cards have no answer')
  }
  return !wrong
}

/** Clicks "Lanjut" and waits until the next queue step (or the finish screen) is showing. */
async function next(page: Page) {
  const step = await lessonMain(page).getAttribute('data-step')
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await page.waitForFunction((prev) => {
    const main = document.querySelector<HTMLElement>('main[data-step]')
    return !main || main.dataset.step !== prev
  }, step)
}

/**
 * Plays the lesson to the finish screen. Exercises in `wrongFirst` are answered
 * wrong the first time they show up. Returns the ids in the order they appeared.
 */
async function playLesson(page: Page, wrongFirst = new Set<string>()) {
  const seen: string[] = []
  const missed = new Set<string>()
  for (let guard = 0; guard < 40; guard++) {
    if (await page.getByRole('heading', { name: 'Lesson selesai!' }).isVisible()) return seen
    const main = lessonMain(page)
    const id = (await main.getAttribute('data-item-id'))!
    const retry = (await main.getAttribute('data-retry')) !== null
    const item = byId.get(id)!
    seen.push(retry ? `${id} (retry)` : id)

    if (item.type === 'intro') {
      await expect(page.getByRole('heading', { name: item.title })).toBeVisible()
      await next(page)
      continue
    }
    if (retry) await expect(page.getByText('Soal yang tadi salah')).toBeVisible()

    const wrong = wrongFirst.has(id) && !missed.has(id)
    if (wrong) missed.add(id)
    const before = await progressNow(page)
    const ok = await answer(page, item, wrong)
    await expect(page.getByRole('region', { name: ok ? PRAISE : 'Kurang tepat' })).toBeVisible()
    if (ok) expect(await progressNow(page)).toBeGreaterThan(before)
    else {
      expect(await progressNow(page)).toBe(before)
      await expect(page.getByText('Soal ini akan muncul lagi di akhir lesson.')).toBeVisible()
    }
    await next(page)
  }
  throw new Error('lesson did not finish')
}

test('plays Unit 4 lesson 1 with intro cards, and repeats wrong answers until they are right', async ({ page }) => {
  await openLesson(page)
  const [, e1, , e2, e3, e5] = items.map((i) => i.id)
  const seen = await playLesson(page, new Set([e2, e3]))

  expect(seen).toEqual([
    'u04-l1-i1',
    e1,
    'u04-l1-i2',
    e2,
    e3,
    e5,
    `${e2} (retry)`,
    `${e3} (retry)`,
  ])
  // Accuracy and XP count first attempts: 2 of 4 right, no flawless bonus.
  await expect(page.getByText('50%')).toBeVisible()
  await expect(page.getByLabel('10 XP')).toBeVisible()
  await expect(page.getByText('2 dari 4 soal benar di percobaan pertama.')).toBeVisible()

  await page.getByRole('button', { name: 'Lanjut' }).click()
  await expect(page.locator('[data-node="u04-l1"]')).toHaveAttribute('data-node-state', 'done')
  await expect(page.getByLabel('XP hari ini 10 dari target 50')).toBeVisible()
})

test('a flawless run earns the +5 XP bonus and survives a reload', async ({ page }) => {
  await openLesson(page)
  const seen = await playLesson(page)
  expect(seen).toEqual(items.map((i) => i.id))
  await expect(page.getByLabel('15 XP')).toBeVisible()
  await expect(page.getByText('100%')).toBeVisible()
  await page.getByRole('button', { name: 'Lanjut' }).click()
  await page.reload()
  await expect(page.getByLabel('XP hari ini 15 dari target 50')).toBeVisible()
})

test('intro cards show the concept, its diagram, and a neutral Awan', async ({ page }) => {
  await openLesson(page)
  const intro = items[0]
  if (intro.type !== 'intro') throw new Error('lesson should open with an intro card')
  await expect(page.getByText('Konsep baru')).toBeVisible()
  await expect(page.getByRole('heading', { name: intro.title })).toBeVisible()
  await expect(page.getByText(intro.body)).toBeVisible()
  await expect(page.getByRole('img', { name: /tiga availability zone/ })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Awan, maskot Langit' })).toBeVisible()
  // No answer to give: nothing to check, the progress bar moves on "Lanjut".
  await expect(page.getByRole('button', { name: 'Periksa' })).toHaveCount(0)
  await next(page)
  expect(await progressNow(page)).toBeGreaterThan(0)
})

test('true/false cards can be swiped', async ({ page }) => {
  await openLesson(page)
  await next(page) // intro card
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

test('works from the keyboard: Enter on intro cards, number and Enter on choices', async ({ page }) => {
  await openLesson(page)
  for (let guard = 0; guard < 10; guard++) {
    const id = (await lessonMain(page).getAttribute('data-item-id'))!
    const item = byId.get(id)!
    if (item.type === 'intro') {
      const step = await lessonMain(page).getAttribute('data-step')
      await page.keyboard.press('Enter')
      await expect(lessonMain(page)).not.toHaveAttribute('data-step', step!)
      continue
    }
    if (item.type === 'choice') {
      const position = await page
        .locator('[data-option]')
        .evaluateAll((els, text) => els.findIndex((el) => el.textContent?.endsWith(text)), item.options[item.answer])
      await page.keyboard.press(String(position + 1))
      await page.keyboard.press('Enter')
      await expect(page.getByRole('region', { name: PRAISE })).toBeVisible()
      return
    }
    await answer(page, item, false)
    await next(page)
  }
  throw new Error('no choice exercise found')
})

test('leaving mid-lesson asks first and saves nothing', async ({ page }) => {
  await openLesson(page)
  await next(page) // intro card
  await answer(page, exercises[0], false)
  await next(page)
  await page.getByRole('button', { name: 'Keluar dari lesson' }).click()
  await expect(page.getByRole('dialog', { name: 'Yakin mau berhenti?' })).toBeVisible()
  await page.getByRole('button', { name: 'Keluar', exact: true }).click()
  await expect(page.locator('[data-node="u04-l1"]')).toHaveAttribute('data-node-state', 'active')
  await expect(page.getByLabel('XP hari ini 0 dari target 50')).toBeVisible()
})
