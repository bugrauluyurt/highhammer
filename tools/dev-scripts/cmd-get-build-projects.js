'use strict';

const fs = require('fs');
const path = require('path');
const { PROJECTS_EXCLUDED } = require('./utils');

const processArguments = process.argv.slice(2);

const AFFECTED_APPS = processArguments[0];

const getVersionsPath = () => path.resolve(__dirname, '../../versions.json')

const getVersionsJson = () => {
  const json = fs.readFileSync(getVersionsPath());
  return JSON.parse(json);
}

const getBuildProjects = () => {
  const projects = {...getVersionsJson()};
  let inputAffectedApps = AFFECTED_APPS ? JSON.parse(AFFECTED_APPS) : [];
  if (!(inputAffectedApps instanceof Array)) {
    inputAffectedApps = [];
  }
  const allWorkspaceProjects = Object.keys(projects)
  const generatedProjects = allWorkspaceProjects.map((projectName) => {
    if (PROJECTS_EXCLUDED.includes(projectName)) {
      return undefined;
    }
    if (!inputAffectedApps.length) {
      return projectName;
    }
    return inputAffectedApps.includes(projectName) ? projectName : undefined
  }).filter(Boolean)
  return JSON.stringify(generatedProjects.length ? generatedProjects : allWorkspaceProjects);
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

