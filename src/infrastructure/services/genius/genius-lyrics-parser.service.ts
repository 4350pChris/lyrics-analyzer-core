import {DomUtils, parseDocument} from 'htmlparser2';
import {type LyricsParser} from '@/infrastructure/interfaces/lyrics-parser.interface';

export class GeniusLyricsParser implements LyricsParser {
	parse(html: string) {
		const dom = parseDocument(html);
		const found = DomUtils.findOne(
			element =>
				element.attribs.class === 'lyrics' || element.attribs.class?.startsWith('Lyrics__Container'),
			dom.childNodes,
		);
		if (found) {
			const text = DomUtils.textContent(found).trim();
			return text;
		}

		throw new Error('Lyrics not found');
	}
}
