import type {UseCase} from '../usecase';
import type {ArtistAggregate} from '@/domain/entities/artist.aggregate';
import type {ArtistRepository} from '@/domain/interfaces/artist-repository.interface';

export class ListArtists implements UseCase {
	constructor(
		private readonly artistRepository: ArtistRepository,
	) {}

	async execute(): Promise<ArtistAggregate[]> {
		const artists = this.artistRepository.list();
		return artists;
	}
}
