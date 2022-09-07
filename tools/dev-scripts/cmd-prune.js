const util = require('node:util');
const execPromise = util.promisify(require('node:child_process').exec);

const pruneContainers = () => {
  return execPromise('docker container prune -f').catch((e) => {
    console.error('[Highhammer] An error occurred while pruning docker containers.', e);
  }).finally(() => console.log('[Highhammer] Container prune completed.'));
};

const pruneImages = () => {
  return execPromise('docker images | grep none').then((output) => {
    if (!output?.stdout?.length) {
      return;
    }
    const imageIdExecs = [];
    output.stdout.split('\n').forEach((line) => {
      if (!line || !line.length) {
        return;
      }
      const sanitizedLine = line.replace(/\s\s+/g, ' ').split(' ');
      const imageId = sanitizedLine[2];
      if (imageId?.length) {
        imageIdExecs.push(
          execPromise(`docker image rm ${imageId} -f`)
            .then(() => console.log(`[Highhammer] Docker image with id:${imageId} removed.`))
            .catch()
        );
      }
    });
    return Promise.all(imageIdExecs);
  }).catch(() => {
    return 'error'
  }).finally(() => console.log('[Highhammer] Image removal completed.'))
};

const stopDockerCompose = () => {
  return execPromise('docker compose -f ./docker-compose.workspace.yaml down')
    .then((response) => {
      if (response?.stderr?.length) {
        console.log(response?.stderr);
      }
    })
    .catch((e) => {
      console.error('[Highhammer] An error occurred while executing docker compose down.', e);
    });
};

const prune = () => {
  return pruneContainers()
    .then(() => pruneImages());
}

const handleSuccess = () => {
  console.error('[Highhammer] Docker prune operation completed.');
  process.exit(0);
};

const handleError = (error) => {
  console.error('[Highhammer] An error occurred while pruning docker assets.', error);
  process.exit(1);
}

const run = () => {
  prune()
    .then(handleSuccess)
    .catch(handleError);
}

run();
