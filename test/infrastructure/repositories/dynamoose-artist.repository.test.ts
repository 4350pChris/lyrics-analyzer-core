import test from 'ava';
import dynamoose from 'dynamoose';
import type {AnyItem} from 'dynamoose/dist/Item.js';
import {DynamooseArtistRepository} from '@/infrastructure/repositories/dynamoose-artist.repository.js';
import {getArtistModel} from '@/infrastructure/models/artist.model.js';
import {ArtistMapper} from '@/infrastructure/mappers/artist.mapper.js';

const getDummyArtist = () => ({
	id: '1',
	name: 'name',
	description: 'description',
	songs: [
		{
			name: 'song name',
			text: 'song text',
		},
	],
} satisfies Partial<AnyItem>);

const mapper = new ArtistMapper();
const artistModel = getArtistModel('artistTable');
const repo = new DynamooseArtistRepository(mapper, artistModel);

test.before(() => {
	dynamoose.aws.ddb.local();
});

test.afterEach.always(async () => {
	await artistModel.delete(getDummyArtist().id);
});

test.serial('Get by id', async t => {
	await artistModel.create(getDummyArtist());

	const artist = await repo.getById(1);
	t.deepEqual(artist, mapper.toDomain(getDummyArtist()));
});

test.serial('Save artist', async t => {
	const dummy = mapper.toDomain(getDummyArtist());
	const artist = await repo.save(dummy);
	t.deepEqual(artist, dummy);
});
