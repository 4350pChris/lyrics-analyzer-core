/* eslint-disable @typescript-eslint/naming-convention */
import test from 'ava';
import {GeniusService} from '@/infrastructure/services/genius.service.js';
import type {GeniusApi} from '@/infrastructure/interfaces/genius-api.interface.js';
import {type SearchResponse} from '@/infrastructure/dtos/search-response.dto.js';
import {type GeniusSongDto} from '@/infrastructure/dtos/genius-song.dto';
import {type LyricsParser} from '@/infrastructure/interfaces/lyrics-parser.interface';

const getMockSong: () => Omit<GeniusSongDto, 'primary_artist'> = () => ({
	id: 3810,
	title_with_featured: 'Accordion',
	url: 'https://genius.com/Madvillain-accordion-lyrics',
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
		async getSong(url) {
			throw new Error('not implemented');
		},
	};
	const geniusService = new GeniusService(mockClient, {} as LyricsParser);
	const artists = await geniusService.searchArtists('MF DOOM');
	t.is(artists.length, 2);
});

test('Get paginated songs should return a list of songs witht their lyrics', async t => {
	const mockClient: GeniusApi = {
		async search() {
			throw new Error('not implemented');
		},
		async getSong(url) {
			return 'text';
		},
		async getSongsForArtist() {
			return {
				meta: {
					status: 200,
				},
				response: {
					next_page: undefined,
					songs: [
						{
							...getMockSong(),
							primary_artist: {
								id: 150,
								name: 'Madvillain',
							},
						},
						{
							...getMockSong(),
							primary_artist: {
								id: 151,
								name: 'MF DOOM',
							},
						},
					],
				},
			};
		},
	};

	const geniusService = new GeniusService(mockClient, {
		parse(html: string) {
			return html;
		},
	} as LyricsParser);

	const songs = await geniusService.retrieveSongsForArtist(150);
	t.is(songs.length, 1);
});
