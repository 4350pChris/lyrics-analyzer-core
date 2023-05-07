import dynamoose from 'dynamoose';

const artistSchema = new dynamoose.Schema(
	{
		id: {
			type: String,
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
						type: String,
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

export const getArtistModel = (artistTableName: string) => dynamoose.model('Artist', artistSchema, {
	tableName: artistTableName,
});
