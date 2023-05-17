/* eslint-disable @typescript-eslint/naming-convention */
import test from 'ava';
import td from 'testdouble';
import {GeniusService} from '@/infrastructure/services/genius.service';
import type {GeniusApi} from '@/infrastructure/interfaces/genius-api.interface';
import {type GeniusSearchResponse} from '@/infrastructure/dtos/genius-search.dto';
import {type GeniusSongDto} from '@/infrastructure/dtos/genius-song.dto';
import {type LyricsParser} from '@/infrastructure/interfaces/lyrics-parser.interface';

const getMockSong: () => Omit<GeniusSongDto, 'primary_artist'> = () => ({
	id: 3810,
	title_with_featured: 'Accordion',
	url: 'https://genius.com/Madvillain-accordion-lyrics',
});

const setupMocks = () => ({
	client: td.object<GeniusApi>(),
	lyricsParser: td.object<LyricsParser>(),
});

test('get artist should return artist from response', async t => {
	const artist = {
		id: 151,
		name: 'MF DOOM',
		description: {plain: 'ALL CAPS'},
		image_url: 'url',
	};
	const {client, lyricsParser} = setupMocks();
	td.when(client.getArtist(td.matchers.isA(Number) as number)).thenResolve({
		meta: {
			status: 200,
		},
		response: {
			artist,
		},
	});

	const geniusService = new GeniusService(client, lyricsParser);

	const responseArtist = await geniusService.getArtist(150);

	t.deepEqual(responseArtist, {
		id: artist.id,
		name: artist.name,
		description: artist.description.plain,
		imageUrl: artist.image_url,
	});
});

test('Search artists should consolidate artists from songs', async t => {
	const {client, lyricsParser} = setupMocks();
	td.when(client.search('MF DOOM')).thenResolve({
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
	} satisfies GeniusSearchResponse);
	const geniusService = new GeniusService(client, lyricsParser);
	const artists = await geniusService.searchArtists('MF DOOM');
	t.is(artists.length, 2);
});

test('Get paginated songs should return a list of songs for parsing', async t => {
	const {client, lyricsParser} = setupMocks();
	td.when(client.getSongsForArtist(150, 1)).thenResolve({
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

	const geniusService = new GeniusService(client, lyricsParser);

	const songs = await geniusService.retrieveSongsForArtist(150);
	t.is(songs.length, 1);
});

test('Parse lyrics should return lyrics from parser', async t => {
	const {client, lyricsParser} = setupMocks();

	td.when(client.getSong(td.matchers.isA(URL) as URL)).thenResolve('html');
	td.when(lyricsParser.parse('html')).thenResolve('parsed');

	const geniusService = new GeniusService(client, lyricsParser);
	const parsed = await geniusService.parseLyrics(new URL('http://localhost'));

	t.is(parsed, 'parsed');
});
