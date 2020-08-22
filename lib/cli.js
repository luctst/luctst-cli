#!/usr/bin/env node
/* eslint-disable no-console */
const meow = require("meow");
const chalk = require("chalk");
const path = require("path");
const { promises } = require("fs");

const startCommand = require("./commands/start");

const flagsAvailable = {
	flags: {
		path: {
			type: "string",
			alias: "p",
			isMultiple: false
		}
	}
};

const { input, flags } = meow(
	chalk`
	{green Usage}
		npx luctst-cli <command>

	{yellow Options}
		--version, Display the actual package version.
		--help, Display all commands and options available.
		--path, -p Custom path where the project must be created.

	{blue Commands}
		npx luctst-cli start, create project structure
`,
	{ ...flagsAvailable }
);

// eslint-disable-next-line consistent-return
(async function() {
	const commandsAvailables = ["start"];
	const flagsKeysAvailable = Object.keys(flagsAvailable.flags);
	const flagsEnter = Object.keys(flags);
	let customPath;

	// Verif command.
	if (input.length === 0) {
		process.stderr.write(
			chalk`{red \nYou must enter a command, type the --help flag to get all commands availables.\n}`
		);
		process.exit(1);
	}

	if (input.length > commandsAvailables.length) {
		process.stderr
			.write(chalk`\n{red.bold Error !! You can't use two commands at the same time} \n You enter this commands: ${input.map(
			userAnswer => chalk.cyan(userAnswer)
		)}\n If you need help try running this command {cyan npx luctst-cli --help}.
		\n`);
		process.exit(1);
	}

	if (!commandsAvailables.includes(input[0])) {
		process.stderr.write(
			chalk`\n{red {yellow ${input[0]}} command is not available for now, run the {yellow --help}.}\n`
		);
		process.exit(1);
	}

	// Verif flags.
	if (flagsEnter.length !== 0) {
		if (flagsEnter.length > 1) {
			process.stderr.write(chalk`{red You can use only one flag}`);
			process.exit(1);
		}

		if (!flagsKeysAvailable.includes(flagsEnter[0])) {
			process.stderr.write(chalk`{red {cyan ${flagsEnter[0]}} is not a valid flag.}`);
			process.exit(1);
		}

		customPath = path.resolve(process.cwd(), flags.path);

		try {
			await promises.readdir(customPath);
		} catch (error) {
			process.stderr.write(chalk`{red The path enter is not a directory.}`);
			process.exit(1);
		}
	}

	switch (input[0]) {
		case "start":
			return startCommand(customPath);
		default:
			break;
	}
})();
