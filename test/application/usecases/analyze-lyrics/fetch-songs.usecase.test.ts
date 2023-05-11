import test from 'ava';
import td from 'testdouble';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type Queue} from '@/application/interfaces/queue.interface';
import {FetchSongs} from '@/application/usecases/analyze-lyrics/fetch-songs.usecase';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface';
import {type ProcessTrackerRepository} from '@/application/interfaces/process-tracker.repository.interface';

const setupMocks = () => ({
	lyricsApiService: td.object<LyricsApiService>(),
	artistRepository: td.object<ArtistRepository>(),
	queueService: td.object<Queue>(),
	processTrackerRepository: td.object<ProcessTrackerRepository>(),
});

test('Should retrieve all songs from genius API then push to SQS queue in chunks of 10', async t => {
	const {artistRepository, lyricsApiService, queueService, processTrackerRepository} = setupMocks();
	const artistId = 1;

	td.when(processTrackerRepository.isRunning(artistId)).thenResolve(false);
	td.when(lyricsApiService.retrieveSongsForArtist(artistId)).thenResolve(Array.from({length: 100}, (_, i) => ({id: i, title: 'title', url: 'url'})));
	td.when(lyricsApiService.getArtist(artistId)).thenResolve({name: 'name', description: 'description', imageUrl: 'imageUrl'});
	td.when(queueService.publish(td.matchers.isA(String) as string)).thenResolve();

	const fetchSongs = new FetchSongs(lyricsApiService, artistRepository, queueService, processTrackerRepository);

	await fetchSongs.execute(1);

	t.is(td.explain(lyricsApiService.getArtist).callCount, 1);
	t.is(td.explain(lyricsApiService.retrieveSongsForArtist).callCount, 1);
	t.is(td.explain(queueService.publish).callCount, 10);
	t.is(td.explain(artistRepository.save).callCount, 1);
});

test('Should reject when artist is being processed already', async t => {
	const {artistRepository, lyricsApiService, queueService, processTrackerRepository} = setupMocks();

	const artistId = 1;
	td.when(processTrackerRepository.isRunning(artistId)).thenResolve(true);

	const fetchSongs = new FetchSongs(lyricsApiService, artistRepository, queueService, processTrackerRepository);

	await t.throwsAsync(fetchSongs.execute(artistId), {message: 'Artist is currently being processed'});
});
