import fs from 'node:fs/promises'
import path from 'node:path'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { classifyComponentImport, markdownComponentRegistry } from './components.mjs'
import { rewriteDocumentationUrl } from './links.mjs'

function parserFor(filePath) {
  const processor = unified().use(remarkParse).use(remarkGfm)
  if (filePath.endsWith('.mdx')) processor.use(remarkMdx)
  return processor
}

function stringify(tree) {
  return unified()
    .use(remarkGfm)
    .use(remarkStringify, {
      bullet: '-',
      fences: true,
      listItemIndent: 'one',
    })
    .stringify(tree)
}

function location(node) {
  const start = node?.position?.start
  return start ? `${start.line}:${start.column}` : 'unknown location'
}

function expressionValue(value, node, fail) {
  const program = value?.data?.estree
  const expression = program?.body?.[0]?.expression
  if (!expression) fail(node, 'Expected a static attribute expression')

  if (expression.type === 'Literal') return expression.value
  if (expression.type === 'Identifier') return { identifier: expression.name }
  if (expression.type === 'ArrayExpression') {
    return expression.elements.map(element => {
      if (element?.type !== 'Literal' || typeof element.value !== 'string') {
        fail(node, 'Only string literals are supported in attribute arrays')
      }
      return element.value
    })
  }

  fail(node, `Unsupported dynamic attribute expression ${expression.type}`)
}

function attributeValue(node, name, fail) {
  const attribute = node.attributes?.find(item => item.type === 'mdxJsxAttribute' && item.name === name)
  if (!attribute) return undefined
  if (attribute.value === null) return true
  if (typeof attribute.value === 'string') return attribute.value
  return expressionValue(attribute.value, attribute, fail)
}

async function resolveModule(repoRoot, fromFile, source) {
  let candidate
  if (source.startsWith('@components/')) {
    candidate = path.join(repoRoot, 'components', source.slice('@components/'.length))
  } else if (source.startsWith('@assets/')) {
    candidate = path.join(repoRoot, 'assets', source.slice('@assets/'.length))
  } else if (source.startsWith('.')) {
    candidate = path.resolve(path.dirname(fromFile), source)
  } else {
    return source
  }

  const cleanCandidate = candidate.replace(/\?.*$/, '')
  for (const extension of ['', '.tsx', '.ts', '.jsx', '.js', '.mdx', '.md']) {
    const resolved = `${cleanCandidate}${extension}`
    try {
      const stat = await fs.stat(resolved)
      if (stat.isFile()) return resolved
    } catch {
      // Try the next supported extension.
    }
  }

  return cleanCandidate
}

function normaliseBlocks(nodes) {
  const result = []
  let phrasing = []

  const flush = () => {
    if (phrasing.length) result.push({ type: 'paragraph', children: phrasing })
    phrasing = []
  }

  for (const node of nodes || []) {
    if (['break', 'delete', 'emphasis', 'footnoteReference', 'image', 'imageReference', 'inlineCode', 'link', 'linkReference', 'strong', 'text'].includes(node.type)) {
      phrasing.push(node)
    } else {
      flush()
      result.push(node)
    }
  }
  flush()
  return result
}

function isWhitespace(node) {
  if (node?.type === 'text') return !node.value.trim()
  if (node?.type === 'mdxFlowExpression' || node?.type === 'mdxTextExpression') {
    const value = node.value.trim()
    return !value || value.startsWith('/*')
  }
  return false
}

