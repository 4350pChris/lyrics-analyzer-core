import process from 'node:process';
import type {APIGatewayProxyEventV2} from 'aws-lambda';
import type {SQS} from 'aws-sdk';
import {AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase.js';
import {setupDependencyInjection} from '@/infrastructure/dependency-injection.js';
import {SqsQueueService} from '@/infrastructure/services/sqs-queue.service.js';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface.js';

export const handler = async (event: APIGatewayProxyEventV2) => {
	const queueUrl = process.env.QUEUE_URL;
	if (!queueUrl) {
		throw new Error('QUEUE_URL environment variable is required, check serverless config');
	}

	const body = JSON.parse(event.body ?? '{}') as {artistId?: number};
	if (!body.artistId) {
		throw new Error('artistId is required');
	}

	const container = setupDependencyInjection();
	const queue = new SqsQueueService(container.resolve<SQS>('sqs'), queueUrl);

	const analyzeLyrics = new AnalyzeLyrics(container.resolve<LyricsApiService>('lyricsApiService'), queue);
	await analyzeLyrics.execute(body.artistId);
};
