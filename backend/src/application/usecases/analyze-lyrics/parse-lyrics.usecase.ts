import {type UseCase} from '../../interfaces/usecase';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import {type SongDto} from '@/application/dtos/song.dto';
import {type IntegrationEventBus} from '@/application/interfaces/integration-event-bus.service.interface';
import {type ParsedLyricsEvent} from '@/application/events/parsed-lyrics.event';

export class ParseLyrics implements UseCase {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
		private readonly artistRepository: ArtistRepository,
		private readonly integrationEventBus: IntegrationEventBus,
	) {}

	async execute(artistId: number, songs: SongDto[]): Promise<void> {
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

		const event: ParsedLyricsEvent = {artistId, eventType: 'parsedLyrics'};
		await this.integrationEventBus.publishIntegrationEvent(event);
	}

	private async saveSongsToArtist(artistId: number, songs: Array<SongDto & {text: string}>): Promise<void> {
		const artist = await this.artistRepository.getById(artistId);
		for (const song of songs) {
			artist.addSong(song.id, song.title, song.text);
		}

		await this.artistRepository.update(artist);
	}
}
