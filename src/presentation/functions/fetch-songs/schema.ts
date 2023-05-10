export default {
	type: 'object',
	properties: {
		artistId: {
			type: 'string',
		},
	},
	required: ['artistId'],
} as const;
