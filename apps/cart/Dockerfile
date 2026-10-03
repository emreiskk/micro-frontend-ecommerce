# ==============================================================
# TrendSphere Cart Micro-Frontend Dockerfile (Multi-Stage)
# Port: 3001 | BasePath: /cart | Isolated Cart Service
# ==============================================================

# Stage 1: Dependencies installation (cached layer)
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy monorepo manifests
COPY package.json package-lock.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/cart-sync/package.json ./packages/cart-sync/
COPY apps/cart/package.json ./apps/cart/

RUN npm ci

# Stage 2: Production Build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY packages ./packages
COPY apps/cart ./apps/cart

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build -w @repo/cart

# Stage 3: Minimal Production Runner
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Run as non-root user for security best practices
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages
COPY --from=builder --chown=nextjs:nodejs /app/apps/cart ./apps/cart

USER nextjs

EXPOSE 3001

WORKDIR /app/apps/cart

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/cart || exit 1

CMD ["npm", "run", "start"]
