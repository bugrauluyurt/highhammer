'use strict';

const fs = require('fs');
const path = require('path');

// @IMPORTANT: This script is not needed anymore since NX has removed workspace.json.
const getWorkSpacePath = () => path.resolve(__dirname, '../../workspace.json')

const getWorkSpaceJson = () => {
  const json = fs.readFileSync(getWorkSpacePath());
  return JSON.parse(json);
}

const generateWorkspaceJson = (projectName) => {
  const workSpaceJson = {...getWorkSpaceJson()};

  Object.keys(workSpaceJson.projects).forEach((key) => {
    if (key !== projectName) {
      delete workSpaceJson.projects[key]
    }
  });

  fs.writeFileSync(getWorkSpacePath(), JSON.stringify(workSpaceJson));
}

const run = () => {
  try {
    // Set environment variables: Nx automatically sets the env variables, no need to do it manually.
    // setEnvVariables()

    // Get process args
    const args = process.argv.slice(2);
    if (!args.length) {
      console.error('Please provide the project name as an argument')
      return process.exit(1);
    }
    const projectName = args[0]

    // Re-generate the workspace.json file
    generateWorkspaceJson(projectName)

    process.exit(0);

  } catch (e) {

    console.error(e);
    process.exit(1);

  }

};

run();

