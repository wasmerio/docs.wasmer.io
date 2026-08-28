import path from 'node:path'

const INTERNAL_DOCS_HOSTS = new Set(['docs.wasmer.io', 'www.docs.wasmer.io'])

function splitSuffix(url) {
  const match = url.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/)
  return {
    pathname: match?.[1] || '',
    suffix: `${match?.[2] || ''}${match?.[3] || ''}`,
  }
}

function applyRedirect(pathname, redirects) {
  let current = pathname

  for (let attempt = 0; attempt < 10; attempt += 1) {
    let destination

    for (const redirect of redirects) {
      if (redirect.source.includes(':path*')) {
        const [prefix] = redirect.source.split('/:path*')
        if (current === prefix || current.startsWith(`${prefix}/`)) {
          const rest = current.slice(prefix.length).replace(/^\//, '')
          destination = redirect.destination.replace(':path*', rest)
          break
        }
      } else if (redirect.source === current) {
        destination = redirect.destination
        break
      }
    }

    if (!destination || destination === current) return current
    if (/^[a-z][a-z+.-]*:/i.test(destination)) return destination
    current = path.posix.normalize(`/${destination.replace(/^\//, '')}`)
  }

  throw new Error(`Redirect loop while resolving ${pathname}`)
}

function routeCandidate(pathname) {
  let candidate = path.posix.normalize(`/${pathname.replace(/^\//, '')}`)
  candidate = candidate.replace(/\/(?:index)?\.(?:md|mdx)$/i, '') || '/'
  candidate = candidate.replace(/\.(?:md|mdx)$/i, '')
  candidate = candidate.replace(/\/$/, '') || '/'
  return candidate
}

export function rewriteDocumentationUrl(url, {
  currentRoute,
  redirects,
  routes,
}) {
  if (!url || url.startsWith('#')) return url

  let rawPath = url

  if (/^[a-z][a-z+.-]*:/i.test(url)) {
    let parsed
    try {
      parsed = new URL(url)
    } catch {
      return url
    }
    if (!INTERNAL_DOCS_HOSTS.has(parsed.hostname)) return url
    rawPath = `${parsed.pathname}${parsed.search}${parsed.hash}`
  } else if (url.startsWith('//')) {
    return url
  }

  const { pathname, suffix } = splitSuffix(rawPath)
  if (!pathname) return url

  const candidates = pathname.startsWith('/')
    ? [pathname]
    : [
        path.posix.resolve(path.posix.dirname(currentRoute), pathname),
        path.posix.resolve(currentRoute, pathname),
      ]

  for (const candidate of new Set(candidates)) {
    const redirected = applyRedirect(routeCandidate(candidate), redirects)
    if (/^[a-z][a-z+.-]*:/i.test(redirected)) return `${redirected}${suffix}`

    const outputPath = routes.get(routeCandidate(redirected))
    if (outputPath) return `/ai-docs/${outputPath}${suffix}`
  }

  return url
}
