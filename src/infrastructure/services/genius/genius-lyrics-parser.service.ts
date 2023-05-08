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

	/**
	 *
	 * @param artist THe artists name - in some cases this might be two artists like 'Bob Marley & the Wailers'
	 * @param text The complete lyrics which should contain square brackets in front of each verse
	 * @returns The lyrics without verses that don't belong to the artist
	 */
	removeVersesNotByArtist(artist: string, text: string): string {
		// Get the positions of each square brackets denoting verses
		const matches = [...text.matchAll(/\[[^\]]*]/g)];
		let sanitized = '';

		// Loop through each match and check if the verse belongs to the artist
		for (const [i, value] of matches.entries()) {
			const end = matches[i + 1] ? matches[i + 1].index : undefined;
			const part = text.slice(value.index, end);
			const token = value[0];
			// Tokens like [Verse 1] don't have to be checked
			if (!token.includes(':')) {
				sanitized += part;
				continue;
			}

			// Token looks like [Verse 1: artist] so we have to check if the current artist is the one this verse belongs to
			// split at the colon to get the artist
			const colonIndex = token.indexOf(':');
			const verseArtists = token.slice(colonIndex + 1);
			// When there's an & in the token, the first artist should be part of the primary artist(s)
			const mainVerseArtist = verseArtists.split(' & ')[0].trim().replace(']', '');
			// In case the primary artist contains an ampersand the verse's artist needs to be one of them
			const primaryArtists = artist.split(' & ');

			if (primaryArtists.includes(mainVerseArtist)) {
				sanitized += part;
			}
		}

		return sanitized;
	}

	removeExtraCharacters(text: string) {
		return text
			// Remove brackets
			.replace(/\[[^\]]*]/g, ' ')
			// Remove newlines and multiple spaces
			.replace(/[\n\s]+/g, ' ')
			// Remove non-ascii characters
			.replace(/[^\u00C0-\u02AF\w'-]/g, ' ')
			// Remove dashes
			.replace(' - ', ' ');
	}

	sanitize(artist: string, text: string) {
		const onlyByMainArtist = this.removeVersesNotByArtist(artist, text);
		const noExtras = this.removeExtraCharacters(onlyByMainArtist);
		return noExtras.toLowerCase().trim();
	}
}
