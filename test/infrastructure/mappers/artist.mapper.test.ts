import test from 'ava';
import td from 'testdouble';
import {type ArtistFactory} from '../../../src/domain/interfaces/concrete-artist.factory.interface';
import {ArtistMapper} from '@/infrastructure/mappers/artist.mapper';
import {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {Song} from '@/domain/entities/song.entity';
import {type ArtistProps} from '@/domain/interfaces/artist-props.interface';

const setupMocks = () => ({
	artistFactory: td.object<ArtistFactory>(),
});

const makeArtist = () => new ArtistAggregate({
	id: 1,
	description: 'description1',
	name: 'artist1',
	songs: [
		new Song(1, 'song1', 'text1'),
		new Song(2, 'song2', 'text2'),
	],
});

const makeModel = () => ({
	id: 1,
	description: 'description1',
	name: 'artist1',
	songs: [
		{id: 1, name: 'song1', text: 'text1'},
		{id: 2, name: 'song2', text: 'text2'},
	],
});

test('Domain to model', t => {
	const {artistFactory} = setupMocks();
	const mapper = new ArtistMapper(artistFactory);
	const model = mapper.toModel(makeArtist());

	t.like(model, makeModel());
});

test('Model to domain uses factory', t => {
	const {artistFactory} = setupMocks();
	const mapper = new ArtistMapper(artistFactory);
	const model = makeModel();

	td.when(artistFactory.createArtist(td.matchers.anything() as ArtistProps)).thenReturn(makeArtist());

	const artist = mapper.toDomain(model);
	t.deepEqual(artist, makeArtist());
});
