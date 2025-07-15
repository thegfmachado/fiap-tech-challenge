
# Base: Node.js Alpine
FROM node:20-alpine AS base

# Deps: Instala dependências
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/bytebank-web/package*.json ./apps/bytebank-web/

RUN npm ci

# Builder: Compila aplicação principal
FROM base AS builder
WORKDIR /app

ENV NODE_ENV production

# Recebe URL do microfrontend auth para build
ARG BYTEBANK_WEB_AUTH_DOMAIN
ENV BYTEBANK_WEB_AUTH_DOMAIN=${BYTEBANK_WEB_AUTH_DOMAIN}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build com saída standalone otimizada
RUN npm run build

# Runner: Container final otimizado
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia build standalone do Next.js
COPY --from=builder /app/apps/bytebank-web/.next/standalone ./
COPY --from=builder /app/apps/bytebank-web/.next/static ./apps/bytebank-web/.next/static
COPY --from=builder /app/apps/bytebank-web/public ./apps/bytebank-web/public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/bytebank-web/server.js"]
