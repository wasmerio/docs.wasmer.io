import {
  generateStaticParamsFor,
  importPage,
} from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

type PageProps = {
  params: Promise<{
    mdxPath?: string[]
  }>
}

export const generateStaticParams = generateStaticParamsFor('mdxPath')

// Canonical path for a docs page: `/` for the index, `/edge/get-started` for nested pages.
// Resolved against `metadataBase` (https://docs.wasmer.io) in app/layout.tsx.
function canonicalPath(mdxPath?: string[]) {
  return mdxPath?.length ? `/${mdxPath.join('/')}` : '/'
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)

  return {
    ...metadata,
    alternates: {
      ...metadata?.alternates,
      canonical: canonicalPath(params.mdxPath),
    },
  }
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: PageProps) {
  const params = await props.params
  const {
    default: MDXContent,
    metadata,
    sourceCode,
    toc,
  } = await importPage(params.mdxPath)

  return (
    <Wrapper metadata={metadata} sourceCode={sourceCode} toc={toc}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
