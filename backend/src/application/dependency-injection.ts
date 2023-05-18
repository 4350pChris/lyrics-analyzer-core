import process from 'node:process';
import {createContainer, asClass, asValue, asFunction, InjectionMode} from 'awilix';
import {SQSClient} from '@aws-sdk/client-sqs';
import {type ModelType} from 'dynamoose/dist/General';
import {AnalyzeLyrics} from './usecases/analyze-lyrics/analyze-lyrics.usecase';
import {DynamooseArtistRepository} from '@/infrastructure/repositories/dynamoose-artist.repository';
import {GeniusService} from '@/infrastructure/services/genius.service';
import {ArtistMapper} from '@/infrastructure/mappers/artist.mapper';
import {type ArtistModelItem, getArtistModel} from '@/infrastructure/models/artist.model';
import {GeniusApiClient} from '@/infrastructure/clients/genius-api.client';
import {SqsIntegrationEventBus} from '@/infrastructure/services/sqs-integration-event-bus.service';
import {SearchArtists} from '@/application/usecases/artist/search-artists.usecase';
import {FetchSongs} from '@/application/usecases/analyze-lyrics/fetch-songs.usecase';
import {ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {ListArtists} from '@/application/usecases/artist/list-artists.usecase';
import {TriggerWorkflow} from '@/application/usecases/analyze-lyrics/trigger-workflow.usecase';
import {ConcreteArtistFactory} from '@/domain/factories/concrete-artist.factory';
import {ConcreteStatisticsCalculator} from '@/domain/services/concrete-statistics-calculator.service';

export type Cradle = {
	geniusAccessToken: string;
	artistTableName: string;
	processTableName: string;
	integrationEventQueueUrl: string;
	geniusBaseUrl?: string;
	// Models
	artistModel: ModelType<ArtistModelItem>;
	// Mappers
	artistMapper: ArtistMapper;
	// Factories
	artistFactory: ConcreteArtistFactory;
	// Repositories
	artistRepository: DynamooseArtistRepository;
	// Services
	statisticsCalculator: ConcreteStatisticsCalculator;
	geniusApiClient: GeniusApiClient;
	lyricsApiService: GeniusService;
	sqs: SQSClient;
	integrationEventBus: SqsIntegrationEventBus;
	// Use cases
	searchArtistsUseCase: SearchArtists;
	listArtistsUseCase: ListArtists;
	triggerWorkflowUseCase: TriggerWorkflow;
	fetchSongsUseCase: FetchSongs;
	parseLyricsUseCase: ParseLyrics;
	analyzeLyricsUseCase: AnalyzeLyrics;
};

const container = createContainer<Cradle>({
	injectionMode: InjectionMode.CLASSIC,
});

const getEnv = (key: string) => {
	const value = process.env[key];
	if (value === undefined) {
		throw new Error(`Environment variable ${key} is not defined`);
	}

	return value;
};

container.register({
	// Environment variables
	geniusAccessToken: asValue(getEnv('GENIUS_ACCESS_TOKEN')),
	artistTableName: asValue(getEnv('ARTIST_TABLE_NAME')),
	integrationEventQueueUrl: asValue(getEnv('INTEGRATION_EVENT_QUEUE_URL')),
	geniusBaseUrl: asValue('https://api.genius.com'),
	// Models
	artistModel: asFunction(getArtistModel).singleton(),
	// Mappers
	artistMapper: asClass(ArtistMapper),
	// Factories
	artistFactory: asClass(ConcreteArtistFactory),
	// Repositories
	artistRepository: asClass(DynamooseArtistRepository),
	// Services
	statisticsCalculator: asClass(ConcreteStatisticsCalculator),
	geniusApiClient: asClass(GeniusApiClient),
	lyricsApiService: asClass(GeniusService),
	sqs: asFunction(() => new SQSClient({})),
	integrationEventBus: asClass(SqsIntegrationEventBus),
	// Use cases
	searchArtistsUseCase: asClass(SearchArtists),
	listArtistsUseCase: asClass(ListArtists),
	triggerWorkflowUseCase: asClass(TriggerWorkflow),
	fetchSongsUseCase: asClass(FetchSongs),
	parseLyricsUseCase: asClass(ParseLyrics),
	analyzeLyricsUseCase: asClass(AnalyzeLyrics),
});

export {container};

