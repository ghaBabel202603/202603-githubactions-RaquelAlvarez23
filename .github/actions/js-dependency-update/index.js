const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    const baseBranch = core.getInput('base-branch', { required: true });
    const targetBranch = core.getInput('target-branch', { required: true });
    const workingDirectory = core.getInput('working-directory', { required: true });
    const ghToken = core.getInput('gh-token', { required: true });
    const debug = core.getBooleanInput('debug');

    core.setSecret(ghToken);

    // Validate inputs
    const commonValidationRegex = /^[a-zA-Z0-9-_/]+$/;

    if (!commonValidationRegex.test(baseBranch)) {
      core.setFailed('The base branch name is invalid.');
      return;
    }

    if (!commonValidationRegex.test(targetBranch)) {
      core.setFailed('The target branch name is invalid.');
      return;
    }

    if (!commonValidationRegex.test(workingDirectory)) {
      core.setFailed('The working directory name is invalid.');
      return;
    }

    core.info(`Base branch: ${baseBranch}`);
    core.info(`Target branch: ${targetBranch}`);
    core.info(`Working directory: ${workingDirectory}`);

    if (debug) {
      core.info('Debug mode is enabled');
    }

    await exec.exec('npm', ['update'], {
      cwd: workingDirectory
    });

    const gitStatusOutput = await exec.getExecOutput('git', ['status', '-s', 'package*.json'], {
      cwd: workingDirectory
    });

    if (gitStatusOutput.stdout.length > 0) {
      core.info('There are updates available.');
    } else {
      core.info('There are no updates at this point in time.');
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
