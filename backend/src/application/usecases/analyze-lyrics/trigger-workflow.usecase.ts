import type {UseCase} from '../../interfaces/usecase';
import {type TriggerWorkflowEvent} from '../../events/trigger-workflow.event';
import {type IntegrationEventBus} from '@/application/interfaces/integration-event-bus.service.interface';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import {type ArtistFactory} from '@/domain/interfaces/artist.factory.interface';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';

export class TriggerWorkflow implements UseCase {
	constructor(
		private readonly artistRepository: ArtistRepository,
		private readonly artistFactory: ArtistFactory,
		private readonly lyricsApiService: LyricsApiService,
		private readonly integrationEventBus: IntegrationEventBus,
	) {}

	async execute(artistId: number): Promise<void> {
		let artist: ArtistAggregate;
		try {
			artist = await this.artistRepository.getById(artistId);
		} catch {
			const apiArtist = await this.lyricsApiService.getArtist(artistId);

			const artist = this.artistFactory.createArtist({...apiArtist, songs: []});
			await this.artistRepository.create(artist);
		}

		const event: TriggerWorkflowEvent = {artistId, eventType: 'triggerWorkflow'};
		await this.integrationEventBus.publishIntegrationEvent(event);
	}
}
