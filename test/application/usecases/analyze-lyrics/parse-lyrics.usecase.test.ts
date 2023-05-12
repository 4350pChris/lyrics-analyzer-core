import test from 'ava';
import td from 'testdouble';
import {ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type ProcessTrackerRepository} from '@/application/interfaces/process-tracker.repository.interface';

const setupMocks = () => ({
	lyricsApiService: td.object<LyricsApiService>(),
	processTrackerRepository: td.object<ProcessTrackerRepository>(),
});

test('Should parse lyrics and push the result to a queue', async t => {
	const {lyricsApiService, processTrackerRepository} = setupMocks();
	const parseLyrics = new ParseLyrics(lyricsApiService, processTrackerRepository);

	td.when(lyricsApiService.parseLyrics(td.matchers.argThat((url: URL) => url.pathname === '/1') as URL)).thenResolve('lyrics');

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
	t.is(td.explain(processTrackerRepository.decrement).callCount, 1);
});
