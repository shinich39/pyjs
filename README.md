# pyjs

Python wrapper.

## Usage

```js
import py from 'pyjs';

(async function() {
  const TEST_PATH = path.join(__dirname, "test");
  const SCRIPT_PATH = path.join(__dirname, "test/script.py");
  const MODULE_PATH = path.join(__dirname, "test/module.zip"); 

  // create a virtual environment
  await py.venv();

  // install module in venv
  await py.install(MODULE_PATH);

  // execute script.
  // script is import installed module in venv.
  const { stdout, stderr } = await py.exec(SCRIPT_PATH);
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
})();

```