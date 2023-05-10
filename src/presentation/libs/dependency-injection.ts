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

export const setupDependencyInjection = () => {
	const container = createContainer({
		injectionMode: InjectionMode.CLASSIC,
	});

	container.register({
		artistRepository: asClass(DynamooseArtistRepository).singleton(),
		geniusAccessToken: asValue(process.env.GENIUS_ACCESS_TOKEN),
		geniusBaseUrl: asValue('https://api.genius.com'),
		geniusApiClient: asClass(GeniusApiClient).singleton(),
		lyricsApiService: asClass(GeniusService).singleton(),
		artistMapper: asClass(ArtistMapper).singleton(),
		artistTableName: asValue(process.env.ARTIST_TABLE_NAME),
		artistModel: asFunction(getArtistModel).singleton(),
		sqs: asFunction(() => new SQS()),
		queueService: asClass(SqsQueueService),
		processTableName: asValue(process.env.PROCESS_TABLE_NAME),
		processModel: asFunction(getProcessModel).singleton(),
		processRepository: asClass(DynamooseProcessRepository),
		processTracker: asClass(ArtistProcessTracker),
	});

	return container;
};
