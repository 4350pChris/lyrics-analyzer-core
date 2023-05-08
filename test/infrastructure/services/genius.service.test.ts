/* eslint-disable @typescript-eslint/naming-convention */
import test from 'ava';
import {GeniusService} from '@/infrastructure/services/genius.service.js';
import type {GeniusApi} from '@/infrastructure/interfaces/genius-api.interface.js';
import {type SearchResponse} from '@/infrastructure/dtos/search-response.dto.js';
import {type GeniusSongDto} from '@/infrastructure/dtos/genius-song.dto';
import {type LyricsParser} from '@/infrastructure/interfaces/lyrics-parser.interface';
import {type ArtistDetailResponse} from '@/infrastructure/dtos/artist-detail-response.dto';
import {type ArtistSongsResponse} from '@/infrastructure/dtos/artist-songs-response.dto';

const getMockSong: () => Omit<GeniusSongDto, 'primary_artist'> = () => ({
	id: 3810,
	title_with_featured: 'Accordion',
	url: 'https://genius.com/Madvillain-accordion-lyrics',
});

const createMockClient: () => GeniusApi = () => ({
	async search(query: string): Promise<SearchResponse> {
		throw new Error('Function not implemented.');
	},
	async getSongsForArtist(artistId: number, page: number): Promise<ArtistSongsResponse> {
		throw new Error('Function not implemented.');
	},
	async getSong(url: string): Promise<string> {
		throw new Error('Function not implemented.');
	},
	async getArtist(artistId: number): Promise<ArtistDetailResponse> {
		throw new Error('Function not implemented.');
	},
});

test('get artist should return artist from response', async t => {
	const artist = {
		id: 151,
		name: 'MF DOOM',
		description: 'ALL CAPS',
		image_url: 'url',
	};
	const mockClient = createMockClient();
	mockClient.getArtist = async artistId => ({
		meta: {
			status: 200,
		},
		response: {
			artist,
		},
	});
	const geniusService = new GeniusService(mockClient, {} as LyricsParser);

	const responseArtist = await geniusService.getArtist(150);

	t.like(responseArtist, artist);
});

test('Search artists should consolidate artists from songs', async t => {
	const mockClient = createMockClient();
	mockClient.search = async query => ({
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
	} satisfies SearchResponse);
	const geniusService = new GeniusService(mockClient, {} as LyricsParser);
	const artists = await geniusService.searchArtists('MF DOOM');
	t.is(artists.length, 2);
});

test('Get paginated songs should return a list of songs with their lyrics', async t => {
	const mockClient = createMockClient();
	mockClient.getSong = async url => 'text';
	mockClient.getSongsForArtist = async (artistId, page) => ({
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
	});

	const geniusService = new GeniusService(mockClient, {
		parse(html: string) {
			return html;
		},
		sanitize(artist, text) {
			return text;
		},
	} as LyricsParser);

	const songs = await geniusService.retrieveSongsForArtist(150);
	t.is(songs.length, 1);
});
