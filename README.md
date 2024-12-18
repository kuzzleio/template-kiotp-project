<p align="center">
  <img src="https://user-images.githubusercontent.com/7868838/103797784-32337580-5049-11eb-8917-3fcf4487644c.png"/>
</p>
<p align="center">
  <img alt="GitHub branch checks state" src="https://img.shields.io/github/checks-status/kuzzleio/template-kiotp-project/master">
</p>

## Kuzzle IoT Platform Project

This repo is a template to create a project using the [Kuzzle IoT Platform](https://docs.kuzzle.io/iot-backend/3/concepts/architecture/), like our mantra for kuzzle, we value your time, so rather than developping your own platform, you can start from our work and add **high-level, high-value business functionalities**. Have a look at our documentation and how to get started.

This repo contains a pre-configured [Turborepo](https://turborepo.org/) with the necessary tooling to create a project using the IoT Platform.


### Important Notes

This is a product under license that require private packages in order to work. You need to have a valid license to use it. If you don't have one, you can request a license [here](https://kuzzle.io/contact-kuzzle-team-to-deliver-projects-faster/).

## Installation and run

Requirement:
 - Node.js >= 18
 - NPM = 10.1.0
 - Docker
 - Docker-Compose

## What's inside?

### Turborepo

This turborepo uses [npm](https://www.npmjs.com/) as a package manager. It includes the following apps:

2 applications
- `api`: a Kuzzle IoT Backend application
- `web`: a Kuzzle IoT Console application

### Install dependencies

Log to Kuzzle npm private repository : https://docs.kuzzle.io/paas-console/1/guides/access-private-plugins/

Go to the repository root and run `npm install`

### Run the stack

```bash
docker compose run --rm api npm install
docker compose up -d
```

## Useful Links

Learn more about the power of Kuzzle

* [Getting Started with Kuzzle](https://docs.kuzzle.io/core/2/guides/getting-started/run-kuzzle/)
* [API](https://docs.kuzzle.io/core/2/guides/main-concepts/api/)
* [Data Storage](https://docs.kuzzle.io/core/2/guides/main-concepts/data-storage/)
* [Querying](https://docs.kuzzle.io/core/2/guides/main-concepts/querying/)
* [Permissions](https://docs.kuzzle.io/core/2/guides/main-concepts/permissions/)
* [Authentication](https://docs.kuzzle.io/core/2/guides/main-concepts/authentication/)
* [Realtime Engine](https://docs.kuzzle.io/core/2/guides/main-concepts/realtime-engine/)
* [Discover our SDKs](https://docs.kuzzle.io/sdk/v2.html)
* [Release Notes](https://github.com/kuzzleio/kuzzle/releases)

Learn more about the power of Turborepo:

* [Pipelines](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
* [Caching](https://turbo.build/repo/docs/core-concepts/caching)
* [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
* [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
* [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
* [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
