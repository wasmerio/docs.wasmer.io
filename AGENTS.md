# Repository Guidelines

This is the repository for the documentation of Wasmer.
Even though Wasmer was a product mainly oriented for developers, the documentation
should be accessible for anyone at any level.

The overview of the Wasmer ecosystem can be found in `pages/index.mdx`:

- Wasmer Edge in `pages/edge.mdx`: the hosting solution from Wasmer oriented for Edge Computing (similar to AWS Lambda, Cloudflare Workers or Heroku)
- Wasmer Runtime in `pages/runtime.mdx`: the runtime that is able to run any software via WebAssembly securely (similar to Docker)
- Wasmer Registry in `pages/registry.mdx`: the registry that hosts all the packages (similar to Docker Hub, Github or NPM)

## Project Structure & Module Organization

- Source: Next.js + Nextra docs site using TypeScript.
- Content: MDX pages under `pages/` (route = file path). Example: `pages/sdk/wasmer-js/how-to/use-filesystem.mdx`.
- UI: React components in `components/` and `theme/src/components/`; site config in `theme.config.tsx` and `next.config.mjs`.
- Styling & assets: Tailwind config in `tailwind.config.js`, global styles in `styles/`, static files in `public/`, additional images in `assets/`.

## Build, Test, and Development Commands

- Install deps: `pnpm install`
- Run dev server: `pnpm dev` (Next dev server with hot reload)
- Build static export: `pnpm build` (runs `next build --no-lint && next export -o out`)
- Preview production: `pnpm start` (after `pnpm build`)

## Coding Style & Naming Conventions

- Language: TypeScript for React components; MDX for content.
- Indentation: 2 spaces; prefer single quotes in TS/JS.
- Components: PascalCase filenames (e.g., `CopyButton.tsx`).
- MDX pages: kebab-case paths reflecting routes (e.g., `get-started.mdx`).
- Linting: ESLint is configured (`.eslintrc.js`). Run `npx eslint .` locally if needed.

## Testing Guidelines

- No unit test suite in this repo. Validate changes by running `pnpm dev` and checking affected routes.
- Ensure MDX examples compile and client-side snippets render without console errors.
- For redirects, verify behavior matches `next.config.mjs`.

## Commit & Pull Request Guidelines

- Commits: Write clear, scoped messages in present tense (e.g., `docs: add wasm fs how-to`).
- PRs: Include a concise description, affected pages/components, screenshots or local URLs (e.g., `http://localhost:3000/sdk/...`) when visual changes apply, and link related issues.
- CI: GitHub Actions build must pass (`.github/workflows/ci.yaml`). For deploys, main builds publish via Wasmer.

## Security & Deployment Notes

- Deployment: `pnpm build` + `wasmer deploy` in `publish.yaml` using `wasmer.toml`.
- Secrets: GitHub Actions use `WASMER_CIUSER_PROD_TOKEN`—do not commit tokens or credentials.
- External links: Prefer absolute `https://` links; validate they open in a new tab per theme defaults where appropriate.
