'use strict';

const fs = require('fs');
const path = require('path');
const calver = require('calver');

const processArguments = process.argv.slice(2);

const PROJECT_NAME = processArguments[0];
const CALVER_FORMAT = 'YYYY.0M.0D.MINOR';

const getVersionsJsonPath = () => path.resolve(__dirname, `../../versions.json`);

const getVersionsJson = () => {
  const json = fs.readFileSync(getVersionsJsonPath());
  return JSON.parse(json);
}

const getCurrentCalverDate = (date = new Date(), format = 'yyyy.mm.dd') => {
  const map = {
      mm: (date.getMonth() + 1).toString(),
      dd: date.getDate().toString(),
      yyyy: date.getFullYear().toString()
  };
  Object.entries(map).forEach(([key, value]) => {
    if (value.length === 1) {
      map[key] = `0${value}`;
    }
  })
  return format.replace(/mm|dd|yyyy/gi, matched => map[matched]);
}

const generateNextCalver = (projectName) => {
  let versionCurrent = getVersionsJson()[projectName] || '';
  if (versionCurrent === '0.0.0') {
    versionCurrent = '';
  }
  const currentCalverDate = getCurrentCalverDate();
  if (!versionCurrent.length) {
    versionCurrent = `${currentCalverDate}.0`
  } else {
    const versionCurrentOnlyDate = versionCurrent.slice(0, 10);
    if (versionCurrentOnlyDate !== currentCalverDate) {
      versionCurrent = `${currentCalverDate}.0`
    }
  }
  // @INFO: Calver always increases as minor version.
  const versionType = 'minor';
  return calver.inc(CALVER_FORMAT, versionCurrent, versionType);
}

const run = () => {
  try {
    if (!PROJECT_NAME?.length) {
      throw Error('Please input a projectName as a cmd line argument.');
    }
    const nextCalver = generateNextCalver(PROJECT_NAME);
    // @INFO: Log is for getting the stdout
    console.log(nextCalver);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();

