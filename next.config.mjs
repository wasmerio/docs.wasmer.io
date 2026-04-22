import nextra from 'nextra'
import redirects from './redirects.config.mjs'

const withNextra = nextra({})

export default withNextra({
  output: 'export',
  images: {
    unoptimized: true,
  },
  async redirects() {
    return redirects
  }
})
