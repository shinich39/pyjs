import pkg from "./package.json" assert { type: "json" };
import fs from "node:fs";

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

const MODULE_NAME = pkg.name
  .replace(/\W/g, "-")
  .replace(/-?js$/, "");
const MODULE_VERSION = pkg.version;
const GLOBAL_NAME = camelize(pkg.name)
  .replace(/Js$/, ""); // iife

if (fs.existsSync("./dist")) {
  fs.rmSync("./dist", { recursive: true });
}

export default {
  input: "src/index.js",
  output: [
    {
      file: `dist/${MODULE_NAME}.cjs`,
      format: "cjs",
    },
    {
      file: `dist/${MODULE_NAME}.mjs`,
      format: "esm",
    },
    {
      file: `dist/${MODULE_NAME}.js`,
      name: GLOBAL_NAME,
      format: "iife",
    },
  ],
};
