const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs').promises;
const { exec, spawn } = require('child_process');

async function run() {
  try {
    const src = core.getInput('src');
    const dest = core.getInput('dest');
    const username = core.getInput('username');
    const server_ip = core.getInput('server-ip');
    const ssh_key = core.getInput('ssh-key');
    const proxy_username = core.getInput('proxy-username');
    const proxy_server_ip = core.getInput('proxy-server-ip');
    const proxy_ssh_key = core.getInput('proxy-ssh-key');

    // Check proxy input
    let hasProxy = false;
    if (proxy_ssh_key != '') {
      hasProxy = true;
    }

    // mkdir
    await fs.mkdir('.ssh', { mode: '700' });

    // Write key to file
    await fs.writeFile('.ssh/ssh_key', ssh_key, { mode: '600' });
    if (hasProxy) {
      await fs.writeFile('.ssh/proxy_ssh_key', proxy_ssh_key, { mode: '600' });
    }

    // Fix permissions on Windows
    if (process.platform == 'win32') {
      let cmd;
      cmd = 'icacls .ssh/ssh_key /inheritance:r';
      await exec(cmd);
      cmd = 'icacls .ssh/ssh_key /grant:r "%username%":"(R)"';
      await exec(cmd);
      if (hasProxy) {
        let cmd;
        cmd = 'icacls .ssh/proxy_ssh_key /inheritance:r';
        await exec(cmd);
        cmd = 'icacls .ssh/proxy_ssh_key /grant:r "%username%":"(R)"';
        await exec(cmd);
      }
    }

    // Execute SCP
    let cmd;
    if (!hasProxy) {
      cmd = `scp -r -vvv -o StrictHostKeyChecking=no -i .ssh/ssh_key ${src} ${username}@${server_ip}:${dest}`;
    } else {
      cmd = `scp -r -vvv -o StrictHostKeyChecking=no -i .ssh/ssh_key -o ProxyCommand='ssh -W %h:%p -o StrictHostKeyChecking=no -i .ssh/proxy_ssh_key ${proxy_username}@${proxy_server_ip}' ${src} ${username}@${server_ip}:${dest}`;
    }
    console.log(cmd);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
      }
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
