
import test from 'ava';
import {SearchArtists} from '@/application/usecases/artist/search-artists.usecase';
import type {SearchArtistsDto} from '@/application/dtos/search-artist.dto';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';

test('should return a list of artists', async t => {
	const artist: SearchArtistsDto = {
		id: 1,
		name: 'artist 1',
	};

	const geniusService: LyricsApiService = {
		searchArtists: async () => [artist],
		retrieveSongsForArtist() {
			throw new Error('Not implemented');
		},
		getArtist(artistId) {
			throw new Error('Not implemented');
		},
		parseLyrics(url) {
			throw new Error('Not implemented');
		},
	};
	const usecase = new SearchArtists(geniusService);

	const result = await usecase.execute('query');
	t.deepEqual(result, [artist]);
});
