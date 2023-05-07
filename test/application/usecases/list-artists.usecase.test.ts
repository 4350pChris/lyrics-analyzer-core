import test from 'ava';
import {ListArtists} from '@/application/usecases/artist/list-artists.usecase.js';
import {ArtistAggregate} from '@/domain/entities/artist.aggregate';

test('should return a list of artists', async t => {
	const artists: ArtistAggregate[] = [
		new ArtistAggregate('name 1', 'description 1'),
		new ArtistAggregate('name 2', 'description 2'),
	];
	const usecase = new ListArtists({
		async list() {
			return artists;
		},
		async save() {
			throw new Error('Not implemented');
		},
	});
	const result = await usecase.execute();
	t.deepEqual(result, artists);
});
