export async function calloutProFeatureToMarkdown() {
  return [{
    type: 'blockquote',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'strong', children: [{ type: 'text', value: 'Plan requirement' }] },
        ],
      },
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'This feature is only available for Pro and Enterprise plans. ' },
          {
            type: 'link',
            url: 'https://wasmer.io/pro',
            children: [{ type: 'text', value: 'Upgrade your account to Pro' }],
          },
          { type: 'text', value: '.' },
        ],
      },
    ],
  }]
}
