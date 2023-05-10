import type {SQSEvent} from 'aws-lambda';
import {setupDependencyInjection} from '../../libs/dependency-injection';
import {type ProcessTracker} from '@/application/interfaces/process-tracker.interface';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {type Queue} from '@/application/interfaces/queue.interface';
import {type ParsedSongsDto} from '@/application/dtos/parsed-songs.dto';

export const main = async (event: SQSEvent) => {
	const container = setupDependencyInjection();
	const lyricsApiService = container.resolve<LyricsApiService>('lyricsApiService');
	const queue = container.resolve<Queue>('queueService');
	const processTracker = container.resolve<ProcessTracker>('processTracker');

	const parseLyrics = new ParseLyrics(lyricsApiService, queue, processTracker);

	const parsedDtos = event.Records.map(({body}) => JSON.parse(body) as ParsedSongsDto);

	const jobs = parsedDtos.map(async record => parseLyrics.execute(record));

	await Promise.all(jobs);
};
