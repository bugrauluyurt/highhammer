'use strict';

const fs = require('fs');
const path = require('path');

const getWorkSpacePath = () => path.resolve(__dirname, '../../workspace.json')

const getWorkSpaceJson = () => {
  const json = fs.readFileSync(getWorkSpacePath());
  return JSON.parse(json);
}

const run = () => {
  try {
    const args = process.argv.slice(2);

    if (!args.length) {
      console.error('Please provide the project name as an argument')
      return process.exit(1);
    }

    const projectName = args[0]

    const workSpaceJson = {...getWorkSpaceJson()};

    Object.keys(workSpaceJson.projects).forEach((key) => {
      if (key !== projectName) {
        delete workSpaceJson.projects[key]
      }
    });

    fs.writeFileSync(getWorkSpacePath(), JSON.stringify(workSpaceJson));

    process.exit(0);

  } catch (e) {

    console.error(e);
    process.exit(1);

  }

};

run();

