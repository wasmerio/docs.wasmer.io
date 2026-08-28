import path from 'node:path'
import { calloutProFeatureToMarkdown } from '../../components/CalloutProFeature.markdown.mjs'
import { imageLoaderToMarkdown } from '../../components/ImageLoader.markdown.mjs'
import { nextraMarkdownComponents } from '../../components/nextra-theme.markdown.mjs'
import { staticSiteToMarkdown } from '../../components/deploy/quickstart/StaticSite.markdown.mjs'

export const markdownComponentRegistry = {
  ...nextraMarkdownComponents,
  CalloutProFeature: calloutProFeatureToMarkdown,
  ImageLoader: imageLoaderToMarkdown,
  StaticSite: staticSiteToMarkdown,
}

const componentNamesByModule = new Map([
  ['CalloutProFeature', 'CalloutProFeature'],
  ['ImageLoader', 'ImageLoader'],
  ['deploy/quickstart/StaticSite', 'StaticSite'],
])

const fragmentKinds = new Map([
  ['install.mdx', 'include'],
  ['login.mdx', 'include'],
  ['register.mdx', 'include'],
  ['deploy/CliVersionCallout.mdx', 'omit'],
  ['deploy/quickstart/TerminalLeft.mdx', 'terminal'],
  ['deploy/quickstart/TerminalRight.mdx', 'terminal'],
])

export function classifyComponentImport({
  imported,
  repoRoot,
  resolvedPath,
  source,
}) {
  const componentsRoot = path.join(repoRoot, 'components')
  const assetsRoot = path.join(repoRoot, 'assets')

  if (resolvedPath.startsWith(`${assetsRoot}${path.sep}`)) {
    return { kind: 'asset', path: resolvedPath }
  }

  if (!resolvedPath.startsWith(`${componentsRoot}${path.sep}`)) {
    return { kind: 'unknown', source }
  }

  const relative = path.relative(componentsRoot, resolvedPath).replaceAll(path.sep, '/')
  const withoutExtension = relative.replace(/\.(?:[cm]?[jt]sx?|mdx)$/, '')

  if (withoutExtension === 'nextra-theme') {
    return { kind: 'component', name: imported }
  }

  const componentName = componentNamesByModule.get(withoutExtension)
  if (componentName) return { kind: 'component', name: componentName }

  if (withoutExtension === 'GitHubLogo' || withoutExtension === 'icons/ProductIcons') {
    return { kind: 'visual-only' }
  }

  if (relative.endsWith('.mdx')) {
    const fragmentKind = fragmentKinds.get(relative)
    if (!fragmentKind) return { kind: 'unknown-fragment', source, path: resolvedPath }
    return { kind: 'fragment', fragmentKind, path: resolvedPath }
  }

  return { kind: 'unknown', source }
}
