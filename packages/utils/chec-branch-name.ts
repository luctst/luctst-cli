import { exec } from "child_process";
import chalk from "chalk";

export default () => {
	exec("git rev-parse --abbrev-ref HEAD", (error, stdout) => {
		if (error) {
			throw error;
		}
	
		// correspond to fix/abcde-12345-abcdef-abcdef or feature/abcde-12345-abcdef-abcdef
		const regex = new RegExp("^(fix|feature|hotfix|release)/[a-z-0-9\\.]{3,}$");
	
		// remove extra break-line
		const branchName = stdout.replace(/(\r\n|\n|\r)/gm, "");
	
		if (!regex.test(branchName)) {
			console.error(chalk.red("the name of your branch does'nt respect imposed structure"));
			console.error(chalk.red(`current name of your branch: ${stdout}`, "\n"));
			console.error(
				chalk.yellow(
					'- start branch name with prefix "fix|feature|hotfix|release" followed by a slash (ex: feature/)'
				)
			);
			console.error(
				chalk.yellow(
					"- after slash, add title of your branch in kebab-case. (ex: branch-name-in-kebab-case)",
					"\n"
				)
			);
			console.error(chalk.whiteBright("full exemple:", "\n"));
			console.error(chalk.green("✅ ", "feature/add-component-to-product"));
			console.error(chalk.green("✅ ", "fix/product-design-in-search-module"));
			console.error(chalk.red("❌ ", "add-Add-Component-To-Product"));
			console.error(chalk.red("❌ ", "improve/addCompressionHTML", "\n"));
			console.error(
				chalk.red("more infos here: https://www.conventionalcommits.org/en/v1.0.0/")
			);
			process.exit(1);
		} else {
			console.log(
				chalk.green(
					"check-branch-name: the name of your branch is ok, process exit without error"
				)
			);
		}
	
		process.exit(0);
	});
};
