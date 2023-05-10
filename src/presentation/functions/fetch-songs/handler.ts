import {type SQSEvent} from 'aws-lambda';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {setupDependencyInjection} from '@/presentation/libs/dependency-injection';
import {FetchSongs} from '@/application/usecases/analyze-lyrics/fetch-songs.usecase';
import {type Queue} from '@/application/interfaces/queue.interface';
import {type AnalyzeLyricsDto} from '@/application/dtos/analyze-lyrics.dto';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface';
import {type ProcessTracker} from '@/application/interfaces/process-tracker.interface';

export const main = async (event: SQSEvent) => {
	const container = setupDependencyInjection();
	const lyricsApiService = container.resolve<LyricsApiService>('lyricsApiService');
	const artistRepository = container.resolve<ArtistRepository>('artistRepository');
	const queue = container.resolve<Queue>('queueService');
	const processTracker = container.resolve<ProcessTracker>('processTracker');

	const fetchSongs = new FetchSongs(lyricsApiService, artistRepository, queue, processTracker);

	const parsedDtos = event.Records.map(({body}) => JSON.parse(body) as AnalyzeLyricsDto);

	const jobs = parsedDtos.map(async record => fetchSongs.execute(Number.parseInt(record.artistId)));

	await Promise.all(jobs);
};
