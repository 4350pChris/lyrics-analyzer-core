import test from 'ava';
import td from 'testdouble';
import {ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type ProcessTracker} from '@/application/interfaces/process-tracker.interface';
import {type Queue} from '@/application/interfaces/queue.interface';

const setupMocks = () => ({
	lyricsApiService: td.object<LyricsApiService>(),
	queueService: td.object<Queue>(),
	processTracker: td.object<ProcessTracker>(),
});

test('Should parse lyrics and push the result to a queue', async t => {
	const {lyricsApiService, queueService, processTracker} = setupMocks();
	const parseLyrics = new ParseLyrics(lyricsApiService, queueService, processTracker);

	td.when(lyricsApiService.parseLyrics(td.matchers.argThat((url: URL) => url.pathname === '/1') as URL)).thenResolve('lyrics');
	td.when(queueService.publish(td.matchers.isA(String) as string)).thenResolve();

	await parseLyrics.execute({
		artistId: '1',
		songs: [{
			id: 1,
			title: 'title',
			url: 'https://genius.com/1',
		}, {
			id: 2,
			title: 'title',
			url: 'https://genius.com/2',
		}],
	});

	t.is(td.explain(lyricsApiService.parseLyrics).callCount, 2);
	t.is(td.explain(queueService.publish).callCount, 1);
	t.is(td.explain(processTracker.progress).callCount, 1);
});
