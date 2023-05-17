import type {UseCase} from '../../interfaces/usecase';
import {type QueueService} from '@/application/interfaces/queue.service.interface';
import {type ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import {type ArtistFactory} from '@/domain/interfaces/artist.factory.interface';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';

export class TriggerWorkflow implements UseCase {
	constructor(
		private readonly artistRepository: ArtistRepository,
		private readonly artistFactory: ArtistFactory,
		private readonly lyricsApiService: LyricsApiService,
	) {}

	async execute(artistId: number): Promise<void> {
		try {
			const artist = await this.artistRepository.getById(artistId);
			if (artist) {
				return;
			}
		} catch {
			// Do nothing, artist does not exist and we will create it
		}

		const apiArtist = await this.lyricsApiService.getArtist(artistId);

		const artist = this.artistFactory.createArtist({...apiArtist, songs: []});
		await this.artistRepository.create(artist);
	}
}
