const util = require('node:util');
const path = require('path');
const fs = require('fs');
const { getArgs } = require('./cmd-args');
const exec = util.promisify(require('node:child_process').exec);

const defaultShell = process.env.SHELL;

const checkNvmVersion = () => {
  const nvmNodeVersionPath = path.resolve(__dirname, '../../.nvmrc');
  return new Promise((resolve, reject) => {
    fs.readFile(nvmNodeVersionPath, 'utf8', (err, nvmNodeVersion) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(nvmNodeVersion);
    });
  })
  .then((nvmNodeVersion) => ({ nvmNodeVersion }))
  .catch((error) => ({ nvmNodeError: error }))
};

const checkNodeVersion = () => exec("node -v", { shell: defaultShell })
  .then((output) => ({ node: true, nodeVersion: output.stdout }))
  .catch((output) => ({ node: false, nodeError: output.stderr }));

const checkDocker = () => exec("docker --version", { shell: defaultShell })
  .then(() => ({ docker: true }))
  .catch((output) => ({ docker: false, dockerError: output.stderr }));

const checkEnvFiles = () => {
  const hostEnvExists = fs.existsSync(path.resolve(__dirname, '../../config/env/.env.host'));
  const qaEnvExists = fs.existsSync(path.resolve(__dirname, '../../config/env/.env.qa'));
  const devEnvExists = fs.existsSync(path.resolve(__dirname, '../../config/env/.env.dev'));
  if (!hostEnvExists || !qaEnvExists || !devEnvExists) {
    if (!hostEnvExists) {
      console.error('[Highhammer][Error] Please put .env.host file inside your ./config/env/ folder.');
    }
    if (!qaEnvExists) {
      console.error('[Highhammer][Error] Please put .env.qa file inside your ./config/env/ folder.');
    }
    if (!devEnvExists) {
      console.error('[Highhammer][Error] Please put .env.dev file inside your ./config/env/ folder.');
    }
    console.error('[Highhammer][Info] You can copy the template .env.${HOST_ENV} file from ./config/env folder for each environment.');
    process.exit(1);
  }
}

const checkCertificates = () => {
  const keyExists = fs.existsSync(path.resolve(__dirname, '../../config/certificates/localhost-key.pem'));
  const crtExists = fs.existsSync(path.resolve(__dirname, '../../config/certificates/localhost-crt.pem'));
  const certificates = { keyExists, crtExists };
  if (!certificates.crtExists || !certificates.keyExists) {
    console.log('[Highhammer][Error] Please make sure you install mkcert before generating your certificates.')
    if (!certificates.crtExists) {
      console.error('[Highhammer][Error] Please generate a localhost-crt.pem file inside your ./config/certificates/ folder by using mkcert.');
    }
    if (!certificates.keyExists) {
      console.error('[Highhammer][Error] Please generate a localhost-key.pem file inside your ./config/certificates/ folder by using mkcert.');
    }
    process.exit(1);
  }
}

const printNodeVersionError = (data) => {
  console.error(`[Highhammer][Error] Please use the correct node version -> ${data?.nvmNodeVersion}`);
  console.error(`[Highhammer][Error] If you have already run 'pnpm install' or 'pnpm setup' please delete all **/*/node_modules folders inside your project.`);
}

const printDockerError = () => {
  console.error('[Highhammer][Error] Please install docker to run the project correctly.');
}

const checkDependencies = () => {
  let request = [
    checkNodeVersion(),
    checkNvmVersion(),
    checkDocker()
  ];

  const { only } = getArgs();
  const isOnlyNode = only === 'node';
  const isOnlyDocker = only === 'docker';

  const partialCheckEnabled = isOnlyNode || isOnlyDocker

  if (!partialCheckEnabled) {
    checkEnvFiles();
    checkCertificates();
  } else {
    if (isOnlyNode) {
      console.log('[Highhammer] Checking only node and nvm version.');
      request = [checkNodeVersion(), checkNvmVersion()]
    }
    if (isOnlyDocker) {
      console.log('[Highhammer] Checking only docker dependency validity.');
      request = [checkDocker()];
    }
  }

  Promise.all(request)
    .then((response) => {
      const data = response.reduce((acc, partial) => {
        return {...acc, ...partial};
      }, {});

      // Only Docker
      if (isOnlyDocker) {
        if (!data.docker) {
          printDockerError();
        }
        return process.exit(!data.docker ? 1 : 0);
      }

      // Only Node
      const isNodeVersionCompatible = (() => data?.node && (data?.nodeVersion === data?.nvmNodeVersion))();
      if (isOnlyNode) {
        if (!isNodeVersionCompatible) {
          printNodeVersionError(data);
        }
        return process.exit(!isNodeVersionCompatible ? 1 : 0);
      }

      // Docker && Node
      const areDependenciesInstalled = isNodeVersionCompatible && data.docker;
      if (!areDependenciesInstalled) {
        if (!isNodeVersionCompatible) {
          printNodeVersionError(data);
        }
        if (!data.docker) {
          printDockerError();
        }
        return process.exit(1);
      }
      console.log('[Highammer] Dependency check successful.');
      return process.exit(0);
    });
};

checkDependencies();