export async function transformDocumentation({
  assets,
  currentRoute,
  filePath,
  redirects = [],
  repoRoot,
  routes,
  source,
}) {
  const imports = new Map()
  const fragmentStack = new Set([filePath])

  const fail = (node, message, activeFile = filePath) => {
    throw new Error(`${path.relative(repoRoot, activeFile)}:${location(node)}: ${message}`)
  }

  async function collectImports(tree, activeFile) {
    const activeImports = new Map()
    const esmNodes = []
    visit(tree, 'mdxjsEsm', node => esmNodes.push(node))

    for (const node of esmNodes) {
      const statements = node.data?.estree?.body || []
      for (const statement of statements) {
        if (statement.type !== 'ImportDeclaration') {
          fail(node, `Unsupported executable MDX statement ${statement.type}`, activeFile)
        }

        const sourceName = statement.source.value
        const resolvedPath = await resolveModule(repoRoot, activeFile, sourceName)
        for (const specifier of statement.specifiers) {
          const imported = specifier.type === 'ImportSpecifier'
            ? specifier.imported.name
            : 'default'
          const classified = classifyComponentImport({
            imported,
            repoRoot,
            resolvedPath,
            source: sourceName,
          })
          activeImports.set(specifier.local.name, {
            ...classified,
            imported,
            source: sourceName,
          })
        }
      }
    }

    return activeImports
  }

  async function transformTree(tree, activeFile) {
    const previousImports = new Map(imports)
    imports.clear()
    for (const [name, value] of await collectImports(tree, activeFile)) imports.set(name, value)

    const context = {
      fail: (node, message) => fail(node, message, activeFile),
      getIdentifierAttribute(node, name) {
        const value = attributeValue(node, name, context.fail)
        if (!value || typeof value !== 'object' || !value.identifier) {
          context.fail(node, `${name} must reference an imported asset`)
        }
        return value.identifier
      },
      getOptionalStringAttribute(node, name) {
        const value = attributeValue(node, name, context.fail)
        if (value === undefined) return undefined
        if (typeof value !== 'string') context.fail(node, `${name} must be a static string`)
        return value
      },
      getStringArrayAttribute(node, name) {
        const value = attributeValue(node, name, context.fail)
        if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
          context.fail(node, `${name} must be a static string array`)
        }
        return value
      },
      getStringAttribute(node, name) {
        const value = context.getOptionalStringAttribute(node, name)
        if (value === undefined) context.fail(node, `Missing required ${name} attribute`)
        return value
      },
      isWhitespace,
      resolveComponentName(node) {
        if (!node || !['mdxJsxFlowElement', 'mdxJsxTextElement'].includes(node.type)) return undefined
        if (!node.name) return undefined
        const [base, ...parts] = node.name.split('.')
        if (/^[a-z]/.test(base)) return node.name
        const imported = imports.get(base)
        if (!imported) context.fail(node, `Component ${base} is not imported`)
        if (imported.kind === 'component') {
          return [imported.name, ...parts].join('.')
        }
        if (imported.kind === 'fragment') return base
        context.fail(node, `Import ${base} from ${imported.source} is not a Markdown component`)
      },
      resolveImportedAsset(identifier, node) {
        const imported = imports.get(identifier)
        if (imported?.kind !== 'asset') {
          context.fail(node, `${identifier} is not an imported asset`)
        }
        const relative = path.relative(path.join(repoRoot, 'assets'), imported.path)
        if (relative.startsWith('..')) context.fail(node, `Asset ${identifier} is outside assets/`)
        assets.add(imported.path)
        return `/ai-docs/assets/${relative.replaceAll(path.sep, '/')}`
      },
      toBlocks: normaliseBlocks,
      transformChildren: async node => {
        const transformed = []
        for (const child of node.children || []) transformed.push(...await transformNode(child, context, activeFile))
        return transformed
      },
      transformNode: node => transformNode(node, context, activeFile),
    }

    const children = []
    for (const child of tree.children) children.push(...await transformNode(child, context, activeFile))

    imports.clear()
    for (const [name, value] of previousImports) imports.set(name, value)
    return { type: 'root', children: normaliseBlocks(children) }
  }

  async function transformFragment(imported, node, context) {
    if (imported.fragmentKind === 'omit') return []
    if (fragmentStack.has(imported.path)) context.fail(node, `Circular MDX fragment import ${imported.source}`)

    fragmentStack.add(imported.path)
    try {
      const fragmentSource = await fs.readFile(imported.path, 'utf8')
      const fragmentTree = parserFor(imported.path).parse(fragmentSource)

      if (imported.fragmentKind === 'terminal') {
        const code = fragmentTree.children.find(child => child.type === 'code')
        if (!code) context.fail(node, `Terminal fragment ${imported.source} must contain a code block`)
        return [{ type: 'inlineCode', value: code.value.replace(/\s*\n\s*/g, ' ') }]
      }

      return (await transformTree(fragmentTree, imported.path)).children
    } finally {
      fragmentStack.delete(imported.path)
    }
  }

  async function transformHtml(node, context, activeFile) {
    if (node.name === 'br') return [{ type: 'break' }]
    if (node.name === 'a') {
      const href = context.getStringAttribute(node, 'href')
      return [{ type: 'link', url: href, children: await context.transformChildren(node) }]
    }
    if (node.name === 'li') {
      return [{ type: 'listItem', children: normaliseBlocks(await context.transformChildren(node)) }]
    }
    if (node.name === 'ol') {
      const items = []
      for (const child of node.children || []) {
        if (isWhitespace(child)) continue
        if (child.name !== 'li') fail(child, 'ol may only contain li elements', activeFile)
        items.push(...await transformHtml(child, context, activeFile))
      }
      return [{ type: 'list', ordered: true, start: 1, spread: false, children: items }]
    }
    fail(node, `Unsupported HTML element <${node.name}>`, activeFile)
  }

  async function transformNode(node, context, activeFile) {
    if (node.type === 'mdxjsEsm') return []

    if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') {
      const value = node.value.trim()
      if (!value || value.startsWith('/*')) return []
      if (/^[A-Za-z_$][\w$]*$/.test(value)) return [{ type: 'text', value: `{${value}}` }]
      if (/^(["']).*\1$/s.test(value)) {
        try {
          return [{ type: 'text', value: JSON.parse(value.replace(/^'/, '"').replace(/'$/, '"')) }]
        } catch {
          fail(node, 'Unsupported string expression', activeFile)
        }
      }
      fail(node, 'Unsupported executable MDX expression', activeFile)
    }

    if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
      if (node.name && /^[a-z]/.test(node.name)) return transformHtml(node, context, activeFile)
      const [base] = (node.name || '').split('.')
      const imported = imports.get(base)
      if (!imported) fail(node, `Component ${node.name || '(fragment)'} is not imported`, activeFile)
      if (imported.kind === 'fragment') return transformFragment(imported, node, context)

      const componentName = context.resolveComponentName(node)
      const serializer = markdownComponentRegistry[componentName]
      if (!serializer) fail(node, `No Markdown serializer registered for ${componentName}`, activeFile)
      return serializer(node, context)
    }

    if (!node.children) return [{ ...node }]

    const children = []
    for (const child of node.children) children.push(...await transformNode(child, context, activeFile))
    return [{ ...node, children }]
  }

  const tree = parserFor(filePath).parse(source)
  const transformed = await transformTree(tree, filePath)

  visit(transformed, ['link', 'definition'], node => {
    node.url = rewriteDocumentationUrl(node.url, { currentRoute, redirects, routes })
  })

  visit(transformed, node => {
    if (node.type.startsWith('mdx')) fail(node, `Unconverted MDX node ${node.type}`)
  })

  const markdown = stringify(transformed)
  unified().use(remarkParse).use(remarkGfm).parse(markdown)
  return { markdown, tree: transformed }
}
