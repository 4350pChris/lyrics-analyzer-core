import {type FetchedSongsEvent} from '@/application/events/fetched-songs.event';

export default {
	type: 'object',
	properties: {
		artistId: {
			type: 'number',
		},
		eventType: {
			const: 'fetchedSongs' satisfies FetchedSongsEvent['eventType'],
		},
		songs: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					id: {
						type: 'number',
					},
					title: {
						type: 'string',
					},
					url: {
						type: 'string',
					},
				},
				required: ['id', 'title', 'url'],
			},
		},
	},
	required: ['artistId', 'songs'],
} as const;
