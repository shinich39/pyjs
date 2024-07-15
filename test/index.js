import { Py } from "../index.js";

const MODULE_NAME = "python-resize-image";
const SCRIPT_PATH_1 = "./test/src/script.py";
const SCRIPT_PATH_2 = "./test/src/script-example.py";

(async function () {
  const installPath = "."; // current directory
  const py = new Py(installPath);
  await py.init(); // create virtual environment
  await py.install(MODULE_NAME); // install module in venv
  await py.isInstalled(MODULE_NAME); // check module installed
  await py.freeze(); // get python freeze data
  await py.getModules(); // get installed modules

  // execute python script with installed module
  (async function () {
    await py.install("pillow"); // install module in venv
    console.log(await py.isInstalled(MODULE_NAME));
    console.log(await py.isInstalled("pillow"));
    const { stdout, stderr } = await py.exec(SCRIPT_PATH_1);
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  })();

  // execute python script and return value
  (async function () {
    const { stdout, stderr } = await py.exec(SCRIPT_PATH_2);
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  })();
})();
