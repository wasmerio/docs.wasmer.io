import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import DocsShell from '../components/DocsShell'
import '../styles/global.css'

export const metadata: Metadata = {
  title: {
    default: 'Wasmer Docs',
    template: '%s | Wasmer Docs',
  },
  description: 'Documentation for Wasmer products and developer tools.',
  metadataBase: new URL('https://docs.wasmer.io'),
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [rootPageMap, edgePageMap, registryPageMap, sdkPageMap, runtimePageMap] =
    await Promise.all([
      getPageMap('/'),
      getPageMap('/edge'),
      getPageMap('/registry'),
      getPageMap('/sdk'),
      getPageMap('/runtime'),
    ])

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <DocsShell
          pageMaps={{
            root: rootPageMap,
            edge: edgePageMap,
            registry: registryPageMap,
            sdk: sdkPageMap,
            runtime: runtimePageMap,
          }}
        >
          {children}
        </DocsShell>
      </body>
    </html>
  )
}
