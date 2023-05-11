import dynamoose from 'dynamoose';
import {Item} from 'dynamoose/dist/Item';

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
			schema: [Number],
		},
		stats: {
			type: Array,
			schema: [Number],
		},
	},
	{
		timestamps: true,
	},
);

export class ArtistModelItem extends Item {
	id!: string;
	name!: string;
	description!: string;
	imageUrl!: string;
	songs!: number[];
	stats!: number[];
	createdAt!: string;
	updatedAt!: string;
}

export const getArtistModel = (artistTableName: string) => dynamoose.model<ArtistModelItem>(artistTableName, artistSchema, {
	create: false,
	waitForActive: false,
});
