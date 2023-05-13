export default {
	type: 'object',
	properties: {
		artistId: {
			type: 'number',
		},
	},
	required: ['artistId'],
} as const;
