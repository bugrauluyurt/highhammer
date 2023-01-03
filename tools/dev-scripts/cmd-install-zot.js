const path = require('path');
const util = require('node:util');
const childProcess = require('node:child_process');
const execPromise = util.promisify(childProcess.exec);

// @INFO: Zot is used for testing local oci repository operations

const ZOT_OCI_REPOSITORY_PORT = 5000;

const runCmd = (cmd) => {
  const cleanCmd = cmd.replace(/\n/, '');
  console.log(`$ ${cleanCmd}`)
  return execPromise(cleanCmd);
}

const addZotRepo = async () => {
  return runCmd('helm repo add project-zot http://zotregistry.io/helm-charts && helm repo update project-zot && helm show values project-zot/zot');
};

const installZot = async () => {
  return runCmd(`helm upgrade --install --set service.port=${ZOT_OCI_REPOSITORY_PORT} zot project-zot/zot`);
};

const getOCINodePortUrl = async () => {
  return runCmd(path.resolve(__dirname, './cmd-get-oci-nodeport-url.sh')).then((response) => {
    return response.stdout;
  });
};

const run = async () => {
  await addZotRepo();
  await installZot().then(() => {
    console.log(`[Highhammer] Installed Zot OCI successfully. If you want to uninstall zot run => helm uninstall zot`);
  });
  await getOCINodePortUrl().then((url) => {
    console.log(`[Highhammer] Zot OCI running on NodePort ${url}. Authentication is disabled for dev purposes.`.replace(/\n/, ''));
  });
}

module.exports = {
  run
};
