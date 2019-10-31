#!/usr/bin/env node
/* eslint-disable no-console */
const meow = require("meow");
const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const path = require("path");
const replaceInfile = require("replace-in-file");
const fs = require("fs");

const { tree } = require("./structure.json");

const { input } = meow(chalk`
	{green Usage}
		npx luctst-cli <command>

	{yellow Options}
		--version, Display the actual package version
		--help, Display all commands and options available

	{blue Commands}
		npw luctst-cli start, create project structure
		npx luctst-cli update, check if files config from template/ are diferents from yours
`);

/**
 * Check if everything is fine
 * @param {Array} command The command user enter.
 * @returns An object with some data if an error exist, either return `true`.
 */
function checkErrors(command) {
	const commandsAvailables = [
		// Command in this array are working.
		"start"
	];

	if (command.length === 0)
		return Promise.reject(
			new Error(
				chalk`\nYou must enter a command, type the {yellow --help} flag to get all commands availables.\n`
			)
		);

	if (command.length > 1)
		return Promise.reject(
			new Error(chalk`\n{red.bold Error !! You can't use two commands at the same time} \n You enter this commands: ${command.map(
				userAnswer => chalk.cyan(userAnswer)
			)}\n If you need help try to run {bgWhiteBright.red npx luctst-cli --help}.
		\n`)
		);

	if (!commandsAvailables.includes(command[0]))
		return Promise.reject(
			new Error(
				chalk`\nThe {yellow ${
					command[0]
				}} command is not available for now, run the {yellow --help}.\n`
			)
		);
	return true;
}

/**
 * Create a file
 * @param {String} pathToRead The name of the file to be read.
 * @param {String} pathToWrite The name of the file to be written.
 * @param {Object} answr The user answer object
 */
function createFile(pathToRead, pathToWrite, answr) {
	let pathToReadFormat;

	if (path.basename(pathToRead)[0] === ".") {
		pathToReadFormat = path.join(
			path.dirname(pathToRead),
			path.basename(pathToRead).replace(".", "_")
		);
	}

	const rs =
		typeof pathToReadFormat === "string"
			? fs.createReadStream(pathToReadFormat)
			: fs.createReadStream(pathToRead);

	rs.on("error", error => error).once("open", () => {
		const ws = fs.createWriteStream(pathToWrite);

		ws.on("error", error => error).on("open", async () => {
			rs.pipe(ws);

			const fileContent = await fs.promises.readFile(pathToWrite);
			const contentToReplace = fileContent.toString().match(/\{\{(.*?)\}\}/g);

			if (contentToReplace !== null) {
				const contentToInsert = contentToReplace.map(
					cd => answr[cd.match(/{{(.*?)}}/)[1]]
				);
				replaceInfile({
					files: ws.path,
					from: [...contentToReplace],
					to: [...contentToInsert]
				});
			}
		});
	});
}

/**
 * Create structure of your project.
 * @param {Object} opts Object
 * @param {Boolean} opts.devMode If true create structure from `opts.devModePath`.
 * @param {String} opts.devModePath Indicate path where you want create your project.
 * @param {Object} answr The answer user object.
 */
async function createTree(opts = {}, answr) {
	const pathToCreate = opts.devMode ? opts.devModePath : process.cwd();
	const pathToTake = path.join(__dirname, "template");

	tree.forEach(async file => {
		if (typeof file === "object") {
			await fs.promises.mkdir(path.join(pathToCreate, file.name));

			file.files.forEach(async subFile => {
				if (typeof subFile === "object") {
					await fs.promises.mkdir(path.join(pathToCreate, file.name, subFile.name));

					subFile.files.forEach(async innerFile => {
						createFile(
							path.join(pathToTake, innerFile),
							path.join(pathToCreate, file.name, subFile.name, innerFile),
							answr
						);
					});
				}

				createFile(
					path.join(pathToTake, subFile),
					path.join(pathToCreate, file.name, subFile),
					answr
				);
			});
		}

		createFile(path.join(pathToTake, file), path.join(pathToCreate, file), answr);
	});
}

/**
 * Execute the process.
 * @param {Array} command The command user enter.
 */
async function run(command) {
	const errors = await checkErrors(command);

	if (errors instanceof Error) return errors;

	if (command[0] === "start") {
		const answers = await inquirer.prompt([
			{
				type: "input",
				message: `First what is your full name ? ${new inquirer.Separator(
					"We need this to configure your Licence and package.json file"
				)}`,
				name: "name",
				validate: answer => {
					if (answer.length === 0)
						return console.log(chalk`{red You should enter something}`);
					return true;
				}
			},
			{
				type: "input",
				message: `What is you email adress ? ${new inquirer.Separator(
					"We will not keep this data, actually we keep 0 data :)"
				)}`,
				name: "mail",
				validate: answer => {
					if (
						/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
							answer
						)
					)
						return true;
					return console.log(chalk`{red Enter a valid mail adress}`);
				}
			},
			{
				type: "input",
				message: "What is your github user name ?",
				name: "githubUser",
				validate: answer => {
					if (/^([a-z\d]+-)*[a-z\d]+$/i.test(answer)) return true;
					return console.log(chalk`{red Enter a valid username}`);
				}
			},
			{
				type: "input",
				message: "What is the name of your project ?",
				name: "projectName",
				validate: answer => {
					if (answer.length === 0) return console.log(chalk`{red Name invalid}`);
					return true;
				},
				filter: answer => {
					if (answer.includes(" ")) return answer.replace(/\s+/g, "-").toLowerCase();
					return answer;
				}
			},
			{
				type: "input",
				message: "Why you're creating this project ?",
				name: "description"
			}
		]);

		const spinner = ora({
			text: chalk`Start creating {green ${command}} command.\n`,
			spinner: {
				interval: 500,
				frames: ["😀", "🤔", "🤨", "🙃"]
			}
		}).start();

		await createTree({ devMode: false }, answers);
		spinner.succeed("It's done, your project has been created 👌");
	}
	return true;
}

run(input).catch(error => {
	console.error(error.message.toString());
});
