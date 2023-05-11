import type {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import type {ArtistRepository} from '@/application/interfaces/artist-repository.interface';

export class ListArtists {
	constructor(
		private readonly artistRepository: ArtistRepository,
	) {}

	async execute(): Promise<ArtistAggregate[]> {
		const artists = await this.artistRepository.list();
		return artists;
	}
}
