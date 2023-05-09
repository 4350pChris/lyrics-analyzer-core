import type {UseCase} from '../usecase';
import {type SongDto} from '@/application/dtos/song.dto';
import type {LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type Queue} from '@/application/interfaces/queue.interface';
import {SongChunk} from '@/domain/entities/song-chunk.entity';

export class AnalyzeLyrics implements UseCase {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
		private readonly queue: Queue,
	) {}

	async execute(artistId: number): Promise<void> {
		const songs = await this.lyricsApiService.retrieveSongsForArtist(artistId);
		const chunks = this.getSongsInChunks(songs);
		await Promise.all(chunks.map(async chunk => this.queue.publish(chunk.serialize())));
	}

	getSongsInChunks(songs: SongDto[], chunkSize = 10) {
		// Chunk into buckets of 10 songs
		const chunks: SongChunk[] = [];

		for (let i = 0; i < songs.length; i += chunkSize) {
			const chunk = new SongChunk();
			for (const song of songs.slice(i, i + chunkSize)) {
				chunk.addSong(song.id, song.title, song.url);
			}

			chunks.push(chunk);
		}

		return chunks;
	}
}
