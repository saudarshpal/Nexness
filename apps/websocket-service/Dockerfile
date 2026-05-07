FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock turbo.json ./

COPY packages/redis/package.json ./packages/redis/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/database/package.json ./packages/database/
COPY apps/websocket-service/package.json ./apps/websocket-service/

RUN bun install --no-frozen-lockfile

COPY packages/redis/tsconfig.json ./packages/redis/
COPY packages/database/tsconfig.json ./packages/database/ 
COPY apps/websocket-service/tsconfig.json ./apps/websocket-service/

COPY packages/redis/ ./packages/redis/
COPY packages/typescript-config/ ./packages/typescript-config
COPY packages/database/ ./packages/database
COPY apps/websocket-service/src ./apps/websocket-service/src

WORKDIR /app/packages/database
RUN bunx prisma generate

WORKDIR /app/apps/websocket-service

CMD ["bun","start"]