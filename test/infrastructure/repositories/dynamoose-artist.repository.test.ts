
import test from 'ava';
import dynamoose from 'dynamoose';
import type {AnyItem} from 'dynamoose/dist/Item';
import {DynamooseArtistRepository} from '@/infrastructure/repositories/dynamoose-artist.repository';
import {getArtistModel} from '@/infrastructure/models/artist.model';
import {ArtistMapper} from '@/infrastructure/mappers/artist.mapper';

const genId = ((i = 0) => () => `${++i}`)();

const getDummyArtist = () => ({
	id: genId(),
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

let savedArtists: string[] = [];

test.before(() => {
	dynamoose.aws.ddb.local();
});

test.afterEach.always(async () => {
	if (savedArtists.length === 0) {
		return;
	}

	await artistModel.batchDelete(savedArtists);
	savedArtists = [];
});

test.serial('List all', async t => {
	const artists = [
		getDummyArtist(),
		getDummyArtist(),
		getDummyArtist(),
	];

	await artistModel.batchPut(artists);

	savedArtists.push(...artists.map(artist => artist.id));

	const listedArtists = await repo.list();
	t.is(listedArtists.length, artists.length);
});

test.serial('Save artist', async t => {
	const dummy = getDummyArtist();
	await repo.save(mapper.toDomain(dummy));
	savedArtists.push(dummy.id);
	t.pass();
});

test.serial('Get artist by id', async t => {
	const expected = getDummyArtist();
	const artists = [
		expected,
		getDummyArtist(),
		getDummyArtist(),
		getDummyArtist(),
	];

	await artistModel.batchPut(artists);
	savedArtists.push(...artists.map(artist => artist.id));

	const result = await repo.getById(Number.parseInt(expected.id));

	t.deepEqual(result, mapper.toDomain(expected));
});
