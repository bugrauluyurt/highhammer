const util = require('node:util');
const childProcess = require('node:child_process');
const execPromise = util.promisify(childProcess.exec);


// Local registry is disabled after considering the complexity of security issues occurring inside K8 layer while accessing pulling docker images
const PROJECTS_EXCLUDED = ['api-worker', 'client-app-e2e']
const DOCKER_REGISTRY_NAME = 'registry';
const DOCKER_REGISTRY_PORT = 5020;
const DOCKER_REGISTRY_VERSION = 2;
const ZOT_OCI_REPOSITORY_PORT = 5000;

const runCmd = (cmd) => {
  const cleanCmd = cmd.replace(/\n/g, '');
  console.log(`$ ${cleanCmd}`)
  return execPromise(cleanCmd);
}

module.exports = {
  DOCKER_REGISTRY_NAME,
  DOCKER_REGISTRY_PORT,
  DOCKER_REGISTRY_VERSION,
  ZOT_OCI_REPOSITORY_PORT,
  PROJECTS_EXCLUDED,
  runCmd
}

