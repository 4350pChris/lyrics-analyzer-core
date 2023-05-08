import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import {GeniusLyricsParser} from '@/infrastructure/services/genius/genius-lyrics-parser.service';

const parser = new GeniusLyricsParser();

// Load lyrics.html from this directory
const loadLyricsFile = () => {
	const path = fileURLToPath(new URL('lyrics.html', import.meta.url));
	const html = readFileSync(path, 'utf8');
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

test('Should remove multiline spaces and [Verse] blocks', t => {
	const lyricsBlock = `[Verse 1]

		
		Text
	`;
	const lyrics = parser.sanitize(lyricsBlock);

	t.is(lyrics, 'text');
});
