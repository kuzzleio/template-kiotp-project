FROM kuzzleio/kuzzle-runner:18 AS builder

WORKDIR /var/app

COPY . .

RUN npm install
RUN npm run build
RUN npm prune --production


FROM node:18-bullseye-slim

ARG KUZZLE_ENV="local"
ARG KUZZLE_VAULT_KEY=""

ENV KUZZLE_VAULT_KEY=$KUZZLE_VAULT_KEY
ENV KUZZLE_SECRETS_FILE="/var/app/secrets.enc.json"

ENV NODE_ENV=production

COPY --from=builder /var/app/dist /var/app
COPY --from=builder /var/app/node_modules /var/app/node_modules
COPY --from=builder /var/app/package.json /var/app/package.json
COPY --from=builder /var/app/package-lock.json /var/app/package-lock.json
COPY --from=builder /var/app/lib/environments/${KUZZLE_ENV}/kuzzlerc /var/app/.kuzzlerc
COPY --from=builder /var/app/lib/environments/${KUZZLE_ENV}/secrets.enc.json /var/app/secrets.enc.json

WORKDIR /var/app

CMD [ "node", "app.js" ]
