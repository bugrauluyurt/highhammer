/*
npm run check: => node ./cmd-check.js ->
- should accept an argument --only=docker|node
- should check if the docker is installed. If it is not install it should halt the process with a message.
- should check the node version if it does not match or if the node is not installed it should halt the process.
*/
const util = require('node:util');
const path = require('path');
const fs = require('fs');
const { getArgs } = require('./cmd-args');
const exec = util.promisify(require('node:child_process').exec);

const defaultShell = process.env.SHELL;

const checkNvmVersion = () => {
  const nvmNodeVersionPath = path.resolve(__dirname, '../../.nvmrc');
  return new Promise((resolve, reject) => {
    fs.readFile(nvmNodeVersionPath, 'utf8', (err, nvmNodeVersion) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(nvmNodeVersion);
    });
  })
  .then((nvmNodeVersion) => ({ nvmNodeVersion }))
  .catch((error) => ({ nvmNodeError: error }))
}

const checkNodeVersion = () => exec("node -v", { shell: defaultShell })
  .then((output) => ({ node: true, nodeVersion: output.stdout }))
  .catch((output) => ({ node: false, nodeError: output.stderr }))

const checkDocker = () => exec("docker --version", { shell: defaultShell })
  .then(() => ({ docker: true }))
  .catch((output) => ({ docker: false, dockerError: output.stderr }))

const printNodeVersionError = () => {
  console.error(`Please install the correct node version (${data.nvmNodeVersion})`);
}

const printDockerError = () => {
  console.error('Please install docker to run the project correctly.');
}

const checkDependencies = () => {
  let request = [
    checkNodeVersion(),
    checkNvmVersion(),
    checkDocker()
  ];
  const { only } = getArgs();
  const isOnlyNode = only === 'node';
  const isOnlyDocker = only === 'docker';
  if (isOnlyNode) {
    request = [checkNodeVersion(), checkNvmVersion()]
  }
  if (isOnlyDocker) {
    request = [checkDocker()]
  }
  Promise.all(request)
    .then((response) => {
      const data = response.reduce((acc, partial) => {
        return {...acc, ...partial};
      }, {})

      // Only Docker
      if (isOnlyDocker) {
        if (!data.docker) {
          printDockerError();
        }
        return process.exit(!data.docker ? 1 : 0);
      }

      // Only Node
      const isNodeVersionCompatible = (() => data?.node && (data?.nodeVersion === data?.nvmNodeVersion))();
      if (isOnlyNode) {
        if (!isNodeVersionCompatible) {
          printNodeVersionError();
        }
        return process.exit(!isNodeVersionCompatible ? 1 : 0);
      }

      // Docker && Node
      const areDependenciesInstalled = isNodeVersionCompatible && data.docker;
      if (!areDependenciesInstalled) {
        if (!isNodeVersionCompatible) {
          printNodeVersionError();
        }
        if (!data.docker) {
          printDockerError()
        }
        return process.exit(1);
      }
      console.log('[Highammer] Dependency check successful.')
      return process.exit(0);
    })
}

checkDependencies();

