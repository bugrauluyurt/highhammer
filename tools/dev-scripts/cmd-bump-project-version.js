'use strict';

const fs = require('fs');
const path = require('path');

const processArguments = process.argv.slice(2);

const PROJECT_NAME = processArguments[0];
const VERSION = processArguments[1];

const getProjectPackageJsonPath = (projectName) => path.resolve(__dirname, `../../apps/${projectName}/package.json`);

const getProjectPackageJson = (projectName) => {
  const json = fs.readFileSync(getProjectPackageJsonPath(projectName));
  return JSON.parse(json);
}

const bumpProjectVersion = (projectName, nextCalver) => {
  const projectPackageJson = {...getProjectPackageJson(projectName)};
  projectPackageJson.version = nextCalver;
  fs.writeFileSync(getProjectPackageJsonPath, JSON.stringify(projectPackageJson));
}

const run = () => {
  try {
    if (!PROJECT_NAME?.length || !VERSION?.length) {
      throw Error('Please input a projectName and version as a cmd line argument.');
    }
    bumpProjectVersion(PROJECT_NAME, VERSION);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();

