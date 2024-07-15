import pkg from "./package.json" assert { type: "json" };
import fs from "node:fs";

function camelize(str) {
  return str.replace(/[_.-](\w|$)/g, function (_, x) {
    return x.toUpperCase();
  });
}

const MODULE_NAME = pkg.name.replace(/\W/g, "-").replace(/-?js$/, "");
const MODULE_VERSION = pkg.version;
const GLOBAL_NAME = camelize(pkg.name).replace(/Js$/, ""); // iife

if (fs.existsSync("./dist")) {
  fs.rmSync("./dist", { recursive: true });
}

export default {
  input: "index.js",
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
