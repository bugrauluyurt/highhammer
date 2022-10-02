# Highhammer

Full-stack monorepo starter project with Nx, NestJs, React and Docker.
<p>
  <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" alt="NX Logo" height="50">
  <img src="https://nestjs.com/img/logo-small.svg" height="50" alt="Nest Logo" />
  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" height="50" alt="React Logo" />
  <img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" height="50" alt="Docker Logo" />
  <img src="data:image/png;base64,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" height="50" alt="Pnpm Logo" />
</p>

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

- **Install pnpm**: This repository uses pnpm to manage the dependencies of apps & libs existing inside the monorepo architecture. To install pnpm run `npm install -g pnpm`.

- **Generate .env files**: Add '.' to the beginning of the env files inside the ./config/env folder. This will make your env files invisible to git while enabling them inside the project.

- **SSL setup**: Trusted certificate generation is necessary for SSL. It can easily be done by using `mkcert`. Mkcert can easily be installed by using `brew`. After the installation, please follow the steps given below:

```
$ mkcert -install
$ cd config/certificates
$ mkcert -key-file localhost-key.pem -cert-file localhost-crt.pem localhost
```

- Run `pnpm setup`. This command will automatically install all the dependencies for your apps & libs inside the monorepo.

- Run `pnpm start`. After running this command, please wait for all docker containers to be up. Then navigate to `https://localhost:10443`.

## Useful scripts

The monorepo consists of three different applications.

**client-app**: `React` SPA for front-end face of the application.
**api-core**: Written by using `NestJS` - Main interface of application REST api
**api-worker**: Written by using NestJS - Worker app)

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

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@highhammer/mylib`.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=client-app` to generate a new component.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
