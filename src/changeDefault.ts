import commander from 'commander';
import chalk from 'chalk';
import Preferences from 'preferences';

interface Lang {
	code: string;
	lang: string;
}
export default function changeDefaultLang(
	args: commander.OptionValues,
	langs: Lang[],
	config: Preferences
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
		config.defaultLang = newLang?.code;
		config.save();
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
