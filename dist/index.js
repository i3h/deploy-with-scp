module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(775);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 375:
/***/ (function(module) {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 510:
/***/ (function(module, __unusedexports, __webpack_require__) {

const core = __webpack_require__(868);
const github = __webpack_require__(375);
const fs = __webpack_require__(747).promises;
const { exec } = __webpack_require__(129);

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

    // scp src root@server_ip:dest
    let cmd;
    if (!hasProxy) {
      cmd = `scp -r -o StrictHostKeyChecking=no -i .ssh/ssh_key ${src} ${username}@${server_ip}:${dest}`;
    } else {
      cmd = `scp -r -o StrictHostKeyChecking=no -i .ssh/ssh_key -o ProxyCommand='ssh -W %h:%p -o StrictHostKeyChecking=no -i .ssh/proxy_ssh_key ${proxy_username}@${proxy_server_ip}' ${src} ${username}@${server_ip}:${dest}`;
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


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 775:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const run = __webpack_require__(510);

run();


/***/ }),

/***/ 868:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ })

/******/ });