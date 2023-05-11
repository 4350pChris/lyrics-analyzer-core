import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse} from '../../libs/api-gateway';
import type schema from './schema';
import {withDependencies} from '@/presentation/libs/with-dependencies';
import {type TriggerWorkflow} from '@/application/usecases/analyze-lyrics/trigger-workflow.usecase';

const handler = withDependencies<ValidatedEventAPIGatewayProxyEvent<typeof schema>>((
	triggerWorkflowUseCase: TriggerWorkflow,
) => async event => {
	await triggerWorkflowUseCase.execute(event.body.artistId.toString());

	return formatJSONResponse({
		message: `Lyrics for artist ${event.body.artistId} are being analyzed`,
	});
});

export const main = middy(handler).use(httpJsonBodyParser());
