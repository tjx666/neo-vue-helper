# Neo Vue Helper

![test](https://github.com/tjx666/neo-vue-helper/actions/workflows/test.yml/badge.svg) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com) [![Known Vulnerabilities](https://snyk.io/test/github/tjx666/neo-vue-helper/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tjx666/neo-vue-helper?targetFile=package.json) [![Percentage of issues still open](https://isitmaintained.com/badge/open/tjx666/neo-vue-helper.svg)](http://isitmaintained.com/project/tjx666/neo-vue-helper') [![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg?style=flat-square)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

## Features

### Go to Definition support for `.vue` sfc file

This is mainly for vue2 and vetur users. Vetur doesn't support jump to a `.vue` file which ignore the `.vue` extension in module path. For example:

```javascript
// complete module path is ./components/button/index.vue
import Button from './components/button';

// complete module path is ./comp.vue
import Comp from './comp';
```

This extension also fix the vetur another issue: In monorepo project, you can't use `Go to Definition` for a package which is installed in root but not current workspace.

![Go to Definition](https://github.com/tjx666/neo-vue-helper/blob/main/assets/screenshots/go_to_definition.gif?raw=true)

By default, this feature is disabled, you need manually enable it:

```json
{
  "neoVueHelper.moduleDefinition.enable": true
}
```

Every time you change the above setting, you need to reload vscode to take effect.

## TODOs

- [x] go to definition support for vue sfc module without `.vue` extension and directory index.vue

## My other works

- [Open in External App](https://github.com/tjx666/open-in-external-app)
- [VSCode FE Helper](https://github.com/tjx666/vscode-fe-helper)
- [VSCode archive](https://github.com/tjx666/vscode-archive)
- [Modify File Warning](https://github.com/tjx666/modify-file-warning)

Check all here: [publishers/YuTengjing](https://marketplace.visualstudio.com/publishers/YuTengjing)
