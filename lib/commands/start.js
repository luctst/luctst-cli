const inquirer = require("inquirer");
const chalk = require("chalk");
const fetch = require("node-fetch");
const ora = require("ora");
const { createWriteStream } = require("fs");
const { spawn } = require("child_process");
const { join } = require("path");

const tree = require("../three.json");
const createTree = require("../utils/createTree");

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
		.map(function l(c) {
			const languageName = c.name.split(".")[0];

			if (c.type === "dir" || filesToExludes.includes(languageName)) return;

			return c.name.split(".")[0]; // eslint-disable-line consistent-return
		})
		.filter(f => f !== undefined);

	process.stdout.write(chalk`{cyan We need you to answer a few questions :)}`);

	const answer = await inquirer.prompt([
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
			validate: a => {
				if (a.length === 0)
					return process.stdout.write(chalk`{red You should enter something}`);
				return true;
			}
		},
		{
			type: "input",
			message: "What is your github user name ?",
			name: "githubUser",
			validate: b => {
				if (/^([a-z\d]+-)*[a-z\d]+$/i.test(b)) return true;
				return process.stdout.write(chalk`{red Enter a valid username}`);
			}
		},
		{
			type: "input",
			message: "What is the name of your project ?",
			name: "projectName",
			validate: c => {
				if (c.length === 0) return process.stdout.write(chalk`{red Name invalid}`);
				return true;
			},
			filter: d => {
				if (d.includes(" ")) return d.replace(/\s+/g, "-").toLowerCase();
				return d;
			}
		},
		{
			type: "input",
			message: "In a few lines why you're creating this project ?",
			name: "description"
		}
	]);

	const spinner = ora({
		text: chalk`{cyan Start creating your project.}\n`,
		spinner: {
			interval: 500,
			frames: ["😀", "🤔", "🤨", "🙃"]
		}
	}).start();

	await createTree(directoryPath, tree, answer);

	spinner.text = chalk`{cyan Start creating .gitignore file}.`;

	const l = await fetch(
		`https://api.github.com/repos/github/gitignore/contents/${answer.language}.gitignore?ref=master`
	);
	const gitignoreContent = await l.json();
	const contentBuf = Buffer.from(gitignoreContent.content, "base64");

	createWriteStream(join(directoryPath, ".gitignore")).write(contentBuf.toString());

	spinner.text = chalk`{cyan Start installing nodejs dependencies}`;

	return spawn(
		"npm",
		[
			"install",
			"-D",
			"ava",
			"eslint",
			"eslint-config-airbnb-base",
			"eslint-config-prettier",
			"eslint-plugin-import",
			"eslint-plugin-prettier",
			"eslint-watch",
			"prettier"
		],
		{
			cwd: directoryPath
		}
	)
		.stdout.on("data", data => {
			spinner.text = chalk`Install {yellow ${data.toString()}} dependencies.`;
		})
		.on("close", code => {
			if (code !== 0) {
				spinner.fail();
			}

			spinner.succeed(
				chalk`{green Your project has been created, you can close the process with CTRL + C}.`
			);
		});
};
