import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import redirects from '../../redirects.config.mjs'
import { transformDocumentation } from '../../scripts/ai-docs/transform.mjs'
import { rewriteDocumentationUrl } from '../../scripts/ai-docs/links.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const routes = new Map([
  ['/', 'index.md'],
  ['/install', 'install.md'],
  ['/runtime', 'runtime.md'],
  ['/runtime/get-started', 'runtime/get-started.md'],
  ['/sdk/wasmer-js', 'sdk/wasmer-js.md'],
  ['/sdk/wasmer-js/explainers/troubleshooting', 'sdk/wasmer-js/explainers/troubleshooting.md'],
  ['/wai', 'wai.md'],
  ['/wai/types', 'wai/types.md'],
])

async function transform(source, file = 'content/runtime/get-started.mdx') {
  return transformDocumentation({
    assets: new Set(),
    currentRoute: '/runtime/get-started',
    filePath: path.join(repoRoot, file),
    redirects,
    repoRoot,
    routes,
    source,
  })
}

test('serializes nested components and imported fragments as Markdown', async () => {
  const { markdown } = await transform(`
import { Callout as Notice, Steps, Tabs, Tab } from '@components/nextra-theme'
import Install from '@components/install.mdx'

<Steps>
### Prepare
<Install />
### Run
<Notice type="warning">Keep this safe.</Notice>
<Tabs items={['CLI', 'JS']}>
  <Tab>
    Use the CLI.
  </Tab>

  <Tab>
    Use JavaScript.
  </Tab>
</Tabs>
</Steps>
`)

  assert.match(markdown, /1\. \*\*Prepare\*\*/)
  assert.match(markdown, /2\. \*\*Install Wasmer\*\*/)
  assert.match(markdown, /> \*\*Warning\*\*/)
  assert.match(markdown, /### CLI/)
  assert.doesNotMatch(markdown, /<(?:Steps|Notice|Tabs|Tab|Install)/)
})

test('serializes cards and file trees', async () => {
  const { markdown } = await transform(`
import { Cards, Card, FileTree } from '@components/nextra-theme'

<Cards>
  <Card title="Runtime" href="/runtime" />
</Cards>

<FileTree>
  <FileTree.Folder name="src" defaultOpen>
    <FileTree.File name="main.rs" />
  </FileTree.Folder>
</FileTree>
`)

  assert.match(markdown, /\[Runtime\]\(\/ai-docs\/runtime\.md\)/)
  assert.match(markdown, /```text\nsrc\/\n {2}main\.rs\n```/)
})

test('rewrites aliases, relative links, and docs.wasmer.io redirects', () => {
  assert.equal(
    rewriteDocumentationUrl('/javascript-sdk/explainers/troubleshooting#node', {
      currentRoute: '/runtime/get-started', redirects, routes,
    }),
    '/ai-docs/sdk/wasmer-js/explainers/troubleshooting.md#node',
  )
  assert.equal(
    rewriteDocumentationUrl('../runtime', {
      currentRoute: '/runtime/get-started', redirects, routes,
    }),
    '/ai-docs/runtime.md',
  )
  assert.equal(
    rewriteDocumentationUrl('https://docs.wasmer.io/runtime', {
      currentRoute: '/', redirects, routes,
    }),
    '/ai-docs/runtime.md',
  )
  assert.equal(
    rewriteDocumentationUrl('./types.md', {
      currentRoute: '/wai', redirects, routes,
    }),
    '/ai-docs/wai/types.md',
  )
})

test('fails precisely for unsupported components and expressions', async () => {
  await assert.rejects(
    transform("import Unknown from '@components/DocsLogo'\n\n<Unknown />"),
    /content\/runtime\/get-started\.mdx:3:1: Import Unknown .* is not a Markdown component/,
  )
  await assert.rejects(
    transform('Hello {runSomething()}'),
    /Unsupported executable MDX expression/,
  )
})
