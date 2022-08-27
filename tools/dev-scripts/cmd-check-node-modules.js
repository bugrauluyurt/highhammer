const path = require('path');
const fs = require('fs');

const nodeModulePath = path.resolve(__dirname, '../../node_modules');

const isNodeModuleDirEmpty = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(nodeModulePath, function(err, files) {
      if (err) {
        reject(err);
      } else {
        if (!files.length) {
            // directory appears to be empty
            reject(err);
        }
        resolve();
      }
    });
  })
}

const run = () => {
  isNodeModuleDirEmpty()
    .then(() => {
      console.log('[Highhammer] node_modules check successful.')
      process.exit(0);
    })
    .catch(() => {
      console.error('[Highhammer] Please run <npm run setup> to install node modules.')
      process.exit(1);
    })
}

run();


