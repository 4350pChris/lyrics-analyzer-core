import test from 'ava';
import td from 'testdouble';
import {ListArtists} from '@/application/usecases/artist/list-artists.usecase';
import {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface';

const setupMocks = () => ({
	artistRepository: td.object<ArtistRepository>(),
});

const makeArtist = (id: number) => new ArtistAggregate({
	id,
	name: `name ${id}`,
	description: `description ${id}`,
	imageUrl: `imageUrl ${id}`,
	songs: [],
});

test('should return a list of artists', async t => {
	const artists = [
		makeArtist(1),
		makeArtist(2),
	];

	const {artistRepository} = setupMocks();

	td.when(artistRepository.list()).thenResolve(artists);

	const usecase = new ListArtists(artistRepository);
	const result = await usecase.execute();
	t.deepEqual(result, artists);
});
