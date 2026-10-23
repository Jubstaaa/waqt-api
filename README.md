# Waqt API

Read-only JSON API for the Waqt app. It serves FAQs, stories, religious stories and templates, each translated per language and selected through the `Accept-Language` header, plus a config endpoint that reports which of those sections have content for a given language.

## Stack

- Hono with `@hono/zod-openapi` and Zod
- Drizzle ORM on Cloudflare D1
- Cloudflare Workers
- Scalar API reference

## Endpoints

- `GET /` health check
- `GET /faqs`
- `GET /stories` (paginated with `pageIndex` and `pageSize`)
- `GET /religious-stories` and `GET /religious-stories/{id}`
- `GET /templates`
- `GET /config`
- `GET /openapi.json` and `GET /docs` (Scalar UI)

## Running it

```sh
bun install
bun run dev         # wrangler dev, local D1
bun run type-check
bun run lint
bun run format
```

Drizzle migrations live in `drizzle/` and are applied with `bunx wrangler d1 migrations apply waqt-db`.

## Deploying

The Worker `waqt-api` runs in Hakan's Cloudflare account on the route `waqt-api.haccoo.dev/*`, bound to the D1 database `waqt-db` as `DB`. Deploys happen automatically through Cloudflare Workers Builds on every push to `main`, so no GitHub secret is needed. As a fallback, deploy by hand with:

```sh
CLOUDFLARE_ACCOUNT_ID=3f3477575d9d049c84f20acfccb9a89a bunx wrangler deploy
```

CI only runs type-check and lint. Content changes go straight to D1 with `bunx wrangler d1 execute waqt-db --remote`.

Media lives in the R2 bucket `haccoo-waqt`, served from `https://cdn.haccoo.dev`. The database stores only the object path (for example `religious-story/<title>/cover.webp`), and the API prefixes `MEDIA_BASE_URL` (a var in `wrangler.toml`, currently `https://cdn.haccoo.dev`) when it builds a response. Values that already start with `http` are returned unchanged. Moving the media means changing that one variable.
