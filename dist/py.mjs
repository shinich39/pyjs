// index.js
import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";
var [PYTHON_FILENAME, PYTHON_COMMAND, PIP_FILENAME, PIP_COMMAND] = function() {
  if (isWin()) {
    return ["python.exe", "python", "pip.exe", "pip"];
  } else if (isMac()) {
    return ["python", "python", "pip", "pip"];
  } else if (isLinux()) {
    return ["python", "python", "pip", "pip"];
  } else {
    return [null, null, null, null];
  }
}();
function isWin() {
  return process.platform === "win32";
}
function isMac() {
  return process.platform === "darwin";
}
function isLinux() {
  return process.platform === "linux";
}
function S(filePath, args) {
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
    child.on("exit", function(code, signal) {
      resolve({ stdout, stderr });
    });
  });
}
function chkDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}
function rmDir(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true });
  }
}
var Py = class {
  /**
   *
   * @param {string} installPath default "."
   */
  constructor(installPath) {
    installPath = installPath || ".";
    this.__installPath__ = installPath;
    this.__venvPath__ = path.join(installPath, "venv");
    this.__scriptsPath__ = path.join(installPath, "venv", "Scripts");
    this.__pythonPath__ = path.join(
      installPath,
      "venv",
      "Scripts",
      PYTHON_FILENAME
    );
    this.__pipPath__ = path.join(installPath, "venv", "Scripts", PIP_FILENAME);
    this.__isInitialized__ = this.chkInit();
  }
};
Py.prototype.getPyCmd = function() {
  return this.__isInitialized__ ? this.__pythonPath__ : PYTHON_COMMAND;
};
Py.prototype.getPipCmd = function() {
  return this.__isInitialized__ ? this.__pipPath__ : PIP_COMMAND;
};
Py.prototype.chkInit = function() {
  return fs.existsSync(this.__installPath__) && fs.existsSync(this.__venvPath__) && fs.existsSync(this.__scriptsPath__) && fs.existsSync(this.__pythonPath__) && fs.existsSync(this.__pipPath__);
};
Py.prototype.init = async function(force) {
  if (!PYTHON_COMMAND) {
    throw new Error(`${process.platform} has not been supported.`);
  }
  if (!this.__isInitialized__) {
    chkDir(this.__installPath__);
    if (force) {
      rmDir(this.__venvPath__);
    }
    chkDir(this.__venvPath__);
    await S(PYTHON_COMMAND, ["-m", "venv", this.__venvPath__]);
    this.__isInitialized__ = this.chkInit();
    if (!this.__isInitialized__) {
      throw new Error("Can not create venv.");
    }
  }
};
Py.prototype.destory = async function() {
  rmDir(this.__venvPath__);
  this.__isInitialized__ = this.chkInit();
};
Py.prototype.freeze = async function() {
  const res = await S(this.getPipCmd(), ["freeze"]);
  return res;
};
Py.prototype.getModules = async function() {
  const { stdout, stderr } = await this.freeze();
  return stdout.replace(/\r\n/g, "\n").replace(/\n$/, "").split(/\n/).map(function(item) {
    return {
      name: item.split("==")[0],
      version: item.split("==")[1]
    };
  });
};
Py.prototype.install = async function(moduleName, args) {
  const res = await S(
    this.getPipCmd(),
    ["install", moduleName].concat(args || [])
  );
  return res;
};
Py.prototype.isInstalled = async function(moduleName) {
  const modules = await this.getModules();
  for (const m of modules) {
    if (m.name.indexOf(moduleName) === 0) {
      return true;
    }
  }
  return false;
};
Py.prototype.exec = async function(scriptPath, args) {
  const res = await S(this.getPyCmd(), [scriptPath].concat(args || []));
  return res;
};
export {
  Py
};
