'use strict';

import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VENV_PATH = path.join(__dirname, "venv");
const SCRIPTS_PATH = path.join(__dirname, "venv", "Scripts");
const ACTIVATE_PATH = path.join(__dirname, "venv", "Scripts", "activate.bat");
const DEACTIVATE_APTH = path.join(__dirname, "venv", "Scripts", "deactivate.bat");
const PIP_PATH = path.join(__dirname, "venv", "Scripts", "pip.exe");

function E(filePath, args) {
  return new Promise(function(resolve, reject) {
    let stdout = "";
    let stderr = "";
  
    const child = spawn(filePath, args);
  
    child.stdout.on("data", function(data) {
      stdout += data.toString();
    });
  
    child.stderr.on("data", function(data) {
      stderr += data.toString();
    });
  
    child.on("error", function(err) {
      reject(err);
    });
  
    child.on('exit', function(code, signal) {
      resolve({stdout, stderr})
    });
  });
}

async function install(modulePath) {
  // clear venv dir
  if (fs.existsSync(VENV_PATH)) {
    fs.rmSync(VENV_PATH, { force: true, recursive: true, });
  }

  // create venv dir
  fs.mkdirSync(VENV_PATH);

  // create venv
  await E("python", [
    "-m",
    "venv",
    VENV_PATH,
  ]);

  // install to venv
  await E(PIP_PATH, [
    "install",
    modulePath,
  ]);
}

async function executeModule(moduleName, args) {
  const modulePath = path.join(SCRIPTS_PATH, `${moduleName}.exe`);
  
  if (!fs.existsSync(modulePath)) {
    throw new Error(`${moduleName} not installed.`);
  }

  // execute module in venv
  const result = await E(modulePath, args || []);

  return result;
}

async function executeScript(scriptPath, args) {
  // execute python script
  const result = await E("python", [scriptPath].concat(args || []));

  return result;
}

// esm
export default {
  install,
  module: executeModule,
  script: executeScript,
}
