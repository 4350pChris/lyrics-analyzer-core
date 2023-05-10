import process from 'node:process';
import type {SQSEvent} from 'aws-lambda';
import {asValue} from 'awilix';
import {setupDependencyInjection} from '../../libs/dependency-injection';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {type Queue} from '@/application/interfaces/queue.interface';
import {type ParsedSongsDto} from '@/application/dtos/parsed-songs.dto';

export const main = async (event: SQSEvent) => {
	const queueUrl = process.env.QUEUE_URL;
	if (!queueUrl) {
		throw new Error('QUEUE_URL environment variable is required, check serverless config');
	}

	const container = setupDependencyInjection();
	container.register('queueUrl', asValue(queueUrl));
	const lyricsApiService = container.resolve<LyricsApiService>('lyricsApiService');
	const queue = container.resolve<Queue>('queueService');
	const parseLyrics = new ParseLyrics(lyricsApiService, queue);

	const parsedDtos = event.Records.map(({body}) => JSON.parse(body) as ParsedSongsDto);

	const jobs = parsedDtos.map(async record => parseLyrics.execute(record));

	await Promise.all(jobs);
};
