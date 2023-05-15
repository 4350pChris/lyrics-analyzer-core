import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse} from '../../../libs/api-gateway';
import {withDependencies} from '@/presentation/libs/with-dependencies';
import type {ListArtists} from '@/application/usecases/artist/list-artists.usecase';
import {type ArtistMapper} from '@/infrastructure/mappers/artist.mapper';

const handler = withDependencies<ValidatedEventAPIGatewayProxyEvent<never>>((
	listArtistsUseCase: ListArtists,
	artistMapper: ArtistMapper,
) => async () => {
	const artists = await listArtistsUseCase.execute();

	const serialized = artists.map(artist => artistMapper.toModel(artist));
	return formatJSONResponse({
		artists: serialized,
	});
});

export const main = middy(handler).use(httpJsonBodyParser());

