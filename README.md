# Kuzzle Iot Platform boilerplate

## Install

Clone this repository using the following command

```bash
git clone git@github.com:kuzzleio/byes.git
```

# Login private npm package with username and password

npm login --scope=@kuzzleio --registry=https://packages.paas.kuzzle.io

# Build docker with npm private reposity in private
cd backend
docker build --build-arg NPM_TOKEN=${NPM_TOKEN} .
# Run babysitter.sh
cd [root-project]
./babysitter.sh

# Kill all node process
killall node
