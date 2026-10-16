# Waqt API

Read-only JSON API for the Waqt app. It serves FAQs, stories, religious stories and templates, each translated per language and selected through the `Accept-Language` header, plus a config endpoint that reports which of those sections have content for a given language.

## Stack

- Hono with `@hono/zod-openapi` and Zod
- Drizzle ORM on SQLite (`bun:sqlite`)
- Bun, in a Docker container on the webgooh droplet behind the shared Caddy
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
bun run dev         # bun --hot, reads data/waqt.db
bun run type-check
bun run lint
bun run format
```

The API opens the database read-only from `DATABASE_PATH` (default `data/waqt.db`). Drizzle migrations live in `drizzle/`.

## Deploying

Every push to `main` runs type-check and lint, builds `ghcr.io/jubstaaa/waqt-api`, and runs it on the droplet from `/opt/waqt-api` with `docker compose`. Caddy proxies `waqt-api.haccoo.dev` to `127.0.0.1:3014`.

The database is not in the image. It lives at `/opt/waqt-api/data/waqt.db` on the droplet and is mounted read-only. To change content, edit a copy of that file, upload it over the old one and run `docker compose restart` in `/opt/waqt-api`.

Media lives in the `waqt` Space. The database stores only the object path (for example `religious-story/<title>/cover.webp`), and the API prefixes `MEDIA_BASE_URL` (set in `docker-compose.yml`, default `https://waqt.fra1.cdn.digitaloceanspaces.com`) when it builds a response. Values that already start with `http` are returned unchanged. Moving the media means changing that one variable.
