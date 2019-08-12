#!/usr/bin/env node
const meow = require("meow");
const { prompt } = require("inquirer");
const chalk = require("chalk");

const { log } = console;

const cli = meow(`
	${chalk.green("Usage")}
		${chalk.greenBright("npx luctst-cli <command>")}

	${chalk.yellow("Options")}
		${chalk.yellowBright("--version, Display the actual package version")}
		${chalk.yellowBright("--help, Display all commands and options available")}

	${chalk.blue("Commands")}
		${chalk.blueBright("npw luctst-cli start, start the process")}
		${chalk.blueBright("npx luctst-cli update, start the update")}
`);

// log(cli.input, cli.flags);

if (cli.input.length > 1) {
	log(`
	${chalk.red.bold("Error !! You can't use two commands at the same time")}

	You enter this commands: ${cli.input.map(el => chalk.cyan(el))}
	If you need help try to run ${chalk.bgWhiteBright.red(
		"npx luctst-cli --help"
	)} to get all commands and options availables.
	`);
} else if (cli.input[0] === "start") {
	prompt([
		{
			type: "list",
			message: "What kind of project you wanna create ?",
			name: "projectType",
			choices: ["NodeJs module", "Front-end app"]
		}
	]).then(answers => {
		log(answers);
	});
	/* eslint-disable no-empty */
} else if (cli.input[0] === "update") {
}
/* eslint-enable no-empty */
