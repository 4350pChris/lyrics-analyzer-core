import type {SQSEvent} from 'aws-lambda';
import {setupDependencyInjection} from '../../libs/dependency-injection';
import {type ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {type ParsedSongsDto} from '@/application/dtos/parsed-songs.dto';

export const main = async (event: SQSEvent) => {
	const container = setupDependencyInjection();

	const parseLyrics = container.resolve<ParseLyrics>('parseLyricsUseCase');

	const parsedDtos = event.Records.map(({body}) => JSON.parse(body) as ParsedSongsDto);

	const jobs = parsedDtos.map(async record => parseLyrics.execute(record));

	await Promise.all(jobs);
};
