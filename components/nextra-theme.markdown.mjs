function paragraph(children) {
  return { type: 'paragraph', children }
}

function strongLabel(label) {
  return paragraph([
    { type: 'strong', children: [{ type: 'text', value: label }] },
  ])
}

export async function calloutToMarkdown(node, context) {
  const type = context.getOptionalStringAttribute(node, 'type') || 'note'
  const emoji = context.getOptionalStringAttribute(node, 'emoji')
  const labels = {
    default: 'Note',
    error: 'Caution',
    info: 'Info',
    note: 'Note',
    warning: 'Warning',
  }
  const label = `${emoji ? `${emoji} ` : ''}${labels[type] || type}`
  const children = await context.transformChildren(node)

  return [{
    type: 'blockquote',
    children: [strongLabel(label), ...context.toBlocks(children)],
  }]
}

export async function cardToMarkdown(node, context) {
  const title = context.getStringAttribute(node, 'title')
  const href = context.getStringAttribute(node, 'href')

  return [paragraph([{
    type: 'link',
    url: href,
    children: [{ type: 'text', value: title }],
  }])]
}

export async function cardsToMarkdown(node, context) {
  const items = []

  for (const child of node.children || []) {
    if (context.isWhitespace(child)) continue
    if (context.resolveComponentName(child) !== 'Card') {
      context.fail(child, 'Cards may only contain Card components')
    }

    const blocks = context.toBlocks(await context.transformNode(child))
    items.push({ type: 'listItem', children: blocks })
  }

  return [{ type: 'list', ordered: false, spread: false, children: items }]
}

export async function tabsToMarkdown(node, context) {
  const labels = context.getStringArrayAttribute(node, 'items')
  const tabs = (node.children || []).filter(child => !context.isWhitespace(child))

  if (tabs.length !== labels.length) {
    context.fail(
      node,
      `Tabs has ${labels.length} labels but ${tabs.length} Tab children`,
    )
  }

  const result = []
  for (let index = 0; index < tabs.length; index += 1) {
    const tab = tabs[index]
    if (context.resolveComponentName(tab) !== 'Tab') {
      context.fail(tab, 'Tabs may only contain Tab components')
    }

    result.push({
      type: 'heading',
      depth: 3,
      data: { aiDocsTabHeading: true },
      children: [{ type: 'text', value: labels[index] }],
    })
    result.push(...context.toBlocks(await context.transformChildren(tab)))
  }

  return result
}

export async function tabToMarkdown(node, context) {
  context.fail(node, 'Tab must be a direct child of Tabs')
}

export async function stepsToMarkdown(node, context) {
  const groups = []
  let current

  for (const child of node.children || []) {
    const transformed = await context.transformNode(child)
    for (const block of context.toBlocks(transformed)) {
      const isStepHeading = block.type === 'heading'
        && block.depth === 3
        && !block.data?.aiDocsTabHeading

      if (isStepHeading) {
        current = {
          type: 'listItem',
          children: [paragraph([{
            type: 'strong',
            children: block.children,
          }])],
        }
        groups.push(current)
        continue
      }

      if (!current) {
        current = { type: 'listItem', children: [] }
        groups.push(current)
      }
      current.children.push(block)
    }
  }

  return [{ type: 'list', ordered: true, start: 1, spread: true, children: groups }]
}

function renderFileTreeChildren(children, context, depth, lines) {
  for (const child of children || []) {
    if (context.isWhitespace(child)) continue
    const name = context.resolveComponentName(child)
    const indent = '  '.repeat(depth)

    if (name === 'FileTree.File') {
      lines.push(`${indent}${context.getStringAttribute(child, 'name')}`)
      continue
    }

    if (name === 'FileTree.Folder') {
      const folderName = context.getStringAttribute(child, 'name')
      lines.push(`${indent}${folderName.endsWith('/') ? folderName : `${folderName}/`}`)
      renderFileTreeChildren(child.children, context, depth + 1, lines)
      continue
    }

    context.fail(child, 'FileTree may only contain FileTree.Folder and FileTree.File')
  }
}

export async function fileTreeToMarkdown(node, context) {
  const lines = []
  renderFileTreeChildren(node.children, context, 0, lines)
  return [{ type: 'code', lang: 'text', value: lines.join('\n') }]
}

export async function fileTreeChildToMarkdown(node, context) {
  context.fail(node, `${context.resolveComponentName(node)} must be inside FileTree`)
}

export const nextraMarkdownComponents = {
  Callout: calloutToMarkdown,
  Card: cardToMarkdown,
  Cards: cardsToMarkdown,
  FileTree: fileTreeToMarkdown,
  'FileTree.File': fileTreeChildToMarkdown,
  'FileTree.Folder': fileTreeChildToMarkdown,
  Steps: stepsToMarkdown,
  Tab: tabToMarkdown,
  Tabs: tabsToMarkdown,
}
