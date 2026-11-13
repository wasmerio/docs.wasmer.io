import assert from 'node:assert/strict'
import test from 'node:test'
import { pageUrl, renderLlmsFull, renderLlmsTxt, renderRobots, renderSitemap } from '../../scripts/ai-docs/crawl.mjs'

function page(route, outputPath, title, markdown = `# ${title}\n\nBody of ${title}.\n`) {
  return {
    route,
    outputPath,
    markdown,
    tree: {
      type: 'root',
      children: [{ type: 'heading', depth: 1, children: [{ type: 'text', value: title }] }],
    },
  }
}

const pages = [
  page('/edge/get-started', 'edge/get-started.md', 'Get started with Wasmer Edge'),
  page('/', 'index.md', 'Introduction'),
  page('/edge', 'edge.md', 'Wasmer Edge'),
  page('/runtime/a&b', 'runtime/a&b.md', 'A & B'),
]

test('robots.txt allows everything and points to the sitemap', () => {
  assert.equal(renderRobots(), 'User-agent: *\nAllow: /\n\nSitemap: https://docs.wasmer.io/sitemap.xml\n')
})

test('sitemap lists every page once with absolute, escaped URLs', () => {
  const xml = renderSitemap([...pages, pages[0]])
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/)
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])
  assert.deepEqual(locs, [
    'https://docs.wasmer.io/',
    'https://docs.wasmer.io/edge',
    'https://docs.wasmer.io/edge/get-started',
    'https://docs.wasmer.io/runtime/a&amp;b',
  ])
  assert.ok(xml.trimEnd().endsWith('</urlset>'))
})

test('page URLs match the canonical paths of the site', () => {
  assert.equal(pageUrl('/'), 'https://docs.wasmer.io/')
  assert.equal(pageUrl('/edge/get-started'), 'https://docs.wasmer.io/edge/get-started')
})

test('llms.txt links the Markdown mirror, key pages and every page', () => {
  const text = renderLlmsTxt(pages)
  assert.match(text, /^# Wasmer Docs\n\n> /)
  assert.match(text, /https:\/\/docs\.wasmer\.io\/ai-docs\/index\.md/)
  assert.match(text, /https:\/\/docs\.wasmer\.io\/llms-full\.txt/)
  assert.match(text, /## Key pages\n\n- \[Introduction\]\(https:\/\/docs\.wasmer\.io\/ai-docs\/index\.md\)/)
  assert.match(text, /- \[Get started with Wasmer Edge\]\(https:\/\/docs\.wasmer\.io\/ai-docs\/edge\/get-started\.md\): Deploy your first app/)
  const allPages = text.split('## All pages\n\n')[1].trim().split('\n')
  assert.equal(allPages.length, pages.length)
})

test('llms-full.txt contains every page body with its source URL', () => {
  const text = renderLlmsFull(pages)
  assert.match(text, /All 4 pages/)
  for (const { route, title } of pages.map(p => ({ route: p.route, title: p.tree.children[0].children[0].value }))) {
    assert.ok(text.includes(`Source: ${pageUrl(route)}\n\n# ${title}`), title)
  }
})
