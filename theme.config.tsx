import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>Wasmer Docs</span>,
  project: {
    link: 'https://github.com/wasmerio/docs.wasmer.io',
  },
  chat: {
    link: 'https://discord.gg/qBTfsNP7N8',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1
  },
  docsRepositoryBase: 'https://github.com/wasmerio/docs.wasmer.io',
  footer: {
    text: 'Wasmer Docs',
  },
}

export default config
