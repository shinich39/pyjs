# pyjs

Python wrapper.

## Installation

- win

```console
git clone https://github.com/shinich39/jsm.git && cd ./jsm && rm -r -Force .git && cd ..
```

- osx

```console
git clone https://github.com/shinich39/jsm.git && cd ./jsm && rm -rf .git && cd ..
```

## Packaging

```js
// package.json
{
	...
	// include module while "npm pack"
	"bundleDependencies": [
		"path",
		"moment"
	]
}
```

```console
npm pack
```

## Usage

```console
npm install my-module-1.0.0.tgz
```

```js
const myModule = require('my-module'); // cjs
import myModule from 'my-module'; // esm
const { sum, test } = window.myModule; // browser
```