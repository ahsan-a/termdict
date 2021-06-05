import commander from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

interface Lang {
	code: string;
	lang: string;
}
export default function changeDefaultLang(
	args: commander.OptionValues,
	langs: Lang[],
	config: { defaultLang: string }
) {
	if (args.default === true) {
		const current = langs.find(x => x.code === config.defaultLang);
		return console.log(
			`Your current default language is ${chalk.cyan(
				current?.lang
			)}, with the code of ${chalk.cyan(current?.code)}.`
		);
	}

	if (langs.some(x => x.code.toLowerCase() === args.default.toLowerCase())) {
		var newLang = langs.find(
			x => x.code.toLowerCase() === args.default.toLowerCase()
		);
		fs.writeFileSync(
			path.resolve(__dirname, '../config.json'),
			`{"defaultLang": "${newLang?.code}"}`
		);
		return console.log(
			`Your new default language is ${chalk.cyan(
				newLang?.lang
			)}, with the code of ${chalk.cyan(newLang?.code)}.`
		);
	} else {
		console.log(
			`${chalk.red('ERROR:')} Invalid language code.\n\n${chalk.blue(
				'Valid Languages:'
			)}`
		);

		langs.forEach(lang => {
			console.log(
				`  ${lang.code !== config.defaultLang ? '○' : '◉'} ${chalk.cyan(
					lang.code
				)}: ${lang.lang}`
			);
		});
	}
	return;
}
