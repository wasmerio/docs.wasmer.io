export async function imageLoaderToMarkdown(node, context) {
  const image = context.getIdentifierAttribute(node, 'img')
  const alt = context.getStringAttribute(node, 'alt')

  return [{
    type: 'image',
    url: context.resolveImportedAsset(image, node),
    alt,
  }]
}
