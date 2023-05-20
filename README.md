# Highhammer

Full-stack monorepo starter project with Nx, NestJs, React and Docker.

<p>
  <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" alt="NX Logo" height="50">
  <img src="https://nestjs.com/img/logo-small.svg" height="50" alt="Nest Logo" />
  <img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" height="50" alt="Docker Logo" />
</p>

## Nx plugins used in this project

Below are the Nx plugins that this project uses:

- Web (no framework frontends): `@nx/web`
- [React](https://reactjs.org): `@nx/react`
- [Nest](https://nestjs.com): `@nx/nest`
- [Node](https://nodejs.org): `@nx/node`

## Features

- [x] Docker-compose integration.
- [x] Separate package.json for workspace projects.
- [x] CI with Github actions (build, test, containerization).
- [x] Nx-workspace and Nx-cloud distributed caching.
- [x] Pnpm workspaces.
- [x] Single pnpm cache container for dockerized workspace components.
- [x] Workspace versioning by using semantic-release.
- [x] Project versioning by using calver convention.
- [x] Various dev-scripts for affected project understanding, calver generation and versioning.
- [x] Tailwind and styled-components integration.
- [ ] Radix UI integration.
- [ ] Azure pipelines for deployment.
- [ ] Kubernetes and Helm Charts integration.

## Development setup

This section explains how to setup the application for development.

- **Install Nvm**: Install `nvm` to easily switch between node versions on your computer. You can find the documentation on how to install `nvm` on your machine: `https://github.com/nvm-sh/nvm#installing-and-updating`.
  Inside the root of the project directory run `nvm use`. This command is going to set the node version of your machine to the node version required for this project. If this does not work, find the node version written inside the ./.nvmrc file and run `nvm install ${REPLACE_WITH_NVMRC_NODE_VERSION}`. Then run `nvm use` again.

- **Install Docker**: Details on how to install docker to your system can be found inside the official documentation: `https://docs.docker.com/engine/install/`

- **Install pnpm**: This repository uses pnpm to manage the dependencies of apps & libs existing inside the monorepo architecture. To install pnpm run `npm install -g pnpm`.

- **Generate .env files**: Make copies of all env files inside the ./config/env folder. Add '.' to the beginning of all. This will make your env files invisible to git while enabling them inside the project.

- **SSL setup**: Trusted certificate generation is necessary for SSL. It can easily be done by using `mkcert`. Mkcert can easily be installed by using `brew`. After the installation, please follow the steps given below:

```
$ mkcert -install
$ cd config/certificates
$ mkcert -key-file localhost-key.pem -cert-file localhost-crt.pem localhost host.minikube.internal 0.0.0.0 127.0.0.1 ::1
```

- Run `pnpm install`. This command will automatically install all the dependencies for your apps & libs inside the monorepo recursively.

- Run `pnpm start`. After running this command, please wait for all docker containers to be up. Then navigate to `https://localhost:10443`.

## Useful scripts

The monorepo consists of three different applications.

- **client-app**: `React` SPA for front-end face of the application.
- **api-customer-service**: Written by using `NestJS` - Main interface of application REST api
- **api-worker**: Written by using NestJS - Worker app)

These three applications can run **at the same time (React-SPA, Rest-API, Worker)** or **client-app (React-SPA)** can run only by itself while pointing its dependent URIs to the remote QA/DEV servers.

Here are some core development needs and the description of the default npm scripts to cover those needs:

- `pnpm start`: Starts all the applications inside the workspace while pointing all the data sources for `api-*` applications to your local machine. If DBs are empty in your local machine you might need to seed some data.

- `pnpm start:client:qa`: Starts only the client-app while pointing all api references to remote deployed `QA` REST api.

- `pnpm start:client:dev`: Starts only the client-app while pointing all api references to remote deployed `DEV` REST api.

- `pnpm start:workspace:host`: Please see `pnpm start` (alias for this command).

- `pnpm start:workspace:qa`: Starts all the applications inside the workspace while pointing the data sources inside the `api-*` applications (databases etc.) to `QA`.

- `pnpm start:workspace:dev`: Starts all the applications inside the workspace while pointing the data sources inside the `api-*` applications (databases etc.) to `DEV`.

- `pnpm stop`: Stops all the containers gracefully.

- `pnpm stop:prune`: Stops all the containers while pruning all unused containers and deleting all images. Dangling images which does not include a tag (`<none>`) are also deleted by this command.

- `pnpm nx:start`: Starts all the applications without the help of Docker containers. Not recommended since environment configs are tightly bound with the docker-compose flow.

- `pnpm nx:build`: Builds all the applications inside the monorepo into the ./dist folder. This command should be used during deployment.

- `pnpm nx:test`: Runs all the test suits for all applications inside the workspace.

- `pnpm nx:test:affected`: Runs all the test suits for the affected applications by the recent changes. NX handles the comparison in between the HEAD of the current branch to the target branch where PR has been opened.

## Generating a library

Run `nx g @nx/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@highhammer/mylib`.

## Code scaffolding

Run `nx g @nx/react:component my-component --project=client-app` to generate a new component.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
