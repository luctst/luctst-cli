const {readdir, lstatSync, readdirSync} = require("fs");
const {promisify} = require("util");
const {join} = require("path");
const chalk = require("chalk");

const readDirPromise = promisify(readdir);

/**
 * Look for files with `{{}}` inside the `template/` folder for replace with good content.
 *
 * @param {String} directory The directory folder to start looping through to find files.
 * @param {Object} options Object with the value to replace the key name must be equal to `{{}}` in the different files.
 */
module.exports = async (directory, options) => {
	const stat = lstatSync(directory);
	const functionHandler = {
		path: "",
		subFolder: []
	};

	if (stat.isDirectory()) {
		const dir = await readDirPromise(directory, {withFileTypes: true});

		dir.forEach(element => {
			if (element.isDirectory()) return loopDeep(element.name);
			parseAndCreateFile();
		})
	} else {
		throw new Error(`The path enter is not a directory ${chalk.red(directory)}`);
	}

	function loopDeep(dirToLoop) {
		functionHandler.subFolder.push(dirToLoop);

		functionHandler.path = join(directory, `${functionHandler.subFolder.join("/")}`)

		console.log(functionHandler.subFolder, functionHandler.path);
		const newDir = readdirSync(functionHandler.path, {withFileTypes: true});

		newDir.forEach(item => {
			if (item.isDirectory()) {
				return loopDeep(item.name)
			}

			console.log(item.name);
			parseAndCreateFile();
		})

		functionHandler.subFolder = [];
	}

	function parseAndCreateFile() {};
};
