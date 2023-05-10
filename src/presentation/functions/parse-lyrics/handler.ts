import middy from '@middy/core';
import sqsJsonBodyParser from '@middy/sqs-json-body-parser';
import type schema from './schema';
import {type ParseLyrics} from '@/application/usecases/analyze-lyrics/parse-lyrics.usecase';
import {withDependencies} from '@/presentation/libs/with-dependencies';
import {type ValidatedEventSQSEvent} from '@/presentation/libs/sqs';

const handler = withDependencies<ValidatedEventSQSEvent<typeof schema>>((
	parseLyricsUseCase: ParseLyrics,
) => async event => {
	const jobs = event.Records.map(async ({body}) => parseLyricsUseCase.execute(body));

	await Promise.all(jobs);
});

export const main = middy(handler).use(sqsJsonBodyParser());
