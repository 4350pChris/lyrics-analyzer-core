import {type UseCase} from '../../interfaces/usecase';
import {type IntegrationEventBus} from '../../interfaces/integration-event-bus.service.interface';
import {type SongDto} from '@/application/dtos/song.dto';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type FetchedSongsEvent} from '@/application/events/fetched-songs.event';

export class FetchSongs implements UseCase {
	constructor(
		private readonly lyricsApiService: LyricsApiService,
		private readonly integrationEventBus: IntegrationEventBus,
	) {}

	async execute(artistId: number): Promise<SongDto[]> {
		const songs = await this.lyricsApiService.retrieveSongsForArtist(artistId);
		const event: FetchedSongsEvent = {
			artistId,
			songs,
			eventType: 'fetchedSongs',
		};
		await this.integrationEventBus.publishIntegrationEvent(event);
		return songs;
	}
}
