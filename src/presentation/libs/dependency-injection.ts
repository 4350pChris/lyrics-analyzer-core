import process from 'node:process';
import {createContainer, asClass, asValue, asFunction, InjectionMode} from 'awilix';
import {SQS} from 'aws-sdk';
import {DynamooseArtistRepository} from '@/infrastructure/repositories/dynamoose-artist.repository';
import {GeniusService} from '@/infrastructure/services/genius.service';
import {ArtistMapper} from '@/infrastructure/mappers/artist.mapper';
import {getArtistModel} from '@/infrastructure/models/artist.model';
import {GeniusApiClient} from '@/infrastructure/clients/genius-api.client';
import {SqsQueueService} from '@/infrastructure/services/sqs-queue.service';
import {ArtistProcessTracker} from '@/application/services/artist-process-tracker.service';
import {DynamooseProcessRepository} from '@/infrastructure/repositories/dynamoose-process.repository';
import {getProcessModel} from '@/infrastructure/models/process.model';
import {SearchArtists} from '@/application/usecases/artist/search-artists.usecase';
import {AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase';
import {FetchSongs} from '@/application/usecases/analyze-lyrics/fetch-songs.usecase';
import {ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {ListArtists} from '@/application/usecases/artist/list-artists.usecase';

export const setupDependencyInjection = () => {
	const container = createContainer({
		injectionMode: InjectionMode.CLASSIC,
	});

	container.register({
		// Environment variables
		geniusAccessToken: asValue(process.env.GENIUS_ACCESS_TOKEN),
		artistTableName: asValue(process.env.ARTIST_TABLE_NAME),
		processTableName: asValue(process.env.PROCESS_TABLE_NAME),
		queueUrl: asValue(process.env.QUEUE_URL),
		geniusBaseUrl: asValue('https://api.genius.com'),
		// Models
		artistModel: asFunction(getArtistModel).singleton(),
		processModel: asFunction(getProcessModel).singleton(),
		// Repositories
		artistRepository: asClass(DynamooseArtistRepository).singleton(),
		processRepository: asClass(DynamooseProcessRepository),
		// Services
		geniusApiClient: asClass(GeniusApiClient).singleton(),
		lyricsApiService: asClass(GeniusService).singleton(),
		artistMapper: asClass(ArtistMapper).singleton(),
		sqs: asFunction(() => new SQS()).singleton(),
		queueService: asClass(SqsQueueService),
		processTracker: asClass(ArtistProcessTracker),
		queue: asClass(SqsQueueService),
		// Use cases
		searchArtistsUseCase: asClass(SearchArtists),
		listArtistsUseCase: asClass(ListArtists),
		analyzeLyricsUseCase: asClass(AnalyzeLyrics),
		fetchSongsUseCase: asClass(FetchSongs),
		parseLyricsUseCase: asClass(ParseLyrics),
	});

	return container;
};
