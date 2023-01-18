# Kuzzle IoT Platform Package

This repo contains a pre-configured [Turborepo](https://turborepo.org/) with the necessary tooling to create a package for the IoT Platform.

A package should contains the backend module and the frontend views.

## How to use this template

Usually, you will have 2 release two packages:
 - Backend module: Expose a `XXXModule` that can be registered on a Kuzzle IoT Application
 - Frontend views: Expose `AppChunk`, locales and components to be used with the Frontend Application Builder

Steps to personalize:

 - Rename the directories inside `packages/` according to your package name. In this example the package name is `groups`
 - Change the packages names inside the `packages/**/package.json` files (they need to start by `@kuzzleio/`)
 - Change the dependencies names in `apps/web/package.json` (frontend dependency) and `apps/api/package.json` (backend dependency)

## What's inside?

### Turborepo

This turborepo uses [npm](https://www.npmjs.com/) as a package manager. It includes the following packages/apps:

2 applications used during package development:
- `api`: a Kuzzle IoT Backend application
- `web`: a Kuzzle IoT Console application

2 packages:
 - `kiotp-<name>-module`: the backend module of the package
 - `kiotp-<name>-views`: the frontend views of the package

### Github Actions

 - lint
 - test
 - publish (on private Github packages)
## How to use TurboRepo

__You need to use Node.js 16 because of a bug with Node.js 14__

### Install dependencies

Go to the repository root and run `npm install`

### Run the dev server

First you need to run Elasticsearch and Redis, at the repository root: `docker-compose up`

Go to the repository root and run `npx turbo dev`

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
