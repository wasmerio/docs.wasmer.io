import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import '../styles/global.css'

export const metadata: Metadata = {
  title: {
    default: 'Wasmer Docs',
    template: '%s | Wasmer Docs',
  },
  description: 'Documentation for Wasmer products and developer tools.',
  metadataBase: new URL('https://docs.wasmer.io'),
}

const navbar = <Navbar logo={<b>Wasmer Docs</b>} />

const footer = (
  <Footer>© {new Date().getFullYear()} Wasmer Inc.</Footer>
)

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          docsRepositoryBase="https://github.com/wasmerio/docs.wasmer.io/tree/main"
          editLink="Edit this page on GitHub"
          feedback={{
            content: 'Question? Give us feedback',
            labels: 'feedback',
          }}
          footer={footer}
          navbar={navbar}
          pageMap={await getPageMap()}
          search={null}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            toggleButton: true,
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
