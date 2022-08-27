const util = require('node:util');
const path = require('path');
const fs = require('fs');
const { getArgs } = require('./cmd-args');
const exec = util.promisify(require('node:child_process').exec);

