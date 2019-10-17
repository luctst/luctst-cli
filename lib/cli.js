#!/usr/bin/env node
const meow = require("meow");
const { prompt } = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const copydir = require("copy-dir");
const path = require("path");
const replaceInfile = require("replace-in-file");

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
		const answers = await prompt([
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
			const startAnswers = await prompt([
				{
					type: "input",
					message: "First what is your full name ? We need this to configure your Licence and package.json file",
					name: "name"
				},
				{
					type: "input",
					message: "What is you email adress ? We will not keep this data, actually we keep 0 data :)",
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
					toReplace: ["{{githubUser}}", "{{projectName}}"],
					toInsert: [startAnswers.githubUser, startAnswers.projectName]
				},
				{
					filename: "LICENCE",
					toReplace: ["{{year}}", "{{name}}"],
					toInsert: ["", startAnswers.name]
				},
				{
					filename: "README.md",
					toReplace: ["{{projectName}}", "{{description}}"],
					toInsert: [startAnswers.projectName, startAnswers.description]
				},
				{
					filename: "package.json",
					toReplace: ["{{name}}", "{{description}}", "{{mail}}", "{{githubUser}}", "{{projectName}}"],
					toInsert: [startAnswers.name, startAnswers.description, startAnswers.mail, startAnswers.githubUser, startAnswers.projectName]
				}
			];

			copydir(`${__dirname}/template`, `${process.cwd()}/test/`, {
				utimes: true,
				mode: true,
				cover: true,
				filter: function (stat, filepath, filename) {
					spinner.text = chalk`Start creating {green ${filename}}`;
					if (stat === "file") {
						filesToModify.map(async item => {
							if (item.filename === path.basename(filepath)) {
								//TODO: Get the path of new file. And call replaceInfile with new path.
								// replaceInfile({
								// 	files: filepath,
								// 	from: item.toReplace,
								// 	to: item.toInsert
								// });
							}
						})
						return true;
					}
					return true;
				}
			}, function (err) {
				if (err) throw err;

				spinner.succeed("It's done");
				process.exit();
			});
		}

		if (answers.projectType === "reactApp") {}
	}
}

run(input).catch(data => console.log(data.message));
