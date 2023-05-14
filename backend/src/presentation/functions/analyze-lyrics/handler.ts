import middy from '@middy/core';
import sqsJsonBodyParser from '@middy/sqs-json-body-parser';
import type schema from './schema';
import {withDependencies} from '@/presentation/libs/with-dependencies';
import {type ValidatedEventSQSEvent} from '@/presentation/libs/sqs';
import {type AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase';

const handler = withDependencies<ValidatedEventSQSEvent<typeof schema>>((
	analyzeLyricsUseCase: AnalyzeLyrics,
) => async event => {
	const jobs = event.Records.map(async ({body}) => analyzeLyricsUseCase.execute(body.artistId));

	await Promise.all(jobs);
});

export const main = middy(handler).use(sqsJsonBodyParser());
