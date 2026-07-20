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

// Self-hosted Umami analytics (analytics.wasmer.io). Both values are baked in
// at build time, so local dev and preview builds send nothing unless they are
// set. They ship to the browser, so they are public — repo variables, not
// secrets.
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC

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
      <Head>
        {umamiWebsiteId && umamiSrc && (
          <script defer src={umamiSrc} data-website-id={umamiWebsiteId} />
        )}
      </Head>
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
