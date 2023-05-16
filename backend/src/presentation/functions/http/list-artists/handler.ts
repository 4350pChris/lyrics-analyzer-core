import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, middyfyGatewayHandler} from '../../../libs/api-gateway';

const handler: ValidatedEventAPIGatewayProxyEvent<never> = async (_, context) => {
	const {artistMapper, listArtistsUseCase} = context.container.cradle;
	const artists = await listArtistsUseCase.execute();

	const serialized = artists.map(artist => artistMapper.toModel(artist));

	return formatJSONResponse({
		artists: serialized,
	});
};

export const main = middyfyGatewayHandler(handler);

