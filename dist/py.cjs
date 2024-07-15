"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.js
var py_js_exports = {};
__export(py_js_exports, {
  Py: () => Py
});
module.exports = __toCommonJS(py_js_exports);
var import_node_path = __toESM(require("node:path"), 1);
var import_node_fs = __toESM(require("node:fs"), 1);
var import_node_child_process = require("node:child_process");
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
    const child = (0, import_node_child_process.spawn)(filePath, args);
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
  if (!import_node_fs.default.existsSync(p)) {
    import_node_fs.default.mkdirSync(p, { recursive: true });
  }
}
function rmDir(p) {
  if (import_node_fs.default.existsSync(p)) {
    import_node_fs.default.rmSync(p, { recursive: true });
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
    this.__venvPath__ = import_node_path.default.join(installPath, "venv");
    this.__scriptsPath__ = import_node_path.default.join(installPath, "venv", "Scripts");
    this.__pythonPath__ = import_node_path.default.join(
      installPath,
      "venv",
      "Scripts",
      PYTHON_FILENAME
    );
    this.__pipPath__ = import_node_path.default.join(installPath, "venv", "Scripts", PIP_FILENAME);
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
  return import_node_fs.default.existsSync(this.__installPath__) && import_node_fs.default.existsSync(this.__venvPath__) && import_node_fs.default.existsSync(this.__scriptsPath__) && import_node_fs.default.existsSync(this.__pythonPath__) && import_node_fs.default.existsSync(this.__pipPath__);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Py
});
