import {type SQSEvent} from 'aws-lambda';
import {setupDependencyInjection} from '@/presentation/libs/dependency-injection';
import {type FetchSongs} from '@/application/usecases/analyze-lyrics/fetch-songs.usecase';
import {type AnalyzeLyricsDto} from '@/application/dtos/analyze-lyrics.dto';

export const main = async (event: SQSEvent) => {
	const container = setupDependencyInjection();

	const fetchSongs = container.resolve<FetchSongs>('fetchSongsUseCase');

	const parsedDtos = event.Records.map(({body}) => JSON.parse(body) as AnalyzeLyricsDto);

	const jobs = parsedDtos.map(async record => fetchSongs.execute(Number.parseInt(record.artistId)));

	await Promise.all(jobs);
};
