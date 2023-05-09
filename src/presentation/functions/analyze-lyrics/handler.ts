import process from 'node:process';
import type {SQS} from 'aws-sdk';
import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse} from '../../libs/api-gateway';
import {setupDependencyInjection} from '../../libs/dependency-injection';
import type schema from './schema';
import {AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase';
import {SqsQueueService} from '@/infrastructure/services/sqs-queue.service';
import type {LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {middyfy} from '@/presentation/libs/lambda';

const analyzeLyrics: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async event => {
	const queueUrl = process.env.QUEUE_URL;
	if (!queueUrl) {
		throw new Error('QUEUE_URL environment variable is required, check serverless config');
	}

	const container = setupDependencyInjection();
	const queue = new SqsQueueService(container.resolve<SQS>('sqs'), queueUrl);

	const analyzeLyrics = new AnalyzeLyrics(container.resolve<LyricsApiService>('lyricsApiService'), queue);
	await analyzeLyrics.execute(event.body.artistId);

	return formatJSONResponse({
		message: `Lyrics for artist ${event.body.artistId} are being analyzed`,
	});
};

export const main = middyfy(analyzeLyrics);

