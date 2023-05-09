import type {SQSEvent} from 'aws-lambda';
import {setupDependencyInjection} from '../../libs/dependency-injection';
import {SongChunk} from '@/domain/entities/song-chunk.entity';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';

export const handler = async (event: SQSEvent) => {
	const container = setupDependencyInjection();
	const lyricsApiService = container.resolve<LyricsApiService>('lyricsApiService');
	const parsingPromises: Array<Promise<string>> = [];
	for (const record of event.Records) {
		const chunk = SongChunk.unserialize(record.body);
		parsingPromises.push(...chunk.songs.map(async song => lyricsApiService.parseLyrics(new URL(song.url))));
	}

	await Promise.all(parsingPromises);
};
