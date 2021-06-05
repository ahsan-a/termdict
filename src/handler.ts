import commander from 'commander';
import chalk from 'chalk';
import Preferences from 'preferences';
import dict from './dict';
import changeDefault from './changeDefault';

var config = new Preferences('com.ahsan-a.termdict', {
	defaultLang: 'en_GB',
});

const langs = [
	{ code: 'en_GB', lang: 'English (UK)' },
	{ code: 'en_US', lang: 'English (US)' },
	{ code: 'hi', lang: 'Hindi' },
	{ code: 'es', lang: 'Spanish' },
	{ code: 'fr', lang: 'French' },
	{ code: 'ja', lang: 'Japanese' },
	{ code: 'ru', lang: 'Russian' },
	{ code: 'de', lang: 'German' },
	{ code: 'it', lang: 'Italian' },
	{ code: 'ko', lang: 'Korean' },
	{ code: 'pt-BR', lang: 'Brazilian Portuguese' },
	{ code: 'ar', lang: 'Arabic' },
	{ code: 'tr', lang: 'Turkish' },
];

function capitilise(w: string) {
	return w.charAt(0).toUpperCase() + w.slice(1);
}

export interface Meaning {
	word: string;
	phonetics?: PhoneticsEntity[] | null;
	meanings?: MeaningsEntity[] | null;
	title?: string;
	message?: string;
	resolution?: string;
}
export interface PhoneticsEntity {
	text: string;
	audio: string;
}
export interface MeaningsEntity {
	partOfSpeech: string;
	definitions?: DefinitionsEntity[] | null;
}
export interface DefinitionsEntity {
	definition: string;
	synonyms?: string[] | null;
	example?: string | null;
}

export default async function handle(
	program: commander.Command,
	word?: string
): Promise<any> {
	const args = program.opts();
	if (args.hasOwnProperty('default')) return changeDefault(args, langs, config);

	if (args.hasOwnProperty('language')) {
		if (!word)
			return console.log(
				`${chalk.red(
					'ERROR: '
				)}You seem to have specified a language but you haven't specified a word.`
			);

		if (!langs.some(x => x.code === args.language)) {
			console.log(
				`${chalk.red('ERROR:')} Invalid language code.\n\n${chalk.blue(
					'Valid Languages:'
				)}`
			);

			langs.forEach(lang => {
				console.log(`  ○ ${chalk.cyan(lang.code)}: ${lang.lang}`);
			});
			return;
		}
	}

	if (!word)
		return console.log(
			`${chalk.red(
				'ERROR:'
			)} No word specified. Run this with --help for more info.`
		);

	const meaning: Meaning = await dict(
		word,
		args.language || config.defaultLang
	).then(meaning => (Array.isArray(meaning) ? meaning[0] : meaning));

	if (meaning.title)
		return console.log(chalk.red(`No Definitions found for "${word}"`));

	// actual stuff
	meaning.meanings?.forEach(definition => {
		console.log('');
		console.log(chalk.blue(capitilise(definition.partOfSpeech)));
		definition.definitions?.forEach(def => {
			console.log(capitilise(def.definition));
			if (def.example)
				console.log(`${chalk.cyan('Example:')} "${capitilise(def.example)}"`);
			if (def.synonyms?.length) console.log(chalk.cyan('\nSynonyms:'));
			def.synonyms?.forEach(syn => console.log(`  ○ ${capitilise(syn)}`));
		});
	});

	if (meaning.phonetics && meaning.phonetics[0].audio) {
		console.log('\n');
		console.log(chalk.cyan('Phonetics'));
		meaning.phonetics.forEach(phon => {
			console.log(`${chalk.cyan(phon.text)}: ${phon.audio}`);
		});
	}
}
