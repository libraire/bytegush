# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm 10 to match lockfile
RUN npm install -g pnpm@10

# Copy dependency specifications
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./
RUN pnpm install --frozen-lockfile || pnpm install

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@10

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment for production build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ==========================================
# Stage 3: Runner (Minimal Production Image)
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV SQLITE_DB_PATH="/app/data/bytegush.sqlite"

# Create non-root user and group for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Create data directory for SQLite persistence with correct permissions
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Copy built standalone server and static assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to unprivileged user
USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
