import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse} from '../../libs/api-gateway';
import type schema from './schema';
import {withDependencies} from '@/presentation/libs/with-dependencies';
import {type AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase';

const handler = withDependencies<ValidatedEventAPIGatewayProxyEvent<typeof schema>>((
	analyzeLyricsUseCase: AnalyzeLyrics,
) => async event => {
	await analyzeLyricsUseCase.execute(event.body.artistId.toString());

	return formatJSONResponse({
		message: `Lyrics for artist ${event.body.artistId} are being analyzed`,
	});
});

export const main = middy(handler).use(httpJsonBodyParser());

