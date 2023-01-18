const util = require('node:util');
const path = require('path');
const { DOCKER_REGISTRY_NAME, DOCKER_REGISTRY_PORT, DOCKER_REGISTRY_VERSION, runCmd } = require('./utils');
const execPromise = util.promisify(require('node:child_process').exec);
const { run: startOCIRepository } = require('./cmd-ci-test-install-zot');

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
};

const isDockerLocalRegistryRunning = async () => {
  const lsOfRunningContainers = await listRunningContainers();
  return lsOfRunningContainers.some((row) => row.indexOf(DOCKER_REGISTRY_NAME) !== -1 && row.indexOf(`0.0.0.0:${DOCKER_REGISTRY_PORT}`) !== -1 && row.indexOf('Up') > -1);
};

// @INFO: Local docker registry is created to test helm implementation locally
const startDockerLocalRegistry = async () => {
  const isRegistryRunning = await isDockerLocalRegistryRunning();
  const logSuccess = () => {
    console.log(`[Highhammer] Docker registry running on port ${DOCKER_REGISTRY_PORT}.`);
    const logMessageForTail = '[Highhammer] To tail the container logs you can run:\n => docker logs -f registry';
    console.log(logMessageForTail);
    const logMessageForTermination = `[Highhammer] To stop the registry you can run:\n => docker container stop ${DOCKER_REGISTRY_NAME} && docker container rm -v ${DOCKER_REGISTRY_NAME}`;
    console.log(logMessageForTermination);
  }
  if (isRegistryRunning) {
    logSuccess();
    return;
  }
  console.log(`[Highhammer] Creating local docker registry with name-> ${DOCKER_REGISTRY_NAME} on port ${DOCKER_REGISTRY_PORT}`);
  const removeExistingRegistry = execPromise(`docker container rm -f ${DOCKER_REGISTRY_NAME}`).then((response) => {
    if (response?.stderr?.length && !response.stderr.includes('No such container')) {
      console.log(response?.stderr);
    }
  })
  return removeExistingRegistry.then(() => {
    // const certificatePath = path.resolve(__dirname, '../../config/certificates')
    // @INFO: Uncomment the line and replace it with the runCmd if https is necessary
    // return runCmd(`docker run -d --name ${DOCKER_REGISTRY_NAME} -v ${certificatePath}:/certs -e REGISTRY_HTTP_ADDR=0.0.0.0:443 -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/localhost-crt.pem -e REGISTRY_HTTP_TLS_KEY=/certs/localhost-key.pem -p ${DOCKER_REGISTRY_PORT}:443 registry:${DOCKER_REGISTRY_VERSION}`)
    return runCmd(`docker run -d -p ${DOCKER_REGISTRY_PORT}:5000 --name ${DOCKER_REGISTRY_NAME} registry:${DOCKER_REGISTRY_VERSION}`)
      .then((response) => {
        if (response?.stderr?.length) {
          console.log(response?.stderr);
        } else {
          logSuccess();
        }
      })
      .catch((e) => {
        console.error('[Highhammer] An error occurred while creating a local registry.', e);
        process.exit(1);
      });
  })

};

const runJob = async (
  startLog,
  cmdAsyncCallback,
) => {
  console.log('---------JOB---------');
  console.log(startLog);
  return cmdAsyncCallback().finally(() => {
    console.log('------------------- \n');
  });
}

const run = async () => {
  try {
    await runJob(
      '[Highhammer] Job->startDockerLocalRegistry()',
      startDockerLocalRegistry
    );
    await runJob(
      '[Highhammer] Job->startOCIRepository',
      startOCIRepository
    );
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

run();
