<p align="center">
  <img src="https://user-images.githubusercontent.com/7868838/103797784-32337580-5049-11eb-8917-3fcf4487644c.png"/>
</p>
<p align="center">
  <img alt="GitHub branch checks state" src="https://img.shields.io/github/checks-status/kuzzleio/template-kiotp-project/main">
</p>

# Kuzzle IoT Platform Project
This repo is a template to create a project using the [Kuzzle IoT Platform](https://docs.kuzzle.io/iot-backend/3/concepts/architecture/), like our mantra for kuzzle, we value your time, so rather than developping your own platform, you can start from our work and add **high-level, high-value business functionalities**. Have a look at our documentation and how to get started.

## ⚠️ Important Notes

This is a product under license that require private packages in order to work. You need to have a valid license to use it. If you don't have one, you can request a license [here](https://kuzzle.io/contact-kuzzle-team-to-deliver-projects-faster/).






## 🚀 Installation

### Requirement:

- Node.js >= 18
- NPM = 10.1.0
- Docker
- Docker-Compose

## Run the stack

Log to Kuzzle npm private repository : https://docs.kuzzle.io/paas-console/1/guides/access-private-plugins/

Once you finished the setup of the private repository, you are supposed to have a new file generated in your home directory `~/.npmrc` with the following content:

```bash
//packages.paas.kuzzle.io/:_authToken="psedkKaRv3PkRw56+...xyz"
@kuzzleio:registry=https://packages.paas.kuzzle.io/
```

Then you can install the dependencies:

```bash
docker compose run --no-deps --rm api npm install
docker compose up -d
````

Running this command will install the dependencies for both the `api` and `web` applications. And start the stack.

## What will be running on my computer ?

The stack will be composed of the following services:

| Service                | URL                     |
| ---------------------- | ----------------------- |
| KIOTP Console          | `http://localhost:8081` |
| Kuzzle API             | `http://localhost:7512` |
| Elasticsearch          | `http://localhost:9200` |
| Redis                  | `http://localhost:6379` |
| Keycloak Admin Console | `http://localhost:8080` |
| Postgres               | `http://localhost:5432` |

### ❌ I am on Macos or Windows and I can't access the services

Docker Desktop added general support for "host networking" with version 4.34 and later.

To enable the feature you have to be signed in, go to "Settings", within the "Resources" choose "Network" and then check the "Enable host networking". Docker Desktop must be restarted for the change to take affect

For details look at the documentation: https://docs.docker.com/engine/network/drivers/host/

## Initial setup


When running the stack for the first time, you will need to setup

1. Keycloak secret
1. Kuzzle IOT Platform first Tenant
1. Kuzzle IOT Platform first user


### Keycloak secret

1. Go to `http://localhost:8080`
1. Log in with the following credentials:
   - Username: `admin-kuzzle-kiotp`
   - Password: `Test1234`
1. Go to `Clients` > `kiotp-back` > `Credentials` and copy the `Secret` value
1. Update the `application.keycloak.backend.clientSecret` value in the `.kuzzlerc` file with the copied value
