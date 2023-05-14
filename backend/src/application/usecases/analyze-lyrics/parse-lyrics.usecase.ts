import {type UseCase} from '../../interfaces/usecase';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type FetchSongsDto} from '@/application/dtos/fetch-songs.dto';
import {type QueueService} from '@/application/interfaces/queue.service.interface';
import {type ProcessTrackerRepository} from '@/application/interfaces/process-tracker.repository.interface';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import {type SongDto} from '@/application/dtos/song.dto';

export class ParseLyrics implements UseCase {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
		private readonly queueService: QueueService,
		private readonly processTrackerRepository: ProcessTrackerRepository,
		private readonly artistRepository: ArtistRepository,
	) {}

	async execute({artistId, songs}: FetchSongsDto) {
		const parsedSongs = await Promise.allSettled(songs.map(async song => {
			const text = await this.lyricsApiService.parseLyrics(new URL(song.url));
			return {...song, text};
		}));

		const successfulSongs = [];
		for (const result of parsedSongs) {
			if (result.status === 'fulfilled') {
				successfulSongs.push(result.value);
			}
		}

		await this.saveSongsToArtist(artistId, successfulSongs);

		await this.processTrackerRepository.decrement(artistId, songs.length);

		await this.triggerAnalysis(artistId);
	}

	private async triggerAnalysis(artistId: number): Promise<void> {
		const running = await this.processTrackerRepository.isRunning(artistId);
		if (!running) {
			await this.processTrackerRepository.delete(artistId);
			await this.queueService.sendToAnalysisQueue({artistId});
		}
	}

	private async saveSongsToArtist(artistId: number, songs: Array<SongDto & {text: string}>): Promise<void> {
		const artist = await this.artistRepository.getById(artistId);
		for (const song of songs) {
			artist.addSong(song.id, song.title, song.text);
		}

		await this.artistRepository.update(artist);
	}
}
