import {type FromSchema} from 'json-schema-to-ts';
import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, middyfyGatewayHandler} from '../../../libs/api-gateway';
import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<FromSchema<typeof schema>> = async (event, context) => {
	const {triggerWorkflowUseCase} = context.container.cradle;
	await triggerWorkflowUseCase.execute(event.body.artistId);

	return formatJSONResponse({
		message: `Lyrics for artist ${event.body.artistId} are being analyzed`,
	});
};

export const main = middyfyGatewayHandler(handler, schema);

