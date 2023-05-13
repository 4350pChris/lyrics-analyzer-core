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

	td.when(lyricsApiService.parseLyrics(td.matchers.anything() as URL)).thenResolve('lyrics');
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

const makeSong = (id: number) => ({
	id,
	title: 'title',
	url: `https://genius.com/${1}`,
});

test('Should parse lyrics and push the result to a queue', async t => {
	const {usecase, lyricsApiService, processTrackerRepository} = setupUsecase();

	await usecase.execute({
		artistId: '1',
		songs: [makeSong(1), makeSong(2)],
	});

	t.is(td.explain(lyricsApiService.parseLyrics).callCount, 2);
	t.is(td.explain(processTrackerRepository.decrement).callCount, 1);
});

test('Should add songs to artist', async t => {
	const {usecase, artist} = setupUsecase();

	await usecase.execute({artistId: '1', songs: [makeSong(1)]});

	t.is(td.explain(artist.addSong).callCount, 1);
});

test('Should update artist model with new songs', async t => {
	const {usecase, artistRepository} = setupUsecase();

	await usecase.execute({artistId: '1', songs: [makeSong(1)]});

	t.is(td.explain(artistRepository.update).callCount, 1);
});

test('Should decrement process tracker with count of all songs', async t => {
	const {usecase, processTrackerRepository, lyricsApiService} = setupUsecase();

	td.when(lyricsApiService.parseLyrics(td.matchers.anything() as URL)).thenReject('error');
	await usecase.execute({artistId: '1', songs: [makeSong(1)]});

	td.verify(processTrackerRepository.decrement(1, 1));
	t.pass();
});

test('Should delete process from tracker when all songs are processed', async t => {
	const {usecase, processTrackerRepository} = setupUsecase();
	await usecase.execute({artistId: '1', songs: [makeSong(1)]});

	td.verify(processTrackerRepository.delete(1));
	t.pass();
});
