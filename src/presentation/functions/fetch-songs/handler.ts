import process from 'node:process';
import {asValue} from 'awilix';
import {type SQSEvent} from 'aws-lambda';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {setupDependencyInjection} from '@/presentation/libs/dependency-injection';
import {FetchSongs} from '@/application/usecases/analyze-lyrics/fetch-songs.usecase';
import {type Queue} from '@/application/interfaces/queue.interface';
import {type AnalyzeLyricsDto} from '@/application/dtos/analyze-lyrics.dto';

export const main = async (event: SQSEvent) => {
	const queueUrl = process.env.QUEUE_URL;
	if (!queueUrl) {
		throw new Error('QUEUE_URL environment variable is required, check serverless config');
	}

	const container = setupDependencyInjection();
	container.register('queueUrl', asValue(queueUrl));
	const lyricsApiService = container.resolve<LyricsApiService>('lyricsApiService');
	const queue = container.resolve<Queue>('queueService');

	const fetchSongs = new FetchSongs(lyricsApiService, queue);

	const parsedDtos = event.Records.map(({body}) => JSON.parse(body) as AnalyzeLyricsDto);

	const jobs = parsedDtos.map(async record => fetchSongs.execute(record.artistId));

	await Promise.all(jobs);
};
