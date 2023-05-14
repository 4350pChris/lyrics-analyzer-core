import test from 'ava';
import td from 'testdouble';
import {TriggerWorkflow} from '@/application/usecases/analyze-lyrics/trigger-workflow.usecase';
import {type QueueService} from '@/application/interfaces/queue.service.interface';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import {type ArtistFactory} from '@/domain/interfaces/artist.factory.interface';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {type WorkflowTriggerDto} from '@/application/dtos/workflow-trigger.dto';
import {type ProcessTrackerRepository} from '@/application/interfaces/process-tracker.repository.interface';

const setupMocks = () => ({
	queueService: td.object<QueueService>(),
	artistRepository: td.object<ArtistRepository>(),
	artistFactory: td.object<ArtistFactory>(),
	lyricsApiService: td.object<LyricsApiService>(),
	processTrackerRepository: td.object<ProcessTrackerRepository>(),
});

test('Should trigger workflow by pushing artist id to SQS queue', async t => {
	const {queueService, artistRepository, artistFactory, lyricsApiService, processTrackerRepository} = setupMocks();

	const usecase = new TriggerWorkflow(queueService, artistRepository, artistFactory, lyricsApiService, processTrackerRepository);

	const artistId = 1;

	td.when(queueService.sendToFetchQueue({artistId})).thenResolve();

	await usecase.execute(artistId);

	t.pass();
});

test('Should create artist from API if it is not found', async t => {
	const {queueService, artistRepository, artistFactory, lyricsApiService, processTrackerRepository} = setupMocks();

	td.when(artistRepository.getById(td.matchers.anything() as number)).thenReject('Artist does not exist');
	td.when(artistRepository.create(td.matchers.anything() as ArtistAggregate)).thenResolve({});

	const usecase = new TriggerWorkflow(queueService, artistRepository, artistFactory, lyricsApiService, processTrackerRepository);

	await usecase.execute(123);

	t.is(td.explain(artistRepository.create).calls.length, 1);
});

test('Should not create artist if already exists', async t => {
	const {queueService, artistRepository, artistFactory, lyricsApiService, processTrackerRepository} = setupMocks();

	td.when(artistRepository.getById(td.matchers.anything() as number)).thenResolve({} as ArtistAggregate);

	const usecase = new TriggerWorkflow(queueService, artistRepository, artistFactory, lyricsApiService, processTrackerRepository);

	await usecase.execute(123);

	t.is(td.explain(artistRepository.create).calls.length, 0);
});

test('Should reject when artist is being processed already', async t => {
	const {queueService, artistRepository, artistFactory, lyricsApiService, processTrackerRepository} = setupMocks();

	const usecase = new TriggerWorkflow(queueService, artistRepository, artistFactory, lyricsApiService, processTrackerRepository);

	const artistId = 1;
	td.when(processTrackerRepository.isRunning(artistId)).thenResolve(true);

	await t.throwsAsync(usecase.execute(artistId), {message: 'Artist is currently being processed'});
});

