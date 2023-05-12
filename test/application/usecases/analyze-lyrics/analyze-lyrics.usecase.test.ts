import test from 'ava';
import td from 'testdouble';
import {AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';

const setupMocks = () => ({
	artistRepository: td.object<ArtistRepository>(),
});

test('should call artistRepository.getById with correct params', async t => {
	const {artistRepository} = setupMocks();
	const usecase = new AnalyzeLyrics(artistRepository);

	td.when(artistRepository.getById(1)).thenResolve(td.object());

	await usecase.execute(1);

	t.is(td.explain(artistRepository.getById).callCount, 1);
});

test('should throw error if artist is not found', async t => {
	const {artistRepository} = setupMocks();
	const usecase = new AnalyzeLyrics(artistRepository);

	td.when(artistRepository.getById(1)).thenReject(new Error('Internal error'));

	await t.throwsAsync(usecase.execute(1), {message: 'Artist not found'});
});

