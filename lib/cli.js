#!/usr/bin/env node
const meow = require("meow");
const { prompt } = require("inquirer");
const chalk = require("chalk");
const { readdir } = require("fs");
const { promisify } = require("util");
const replaceInFile = require("./utils/replace");
replaceInFile(`${process.env.PWD}/lib/template`);

const { log } = console;
const readDirPromise = promisify(readdir);


const cli = meow(`
	${chalk.green("Usage")}
		${chalk.greenBright("npx luctst-cli <command>")}

	${chalk.yellow("Options")}
		${chalk.yellowBright("--version, Display the actual package version")}
		${chalk.yellowBright("--help, Display all commands and options available")}

	${chalk.blue("Commands")}
		${chalk.blueBright("npw luctst-cli start, start the process")}
		${chalk.blueBright("npx luctst-cli update, start the update process.")}
`);

(async () => {
	if (cli.input.length > 1) {
		log(`
		${chalk.red.bold("Error !! You can't use two commands at the same time")}

		You enter this commands: ${cli.input.map(el => chalk.cyan(el))}
		If you need help try to run ${chalk.bgWhiteBright.red(
			"npx luctst-cli --help"
		)} to get all commands and options availables.
		`);
	}

	if (cli.input[0] === "start") {
		log("We need a few informations to easily create your project structure. \n");

		const answers = await prompt([
			{
				type: "list",
				message: "What kind of project you wanna create ?",
				name: "projectType",
				choices: [
					{ name: "NodeJs module", value: "module" },
					{ name: "React application", value: "reactApp" }
				]
			}
		])

		if (answers.projectType === "module") {
			const files = await readDirPromise(`${__dirname}/template`, { withFileTypes: true });
			const startAnswers = await prompt([
				{
					type: "input",
					message: "First what is your full name ? We need this to configure your Licence and package.json file",
					name: "name"
				},
				{
					type: "confirm",
					message: "Do you have a github account ?",
					name: "hasGithub"
				},
				{
					type: "input",
					message: "What is your github user name ?",
					name: "githubUser",
					validate: answer => {
						if (/^([a-z\d]+-)*[a-z\d]+$/i.test(answer)) return true;
						return log(chalk.red("Enter a valid username"));
					},
					when: answers => answers.hasGithub ? true : false
				},
				{
					type: "input",
					message: "What is the name of your project ?",
					name: 'projectName',
					validate: answer => {
						if (answer.length === 0) return log(`${chalk.red("Name invalid")}`);
						return true;
					}
				},
				{
					type: "input",
					message: "Why you're creating this project ?",
					name: "description"
				}
			]);

			/**
			 * Files to modify
			 * CONTRIBUTING.md - {{githubUser}} {{projectName}}
			 * Licence - {{year}} {{name}}
			 * README.md - {{projectName}} {{description}}
			 * package.json - name description mail githubUser projectName
			 */

			files.map(file => {
				if (file.isDirectory()) {
					log(`${chalk.bgYellow.black(file.name)} directory created in ${chalk.cyan(process.env.PWD)} folder. \n`);
				} else {
					log(`${chalk.bgGreen.black(file.name)} file created in ${chalk.cyan(process.env.PWD)} folder. \n`);
				}
			})
		}

		if (answers.projectType === "reactApp") {
			log(`
			Check the ${chalk.underline.cyan("https://www.npmjs.com/package/create-react-app-luctst")} package.
			`);
		}
	}

	if (cli.input[0] === "update") {}

	if (cli.input.length === 0) {
		log(`
		${chalk.yellow("You must enter a command, type the --help flag to get all commands availables")}
		`);
	}
})()

process.on("uncaughtException", err => {
	log(`${chalk.red(err)}`);
	process.exit(1);
})
