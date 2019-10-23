# luctst-cli

[![Build Status](https://travis-ci.com/luctst/luctst-cli.svg?branch=master)](https://travis-ci.com/luctst/luctst-cli)
[![NPM version](https://img.shields.io/npm/v/luctst-cli?style=flat-square)](https://img.shields.io/npm/v/luctst-cli?style=flat-square)
[![Package size](https://img.shields.io/bundlephobia/min/luctst-cli)](https://img.shields.io/bundlephobia/min/luctst-cli)
[![Dependencies](https://img.shields.io/david/luctst/luctst-cli.svg?style=popout-square)](https://david-dm.org/luctst/luctst-cli)
[![devDependencies Status](https://david-dm.org/luctst/luctst-cli/dev-status.svg?style=flat-square)](https://david-dm.org/luctst/luctst-cli?type=dev)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Twitter](https://img.shields.io/twitter/follow/luctstt.svg?label=Follow&style=social)](https://twitter.com/luctstt)

*A cli tool to generate node module project.*

## Features
* Eslint.
* Prettier.
* Ava.
* Continue integration with TravisCi

## Usage
To start using this package create a folder and run this command:
```
npx luctst-cli
```
Follow the instructions :).

If you don't have npx try updating your nodejs version or run:
```
npm install luctst-cli -g
```

Once your structure is created install all dependencies that you need and choose a script:
```
npm run test:watch
```

Watch all files with `ava` in `test/` folder.
```
npm run lint:watch
```

Watch all files with `estlint`, `prettier` in `lib` folder.
> **Note** - Prettier can fix some errors automatically, run `npm run lint:fix`

> **Note** - You must have node10.0.0

## Structure
```
├── .github
│	├── ISSUE_TEMPLATE
│	│	├── bug_report.md
│	│	├── feature_request.md
│	├── CODE_OF_CONDUCT.md
│	├── CONTRIBUTING.md
│	├── LICENSE
│	├── pull_request_template.md
├── lib
├── test
│	├── test.js
│	├── .editorconfig
│	├── .estlintrc.json
│	├── .gitattributes
│	├── .gitignore
│	├── .prettierignore
│	├── .prettierrc.json
│	├── .travis.yml
│	├── package-lock.json
│	├── package.json
│	├── README.md
```

## Contributing
You've found an issue ? A new idea for the project and you want contribute ? It's nice, but before coding make sure you have read the [CONTRIBUTING.md](https://github.com/luctst/luctst-cli/blob/master/.github/CONTRIBUTING.md) file it is important.

## Licence
MIT [LICENSE](https://github.com/luctst/luctst-cli/blob/master/.github/LICENSE)

<p style="font-size:8px;text-align:center;margin-top:50px;">File generated with <a href="https://github.com/luctst/get-good-readme">get-good-readme</a> module.</p>
