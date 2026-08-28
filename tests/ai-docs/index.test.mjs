import assert from 'node:assert/strict'
import test from 'node:test'
import { getPageTitle, renderPageIndex } from '../../scripts/ai-docs/index.mjs'

function page(outputPath, title) {
  return {
    outputPath,
    tree: title
      ? {
          type: 'root',
          children: [{
            type: 'heading',
            depth: 1,
            children: [{ type: 'text', value: title }],
          }],
        }
      : { type: 'root', children: [] },
  }
}

test('builds a grouped index containing every generated page', () => {
  const pages = [
    page('index.md', 'Introduction'),
    page('edge/get-started.md', 'Get started with Wasmer Edge'),
    page('runtime/wasix.md', 'WASIX'),
    page('graphql-api.md', 'GraphQL API'),
  ]

  const markdown = renderPageIndex(pages)

  assert.match(markdown, /lists all 4 pages/)
  assert.match(markdown, /### General/)
  assert.match(markdown, /### Wasmer Runtime/)
  assert.match(markdown, /### Wasmer Edge/)
  assert.match(markdown, /\[Introduction\]\(\/ai-docs\/index\.md\)/)
  assert.match(markdown, /\[Get started with Wasmer Edge\]\(\/ai-docs\/edge\/get-started\.md\)/)
})

test('uses the output filename when a page has no level-one heading', () => {
  assert.equal(getPageTitle(page('edge/custom-domains.md')), 'Custom Domains')
})
