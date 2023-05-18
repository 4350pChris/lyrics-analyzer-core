import test from 'ava';
import td from 'testdouble';
import {ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';

const setupUsecase = () => {
	const lyricsApiService = td.object<LyricsApiService>();
	const artistRepository = td.object<ArtistRepository>();
	const artist = td.object<ArtistAggregate>();

	td.when(lyricsApiService.parseLyrics(td.matchers.anything() as URL)).thenResolve('lyrics');
	td.when(artistRepository.getById(1)).thenResolve(artist);

	const usecase = new ParseLyrics(lyricsApiService, artistRepository);

	return {
		usecase,
		lyricsApiService,
		artistRepository,
		artist,
	};
};

const makeSong = (id: number) => ({
	id,
	title: 'title',
	url: `https://genius.com/${id}`,
});

test.afterEach.always('Reset mocks', () => {
	td.reset();
});

test('Should parse lyrics', async t => {
	const {usecase, lyricsApiService} = setupUsecase();

	await usecase.execute(
		1,
		[makeSong(1), makeSong(2)],
	);

	t.is(td.explain(lyricsApiService.parseLyrics).callCount, 2);
});

test('Should add songs to artist', async t => {
	const {usecase, artist} = setupUsecase();

	await usecase.execute(1, [makeSong(1)]);

	t.is(td.explain(artist.addSong).callCount, 1);
});

test('Should update artist model with new songs', async t => {
	const {usecase, artistRepository} = setupUsecase();

	await usecase.execute(1, [makeSong(1)]);

	t.is(td.explain(artistRepository.update).callCount, 1);
});
