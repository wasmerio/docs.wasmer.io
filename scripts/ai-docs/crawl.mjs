import { getPageTitle } from './index.mjs'

// Files for search engines and AI assistants, generated from the same page list as the
// AI-agent Markdown mirror in public/ai-docs.

export const SITE_ORIGIN = 'https://docs.wasmer.io'

// Short list of starting points for llms.txt, in reading order. Every other page is in the full index.
const KEY_PAGES = [
  ['/', 'What Wasmer is and how the docs are organised'],
  ['/edge', 'Wasmer Edge: hosting for websites and apps'],
  ['/edge/get-started', 'Deploy your first app on Wasmer Edge'],
  ['/edge/learn/supported-frameworks-and-languages', 'Frameworks and languages Wasmer Edge supports'],
  ['/edge/wordpress-hosting/overview', 'Host WordPress on Wasmer Edge'],
  ['/edge/configuration', 'App configuration reference'],
  ['/edge/faq', 'Wasmer Edge FAQ'],
  ['/runtime', 'Wasmer Runtime: run WebAssembly anywhere'],
  ['/registry', 'Wasmer Registry: publish and share packages'],
  ['/graphql-api', 'GraphQL API'],
]

export function pageUrl(route) {
  return route === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route}`
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

/** sitemap.xml listing every documentation page once, sorted by route. */
export function renderSitemap(pages) {
  const routes = [...new Set(pages.map(page => page.route))].sort()
  const urls = routes.map(route => `  <url>\n    <loc>${escapeXml(pageUrl(route))}</loc>\n  </url>`)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

export function renderRobots() {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_ORIGIN}/sitemap.xml`, ''].join('\n')
}

function escapeLinkText(value) {
  return value.replaceAll('[', '\\[').replaceAll(']', '\\]')
}

/** llms.txt: what the docs cover, the key pages, and a link to every page's Markdown copy. */
export function renderLlmsTxt(pages) {
  const byRoute = new Map(pages.map(page => [page.route, page]))
  const keyPages = KEY_PAGES.filter(([route]) => byRoute.has(route)).map(([route, summary]) => {
    const page = byRoute.get(route)
    const title = escapeLinkText(getPageTitle(page))
    return `- [${title}](${SITE_ORIGIN}/ai-docs/${page.outputPath}): ${summary}. Web page: ${pageUrl(route)}`
  })
  const allPages = [...pages]
    .sort((left, right) => left.outputPath.localeCompare(right.outputPath))
    .map(page => `- [${escapeLinkText(getPageTitle(page))}](${SITE_ORIGIN}/ai-docs/${page.outputPath})`)

  return [
    '# Wasmer Docs',
    '',
    '> Documentation for Wasmer: Wasmer Edge (hosting for websites and apps on a global edge network, with a free Hobby plan), the Wasmer Runtime (run WebAssembly anywhere) and the Wasmer Registry (publish and share packages).',
    '',
    `Every page is also available as plain Markdown under ${SITE_ORIGIN}/ai-docs/. Start at ${SITE_ORIGIN}/ai-docs/index.md, or read everything in one file at ${SITE_ORIGIN}/llms-full.txt.`,
    '',
    '## Key pages',
    '',
    ...keyPages,
    '',
    '## Wasmer website',
    '',
    '- [Pricing](https://wasmer.io/pricing): Hobby plan is free for personal, non-commercial projects; Pro is for commercial use.',
    '- [Templates](https://wasmer.io/templates): Starter templates you can deploy in one click.',
    '- [wasmer.io llms.txt](https://wasmer.io/llms.txt): Product overview and how to deploy.',
    '',
    '## All pages',
    '',
    ...allPages,
    '',
  ].join('\n')
}

/** llms-full.txt: every Markdown page in one file, each preceded by its source URL. */
export function renderLlmsFull(pages) {
  const sections = [...pages]
    .sort((left, right) => left.outputPath.localeCompare(right.outputPath))
    .map(page => `---\n\nSource: ${pageUrl(page.route)}\n\n${page.markdown.trim()}\n`)
  return [
    '# Wasmer Docs (full text)',
    '',
    `> All ${pages.length} pages of ${SITE_ORIGIN}, as Markdown. Index: ${SITE_ORIGIN}/llms.txt`,
    '',
    ...sections,
  ].join('\n')
}
