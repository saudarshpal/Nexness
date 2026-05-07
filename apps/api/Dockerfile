FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock turbo.json ./

COPY packages/redis/package.json ./packages/redis/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/database/package.json ./packages/database/
COPY apps/api/package.json ./apps/api/

RUN bun install --no-frozen-lockfile

COPY packages/redis/tsconfig.json ./packages/redis/
COPY packages/database/tsconfig.json ./packages/database/ 
COPY apps/api/tsconfig.json ./apps/api/

COPY packages/redis/ ./packages/redis/
COPY packages/typescript-config/ ./packages/typescript-config
COPY packages/database/ ./packages/database
COPY apps/api/src ./apps/api/src

WORKDIR /app/packages/database
RUN bunx prisma generate

WORKDIR /app/apps/api

COPY apps/api/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/entrypoint.sh"]