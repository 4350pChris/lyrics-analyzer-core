import type {UseCase} from '../../interfaces/usecase';
import {type QueueService} from '@/application/interfaces/queue.service.interface';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface';
import {type ArtistFactory} from '@/domain/interfaces/concrete-artist.factory.interface';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';

export class TriggerWorkflow implements UseCase {
	constructor(
		private readonly queueService: QueueService,
		private readonly artistRepository: ArtistRepository,
		private readonly artistFactory: ArtistFactory,
		private readonly lyricsApiService: LyricsApiService,
	) {}

	async execute(artistId: number): Promise<void> {
		await this.createArtistFromApi(artistId);
		await this.queueService.sendToFetchQueue({artistId: artistId.toString()});
	}

	private async createArtistFromApi(artistId: number): Promise<void> {
		const apiArtist = await this.lyricsApiService.getArtist(artistId);

		const artist = this.artistFactory.createArtist({id: artistId, ...apiArtist, songs: []});
		await this.artistRepository.save(artist);
	}
}
