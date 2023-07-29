import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, middyfyGatewayHandler} from '../../../libs/api-gateway';

const handler: ValidatedEventAPIGatewayProxyEvent<never> = async (_, context) => {
	const {listArtistsUseCase} = context.container.cradle;
	const artists = await listArtistsUseCase.execute();

	return formatJSONResponse({
		artists,
	});
};

export const main = middyfyGatewayHandler(handler);

