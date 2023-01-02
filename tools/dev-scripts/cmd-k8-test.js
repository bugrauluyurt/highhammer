const path = require('path');
const fs = require('fs');
const util = require('node:util');
const execPromise = util.promisify(require('node:child_process').exec);

const PROJECTS_EXCLUDED = ['api-worker', 'client-app-e2e']

const DOCKER_REGISTRY_URL = 'localhost'
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
    console.log('-------------------')
    console.log(`[Highhammer] Docker registry running on port ${DOCKER_REGISTRY_PORT}.`);
    const logMessageForTail = '[Highhammer] To tail the container logs you can run:\n $ docker logs -f registry';
    console.log(logMessageForTail);
    const logMessageForTermination = `[Highhammer] To stop the registry you can run:\n $ docker container stop ${DOCKER_REGISTRY_NAME} && docker container rm -v ${DOCKER_REGISTRY_NAME}`;
    console.log(logMessageForTermination);
    console.log('-------------------')
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

const getLatestTagVersion = async () => {
  return execPromise(`git describe --abbrev=0 --tags | tr -d v`)
    .then((response) => {
      if (response?.stderr?.length) {
        console.log(response?.stderr);
      } else {
        const latestTagVersion = response.stdout
        if (latestTagVersion.length && latestTagVersion.split('.').length === 3) {
          return latestTagVersion
        }
        return '0.0.0'
      }
    })
    .catch((e) => {
      console.error('[Highhammer] An error occurred while getting the latest tag version. Returning the tag version as 0.0.0', e);
      return '0.0.0'
    });
}

const tagAndPushProjectImage = async (projectName, tag) => {
  const cmdDockerBuild = `docker build -t ${tag} -f ./apps/${projectName}/Dockerfile ./apps/${projectName}`.replace(/\n/, '')
  await execPromise(cmdDockerBuild)
  await execPromise(`docker push ${tag}`)
}

const tagAndPushProjectImages = async () => {
  const versions = getVersionsJson();
  const latestTagVersion = await getLatestTagVersion();
  const promiseBatch = Object.entries(versions)
    .filter(([projectName]) => !PROJECTS_EXCLUDED.includes(projectName))
    .map(([projectName, calVer]) => {
      const imageName = projectName
      const versionProject = calVer
      const versionMonoRepo = latestTagVersion
      const containerTag = `${DOCKER_REGISTRY_URL}:${DOCKER_REGISTRY_PORT}/${imageName}:${versionProject}-${versionMonoRepo}`
      return tagAndPushProjectImage(projectName, containerTag)
    });
  return Promise.all(promiseBatch)
    .then((response) => {
      if (response?.stderr?.length) {
        console.log(response?.stderr);
      } else {
        console.log(`[Highhammer] Project images are tagged and pushed successfully.`);
      }
    })
    .catch((e) => {
      console.error('[Highhammer] An error occurred while tagging and pushing project images.', e);
      process.exit(1);
    });
}

const buildProjects = async () => {
  return execPromise(`pnpm nx:build`)
    .then((response) => {
      if (response?.stderr?.length) {
        console.log(response?.stderr);
      } else {
        console.log(`[Highhammer] All projects are build successfully.`);
        const versions = getVersionsJson();
        // @INFO: Copy all the dist folder into the project's own folder
        const promiseBatch = Object.keys(versions)
          .filter((projectName) => {
            return !PROJECTS_EXCLUDED.includes(projectName)
          })
          .map((projectName) => {
            return execPromise(`rm -rf ./apps/${projectName}/dist && cp -r ./dist/apps/${projectName}/ ./apps/${projectName}/dist/`)
              .catch(() => undefined)
          })
        return Promise.all(promiseBatch)
      }
    })
    .catch((e) => {
      console.error('[Highhammer] An error occurred while building the projects.', e);
      process.exit(1);
    });
}

const run = async () => {
  try {
    console.log(`[Highhammer] Init->runDockerLocalRegistry()`);
    await runDockerLocalRegistry();
    console.log(`[Highhammer] Init->buildProjects()`);
    await buildProjects()
    console.log(`[Highhammer] Init->tagAndPushProjectImages()`);
    await tagAndPushProjectImages()
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

run()
