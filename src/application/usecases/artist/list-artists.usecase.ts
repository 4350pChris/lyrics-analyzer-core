import type {UseCase} from '../usecase.js';
import type {ArtistAggregate} from '@/domain/entities/artist.aggregate.js';
import type {ArtistRepository} from '@/domain/interfaces/artist.repository.js';

export class ListArtists implements UseCase {
	constructor(
		private readonly artistRepository: ArtistRepository,
	) {}

	async execute(): Promise<ArtistAggregate[]> {
		const artists = this.artistRepository.list();
		return artists;
	}
}
