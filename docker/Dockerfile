# docker/Dockerfile
FROM node:20-alpine AS builder

# Instalar netcat para healthcheck
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Produção :::
FROM node:20-alpine

# Instalar netcat para healthcheck
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/database ./src/database

# Copiar entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

# Usar entrypoint
ENTRYPOINT ["/entrypoint.sh"]