'use strict';

const fs = require('fs');
const path = require('path');

const processArguments = process.argv.slice(2);

const AFFECTED_APPS = processArguments[0];

const getWorkSpacePath = () => path.resolve(__dirname, '../../workspace.json')

const getWorkSpaceJson = () => {
  const json = fs.readFileSync(getWorkSpacePath());
  return JSON.parse(json);
}

const getBuildProjects = () => {
  const workSpaceJson = {...getWorkSpaceJson()};
  let inputAffectedApps = AFFECTED_APPS ? JSON.parse(AFFECTED_APPS) : [];
  if (!(inputAffectedApps instanceof Array)) {
    inputAffectedApps = [];
  }
  const allWorkspaceProjects = Object.keys(workSpaceJson.projects)
  const generatedProjects = allWorkspaceProjects.map((projectName) => {
    if (projectName.includes('e2e') || projectName.includes('api-worker')) {
      return undefined;
    }
    if (!inputAffectedApps.length) {
      return projectName;
    }
    return inputAffectedApps.includes(projectName) ? projectName : undefined
  }).filter(Boolean)
  return JSON.stringify(generatedProjects.length ? generateProject : allWorkspaceProjects);
}

const run = () => {
  try {
    console.log(getBuildProjects())
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();

