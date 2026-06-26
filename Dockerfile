# syntax=docker/dockerfile:1.7

# =====================================================
#  Stage 1: dependencies
# =====================================================
FROM node:20-alpine AS deps
WORKDIR /app

# Bun para installs rápidos (lo usamos solo en build, no en runtime).
RUN npm install -g bun

COPY package.json bun.lock* ./
COPY .npmrc* ./

# Instalar dependencias con bun (más rápido que npm).
RUN bun install --frozen-lockfile

# =====================================================
#  Stage 2: builder
# =====================================================
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g bun

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de build (públicas). Las secretas van en runtime.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Construir con standalone output (configurado en next.config.ts).
RUN bun run build

# =====================================================
#  Stage 3: runner (imagen final mínima)
# =====================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Usuario no-root para seguridad.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copiar standalone output + static + public.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
