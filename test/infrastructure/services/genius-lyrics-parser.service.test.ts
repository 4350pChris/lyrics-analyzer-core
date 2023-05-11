import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import test from 'ava';
import {GeniusLyricsParser} from '@/infrastructure/services/genius-lyrics-parser.service';

const parser = new GeniusLyricsParser();

// Load lyrics.html from this directory
const loadLyricsFile = () => {
	const html = readFileSync(resolve(__dirname, 'lyrics.html'), 'utf8');
	return html;
};

test('Should get correct sanitized lyrics from html', t => {
	const html = loadLyricsFile();
	const lyrics = parser.parse(html);

	t.truthy(lyrics);
	t.snapshot(lyrics);
});

test('Should get lyrics block from html', t => {
	const html = loadLyricsFile();
	const lyrics = parser.getLyricsBlock(html);

	t.truthy(lyrics);
});

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
