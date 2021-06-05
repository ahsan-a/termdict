import fetch from 'node-fetch';

export default async function dict(word: string, lang: string) {
	return await fetch(
		`https://api.dictionaryapi.dev/api/v2/entries/${lang}/${encodeURI(word)}`
	).then(res => res.json());
}
