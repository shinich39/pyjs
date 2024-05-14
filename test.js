import py from "./index.js";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  await py.exec(SCRIPT_PATH);

  // const { stdout, stderr } = await py.exec(SCRIPT_PATH);
  // console.log(`stdout: ${stdout}`);
  // console.log(`stderr: ${stderr}`);
  // console.log(`to JSON: `, JSON.parse(stdout.split("\n").pop()));
})();


