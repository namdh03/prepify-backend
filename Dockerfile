# Base
FROM node:18-alpine3.18 AS base
WORKDIR /usr/src/app

# Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production --frozen-lockfile

# Builder
FROM base AS builder
COPY . .
RUN npm ci --frozen-lockfile
RUN npm run build:dev

# Runner
FROM node:18-alpine3.18 AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 fastify

COPY --from=deps --chown=fastify:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=fastify:nodejs /usr/src/app/build ./build
COPY --from=builder --chown=fastify:nodejs /usr/src/app/.env ./.env

USER fastify
EXPOSE 8899

CMD ["node", "build/src/main.js"]
