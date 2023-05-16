import {type FromSchema} from 'json-schema-to-ts';
import type schema from './schema';
import {type ValidatedEventSQSEvent, middyfySqsHandler} from '@/presentation/libs/sqs';

const handler: ValidatedEventSQSEvent<FromSchema<typeof schema>> = async (event, context) => {
	const {fetchSongsUseCase} = context.container.cradle;
	const jobs = event.Records.map(async ({body}) => fetchSongsUseCase.execute(body.artistId));

	await Promise.all(jobs);
};

export const main = middyfySqsHandler(handler);
