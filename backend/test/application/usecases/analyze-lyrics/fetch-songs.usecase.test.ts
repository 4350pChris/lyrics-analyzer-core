import test from 'ava';
import td from 'testdouble';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {FetchSongs} from '@/application/usecases/analyze-lyrics/fetch-songs.usecase';
import {type IntegrationEventBus} from '@/application/interfaces/integration-event-bus.service.interface';
import {type FetchedSongsEvent} from '@/application/events/fetched-songs.event';

const setupMocks = () => {
	const lyricsApiService = td.object<LyricsApiService>();
	const integrationEventBus = td.object<IntegrationEventBus>();

	const artistId = 1;
	const songs = Array.from({length: 10}, (_, i) => ({id: i, title: 'title', url: 'url'}));

	const fetchSongs = new FetchSongs(lyricsApiService, integrationEventBus);

	td.when(lyricsApiService.retrieveSongsForArtist(artistId)).thenResolve(songs);
	td.when(lyricsApiService.getArtist(artistId)).thenResolve({name: 'name', description: 'description', imageUrl: 'imageUrl'});

	return {
		lyricsApiService,
		integrationEventBus,
		fetchSongs,
		artistId,
		songs,
	};
};

test.afterEach.always('Reset mocks', () => {
	td.reset();
});

test('Should retrieve all songs from genius API', async t => {
	const {artistId, fetchSongs} = setupMocks();

	const songs = await fetchSongs.execute(artistId);

	t.is(songs.length, 10);
});

test('Should publish integration event containing songs', async t => {
	const {integrationEventBus, fetchSongs, artistId, songs} = setupMocks();

	await fetchSongs.execute(artistId);

	const event: FetchedSongsEvent = {
		artistId,
		eventType: 'fetchedSongs',
		songs,
	};

	td.verify(integrationEventBus.publishIntegrationEvent(event));

	t.pass();
});
