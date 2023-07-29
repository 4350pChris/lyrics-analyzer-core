import type {UseCase} from '@/application/interfaces/usecase';
import type {ArtistRepository} from '@/application/interfaces/artist-repository.interface';
import type {ArtistDetailDto} from '@/application/dtos/artist-detail.dto';

export class ListArtists implements UseCase {
	constructor(
		private readonly artistRepository: ArtistRepository,
	) {}

	async execute(): Promise<ArtistDetailDto[]> {
		const artists = await this.artistRepository.list();
		return artists;
	}
}
