import {type FromSchema} from 'json-schema-to-ts';
import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, middyfyGatewayHandler} from '../../../libs/api-gateway';

const handler: ValidatedEventAPIGatewayProxyEvent<FromSchema<never>> = async (event, context) => {
	const {query} = event.queryStringParameters;

	if (!query) {
		return formatJSONResponse({
			message: 'No query provided',
		}, 400);
	}

	const {searchArtistsUseCase} = context.container.cradle;
	const artists = await searchArtistsUseCase.execute(query);

	return formatJSONResponse({
		artists,
	});
};

export const main = middyfyGatewayHandler(handler);

