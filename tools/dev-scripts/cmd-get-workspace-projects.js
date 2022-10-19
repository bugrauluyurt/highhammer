'use strict';

const fs = require('fs');
const path = require('path');

const getWorkSpacePath = () => path.resolve(__dirname, '../../workspace.json')

const getWorkSpaceJson = () => {
  const json = fs.readFileSync(getWorkSpacePath());
  return JSON.parse(json);
}

const getWorkSpaceProjects = () => {
  const workSpaceJson = {...getWorkSpaceJson()};
  return JSON.stringify(Object.keys(workSpaceJson.projects));
}

const run = () => {
  try {
    getWorkSpaceProjects()
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();

