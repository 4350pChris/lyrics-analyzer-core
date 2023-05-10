
import test from 'ava';
import td from 'testdouble';
import {SearchArtists} from '@/application/usecases/artist/search-artists.usecase';
import type {SearchArtistsDto} from '@/application/dtos/search-artist.dto';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';

const setupMocks = () => ({
	lyricsApiService: td.object<LyricsApiService>(),
});

test('should return a list of artists', async t => {
	const artist: SearchArtistsDto = {
		id: 1,
		name: 'artist 1',
	};

	const {lyricsApiService} = setupMocks();

	td.when(lyricsApiService.searchArtists('query')).thenResolve([artist]);

	const usecase = new SearchArtists(lyricsApiService);

	const result = await usecase.execute('query');
	t.deepEqual(result, [artist]);
});
