# py-js

Create a python wrapper with js.

## Requirements

- nodejs
- python3

## Usage

```js
import { Py } from "py-js";

(async function () {
  // current directory
  const installPath = ".";

  const py = new Py(installPath);

  // create virtual environment
  await py.init();

  // check module installed
  const booleen = await py.isInstalled("python-resize-image");

  // install module in venv
  await py.install("python-resize-image");

  // execute python script with installed module
  const { stdout, stderr } = await py.exec("./test/src/script.py");

  // get data from python script
  const { stdout, stderr } = await py.exec("./test/src/script-example.py");
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);

  // get python freeze data
  const { stdout, stderr } = await py.freeze();

  // get installed modules
  const modules = await py.getModules();

  // Remove venv
  await py.destory();
})();
```
