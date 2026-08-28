# Wasmer Docs

## Local Development
Install Dependencies

```sh
pnpm i
```

To run locally:
```sh
pnpm run dev
```

Submit a PR to Wasmer Docs.

## AI-agent Markdown documentation

The browser documentation has a plain Markdown mirror at `/ai-docs`. Every
page in `content/` is generated at the corresponding `.md` path, and custom
MDX components use explicit Markdown serializers kept beside their React
implementations.

Generate and validate the mirror locally with:

```sh
pnpm generate:ai-docs
pnpm test:ai-docs
```

The generated `public/ai-docs/` directory is ignored by Git and is rebuilt
automatically before `pnpm dev` and `pnpm build`.
