FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock turbo.json ./

COPY packages/redis/package.json ./packages/redis/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/database/package.json ./packages/database/
COPY apps/price-poller-service/package.json ./apps/price-poller-service/

RUN bun install --no-frozen-lockfile

COPY packages/redis/tsconfig.json ./packages/redis/
COPY packages/database/tsconfig.json ./packages/database/ 
COPY apps/price-poller-service/tsconfig.json ./apps/price-poller-service/

COPY packages/redis/ ./packages/redis/
COPY packages/typescript-config/ ./packages/typescript-config
COPY packages/database/ ./packages/database
COPY apps/price-poller-service/src ./apps/price-poller-service/src

WORKDIR /app/packages/database
RUN bunx prisma generate

WORKDIR /app/apps/price-poller-service

CMD ["bun","start"]