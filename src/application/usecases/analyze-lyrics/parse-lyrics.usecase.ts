import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type FetchSongsDto} from '@/application/dtos/fetch-songs.dto';
import {type ProcessTrackerRepository} from '@/application/interfaces/process-tracker.repository.interface';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';

export class ParseLyrics {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
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

		await this.artistRepository.save(artist);
		await this.processTrackerRepository.decrement(artistId, songs.length);
	}
}
