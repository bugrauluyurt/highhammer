'use strict';

const fs = require('fs');
const path = require('path');

const getVersionsPath = () => path.resolve(__dirname, '../../versions.json')
const getProjectPath = (projectName) => path.resolve(__dirname, `../../apps/${projectName}`)

const getVersionsJson = () => {
  const json = fs.readFileSync(getVersionsPath());
  return JSON.parse(json);
}

const deleteOtherProjectFolders = (projectName) => {
  const projects = {...getVersionsJson()};
  Object.keys(projects).forEach((key) => {
    if (key !== projectName) {
      const projectPath = getProjectPath(key);
      fs.rmSync(projectPath, { recursive: true, force: true });
    }
  });
}

const run = () => {
  try {
    // Get process args
    const args = process.argv.slice(2);
    if (!args.length) {
      console.error('Please provide the project name as an argument')
      return process.exit(1);
    }
    const projectName = args[0]

    // Deletes other project folders to prevent duplicate package installation with pnpm.
    deleteOtherProjectFolders(projectName)

    process.exit(0);

  } catch (e) {

    console.error(e);
    process.exit(1);

  }

};

run();

