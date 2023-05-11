import test from 'ava';
import td from 'testdouble';
import {type ProcessTableRepository} from '@/application/interfaces/process-tracker-repository.interface';
import {ArtistProcessTracker} from '@/application/services/artist-process-tracker.service';

const setupMocks = () => ({
	processRepository: td.object<ProcessTableRepository>(),
});

test('Should start process tracker', async t => {
	const artistId = 1;
	const songsCount = 10;

	const {processRepository} = setupMocks();

	const processTracker = new ArtistProcessTracker(processRepository);

	td.when(processRepository.save(artistId.toString(), songsCount)).thenResolve();

	await processTracker.start(artistId, songsCount);

	t.deepEqual(td.explain(processRepository.save).calls[0].args, [artistId.toString(), songsCount]);
});

test('Should decrement process tracker', async t => {
	const artistId = 1;
	const songsCount = 10;
	const decrementValue = 1;

	const {processRepository} = setupMocks();

	const processTracker = new ArtistProcessTracker(processRepository);

	td.when(processRepository.get(artistId.toString())).thenResolve(songsCount);
	td.when(processRepository.update(artistId.toString(), songsCount - decrementValue)).thenResolve();

	await processTracker.decrement(artistId, decrementValue);

	t.deepEqual(td.explain(processRepository.get).calls[0].args, [artistId.toString()]);
	t.deepEqual(td.explain(processRepository.update).calls[0].args, [artistId.toString(), songsCount - decrementValue]);
});

test('Should throw error when process not found', async t => {
	const artistId = 1;
	const decrementValue = 1;

	const {processRepository} = setupMocks();

	const processTracker = new ArtistProcessTracker(processRepository);

	td.when(processRepository.get(artistId.toString())).thenResolve(undefined);

	await t.throwsAsync(processTracker.decrement(artistId, decrementValue), {message: 'Process not found'});
});

test('Should check if process is running', async t => {
	const artistId = 1;
	const songsCount = 10;

	const {processRepository} = setupMocks();

	const processTracker = new ArtistProcessTracker(processRepository);

	td.when(processRepository.get(artistId.toString())).thenResolve(songsCount);

	const isRunning = await processTracker.isRunning(artistId);

	t.true(isRunning);
});

test('Should declare process as not running when it is not found', async t => {
	const artistId = 1;

	const {processRepository} = setupMocks();

	const processTracker = new ArtistProcessTracker(processRepository);

	td.when(processRepository.get(artistId.toString())).thenResolve(undefined);

	const isRunning = await processTracker.isRunning(artistId);

	t.false(isRunning);
});

test('Should check if process is finished', async t => {
	const artistId = 1;
	const songsCount = 0;

	const {processRepository} = setupMocks();

	const processTracker = new ArtistProcessTracker(processRepository);

	td.when(processRepository.get(artistId.toString())).thenResolve(songsCount);

	const isFinished = await processTracker.isFinished(artistId);

	t.true(isFinished);
});
