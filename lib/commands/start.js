const inquirer = require("inquirer");
const chalk = require("chalk");
const fetch = require("node-fetch");
const ora = require("ora");
const { promises } = require("fs");
const { join } = require("path");

/**
 * Execute the `start` command
 * @param {String} pathToCreate - If the user enter a custom path the project must be create in this directory.
 */
module.exports = async function startCommand(pathToCreate) {
	process.stdout.write(chalk`{cyan Start process..}`);

	const directoryPath = pathToCreate === undefined ? process.cwd() : pathToCreate;
	const filesToExludes = ["README", "LICENSE", "CONTRIBUTING"];
	const res = await fetch("https://api.github.com/repos/github/gitignore/contents");
	const contents = await res.json();

	const languages = contents
		.map(function(c) {
			const languageName = c.name.split(".")[0];

			if (c.type === "dir" || filesToExludes.includes(languageName)) return;

			return c.name.split(".")[0]; // eslint-disable-line consistent-return
		})
		.filter(f => f !== undefined);

	process.stdout.write(chalk`{cyan We need you to answer a few questions :)}`);

	await inquirer.prompt([
		{
			type: "list",
			message: `Which language or framework you will use ?`,
			name: "language",
			choices: [...languages]
		},
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
			message: "In a few lines why you're creating this project ?",
			name: "description"
		}
	]);

	ora({
		text: chalk`{cyan Start creating your project.}\n`,
		spinner: {
			interval: 500,
			frames: ["😀", "🤔", "🤨", "🙃"]
		}
	}).start();

	await promises.mkdir(join(directoryPath, ".github"));
	await promises.mkdir(join(directoryPath, ".github", "ISSUE_TEMPLATE"));
	await promises.mkdir(join(directoryPath, "lib"));
};
