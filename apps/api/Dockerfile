FROM kuzzleio/kuzzle-runner:22 AS builder

WORKDIR /var/app

COPY package*.json .npmrc ./

RUN npm ci

COPY . .

RUN npm run build \
    && npm prune --omit=dev

FROM node:22-bookworm-slim

WORKDIR /var/app

ARG KUZZLE_ENV="local"
ARG KUZZLE_VAULT_KEY=""


ENV NODE_ENV=production \
    KUZZLE_ENV=${KUZZLE_ENV}

# Uncomment if you want to use the Kuzzle Vault
# See https://docs.kuzzle.io/core/2/guides/advanced/secrets-vault
# ENV KUZZLE_VAULT_KEY=$KUZZLE_VAULT_KEY
# ENV KUZZLE_SECRETS_FILE="/var/app/secrets.enc.json"

COPY --from=builder /var/app/dist ./
COPY --from=builder /var/app/node_modules ./node_modules
COPY --from=builder /var/app/package*.json ./

# KUZZLE_ENV is an ARG that can be given by the CI
# Or by using --build-arg "KUZZLE_ENV=local|main"
# See https://docs.kuzzle.io/core/2/guides/advanced/configuration/
COPY --from=builder /var/app/lib/environments/${KUZZLE_ENV}/kuzzlerc ./.kuzzlerc

# Uncomment if you want to use the Kuzzle Vault
# See https://docs.kuzzle.io/core/2/guides/advanced/secrets-vault
# COPY --from=builder /var/app/lib/environments/${KUZZLE_ENV}/secrets.enc.json /var/app/secrets.enc.json

CMD [ "node", "app.js" ]
