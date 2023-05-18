import test from 'ava';
import td from 'testdouble';
import {TriggerWorkflow} from '@/application/usecases/analyze-lyrics/trigger-workflow.usecase';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import {type ArtistFactory} from '@/domain/interfaces/artist.factory.interface';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {type IntegrationEventBus} from '@/application/interfaces/integration-event-bus.service.interface';

const setupMocks = () => ({
	artistRepository: td.object<ArtistRepository>(),
	artistFactory: td.object<ArtistFactory>(),
	lyricsApiService: td.object<LyricsApiService>(),
	integrationEventBus: td.object<IntegrationEventBus>(),
});

test.afterEach.always('Reset mocks', () => {
	td.reset();
});

test('Should trigger workflow by publishing integration event', async t => {
	const {artistRepository, artistFactory, lyricsApiService, integrationEventBus} = setupMocks();

	const usecase = new TriggerWorkflow(artistRepository, artistFactory, lyricsApiService, integrationEventBus);

	td.when(integrationEventBus.publishIntegrationEvent(td.matchers.anything())).thenResolve();

	const artistId = 1;

	await usecase.execute(artistId);

	t.pass();
});

test('Should create artist from API if it is not found', async t => {
	const {artistRepository, artistFactory, lyricsApiService, integrationEventBus} = setupMocks();

	td.when(artistRepository.getById(td.matchers.anything() as number)).thenReject('Artist does not exist');
	td.when(artistRepository.create(td.matchers.anything() as ArtistAggregate)).thenResolve({});

	const usecase = new TriggerWorkflow(artistRepository, artistFactory, lyricsApiService, integrationEventBus);

	await usecase.execute(123);

	t.is(td.explain(artistRepository.create).calls.length, 1);
});

test('Should not create artist if already exists', async t => {
	const {artistRepository, artistFactory, lyricsApiService, integrationEventBus} = setupMocks();

	td.when(artistRepository.getById(td.matchers.anything() as number)).thenResolve({} as ArtistAggregate);

	const usecase = new TriggerWorkflow(artistRepository, artistFactory, lyricsApiService, integrationEventBus);

	await usecase.execute(123);

	t.is(td.explain(artistRepository.create).calls.length, 0);
});
