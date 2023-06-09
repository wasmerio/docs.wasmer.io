const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = {
  ...withNextra(),
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Runtime
      {
        source: '/ecosystem/wasmer',
        destination: '/runtime',
        permanent: true,
      },
      {
        source: '/ecosystem/wasmer/getting-started',
        destination: '/runtime/get-started',
        permanent: true,
      },
      {
        source: '/ecosystem/wasmer/usage',
        destination: '/runtime/cli',
        permanent: true,
      },
      {
        source: '/ecosystem/wasmer/wasmer-features',
        destination: '/runtime/features',
        permanent: true,
      },
      {
        source: '/ecosystem/wasmer/building-from-source',
        destination: '/developers/build-from-source',
        permanent: true,
      },
      {
        source: '/ecosystem/wasmer/building-from-source/testing',
        destination: '/developers/testing',
        permanent: true,
      },

      // Registry
      {
        source: '/ecosystem/wapm',
        destination: '/registry',
        permanent: true,
      },
      {
        source: '/ecosystem/wapm/getting-started',
        destination: '/registry/get-started',
        permanent: true,
      },
      {
        source: '/ecosystem/wapm/publishing-your-package',
        destination: '/registry/publish',
        permanent: true,
      },
      {
        source: '/ecosystem/wapm/manifest',
        destination: '/registry/manifest',
        permanent: true,
      },
      {
        source: '/ecosystem/wapm/graphql-api',
        destination: '/developers/graphql-api',
        permanent: true,
      },
    ];
  },
}
