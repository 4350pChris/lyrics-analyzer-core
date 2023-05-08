/* eslint-disable @typescript-eslint/naming-convention */
import test from 'ava';
import {GeniusService} from '@/infrastructure/services/genius.service.js';
import type {GeniusApi} from '@/infrastructure/interfaces/genius-api.interface.js';
import {type SearchResponse} from '@/infrastructure/dtos/search-response.dto.js';
import {type GeniusSong} from '@/infrastructure/dtos/genius-song.dto';

const getMockSong: () => Omit<GeniusSong, 'primary_artist'> = () => ({
	id: 3810,
	title_with_featured: 'Accordion',
	url: 'https://genius.com/Madvillain-accordion-lyrics',
	release_date_components: {
		year: 2004,
		month: 3,
		day: 23,
	},
});

test('Search artists should consolidate artists from songs', async t => {
	const mockClient: GeniusApi = {
		async search(query) {
			return {
				meta: {
					status: 200,
				},
				response: {
					hits: [
						{
							result: {
								...getMockSong(),
								primary_artist: {
									id: 150,
									name: 'Madvillain',
								},
							},
						},
						{
							result: {
								...getMockSong(),
								primary_artist: {
									id: 151,
									name: 'MF DOOM',
								},
							},
						},
						{
							result: {
								...getMockSong(),
								primary_artist: {
									id: 150,
									name: 'Madvillain',
								},
							},
						},
					],
				},
			} satisfies SearchResponse;
		},
		async getSongsForArtist() {
			throw new Error('not implemented');
		},
	};
	const geniusService = new GeniusService(mockClient);
	const artists = await geniusService.searchArtists('MF DOOM');
	t.is(artists.length, 2);
});

test('Get paginated songs should return a list of songs', async t => {
	const mockClient: GeniusApi = {
		async search() {
			throw new Error('not implemented');
		},
		async getSongsForArtist() {
			return {
				meta: {
					status: 200,
				},
				response: {
					songs: [
						{
							...getMockSong(),
							primary_artist: {
								id: 150,
								name: 'Madvillain',
							},
						},
					],
				},
			};
		},
	};

	const geniusService = new GeniusService(mockClient);

	const songs = await geniusService.retrievePaginatedSongs(150, 1);
	t.is(songs.length, 1);
});
