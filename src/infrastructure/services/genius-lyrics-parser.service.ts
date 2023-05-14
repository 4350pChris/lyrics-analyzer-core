import {DomUtils, parseDocument} from 'htmlparser2';
import {type LyricsParser} from '@/infrastructure/interfaces/lyrics-parser.interface';

export class GeniusLyricsParser implements LyricsParser {
	parse(html: string) {
		const lyrics = this.getLyricsBlock(html);
		return this.sanitize(lyrics);
	}

	getLyricsBlock(html: string) {
		const dom = parseDocument(html);
		const found = DomUtils.findAll(
			element => element.attribs?.['data-lyrics-container'] === 'true',
			dom.childNodes,
		);
		if (found.length > 0) {
			const text = found.map(element => DomUtils.getText(element));
			return text.join(' ');
		}

		throw new Error('Lyrics not found');
	}

	sanitize(text: string) {
		return text
			// Remove brackets
			.replace(/\[[^\]]*]/g, ' ')
			// Remove newlines and multiple spaces
			.replace(/[\n\s]+/g, ' ')
			// Remove non-ascii characters and punctuation
			.replace(/[^\u00C0-\u02AF\w'-]/g, ' ')
			// Remove dashes
			.replace(' - ', ' ')
			// Last trip to trim all extra space
			.replace(/\s+/g, ' ')
			.toLowerCase()
			.trim();
	}
}
