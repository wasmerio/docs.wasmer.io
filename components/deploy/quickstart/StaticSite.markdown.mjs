export async function staticSiteToMarkdown(node, context) {
  const image = context.getIdentifierAttribute(node, 'image')

  return [{
    type: 'image',
    url: context.resolveImportedAsset(image, node),
    alt: 'Wasmer Edge static site preview',
  }]
}
