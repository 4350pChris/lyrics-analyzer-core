import process from 'node:process';
// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config.js';
import test from 'ava';
import {GeniusService} from '@/infrastructure/services/genius.service.js';
import {createApiClient} from '@/infrastructure/clients/genius-api.client';

test('Search', async t => {
	// TODO: mock this using h3
	const geniusService = new GeniusService(createApiClient('https://api.genius.com', process.env.GENIUS_ACCESS_TOKEN ?? ''));
	const songs = await geniusService.search('Kendrick Lamar');
	t.true(songs.length > 0);
});
