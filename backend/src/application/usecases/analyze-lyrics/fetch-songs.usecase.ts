import {type UseCase} from '../../interfaces/usecase';
import {type SongDto} from '@/application/dtos/song.dto';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type QueueService} from '@/application/interfaces/queue.service.interface';
import {type ProcessTrackerRepository} from '@/application/interfaces/process-tracker.repository.interface';

export class FetchSongs implements UseCase {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
		private readonly queueService: QueueService,
		private readonly processTrackerRepository: ProcessTrackerRepository,
	) {}

	async execute(artistId: number): Promise<void> {
		const songs = await this.lyricsApiService.retrieveSongsForArtist(artistId);
		const chunks = this.chunkSongs(songs);

		await this.publishChunks(artistId, chunks);

		await this.processTrackerRepository.start(artistId, songs.length);
	}

	private async publishChunks(artistId: number, chunks: SongDto[][]): Promise<void[]> {
		return Promise.all(chunks.map(async chunk => this.queueService.sendToParseQueue({artistId, songs: chunk})));
	}

	private chunkSongs(songs: SongDto[], chunkSize = 10): SongDto[][] {
		const chunks = [];

		for (let i = 0; i < songs.length; i += chunkSize) {
			const chunk = songs.slice(i, i + chunkSize);
			chunks.push(chunk);
		}

		return chunks;
	}
}
