

# Highhammer

This project was generated using [Nx](https://nx.dev).

<p><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="100"></p>

🔎 **Smart, Fast and Extensible Build System**

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are the plugins that this project uses:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Development Setup

This section explains how to setup the application for development.

1. Install nvm to easily switch between node versions on your computer. You can find the documentation on how to install 'nvm' on your machine: `https://github.com/nvm-sh/nvm#installing-and-updating`

2. Inside the root of the project directory run `nvm use`. This command is going to set the node version of your machine to the node version required for this project. If this does not work, find the node version written inside the ./.nvmrc file and run `nvm install ${REPLACE_WITH_NVMRC_NODE_VERSION}`. Then run `nvm use` again.

3. Install Docker. Details on how to install docker to your system can be found inside the official documentation: `https://docs.docker.com/engine/install/`

4. Run `npm run setup`. This command will check if the project dependencies are met, if so it is going to automatically run `npm install` on your machine.

5. Add '.' to the beginning of the env files inside the ./config/env folder. This will make your env files invisible to git while enabling them inside the project.

6. Generate certificates. Certificate generation can easily be done by using mkcert

## Scripts

The monorepo consists of three different applications.

- client-app (React)
- api-core (NestJS - Main interface of application REST api)
- api-worker (NestJS - Worker app)

These three applications can run at the same time or client-app can run only by itself according to the development needs.

Here are some core development needs and the description of the default npm scripts to cover those needs:

`npm run start`: Starts all the applications inside the workspace while pointing all the data sources for `api-*` applications to your local machine. If DBs are empty in your local machine you might need to seed some data.

`npm run start:qa`: Starts only the client-app while pointing all api references to remote deployed qa REST api.

`npm run start:dev`: Starts only the client-app while pointing all api references to remote deployed dev REST api.

`npm run start:local:host`: Please see `npm run start` (alias for this command).

`npm run start:local:qa`: Starts all the applications inside the workspace while pointing the data sources inside the `api-*` applications (databases etc.) to `QA`.

`npm run start:local:dev`: Starts all the applications inside the workspace while pointing the data sources inside the `api-*` applications (databases etc.) to `DEV`.

`npm run stop`: Stops all the containers gracefully.

`npm run stop:prune`: Stops all the containers while pruning all unused containers and deleting dangling images, which include the images with no tags (`<none>`)

`nx:start`: Starts all the applications without the help of Docker containers. Not recommended since environment configs are tightly bound with the docker-compose flow.

`nx:build`: Builds all the applications inside the monorepo into the ./dist folder. This command should be used before deployment.

`nx:test`: Runs all the test suits for all applications inside the workspace.

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@highhammer/mylib`.

## Development server

[TODO] To be written.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
