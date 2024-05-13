import py from "./index.js";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, "test.py");

py.exec(FILE_PATH)
  .then(function({stdout, stderr}) {
    console.log(JSON.parse(stdout));
  })