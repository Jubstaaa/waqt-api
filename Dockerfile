FROM oven/bun:1.3.13
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY src src

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/data/waqt.db

USER bun

EXPOSE 3000
CMD ["bun", "src/index.ts"]
