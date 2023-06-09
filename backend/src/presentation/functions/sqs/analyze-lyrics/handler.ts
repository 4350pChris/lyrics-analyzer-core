import {type FromSchema} from 'json-schema-to-ts';
import schema from './schema';
import {middyfySqsHandler, type ValidatedEventSQSEvent} from '@/presentation/libs/sqs';

const handler: ValidatedEventSQSEvent<FromSchema<typeof schema>> = async (event, context) => {
	const {analyzeLyricsUseCase} = context.container.cradle;
	const jobs = event.Records.map(async ({body: {Message}}) => analyzeLyricsUseCase.execute(Message.artistId));

	await Promise.all(jobs);
};

export const main = middyfySqsHandler(handler, schema);
