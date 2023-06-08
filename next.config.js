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
        destination: '/runtime/developers/build-from-source',
        permanent: true,
      },
      {
        source: '/ecosystem/wasmer/building-from-source',
        destination: '/runtime/developers/testing',
        permanent: true,
      },

    ];
  },
}
