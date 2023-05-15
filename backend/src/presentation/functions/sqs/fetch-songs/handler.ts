import middy from '@middy/core';
import sqsJsonBodyParser from '@middy/sqs-json-body-parser';
import type schema from './schema';
import {type FetchSongs} from '@/application/usecases/analyze-lyrics/fetch-songs.usecase';
import {withDependencies} from '@/presentation/libs/with-dependencies';
import {type ValidatedEventSQSEvent} from '@/presentation/libs/sqs';

const handler = withDependencies<ValidatedEventSQSEvent<typeof schema>>((
	fetchSongsUseCase: FetchSongs,
) => async event => {
	const jobs = event.Records.map(async ({body}) => fetchSongsUseCase.execute(body.artistId));

	await Promise.all(jobs);
});

export const main = middy(handler).use(sqsJsonBodyParser());
