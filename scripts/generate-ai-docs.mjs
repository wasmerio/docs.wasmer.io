import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import redirects from '../redirects.config.mjs'
import { transformDocumentation } from './ai-docs/transform.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentRoot = path.join(repoRoot, 'content')
const outputRoot = path.join(repoRoot, 'public', 'ai-docs')

async function findDocumentationFiles(directory) {
  const result = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      result.push(...await findDocumentationFiles(entryPath))
    } else if (/\.mdx?$/.test(entry.name)) {
      result.push(entryPath)
    }
  }
  return result.sort()
}

function pageDescriptor(filePath) {
  const relative = path.relative(contentRoot, filePath).replaceAll(path.sep, '/')
  const withoutExtension = relative.replace(/\.mdx?$/, '')
  const route = withoutExtension === 'index' ? '/' : `/${withoutExtension}`
  return {
    filePath,
    outputPath: `${withoutExtension}.md`,
    route,
  }
}

function aiDocsPath(url) {
  if (!url.startsWith('/ai-docs/')) return undefined
  return decodeURIComponent(url.split(/[?#]/, 1)[0])
}

async function main() {
  const pages = (await findDocumentationFiles(contentRoot)).map(pageDescriptor)
  const routes = new Map(pages.map(page => [page.route, page.outputPath]))
  const assets = new Set()
  const generated = []

  await fs.rm(outputRoot, { recursive: true, force: true })
  await fs.mkdir(outputRoot, { recursive: true })

  for (const page of pages) {
    const source = await fs.readFile(page.filePath, 'utf8')
    const { markdown, tree } = await transformDocumentation({
      assets,
      currentRoute: page.route,
      filePath: page.filePath,
      redirects,
      repoRoot,
      routes,
      source,
    })
    const destination = path.join(outputRoot, page.outputPath)
    await fs.mkdir(path.dirname(destination), { recursive: true })
    await fs.writeFile(destination, markdown)
    generated.push({ ...page, tree })
  }

  for (const asset of assets) {
    const relative = path.relative(path.join(repoRoot, 'assets'), asset)
    const destination = path.join(outputRoot, 'assets', relative)
    await fs.mkdir(path.dirname(destination), { recursive: true })
    await fs.copyFile(asset, destination)
  }

  const validTargets = new Set(pages.map(page => `/ai-docs/${page.outputPath}`))
  for (const asset of assets) {
    const relative = path.relative(path.join(repoRoot, 'assets'), asset).replaceAll(path.sep, '/')
    validTargets.add(`/ai-docs/assets/${relative}`)
  }

  for (const page of generated) {
    visitUrls(page.tree, node => {
      const target = aiDocsPath(node.url)
      if (target && !validTargets.has(target)) {
        throw new Error(`${path.relative(repoRoot, page.filePath)} links to missing ${target}`)
      }
    })
  }

  console.log(`Generated ${pages.length} AI docs pages and ${assets.size} assets in public/ai-docs`)
}

function visitUrls(node, callback) {
  if (node && typeof node === 'object') {
    if (typeof node.url === 'string') callback(node)
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(child => visitUrls(child, callback))
      else if (value && typeof value === 'object') visitUrls(value, callback)
    }
  }
}

await main()
