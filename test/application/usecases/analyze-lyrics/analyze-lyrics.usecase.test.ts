import test from 'ava';
import td from 'testdouble';
import {AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';

const setupMocks = () => ({
	artistRepository: td.object<ArtistRepository>(),
});

test('should call artistRepository.getById with correct params', async t => {
	const {artistRepository} = setupMocks();
	const usecase = new AnalyzeLyrics(artistRepository);

	td.when(artistRepository.getById(1)).thenResolve(td.object());

	await usecase.execute({artistId: '1', songs: []});

	t.is(td.explain(artistRepository.getById).callCount, 1);
});

test('should throw error if artist is not found', async t => {
	const {artistRepository} = setupMocks();
	const usecase = new AnalyzeLyrics(artistRepository);

	td.when(artistRepository.getById(1)).thenReject(new Error('Internal error'));

	await t.throwsAsync(usecase.execute({artistId: '1', songs: []}), {message: 'Artist not found'});
});

test('Should add songs to artist', async t => {
	const {artistRepository} = setupMocks();
	const usecase = new AnalyzeLyrics(artistRepository);

	const artist = td.object<ArtistAggregate>();
	td.when(artistRepository.getById(1)).thenResolve(artist);

	await usecase.execute({artistId: '1', songs: [{id: 1, title: 'song1', text: 'text1', url: 'url1'}]});

	t.is(td.explain(artist.addSong).callCount, 1);
});
