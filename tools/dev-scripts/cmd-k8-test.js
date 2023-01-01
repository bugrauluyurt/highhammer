const util = require('node:util');
const execPromise = util.promisify(require('node:child_process').exec);

const DOCKER_REGISTRY_NAME = 'registry';
const DOCKER_REGISTRY_PORT = 5020;
const DOCKER_REGISTRY_VERSION = 2;

const getVersionsJsonPath = () => path.resolve(__dirname, `../../versions.json`);
const getVersionsJson = () => {
  const json = fs.readFileSync(getVersionsJsonPath());
  return JSON.parse(json);
}

const listRunningContainers = async () => {
  return execPromise(`docker container ls -a`)
    .then((response) => {
      if (response?.stderr?.length) {
        console.log(response?.stderr);
      } else {
        return response.stdout.split('\n');
      }
    })
    .catch((e) => {
      console.error('[Highhammer] An error occurred while listing running containers.', e);
      process.exit(1);
    });
}

const isDockerLocalRegistryRunning = async () => {
  const lsOfRunningContainers = await listRunningContainers();
  return lsOfRunningContainers.some((row) => row.indexOf(DOCKER_REGISTRY_NAME) !== -1 && row.indexOf(`0.0.0.0:${DOCKER_REGISTRY_PORT}`) !== -1);
}

// @INFO: Local docker registry is created to test helm implementation locally
const runDockerLocalRegistry = async () => {
  const isRegistryRunning = await isDockerLocalRegistryRunning();
  const logSuccess = () => {
    console.log(`[Highhammer] Docker registry running on port ${DOCKER_REGISTRY_PORT}.`);
    const logMessageForTail = '[Highhammer] To tail the container logs you can run:\n $ docker logs -f registry';
    console.log(logMessageForTail);
    const logMessageForTermination = `[Highhammer] To stop the registry you can run:\n $ docker container stop ${DOCKER_REGISTRY_NAME} && docker container rm -v ${DOCKER_REGISTRY_NAME}`;
    console.log(logMessageForTermination);
  }
  if (isRegistryRunning) {
    logSuccess()
    return
  }
  console.log(`[Highhammer] Creating local docker registry with name-> ${DOCKER_REGISTRY_NAME} on port ${DOCKER_REGISTRY_PORT}`);
  return execPromise(`docker run -d -p ${DOCKER_REGISTRY_PORT}:5000 --name ${DOCKER_REGISTRY_NAME} registry:${DOCKER_REGISTRY_VERSION}`)
    .then((response) => {
      if (response?.stderr?.length) {
        console.log(response?.stderr);
      } else {
        logSuccess()
      }
    })
    .catch((e) => {
      console.error('[Highhammer] An error occurred while creating a local registry.', e);
      process.exit(1);
    });
}

const buildProjects = async () => {
  return execPromise(`pnpm nx:build`)
    .then((response) => {
      if (response?.stderr?.length) {
        console.log(response?.stderr);
      } else {
        console.log(`[Highhammer] Project are build successfully.`);
      }
    })
    .catch((e) => {
      console.error('[Highhammer] An error occurred while building the projects.', e);
      process.exit(1);
    });
}

const run = async () => {
  try {
    await runDockerLocalRegistry();
    await buildProjects()
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

run()
