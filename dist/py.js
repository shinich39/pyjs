var pyjs = (function (exports, path, fs, node_child_process) {
  'use strict';

  const [PYTHON_FILENAME, PYTHON_COMMAND, PIP_FILENAME, PIP_COMMAND] =
    (function () {
      if (isWin()) {
        return ["python.exe", "python", "pip.exe", "pip"];
      } else if (isMac()) {
        return ["python", "python", "pip", "pip"];
      } else if (isLinux()) {
        return ["python", "python", "pip", "pip"];
      } else {
        return [null, null, null, null];
      }
    })();
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
    return new Promise(function (resolve, reject) {
      let stdout = "";
      let stderr = "";

      const child = node_child_process.spawn(filePath, args);

      child.stdout.on("data", function (data) {
        stdout += data.toString();
      });

      child.stderr.on("data", function (data) {
        stderr += data.toString();
      });

      child.on("error", function (err) {
        reject(err);
      });

      child.on("exit", function (code, signal) {
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
  class Py {
    /**
     *
     * @param {string} installPath default "."
     */
    constructor(installPath) {
      this.__installPath__ = installPath || ".";
      this.__venvPath__ = path.join(installPath, "venv");
      this.__scriptsPath__ = path.join(installPath, "venv", "Scripts");
      this.__pythonPath__ = path.join(
        installPath,
        "venv",
        "Scripts",
        PYTHON_FILENAME,
      );
      this.__pipPath__ = path.join(installPath, "venv", "Scripts", PIP_FILENAME);
      this.__isInitialized__ = this.chkInit();
    }
  }
  Py.prototype.getPyCmd = function () {
    return this.__isInitialized__ ? this.__pythonPath__ : PYTHON_COMMAND;
  };
  Py.prototype.getPipCmd = function () {
    return this.__isInitialized__ ? this.__pipPath__ : PIP_COMMAND;
  };
  Py.prototype.chkInit = function () {
    return (
      fs.existsSync(this.__installPath__) &&
      fs.existsSync(this.__venvPath__) &&
      fs.existsSync(this.__scriptsPath__) &&
      fs.existsSync(this.__pythonPath__) &&
      fs.existsSync(this.__pipPath__)
    );
  };
  /**
   * Check if venv is created.
   * @param {boolean} force Create venv after remove exists venv
   * @returns
   */
  Py.prototype.init = async function (force) {
    if (!PYTHON_COMMAND) {
      throw new Error(`${process.platform} has not been supported.`);
    }
    if (!this.__isInitialized__) {
      chkDir(this.__installPath__);

      if (force) {
        rmDir(this.__venvPath__);
      }

      chkDir(this.__venvPath__);

      // create venv
      await S(PYTHON_COMMAND, ["-m", "venv", this.__venvPath__]);

      // check venv
      this.__isInitialized__ = this.chkInit();

      if (!this.__isInitialized__) {
        throw new Error("Can not create venv.");
      }
    }
  };
  /**
   *
   */
  Py.prototype.destory = async function () {
    rmDir(this.__venvPath__);
    this.__isInitialized__ = this.chkInit();
  };
  /**
   *
   * @returns {Promise<{stdout: string, stderr: string}>}
   */
  Py.prototype.freeze = async function () {
    const res = await S(this.getPipCmd(), ["freeze"]);

    return res;
  };
  /**
   *
   * @returns {Promise<{name: string, version: string}[]>}
   */
  Py.prototype.getModules = async function () {
    const { stdout, stderr } = await this.freeze();

    return stdout
      .replace(/\r\n/g, "\n")
      .replace(/\n$/, "")
      .split(/\n/)
      .map(function (item) {
        return {
          name: item.split("==")[0],
          version: item.split("==")[1],
        };
      });
  };
  /**
   * Check if module is installed in venv.
   * @param {string} moduleName path or name
   * @param {array} args
   * @returns {Promise<{stdout: string, stderr: string}>}
   */
  Py.prototype.install = async function (moduleName, args) {
    const res = await S(
      this.getPipCmd(),
      ["install", moduleName].concat(args || []),
    );

    return res;
  };
  /**
   *
   * @param {string} moduleName
   * @returns {Promise<boolean>}
   */
  Py.prototype.isInstalled = async function (moduleName) {
    const modules = await this.getModules();

    for (const m of modules) {
      if (m.name.indexOf(moduleName) === 0) {
        return true;
      }
    }

    return false;
  };
  /**
   *
   * @param {string} scriptPath
   * @param {array} args
   * @returns {Promise<{stdout: string, stderr: string}>}
   */
  Py.prototype.exec = async function (scriptPath, args) {
    const res = await S(this.getPyCmd(), [scriptPath].concat(args || []));

    return res;
  };

  exports.Py = Py;

  return exports;

})({}, path, fs, node_child_process);
