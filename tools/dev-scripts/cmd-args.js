const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const getArgs = () => {
  return yargs(hideBin(process.argv)).argv;
}

module.exports = {
  getArgs,
}
