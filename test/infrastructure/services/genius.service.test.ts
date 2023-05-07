import test from 'ava';
import {GeniusService} from '@/infrastructure/services/genius.service.js';

test('Search', async t => {
	const geniusService = new GeniusService();
	const songs = await geniusService.search('Kendrick Lamar');
	t.true(songs.length > 0);
});
