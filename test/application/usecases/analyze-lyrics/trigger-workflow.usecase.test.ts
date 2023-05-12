import test from 'ava';
import td from 'testdouble';
import {TriggerWorkflow} from '@/application/usecases/analyze-lyrics/trigger-workflow.usecase';
import {type QueueService} from '@/application/interfaces/queue.service.interface';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import {type ArtistFactory} from '@/domain/interfaces/concrete-artist.factory.interface';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {type WorkflowTriggerDto} from '@/application/dtos/workflow-trigger.dto';

const setupMocks = () => ({
	queueService: td.object<QueueService>(),
	artistRepository: td.object<ArtistRepository>(),
	artistFactory: td.object<ArtistFactory>(),
	lyricsApiService: td.object<LyricsApiService>(),
});

test('Should trigger workflow by pushing artist id to SQS queue', async t => {
	const {queueService, artistRepository, artistFactory, lyricsApiService} = setupMocks();

	td.when(queueService.sendToFetchQueue(td.matchers.anything() as WorkflowTriggerDto)).thenResolve();

	const usecase = new TriggerWorkflow(queueService, artistRepository, artistFactory, lyricsApiService);

	await usecase.execute(123);

	t.deepEqual(td.explain(queueService.sendToFetchQueue).calls[0].args[0], {artistId: '123'});
});

test('Should create artist from API', async t => {
	const {queueService, artistRepository, artistFactory, lyricsApiService} = setupMocks();

	td.when(artistRepository.save(td.matchers.anything() as ArtistAggregate)).thenResolve({});

	const usecase = new TriggerWorkflow(queueService, artistRepository, artistFactory, lyricsApiService);

	await usecase.execute(123);

	t.is(td.explain(artistRepository.save).calls.length, 1);
});
