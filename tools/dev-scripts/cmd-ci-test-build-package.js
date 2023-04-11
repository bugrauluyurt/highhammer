const path = require('path');
const fs = require('fs');
const util = require('node:util');
const { DOCKER_REGISTRY_PORT, PROJECTS_EXCLUDED, runCmd } = require('./utils');
const execPromise = util.promisify(require('node:child_process').exec);

const processArguments = process.argv.slice(2);

const OCI_REPOSITORY_URL = processArguments[0];
const DOCKER_HUB_USERNAME = processArguments[1];

const getProjectVersionsJsonPath = () => path.resolve(__dirname, `../../versions.json`);
const getProjectVersionsJson = () => {
  const json = fs.readFileSync(getProjectVersionsJsonPath());
  return JSON.parse(json);
};

const getLatestTagVersion = async () => {
  return execPromise(`git describe --abbrev=0 --tags | tr -d v`)
    .then((response) => {
      if (response?.stderr?.length) {
        console.log(response?.stderr);
      } else {
        const latestTagVersion = response.stdout;
        if (latestTagVersion.length && latestTagVersion.split('.').length === 3) {
          return latestTagVersion;
        }
        return '0.0.0';
      }
    })
    .catch((e) => {
      console.error('[Highhammer] An error occurred while getting the latest tag version. Returning the tag version as 0.0.0', e);
      return '0.0.0';
    });
};

const tagAndPushProjectDockerImage = async (projectName, tag) => {
  const cmdDockerBuild = `docker build -t ${tag} -f ./apps/${projectName}/Dockerfile ./apps/${projectName}`.replace(/\n/, '');
  console.log(`$ ${cmdDockerBuild}`);
  await execPromise(cmdDockerBuild);
  const cmdDockerPush = `docker push ${tag}`.replace(/\n/, '');
  console.log(`$ ${cmdDockerPush}`);
  await execPromise(cmdDockerPush);
};

const tagAndPushProjectDockerImages = async () => {
  const projects = getProjectVersionsJson();
  const latestTagVersion = await getLatestTagVersion();
  const promiseBatch = Object.keys(projects)
    .filter((projectName) => !PROJECTS_EXCLUDED.includes(projectName))
    .map((projectName) => {
      const imageName = projectName;
      const versionMonoRepo = latestTagVersion;
      const imagePath = `${imageName}:${versionMonoRepo}`
      const containerTag = !DOCKER_HUB_USERNAME?.length
        ? `localhost:${DOCKER_REGISTRY_LOCAL_PORT}/${imagePath}`
        : `${DOCKER_HUB_USERNAME}/${imagePath}`;
      return tagAndPushProjectDockerImage(projectName, containerTag);
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
};

const buildProjects = async () => {
  return execPromise(`pnpm nx:build`)
    .then((response) => {
      if (response?.stderr?.length) {
        console.log(response?.stderr);
      } else {
        console.log(`[Highhammer] All projects are build successfully.`);
        const projects = getProjectVersionsJson();
        // @INFO: Copy all the dist folder into the project's own folder
        const promiseBatch = Object.keys(projects)
          .filter((projectName) => {
            return !PROJECTS_EXCLUDED.includes(projectName);
          })
          .map((projectName) => {
            return execPromise(`rm -rf ./apps/${projectName}/dist && cp -r ./dist/apps/${projectName}/ ./apps/${projectName}/dist/`)
              .catch(() => undefined);
          })
        return Promise.all(promiseBatch);
      }
    })
    .catch((e) => {
      console.error('[Highhammer] An error occurred while building the projects.', e);
      process.exit(1);
    });
};

const tagAndPushProjectHelmChart = async (chartName, chartPath, version) => {
  // @INFO: Only client-app is packaged for testing purposes.
  if (chartName === 'client-app') {
    const zippedFile = `${chartName}-${version}.tgz`;
    return runCmd(`helm lint ${chartPath}`)
    .then(() => runCmd(`helm package --dependency-update --version ${version} --app-version ${version} ${chartPath}`))
    .then(() => runCmd(`helm push ${zippedFile} oci://${OCI_REPOSITORY_URL}/helm`))
    .then(() => runCmd(`helm show all "oci://${OCI_REPOSITORY_URL}/helm/${chartName}" --version ${version}`)).then((response) => console.log(response.stdout))
    .then(() => runCmd(`rm -f ./${zippedFile}`))
    .catch((e) => {
      console.error(`[Highhammer] An error occurred while packaging the chart ${chartName}`, e);
      process.exit(1);
    });
  }
  return Promise.resolve();
};

const tagAndPushProjectHelmCharts = async () => {
  if (!OCI_REPOSITORY_URL) {
    return Promise.reject('[Highhammer][Error] Please pass the OCI repository url as an argument.')
  }
  const projects = getProjectVersionsJson();
  const latestTagVersion = await getLatestTagVersion();
  const promiseBatch = Object.keys(projects)
    .filter((projectName) => !PROJECTS_EXCLUDED.includes(projectName))
    .map((projectName) => {
      const chartName = projectName;
      const version = latestTagVersion;
      const chartPath = path.resolve(__dirname, `../../charts/${projectName}`);
      return tagAndPushProjectHelmChart(chartName, chartPath, version);
    });
  // @TODO: Project charts are pushed above. Those are the sub-charts. There should be main chart which include all the sub-charts as dependencies with their corresponding versions.
  return Promise.all(promiseBatch)
};

const helmDryRun = async () => {
  // @TODO: Here only dry-run the main chart. Do not do it for subcharts. For testing purposes, now only the sub-chart client-app is being dry-run.
  const projects = getProjectVersionsJson();
  const latestTagVersion = await getLatestTagVersion();
  const promiseBatch = Object.keys(projects)
    .filter((projectName) => ['client-app'].includes(projectName))
    .map((projectName) => {
      const chartName = projectName;
      const version = latestTagVersion;
      // For local testing
      // helm upgrade --install client-app --version 1.3.43 oci://localhost:${ZOT_PORT_INSIDE_MINIKUBE}/helm/client-app --set image.repository="host.minikube.internal:5020/client-app" --set image.tag="1.3.43"

      // For remote images
      // helm upgrade --install client-app --version 1.3.43 oci://localhost:${ZOT_PORT_INSIDE_MINIKUBE}/helm/client-app --set image.repository="bugrauluyurt/client-app" --set image.tag="1.3.43"
      return runCmd(`helm upgrade --install ${chartName} --version ${version} oci://${OCI_REPOSITORY_URL}/helm/${chartName} --set image.repository="host.minikube.internal:${DOCKER_REGISTRY_PORT}/${chartName}" --set image.tag="${version}"`)
    })
  return Promise.all(promiseBatch)
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
};

// @TODO: Filtered projects list can be given here to all functions here from the start
const run = async () => {
  try {
    await runJob(
      '[Highhammer] Job->buildProjects()',
      buildProjects
    );
    await runJob(
      '[Highhammer] Job->tagAndPushProjectDockerImages()',
      tagAndPushProjectDockerImages
    );
    await runJob(
      '[Highhammer] Job->tagAndPushProjectHelmCharts()',
      tagAndPushProjectHelmCharts
    );
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

run();
