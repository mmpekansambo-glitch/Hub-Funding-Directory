// Click test: opens every page, clicks every link and button, and checks that each
// click lands on the right page, the page renders, and nothing throws.
//
//   npm run test:clicks
//
// Builds the site with the bundled data (no Supabase needed), serves it, and drives
// Chromium with Playwright. Exits with code 1 if any click fails.
import { spawn, execSync } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require('playwright'))
} catch {
  console.error('Playwright is missing. Run: npm i --no-save playwright && npx playwright install chromium')
  process.exit(1)
}

const PORT = 4310
const BASE = `http://localhost:${PORT}`
const START_PAGES = ['/', '/directory', '/browse', '/states', '/states/PA', '/programs/3', '/about', '/saved', '/nope']
const failures = []
const fail = (msg) => {
  failures.push(msg)
  console.log('  FAIL', msg)
}

execSync('npx vite build --mode test --outDir dist-test', { stdio: 'inherit' })
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', 'dist-test'], { stdio: 'ignore' })

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE)).ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('preview server did not start')
}

const pathOf = (url) => {
  const u = new URL(url)
  return u.pathname + u.search
}

async function run() {
  await waitForServer()
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })

  // Newer Chrome returns a Promise from window.scrollTo / scrollIntoView. Older test
  // browsers return undefined, so make them behave like current Chrome.
  await context.addInitScript(() => {
    const promised = (fn) =>
      function (...args) {
        fn.apply(this, args)
        return Promise.resolve()
      }
    window.scrollTo = promised(window.scrollTo)
    window.scroll = promised(window.scroll)
    window.scrollBy = promised(window.scrollBy)
    Element.prototype.scrollIntoView = promised(Element.prototype.scrollIntoView)
    Element.prototype.scrollTo = promised(Element.prototype.scrollTo)
  })

  const page = await context.newPage()
  let errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  const open = async (path) => {
    errors = []
    await page.goto(BASE + path)
    await page.waitForSelector('main#main > *:not(:empty)')
    await page.waitForFunction(() => !document.querySelector('main#main')?.innerText.includes('Loading…'))
  }

  // Checks the page after a click: right URL, something rendered, no errors.
  const check = async (label, expected) => {
    try {
      await page.waitForURL((u) => pathOf(u.href) === expected, { timeout: 3000 })
    } catch {}
    const got = pathOf(page.url())
    if (got !== expected) return fail(`${label}: expected ${expected}, got ${got}`)
    await page.waitForTimeout(150)
    const text = await page.$eval('main#main', (m) => m.innerText.trim()).catch(() => '')
    if (!text) fail(`${label}: page is blank after click`)
    if (errors.length) fail(`${label}: error after click: ${errors[0]}`)
  }

  // 1. Every link on every page.
  for (const start of START_PAGES) {
    await open(start)
    const links = await page.$$eval('a[href]', (as) =>
      as.map((a, i) => ({ i, href: a.getAttribute('href'), target: a.target, text: a.innerText.trim().replace(/\s+/g, ' ').slice(0, 40) })),
    )
    const seen = new Set()
    let clicked = 0
    for (const l of links) {
      if (seen.has(l.href)) continue
      seen.add(l.href)
      const label = `${start} → "${l.text || l.href}"`
      if (/^(https?:|mailto:)/.test(l.href)) {
        if (l.target !== '_blank') fail(`${label}: outside link should open in a new tab`)
        continue
      }
      await open(start)
      const el = (await page.$$('a[href]'))[l.i]
      if (!el) continue
      if (l.href.startsWith('#')) {
        // In-page jump: must exist and keep you on the same page.
        const id = decodeURIComponent(l.href.slice(1))
        if (!(await page.$(`[id="${id}"]`))) fail(`${label}: no target #${id} on the page`)
        continue
      }
      if (!(await el.isVisible())) continue
      try {
        await el.click({ timeout: 3000 })
      } catch (e) {
        fail(`${label}: could not click (${e.message.split('\n')[0]})`)
        continue
      }
      await check(label, l.href)
      clicked++
    }
    console.log(`ok ${start} (${clicked} links)`)
  }

  // 2. Click through pages in a row without reloading.
  await open('/')
  const route = [
    ['header a[href="/directory"]', '/directory'],
    ['header a[href="/browse"]', '/browse'],
    ['header a[href="/states"]', '/states'],
    ['header a[href="/about"]', '/about'],
    ['header a[href="/saved"]', '/saved'],
    ['header a.brand', '/'],
  ]
  for (const [sel, expected] of route) {
    await page.click(sel)
    await check(`nav chain → ${expected}`, expected)
  }
  await page.goBack()
  await check('browser back', '/saved')
  console.log('ok nav chain')

  // 3. Landing search box.
  await open('/')
  await page.fill('form input', 'loan')
  await page.press('form input', 'Enter')
  await check('landing search "loan"', '/directory?q=loan')
  console.log('ok landing search')

  // 4. Browse: each cut opens its options, and an option opens the directory.
  await open('/browse')
  const cuts = await page.$$eval('.cuts [role=tab]', (bs) => bs.map((b) => b.innerText.trim().split('\n')[0]))
  for (let i = 0; i < cuts.length; i++) {
    await open('/browse')
    await page.click(`.cuts [role=tab] >> nth=${i}`)
    await page.waitForSelector('#browse-panel a[href]')
    if (!/[?&]by=/.test(page.url())) fail(`browse "${cuts[i]}": URL did not change`)
    if (errors.length) fail(`browse "${cuts[i]}": error: ${errors[0]}`)
    const href = await page.getAttribute('#browse-panel a[href] >> nth=0', 'href')
    await page.click('#browse-panel a[href] >> nth=0')
    await check(`browse "${cuts[i]}" → first option`, href)
  }
  console.log(`ok browse (${cuts.length} cuts)`)

  // 5. Directory filters update the URL and keep the page alive.
  await open('/directory')
  for (const id of ['kind', 'need', 'stage', 'state', 'level', 'status']) {
    const value = await page.$eval(`select#${id}`, (s) => [...s.options].find((o) => o.value)?.value)
    await page.selectOption(`select#${id}`, value)
    if (new URL(page.url()).searchParams.get(id) !== value) fail(`filter ${id}: URL missing ${id}=${value}`)
    if (errors.length) fail(`filter ${id}: error: ${errors[0]}`)
    await page.selectOption(`select#${id}`, '')
  }
  const row = await page.getAttribute('.ptable-row >> nth=0', 'href')
  await page.click('.ptable-row >> nth=0')
  await check('directory row', row)
  console.log('ok directory filters and rows')

  // 6. Save button saves without opening the program, and shows up on /saved.
  await open('/directory')
  await page.click('.ptable li button >> nth=0')
  await page.waitForTimeout(150)
  if (pathOf(page.url()) !== '/directory') fail(`save button navigated to ${pathOf(page.url())}`)
  const badge = await page.$eval('.count-badge', (b) => b.innerText).catch(() => '')
  if (badge !== '1') fail(`save button: badge shows "${badge}", expected 1`)
  await page.click('header a[href="/saved"]')
  await check('saved page', '/saved')
  if (!(await page.$('.ptable-row'))) fail('saved page: saved program not listed')
  console.log('ok save')

  await browser.close()
}

try {
  await run()
} catch (e) {
  fail(`test crashed: ${e.message}`)
} finally {
  server.kill()
}

if (failures.length) {
  console.log(`\n${failures.length} click check(s) failed.`)
  process.exit(1)
}
console.log('\nAll clicks open the right page.')
