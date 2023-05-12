import test from 'ava';
import td from 'testdouble';
import {ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type ProcessTrackerRepository} from '@/application/interfaces/process-tracker.repository.interface';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import {type SqsQueueService} from '@/infrastructure/services/sqs-queue.service';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';

const setupUsecase = () => {
	const lyricsApiService = td.object<LyricsApiService>();
	const processTrackerRepository = td.object<ProcessTrackerRepository>();
	const queueService = td.object<SqsQueueService>();
	const artistRepository = td.object<ArtistRepository>();
	const artist = td.object<ArtistAggregate>();

	td.when(lyricsApiService.parseLyrics(td.matchers.argThat((url: URL) => url.pathname === '/1') as URL)).thenResolve('lyrics');
	td.when(artistRepository.getById(1)).thenResolve(artist);

	const usecase = new ParseLyrics(lyricsApiService, queueService, processTrackerRepository, artistRepository);

	return {
		usecase,
		lyricsApiService,
		processTrackerRepository,
		queueService,
		artistRepository,
		artist,
	};
};

test('Should parse lyrics and push the result to a queue', async t => {
	const {usecase, lyricsApiService, processTrackerRepository} = setupUsecase();

	await usecase.execute({
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

test('Should add songs to artist', async t => {
	const {usecase, artist} = setupUsecase();

	await usecase.execute({artistId: '1', songs: [{id: 1, title: 'song1', url: 'https://genius.com/1'}]});

	t.is(td.explain(artist.addSong).callCount, 1);
});
