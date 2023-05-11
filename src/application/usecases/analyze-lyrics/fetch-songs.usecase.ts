import {type UseCase} from '../../interfaces/usecase';
import {type FetchSongsDto} from '@/application/dtos/fetch-songs.dto';
import {type SongDto} from '@/application/dtos/song.dto';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type Queue} from '@/application/interfaces/queue.interface';
import {type ProcessTrackerRepository} from '@/application/interfaces/process-tracker.repository.interface';

export class FetchSongs implements UseCase {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
		private readonly queueService: Queue,
		private readonly processTrackerRepository: ProcessTrackerRepository,
	) {}

	async execute(artistId: number): Promise<void> {
		if (await this.processTrackerRepository.isRunning(artistId)) {
			throw new Error('Artist is currently being processed');
		}

		const songs = await this.lyricsApiService.retrieveSongsForArtist(artistId);
		const chunks = this.chunkSongs(songs);

		await this.publishChunks(artistId.toString(), chunks);

		await this.processTrackerRepository.start(artistId, songs.length);
	}

	private async publishChunks(artistId: string, chunks: SongDto[][]): Promise<void[]> {
		return Promise.all(chunks.map(async chunk => {
			const dto: FetchSongsDto = {artistId, songs: chunk};
			return this.queueService.publish(JSON.stringify(dto));
		}));
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
