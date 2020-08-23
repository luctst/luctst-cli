const replaceInfile = require("replace-in-file");
const { promises, createReadStream, createWriteStream } = require("fs");
const { join, basename } = require("path");

/**
 * Create folder structure
 * @param {String} path - The path where the files should be created
 * @param {Array} loop - The array to loop on
 * @param {Array} answr - The user answer to replace in files.
 */
module.exports = function createTree(path, loop, answr) {
	return loop.forEach(async function (t) {
		if (typeof t === "object") {
			await promises.mkdir(`${path}/${t.name}`);
			return createTree(join(path, t.name), t.files, answr);
		}

		let fileToRead;

		if (basename(t)[0] === ".") {
			fileToRead = join(process.cwd(), "lib", "template", t.replace(".", "_"));
		} else {
			fileToRead = join(process.cwd(), "lib", "template", t);
		}

		const ws = createWriteStream(join(path, t));

		createReadStream(fileToRead)
			.on("data", function (c) {
				const contentToReplace = c.toString().match(/\{\{(.*?)\}\}/g);

				if (contentToReplace) {
					const contentToInsert = contentToReplace.map(
						cd => {
							if (cd === "{{year}}") return new Date().getFullYear();
							return answr[cd.match(/{{(.*?)}}/)[1]];
						}
					);

					replaceInfile({
						files: ws.path,
						from: [...contentToReplace],
						to: [...contentToInsert]
					});
				}
			})
			.pipe(ws);
	});
}
