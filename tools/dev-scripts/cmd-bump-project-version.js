'use strict';

const fs = require('fs');
const path = require('path');

const processArguments = process.argv.slice(2);

const PROJECT_NAME = processArguments[0];
const VERSION = processArguments[1];

const getVersionsJsonPath = () => path.resolve(__dirname, `../../versions.json`);

const getVersionsJson = () => {
  const json = fs.readFileSync(getVersionsJsonPath());
  return JSON.parse(json);
}

const bumpProjectVersion = (projectName, nextCalver) => {
  const versionsJson = {...getVersionsJson()};
  versionsJson[projectName] = nextCalver;
  fs.writeFileSync(getVersionsJsonPath(), JSON.stringify(versionsJson, null, 4));
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

