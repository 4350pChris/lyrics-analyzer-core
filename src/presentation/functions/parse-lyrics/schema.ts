export default {
	type: 'object',
	properties: {
		artistId: {
			type: 'string',
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
					text: {
						type: 'string',
					},
				},
				required: ['id', 'title', 'url', 'text'],
			},
		},
	},
	required: ['artistId', 'songs'],
} as const;
