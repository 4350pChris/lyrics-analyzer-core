import type {SQSHandler} from 'aws-lambda';
import {type ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {type ParsedSongsDto} from '@/application/dtos/parsed-songs.dto';
import {withDependencies} from '@/presentation/libs/with-dependencies';

export const main = withDependencies<SQSHandler>((
	parseLyricsUseCase: ParseLyrics,
) => async event => {
	const parsedDtos = event.Records.map(({body}) => JSON.parse(body) as ParsedSongsDto);

	const jobs = parsedDtos.map(async record => parseLyricsUseCase.execute(record));

	await Promise.all(jobs);
});
