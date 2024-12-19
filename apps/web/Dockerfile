# Build step
FROM kuzzleio/kuzzle-runner:20 AS builder

ARG VUE_APP_BACKEND
ENV VUE_APP_BACKEND=$VUE_APP_BACKEND

WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install \
  && npm run build \
  && npm prune --omit=dev

# Server step
FROM nginx:1.27.3-alpine AS production-stage

COPY --from=builder /app/.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
