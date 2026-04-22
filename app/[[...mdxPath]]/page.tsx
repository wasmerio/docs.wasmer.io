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

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)

  return metadata
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
