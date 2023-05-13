import dynamoose from 'dynamoose';
import {Item} from 'dynamoose/dist/Item';
import {type Stats} from '@/domain/entities/stats.value-object';

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
		stats: Object,
	},
	{
		saveUnknown: [
			'stats.**',
		],
		timestamps: true,
	},
);

type SongsItem = {
	id: number;
	name: string;
	text: string;
};

export type ArtistModelType = {
	id: number;
	name: string;
	description: string;
	imageUrl?: string;
	songs: SongsItem[];
	stats?: Stats;
};

class ArtistModelItem extends Item implements ArtistModelType {
	id!: number;
	name!: string;
	description!: string;
	imageUrl?: string;
	songs!: SongsItem[];
	stats?: Stats;
	createdAt!: Date;
	updatedAt!: Date;
}

export const getArtistModel = (artistTableName: string) => dynamoose.model<ArtistModelItem>(artistTableName, artistSchema, {
	create: false,
	waitForActive: false,
});
