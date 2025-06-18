FROM kuzzleio/kuzzle-runner:22 AS builder

WORKDIR /var/app

COPY package*.json .npmrc ./

RUN npm ci

COPY . .

RUN npm run build \
    && npm prune --omit=dev

FROM node:22-bookworm-slim

WORKDIR /var/app

ARG KUZZLE_ENV
ARG KUZZLE_VAULT_KEY

ENV NODE_ENV=production \
    KUZZLE_ENV=${KUZZLE_ENV} \
    KUZZLE_VAULT_KEY=${KUZZLE_VAULT_KEY}

COPY --from=builder /var/app/dist ./
COPY --from=builder /var/app/node_modules ./node_modules
COPY --from=builder /var/app/package*.json ./
COPY --from=builder /var/app/lib/environments/${KUZZLE_ENV}/kuzzlerc ./.kuzzlerc
COPY --from=builder /var/app/lib/environments/${KUZZLE_ENV}/secrets.enc.json /var/app/secrets.enc.json

CMD [ "node", "app.js" ]
