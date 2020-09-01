<div align="center">
  <!-- <a href="#">
  	<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy-downsized.gif" alt="Logo project" height="160" />
  </a> -->
  <br>
  <br>
  <p>
    <b>luctst-cli</b>
  </p>
  <p>
     <i>A cli tool to generate node module project.</i>
  </p>
  <p>

[![Build Status](https://travis-ci.com/luctst/luctst-cli.svg?branch=master)](https://travis-ci.com/luctst/luctst-cli)
[![NPM version](https://img.shields.io/npm/v/luctst-cli?style=flat-square)](https://img.shields.io/npm/v/luctst-cli?style=flat-square)
[![Package size](https://img.shields.io/bundlephobia/min/luctst-cli)](https://img.shields.io/bundlephobia/min/luctst-cli)
[![Dependencies](https://img.shields.io/david/luctst/luctst-cli.svg?style=popout-square)](https://david-dm.org/luctst/luctst-cli)
[![devDependencies Status](https://david-dm.org/luctst/luctst-cli/dev-status.svg?style=flat-square)](https://david-dm.org/luctst/luctst-cli?type=dev)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Twitter](https://img.shields.io/twitter/follow/luctstt.svg?label=Follow&style=social)](https://twitter.com/luctstt)

  </p>
</div>

---

**Content**

* [Features](##features)
* [Install](##install)
* [Usage](##usage)
* [Exemples](##exemples)
* [Documentation](##documentation)
* [Contributing](##contributing)
* [Maintainers](##maintainers)

## Features ✨
* Eslint.
* Prettier.
* Ava.
* Editor config.
* Continue integration with TravisCi
* Copy this structure
```
├── .github/
│	├── ISSUE_TEMPLATE/
│	│	├── bug_report.md
│	│	├── feature_request.md
│	├── CODE_OF_CONDUCT.md
│	├── CONTRIBUTING.md
│	├── LICENSE
│	├── pull_request_template.md
├── lib/
│	├── main.js
├── test/
│	├── test.js
├── .editorconfig
├── .estlintrc.json
├── .gitattributes
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── .travis.yml
├── package-lock.json
├── package.json
├── README.md
```

## Install 🐙
```
npm install luctst-cli
```

## Usage 💡
```sh
npx luctst-cli [command] [options]
```

## Exemples 🖍
### Default path
```sh
npx luctst-cli start
```
Create structure at the root of your nodejs process.

### Custom path
```sh
├── test

npx luctst-cli start --path=test/
```
Create project inside the `test` folder.

## Documentation 📄
**Commands availables:**
* `start`, start the process to create your project.

**Flags:**
* `--version -v`, show the package version.
* `--help -h`, display all commands and flags availables.
* `--path -p`, custom path where the project must be created

**Scripts:**

Those scripts are runnables once the process is done:
* `test`, Test all files in `test` folder with Ava.
* `test:watch`, Watch and test all files in `test` folder with Ava.
* `lint`, Lint all files with prettier and eslint in `lib` folder.
* `lint:watch`, Watch and lint all files with prettier and eslint in `lib` folder.
* `lint:fix`, Fix some errors and warnings automatically.

## Contributing 🍰
Please make sure to read the [Contributing Guide](https://github.com/luctst/luctst-cli/blob/master/.github/CONTRIBUTING.md) before making a pull request.

Thank you to all the people who already contributed to this project!

## Maintainers 👷
<table>
  <tr>
    <td align="center"><a href="https://lucastostee.now.sh/"><img src="https://avatars3.githubusercontent.com/u/22588842?s=460&v=4" width="100px;" alt="Tostee Lucas"/><br /><sub><b>Tostee Lucas</b></sub></a><br /><a href="#" title="Code">💻</a></td>
  </tr>
</table>

## License ⚖️
MIT

---
<div align="center">
	<b>
		<a href="https://www.npmjs.com/package/get-good-readme">File generated with get-good-readme module</a>
	</b>
</div>
