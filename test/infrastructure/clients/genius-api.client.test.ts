import process from 'node:process';
// Easy setup for local access token
// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config.js';
import test from 'ava';
import {GeniusApiClient} from '@/infrastructure/clients/genius-api.client';
import {type GeniusApi} from '@/infrastructure/interfaces/genius-api.interface';

let client: GeniusApi;

test.beforeEach('Setup client', () => {
	const token = process.env.GENIUS_ACCESS_TOKEN;
	if (!token) {
		throw new Error('Genius access token has to be set for client integration test to work');
	}

	client = new GeniusApiClient(
		'https://api.genius.com',
		token,
	);
});

test('get artist by id', async t => {
	const {response} = await client.getArtist(150);
	const {artist} = response;

	t.truthy(artist);
});

test('search artists', async t => {
	const {response} = await client.search('MF DOOM');

	t.not(response.hits.length, 0);
});

test('get songs for artist', async t => {
	const {response} = await client.getSongsForArtist(150, 1);

	t.not(response.songs.length, 0);
});

test('get song', async t => {
	const html = await client.getSong(new URL('https://genius.com/Madvillain-accordion-lyrics'));

	t.regex(html, /<html/);
});
