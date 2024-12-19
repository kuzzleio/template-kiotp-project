FROM kuzzleio/kuzzle-runner:20 AS builder

WORKDIR /var/app

COPY package*.json .npmrc ./

RUN npm ci

COPY . .

RUN npm run build \
    && npm prune --omit=dev

FROM node:20-bookworm-slim

WORKDIR /var/app

ARG KUZZLE_ENV
ARG KUZZLE_VAULT_KEY
ARG PUPPETEER_SERVER_URL
ARG PUPPETEER_SERVER_PORT

ENV NODE_ENV=production \
    KUZZLE_ENV=${KUZZLE_ENV} \
    KUZZLE_VAULT_KEY=${KUZZLE_VAULT_KEY} \
    PUPPETEER_SERVER_URL=${PUPPETEER_SERVER_URL} \
    PUPPETEER_SERVER_PORT=${PUPPETEER_SERVER_PORT}

COPY --from=builder /var/app/dist ./
COPY --from=builder /var/app/node_modules ./node_modules
COPY --from=builder /var/app/package*.json ./
COPY --from=builder /var/app/lib/environments/${KUZZLE_ENV}/kuzzlerc ./.kuzzlerc

CMD [ "node", "app.js" ]
