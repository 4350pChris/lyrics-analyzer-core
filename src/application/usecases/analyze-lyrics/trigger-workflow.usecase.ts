import type {UseCase} from '../../interfaces/usecase';
import {type QueueService} from '@/application/interfaces/queue.service.interface';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import {type ArtistFactory} from '@/domain/interfaces/concrete-artist.factory.interface';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';
import {type ProcessTrackerRepository} from '@/application/interfaces/process-tracker.repository.interface';

export class TriggerWorkflow implements UseCase {
	constructor(
		private readonly queueService: QueueService,
		private readonly artistRepository: ArtistRepository,
		private readonly artistFactory: ArtistFactory,
		private readonly lyricsApiService: LyricsApiService,
		private readonly processTrackerRepository: ProcessTrackerRepository,
	) {}

	async execute(artistId: number): Promise<void> {
		if (await this.processTrackerRepository.isRunning(artistId)) {
			throw new Error('Artist is currently being processed');
		}

		await this.createArtistFromApi(artistId);
		await this.queueService.sendToFetchQueue({artistId});
	}

	private async createArtistFromApi(artistId: number): Promise<void> {
		try {
			const artist = await this.artistRepository.getById(artistId);
			if (artist) {
				return;
			}
		} catch {
			// Do nothing, artist does not exist and we will create it
		}

		const apiArtist = await this.lyricsApiService.getArtist(artistId);

		const artist = this.artistFactory.createArtist({id: artistId, ...apiArtist, songs: []});
		await this.artistRepository.create(artist);
	}
}
