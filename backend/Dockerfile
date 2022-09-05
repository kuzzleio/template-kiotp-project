FROM kuzzleio/kuzzle-runner:16 as builder

WORKDIR /var/app

COPY . .

RUN npm install
RUN npm run build
RUN npm prune --production

FROM node:16-stretch-slim as production

ARG KUZZLE_ENV="local"
ARG KUZZLE_VAULT_KEY=""

ENV NODE_ENV=production
ENV KUZZLE_ENV=$KUZZLE_ENV
ENV KUZZLE_VAULT_KEY=$KUZZLE_VAULT_KEY
ENV KUZZLE_SECRETS_FILE=/var/app/environments/${KUZZLE_ENV}/secrets.enc.json

WORKDIR /var/app

COPY --from=builder /var/app/ .
COPY --from=builder /var/app/environments/${KUZZLE_ENV}/kuzzlerc /var/app/.kuzzlerc

CMD [ "node", "app.js" ]
