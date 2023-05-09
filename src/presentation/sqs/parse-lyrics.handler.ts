import type {SQSEvent} from 'aws-lambda';
import {SongChunk} from '@/domain/entities/song-chunk.entity.js';
import {setupDependencyInjection} from '@/infrastructure/dependency-injection.js';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface.js';

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
