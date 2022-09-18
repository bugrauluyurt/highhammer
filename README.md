# Highhammer

Full-stack starter project with Nx, NestJs, React and Docker.

<!-- <p><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="100"></p> -->

## Nx plugins used in this project

Below are the Nx plugins that this project uses:

- Web (no framework frontends): `@nrwl/web`
- [React](https://reactjs.org): `@nrwl/react`
- [Nest](https://nestjs.com): `@nrwl/nest`
- [Node](https://nodejs.org): `@nrwl/node`

## Development setup

This section explains how to setup the application for development.

- **Install Nvm**: Install `nvm` to easily switch between node versions on your computer. You can find the documentation on how to install `nvm` on your machine: `https://github.com/nvm-sh/nvm#installing-and-updating`.
   Inside the root of the project directory run `nvm use`. This command is going to set the node version of your machine to the node version required for this project. If this does not work, find the node version written inside the ./.nvmrc file and run `nvm install ${REPLACE_WITH_NVMRC_NODE_VERSION}`. Then run `nvm use` again.

- **Install Docker**: Details on how to install docker to your system can be found inside the official documentation: `https://docs.docker.com/engine/install/`

- **Generate .env files**: Add '.' to the beginning of the env files inside the ./config/env folder. This will make your env files invisible to git while enabling them inside the project.

- **SSL setup**: Trusted certificate generation is necessary for SSL. It can easily be done by using `mkcert`. Mkcert can easily be installed by using `brew`. After the installation, please follow the steps given below:

```
$ mkcert -install
$ cd config/certificates
$ mkcert -key-file localhost-key.pem -cert-file localhost-crt.pem localhost
```

- Run `npm run setup`. This command will check if the project dependencies are met, if so it is going to automatically run `npm install` on your machine.

- Run `npm run start`. After running this command, please wait for all docker containers to be up. Then navigate to `https://localhost:10443`.

## Useful scripts

The monorepo consists of three different applications.

**client-app**: `React` SPA for front-end face of the application.
**api-core**: Written by using `NestJS` - Main interface of application REST api
**api-worker**: Written by using NestJS - Worker app)

These three applications can run **at the same time (React-SPA, Rest-API, Worker)** or **client-app (React-SPA)** can run only by itself while pointing its dependent URIs to the remote QA/DEV servers.

Here are some core development needs and the description of the default npm scripts to cover those needs:

- `npm run start`: Starts all the applications inside the workspace while pointing all the data sources for `api-*` applications to your local machine. If DBs are empty in your local machine you might need to seed some data.

- `npm run start:client:qa`: Starts only the client-app while pointing all api references to remote deployed `QA` REST api.

- `npm run start:client:dev`: Starts only the client-app while pointing all api references to remote deployed `DEV` REST api.

- `npm run start:workspace:host`: Please see `npm run start` (alias for this command).

- `npm run start:workspace:qa`: Starts all the applications inside the workspace while pointing the data sources inside the `api-*` applications (databases etc.) to `QA`.

- `npm run start:workspace:dev`: Starts all the applications inside the workspace while pointing the data sources inside the `api-*` applications (databases etc.) to `DEV`.

- `npm run stop`: Stops all the containers gracefully.

- `npm run stop:prune`: Stops all the containers while pruning all unused containers and deleting all images. Dangling images which does not include a tag (`<none>`) are also deleted by this command.

- `nx:start`: Starts all the applications without the help of Docker containers. Not recommended since environment configs are tightly bound with the docker-compose flow.

- `nx:build`: Builds all the applications inside the monorepo into the ./dist folder. This command should be used before deployment.

- `nx:test`: Runs all the test suits for all applications inside the workspace.

## Generating a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@highhammer/mylib`.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=client-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e client-app-e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
