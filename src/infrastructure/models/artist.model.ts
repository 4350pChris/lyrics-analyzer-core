import dynamoose from 'dynamoose';

const artistSchema = new dynamoose.Schema(
	{
		id: {
			type: Number,
			hashKey: true,
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
		},
		songs: {
			type: Array,
			schema: [{
				type: Object,
				schema: {
					id: {
						type: Number,
					},
					name: {
						type: String,
						// Required: true,
					},
					text: {
						type: String,
						// Required: true,
					},
				},
			}],
		},
	},
	{
		timestamps: true,
	},
);

export const getArtistModel = (artistTableName: string) => dynamoose.model(artistTableName, artistSchema, {
	create: false,
	waitForActive: false,
});
