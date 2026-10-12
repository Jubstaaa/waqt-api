# Waqt API

Read-only JSON API for the Waqt app. It serves FAQs, stories, religious stories and templates, each translated per language and selected through the `Accept-Language` header, plus a config endpoint that reports which of those sections have content for a given language.

## Stack

- Hono with `@hono/zod-openapi` and Zod
- Drizzle ORM on Cloudflare D1 (SQLite)
- Cloudflare Workers, deployed with Wrangler
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
bun run dev       # wrangler dev
bun run deploy    # wrangler deploy
bun run lint
bun run format
```

The Worker reads a single binding, `DB`, a D1 database configured in `wrangler.toml`. Drizzle migrations live in `drizzle/`, which is also the D1 `migrations_dir`.
