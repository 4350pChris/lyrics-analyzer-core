import test from 'ava';
import td from 'testdouble';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type QueueService} from '@/application/interfaces/queue.service.interface';
import {FetchSongs} from '@/application/usecases/analyze-lyrics/fetch-songs.usecase';
import {type ProcessTrackerRepository} from '@/application/interfaces/process-tracker.repository.interface';
import {type FetchSongsDto} from '@/application/dtos/fetch-songs.dto';

const setupMocks = () => ({
	lyricsApiService: td.object<LyricsApiService>(),
	queueService: td.object<QueueService>(),
	processTrackerRepository: td.object<ProcessTrackerRepository>(),
});

test('Should retrieve all songs from genius API then push to SQS queue in chunks of 10', async t => {
	const {lyricsApiService, queueService, processTrackerRepository} = setupMocks();
	const artistId = 1;

	td.when(processTrackerRepository.isRunning(artistId.toString())).thenResolve(false);
	td.when(lyricsApiService.retrieveSongsForArtist(artistId)).thenResolve(Array.from({length: 100}, (_, i) => ({id: i, title: 'title', url: 'url'})));
	td.when(lyricsApiService.getArtist(artistId)).thenResolve({name: 'name', description: 'description', imageUrl: 'imageUrl'});
	td.when(queueService.sendToParseQueue(td.matchers.anything() as FetchSongsDto)).thenResolve();

	const fetchSongs = new FetchSongs(lyricsApiService, queueService, processTrackerRepository);

	await fetchSongs.execute(1);

	t.is(td.explain(lyricsApiService.retrieveSongsForArtist).callCount, 1);
	t.is(td.explain(queueService.sendToParseQueue).callCount, 10);
});

test('Should reject when artist is being processed already', async t => {
	const {lyricsApiService, queueService, processTrackerRepository} = setupMocks();

	const artistId = 1;
	td.when(processTrackerRepository.isRunning(artistId.toString())).thenResolve(true);

	const fetchSongs = new FetchSongs(lyricsApiService, queueService, processTrackerRepository);

	await t.throwsAsync(fetchSongs.execute(artistId), {message: 'Artist is currently being processed'});
});
