# =========================
# Builder Stage
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile && \
    yarn cache clean

COPY . .

RUN yarn build

# =========================
# Runner Stage
# =========================
FROM nginx:1.27-alpine AS runner

WORKDIR /usr/share/nginx/html

RUN addgroup -S nodejs && \
    adduser -S nodeuser -G nodejs

COPY --from=builder --chown=nodeuser:nodejs /app/dist ./

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

USER nodeuser

CMD ["nginx", "-g", "daemon off;"]
