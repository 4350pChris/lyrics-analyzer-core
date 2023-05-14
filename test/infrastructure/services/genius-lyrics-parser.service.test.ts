import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import test, {type Macro, type ExecutionContext} from 'ava';
import {GeniusLyricsParser} from '@/infrastructure/services/genius-lyrics-parser.service';

const parser = new GeniusLyricsParser();

// Load lyrics.html from this directory
const loadLyricsFile = (filename: string) => {
	const html = readFileSync(resolve(__dirname, 'fixtures', `${filename}.html`), 'utf8');
	return html;
};

const sanitizedMacro: Macro<[string]> = {
	exec(t, filename) {
		const html = loadLyricsFile(filename);
		const lyrics = parser.parse(html);

		t.truthy(lyrics);
		t.snapshot(lyrics);
	},
	title(title, filename) {
		return title ?? `Should get correct sanitized lyrics from ${filename}`;
	},
};

test(sanitizedMacro, 'no_downtime');
test(sanitizedMacro, 'accordion');

const getLyricsBlockMacro: Macro<[string]> = {
	exec(t, filename) {
		const html = loadLyricsFile(filename);
		const lyrics = parser.getLyricsBlock(html);

		t.truthy(lyrics);
	},
	title(title, filename) {
		return title ?? `Should get lyrics block from ${filename}`;
	},
};

test(getLyricsBlockMacro, 'no_downtime');
test(getLyricsBlockMacro, 'accordion');

test('Should throw error if lyrics block is not found', t => {
	const html = '<html></html>';

	t.throws(() => parser.getLyricsBlock(html));
});

test('Should remove multiline spaces and [Verse] blocks', t => {
	const lyricsBlock = `[Verse 1]

		
		Text
	`;
	const lyrics = parser.sanitize(lyricsBlock);

	t.is(lyrics, 'text');
});
