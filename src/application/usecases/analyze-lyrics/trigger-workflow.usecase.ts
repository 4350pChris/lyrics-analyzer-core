import type {UseCase} from '../../interfaces/usecase';
import {type WorkflowTriggerDto} from '../../dtos/workflow-trigger.dto';
import {type Queue} from '@/application/interfaces/queue.interface';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface';
import {type ArtistFactory} from '@/domain/interfaces/concrete-artist.factory.interface';
import {type LyricsApiService} from '@/application/interfaces/lyrics-api.interface';

export class TriggerWorkflow implements UseCase {
	constructor(
		private readonly queueService: Queue,
		private readonly artistRepository: ArtistRepository,
		private readonly artistFactory: ArtistFactory,
		private readonly lyricsApiService: LyricsApiService,
	) {}

	async execute(artistId: number): Promise<void> {
		await this.createArtistFromApi(artistId);
		const dto: WorkflowTriggerDto = {artistId: artistId.toString()};
		await this.queueService.publish(JSON.stringify(dto));
	}

	private async createArtistFromApi(artistId: number): Promise<void> {
		const apiArtist = await this.lyricsApiService.getArtist(artistId);

		const artist = this.artistFactory.createArtist({id: artistId, ...apiArtist, songs: []});
		await this.artistRepository.save(artist);
	}
}
