const sectionOrder = [
  ['general', 'General'],
  ['runtime', 'Wasmer Runtime'],
  ['registry', 'Wasmer Registry'],
  ['edge', 'Wasmer Edge'],
  ['sdk', 'SDKs'],
  ['wasmer-pack', 'Wasmer Pack'],
  ['wai', 'WAI'],
]

function nodeText(node) {
  if (typeof node?.value === 'string') return node.value
  return (node?.children || []).map(nodeText).join('')
}

function fallbackTitle(outputPath) {
  if (outputPath === 'index.md') return 'Introduction'
  const filename = outputPath.split('/').at(-1).replace(/\.md$/, '')
  return filename
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function sectionFor(outputPath) {
  const section = outputPath.split('/')[0].replace(/\.md$/, '')
  return sectionOrder.some(([key]) => key === section) ? section : 'general'
}

function escapeLinkText(value) {
  return value.replaceAll('[', '\\[').replaceAll(']', '\\]')
}

export function getPageTitle(page) {
  const heading = page.tree?.children?.find(node => node.type === 'heading' && node.depth === 1)
  const title = nodeText(heading).trim()
  return title || fallbackTitle(page.outputPath)
}

export function renderPageIndex(pages) {
  const sections = new Map(sectionOrder.map(([key]) => [key, []]))

  for (const page of [...pages].sort((left, right) => left.outputPath.localeCompare(right.outputPath))) {
    const section = sectionFor(page.outputPath)
    const title = escapeLinkText(getPageTitle(page))
    sections.get(section).push(`- [${title}](/ai-docs/${page.outputPath})`)
  }

  const output = [
    '## Documentation index',
    '',
    `This generated index lists all ${pages.length} pages in the AI-agent Markdown documentation.`,
  ]

  for (const [key, label] of sectionOrder) {
    const links = sections.get(key)
    if (!links.length) continue
    output.push('', `### ${label}`, '', ...links)
  }

  return `${output.join('\n')}\n`
}
