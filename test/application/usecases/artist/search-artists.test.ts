/* eslint-disable @typescript-eslint/naming-convention */
import test from 'ava';
import {SearchArtists} from '@/application/usecases/artist/search-artists.usecase.js';
import type {GeniusApiService} from '@/application/interfaces/services/genius-api.service.js';
import type {GeniusSong} from '@/application/interfaces/responses/genius-song.response.js';
import type {SearchArtistsDto} from '@/application/dtos/search-artist.dto';

test('should return a list of artists', async t => {
	const primaryArtist: SearchArtistsDto = {
		id: 1,
		name: 'artist 1',
	};
	const songs: GeniusSong[] = [
		{
			id: 1,
			title_with_featured: 'song 1',
			url: 'https://genius.com/1',
			primary_artist: primaryArtist,
			release_date_components: {
				year: 2020,
				month: 1,
				day: 1,
			},
		},
	];
	const geniusService: GeniusApiService = {
		search: async () => songs,
		async retrievePaginatedSongs() {
			throw new Error('not implemented');
		},
	};
	const usecase = new SearchArtists(geniusService);

	const result = await usecase.execute('query');
	t.deepEqual(result, [primaryArtist]);
});
