const { promises } = require("fs");
const { join } = require("path");

/**
 * Fetch all commands availables for this cli module.
 */
module.exports = async function fetchCommands() {
	return (
		await promises.readdir(join(process.cwd(), "lib", "commands"), {
			withFileTypes: true
		})
	)
		.map(function t(i) {
			if (i.isFile) {
				return i.name.split(".")[0];
			}

			return undefined;
		})
		.filter(l => l !== undefined);
};
