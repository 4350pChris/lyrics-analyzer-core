import {type SQSHandler} from 'aws-lambda';
import {type FetchSongs} from '@/application/usecases/analyze-lyrics/fetch-songs.usecase';
import {type AnalyzeLyricsDto} from '@/application/dtos/analyze-lyrics.dto';
import {withDependencies} from '@/presentation/libs/with-dependencies';

export const main = withDependencies<SQSHandler>((
	fetchSongsUseCase: FetchSongs,
) => async event => {
	const parsedDtos = event.Records.map(({body}) => JSON.parse(body) as AnalyzeLyricsDto);

	const jobs = parsedDtos.map(async record => fetchSongsUseCase.execute(Number.parseInt(record.artistId)));

	await Promise.all(jobs);
});
