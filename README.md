# Kuzzle IoT Platform Project

This repo contains a pre-configured [Turborepo](https://turborepo.org/) with the necessary tooling to create a project using the IoT Platform.

## What's inside?

### Turborepo

This turborepo uses [npm](https://www.npmjs.com/) as a package manager. It includes the following apps:

2 applications
- `api`: a Kuzzle IoT Backend application
- `web`: a Kuzzle IoT Console application

## How to use TurboRepo

__You need to use Node.js 16 because of a bug with Node.js 14__

### Install dependencies

Log to Kuzzle npm private repository : https://docs.kuzzle.io/paas-console/1/guides/access-private-plugins/ 

Go to the repository root and run `npm install`

### Run the dev server

First you need to run Elasticsearch and Redis, at the repository root: `docker-compose up`

Go to the repository root and run `npm run dev`

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
