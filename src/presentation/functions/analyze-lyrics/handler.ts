import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse} from '../../libs/api-gateway';
import type schema from './schema';
import {withDependencies} from '@/presentation/libs/with-dependencies';
import {type AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase';
import {middyfy} from '@/presentation/libs/lambda';

const handler = withDependencies<ValidatedEventAPIGatewayProxyEvent<typeof schema>>((
	analyzeLyricsUseCase: AnalyzeLyrics,
) => async event => {
	await analyzeLyricsUseCase.execute(event.body.artistId.toString());

	return formatJSONResponse({
		message: `Lyrics for artist ${event.body.artistId} are being analyzed`,
	});
});

export const main = middyfy(handler);

