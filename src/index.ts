#!/usr/bin/env node

import { Command } from 'commander';
import handler from './handler';
const program = new Command();

program
	.version('1.1.1')
	.arguments('[word]')
	.description('A CLI Dictionary', {
		word: 'the word you would like to look up',
	})
	.option(
		'-l, --language <language>',
		'Choose a language to override your default'
	)
	.option(
		'-d --default [language-code]',
		'Select a default language to use when the language parameter is not specified'
	)
	.action(word => handler(program, word));

program.parse(process.argv);
