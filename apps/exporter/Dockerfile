# Builder stage
FROM kuzzleio/kuzzle-runner:16 as builder

RUN npm i -g npm@9.5.0 \
 && chown -R 1000:1000 "/var/npm"

WORKDIR /home/node

COPY . .

RUN chown -R node:node /home/node

USER node

RUN npm install
RUN npm run build
RUN npm prune --production

FROM node:16-bullseye-slim

# Puppeteer Chrome headless dependencies
RUN apt-get update && apt-get install -y \
        ca-certificates \
        fonts-liberation \
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libc6 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libexpat1 \
        libfontconfig1 \
        libgbm1 \
        libgcc1 \
        libglib2.0-0 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libstdc++6 \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxi6 \
        libxrandr2 \
        libxrender1 \
        libxss1 \
        libxtst6 \
        lsb-release \
        wget \
        xdg-utils \
  && rm -rf /var/lib/apt/lists/*

RUN usermod -a -G video,audio node

WORKDIR /home/node

USER node

ENV NODE_ENV=production
ENV PUPPETEER_ARGS="--no-sandbox,--disable-setuid-sandbox,--disable-gpu,--disable-dev-shm-usage"

ARG IOT_CONSOLE_URL
ENV IOT_CONSOLE_URL=$IOT_CONSOLE_URL

COPY --from=builder --chown=node /home/node/dist /home/node
COPY --from=builder --chown=node /home/node/node_modules /home/node/node_modules
COPY --from=builder --chown=node /home/node/package.json /home/node/package.json
COPY --from=builder --chown=node /home/node/package-lock.json /home/node/package-lock.json
COPY --from=builder --chown=node /home/node/.cache/puppeteer /home/node/.cache/puppeteer

CMD [ "node", "index.js" ]