import nextra from 'nextra'

const withNextra = nextra({})

export default withNextra({
  output: 'export',
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Runtime
      {
        source: "/ecosystem/wasmer",
        destination: "/runtime",
        permanent: true,
      },
      {
        source: "/ecosystem/wasmer/getting-started",
        destination: "/runtime/get-started",
        permanent: true,
      },
      {
        source: "/ecosystem/wasmer/usage",
        destination: "/runtime/cli",
        permanent: true,
      },
      {
        source: "/ecosystem/wasmer/wasmer-features",
        destination: "/runtime/features",
        permanent: true,
      },
      {
        source: "/ecosystem/wasmer/building-from-source",
        destination: "/developers/build-from-source",
        permanent: true,
      },
      {
        source: "/ecosystem/wasmer/building-from-source/testing",
        destination: "/developers/testing",
        permanent: true,
      },

      // Registry
      {
        source: "/ecosystem/wapm",
        destination: "/registry",
        permanent: true,
      },
      {
        source: "/ecosystem/wapm/getting-started",
        destination: "/registry/get-started",
        permanent: true,
      },
      {
        source: "/ecosystem/wapm/publishing-your-package",
        destination: "/registry/get-started",
        permanent: true,
      },
      {
        source: "/ecosystem/wapm/manifest",
        destination: "/registry/manifest",
        permanent: true,
      },
      {
        source: "/ecosystem/wapm/graphql-api",
        destination: "/developers/graphql-api",
        permanent: true,
      },
       
      // Deprecated
      {
        source: "/developers/build-from-source",
        destination: "https://github.com/wasmerio/wasmer/blob/main/docs/BUILD.md",
        permanent: true,
      },
      {
        source: "/developers/testing",
        destination: "https://github.com/wasmerio/wasmer/blob/main/docs/TEST.md",
        permanent: true,
      },
      {
        source: "/developers/graphql-api",
        destination:"/graphql-api",
        permanent: true,
      },
      {
        source: "/registry/search",
        destination:"/registry/discover",
        permanent: true,
      },
      {
        source: "/javascript-sdk",
        destination:"/sdk/wasmer-js",
        permanent: true,
      },
      {
        source: "/javascript-sdk/:path*",
        destination:"/sdk/wasmer-js/:path*",
        permanent: true,
      },
      {
        source: "/edge/tutorials/:path*",
        destination:"/edge/guides/:path*",
        permanent: true,
      },
      {
        source: "/edge/quickstart/:path*",
        destination:"/edge/guides/:path*",
        permanent: true,
      },
    ];
  }
});
