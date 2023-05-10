import {type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse} from '../../libs/api-gateway';
import {setupDependencyInjection} from '../../libs/dependency-injection';
import type schema from './schema';
import {type AnalyzeLyrics} from '@/application/usecases/analyze-lyrics/analyze-lyrics.usecase';
import {middyfy} from '@/presentation/libs/lambda';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async event => {
	const container = setupDependencyInjection();

	const analyzeLyrics = container.resolve<AnalyzeLyrics>('analyzeLyricsUseCase');
	await analyzeLyrics.execute(event.body.artistId.toString());

	return formatJSONResponse({
		message: `Lyrics for artist ${event.body.artistId} are being analyzed`,
	});
};

export const main = middyfy(handler);

