#!/usr/bin/env node
const meow = require("meow");
const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const copydir = require("copy-dir");
const path = require("path");
const replaceInfile = require("replace-in-file");
const fs = require("fs");

const {input} = meow(chalk`
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
 * @returns An object with some data if an error exist.
 */
function checkErrors (command) {
	const commandsAvailables = [ // Command in this array are working.
		"start",
	];

	if (command.length === 0) return Promise.reject({
		hasError: true,
		message: chalk`\nYou must enter a command, type the {yellow --help} flag to get all commands availables.\n`
	})

	if (command.length > 1) return Promise.reject({
		hasError: true,
		message: chalk`\n{red.bold Error !! You can't use two commands at the same time} \n You enter this commands: ${command.map(input => chalk.cyan(input))}\n If you need help try to run {bgWhiteBright.red npx luctst-cli --help}.
		\n`
	});

	if (!commandsAvailables.includes(command[0])) return Promise.reject({
		hasError: true,
		message: chalk`\nThe {yellow ${command[0]}} command is not available for now, run the {yellow --help}.\n`
	});

	return {
		hasError: false
	};
}

/**
 * Execute the process.
 * @param {Array} command The command user enter.
 */
async function run (command) {
	const errors = await checkErrors(command);

	if (errors.hasError) return errors;

	if (command[0] === "start") {
		const answers = await inquirer.prompt([
			{
				type: "list",
				message: "What kind of project you wanna create ?",
				name: "projectType",
				choices: [
					{name: "NodeJs module", value: "module" },
					{name: "React application", value: "reactApp" }
				]
			}
		])

		if (answers.projectType === "module") {
			const startAnswers = await inquirer.prompt([
				{
					type: "input",
					message: `First what is your full name ? ${new inquirer.Separator("We need this to configure your Licence and package.json file")}`,
					name: "name"
				},
				{
					type: "input",
					message: `What is you email adress ? ${new inquirer.Separator("We will not keep this data, actually we keep 0 data :)")}`,
					name: "mail"
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

			const spinner = ora("Start creating your project").start();
			const filesToModify = [
				{
					filename: "CONTRIBUTING.md",
					path: `${process.cwd()}/test/.github/`,
					toReplace: ["{{githubUser}}", "{{projectName}}"],
					toInsert: [startAnswers.githubUser, startAnswers.projectName]
				},
				{
					filename: "LICENCE",
					path: `${process.cwd()}/test/.github/`,
					toReplace: ["{{year}}", "{{name}}"],
					toInsert: [new Date().getFullYear(), startAnswers.name]
				},
				{
					filename: "README.md",
					path: `${process.cwd()}/test/`,
					toReplace: ["{{projectName}}", "{{description}}"],
					toInsert: [startAnswers.projectName, startAnswers.description]
				},
				{
					filename: "package.json",
					path: `${process.cwd()}/test/`,
					toReplace: ["{{name}}", "{{description}}", "{{mail}}", "{{githubUser}}", "{{projectName}}"],
					toInsert: [startAnswers.name, startAnswers.description, startAnswers.mail, startAnswers.githubUser, startAnswers.projectName]
				}
			];

			copydir(`${__dirname}/template`, `${process.cwd()}/test/`, {
				utimes: true,
				mode: true,
				cover: true,
				filter: filename => spinner.text = chalk`Start creating {green ${filename}}`
			}, function (err) {
				if (err) throw err;

				filesToModify.map(item => {
					replaceInfile.sync({
						files: path.join(item.path, item.filename),
						from: item.toReplace,
						to: item.toInsert
					});
				});
				spinner.succeed("It's done");
				process.exit();
			});
		}

		if (answers.projectType === "reactApp") {}
	}
}

run(input).catch(data => console.log(data.message));
