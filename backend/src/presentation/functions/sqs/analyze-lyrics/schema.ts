import {type ParsedLyricsEvent} from '@/application/events/parsed-lyrics.event';

export default {
	type: 'object',
	properties: {
		artistId: {
			type: 'number',
		},
		eventType: {
			const: 'parsedLyrics' satisfies ParsedLyricsEvent['eventType'],
		},
	},
	required: ['artistId'],
} as const;
