export default {
	type: 'object',
	properties: {
		body: {
			type: 'object',
			properties: {
				artistId: {
					type: 'number',
				},
			},
			required: ['artistId'],
		},
	},
	required: ['body'],
} as const;
