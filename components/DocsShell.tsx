'use client'

import type { ReactNode } from 'react'
import type { PageMapItem } from 'nextra'
import { usePathname } from 'next/navigation'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import DocsNavbarLinks from './DocsNavbarLinks'

type DocsShellProps = {
  children: ReactNode
  pageMaps: {
    root: PageMapItem[]
    edge: PageMapItem[]
    registry: PageMapItem[]
    sdk: PageMapItem[]
    runtime: PageMapItem[]
  }
}

function getSection(pathname: string) {
  if (pathname === '/edge' || pathname.startsWith('/edge/')) return 'edge'
  if (pathname === '/registry' || pathname.startsWith('/registry/')) return 'registry'
  if (pathname === '/sdk' || pathname.startsWith('/sdk/')) return 'sdk'
  if (pathname === '/runtime' || pathname.startsWith('/runtime/')) return 'runtime'
  return 'root'
}

export default function DocsShell({ children, pageMaps }: DocsShellProps) {
  const pathname = usePathname()
  const section = getSection(pathname)
  const pageMap = pageMaps[section]

  const navbar = (
    <Navbar logo={<b>Wasmer Docs</b>} align="left" className="x:relative">
      <DocsNavbarLinks />
    </Navbar>
  )

  const footer = <Footer>© {new Date().getFullYear()} Wasmer Inc.</Footer>

  return (
    <Layout
      key={section}
      docsRepositoryBase="https://github.com/wasmerio/docs.wasmer.io/tree/main"
      editLink="Edit this page on GitHub"
      feedback={{
        content: 'Question? Give us feedback',
        labels: 'feedback',
      }}
      footer={footer}
      navbar={navbar}
      pageMap={pageMap}
      search={null}
      sidebar={{
        defaultMenuCollapseLevel: 1,
        toggleButton: true,
      }}
    >
      {children}
    </Layout>
  )
}
