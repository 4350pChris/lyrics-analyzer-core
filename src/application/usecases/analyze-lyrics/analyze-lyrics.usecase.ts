import {type UseCase} from '@/application/interfaces/usecase';
import {type ArtistAggregate} from '@/domain/entities/artist.aggregate';
import {type ArtistRepository} from '@/domain/interfaces/artist-repository.interface';

export class AnalyzeLyrics implements UseCase {
	constructor(
		private readonly artistRepository: ArtistRepository,
	) {}

	async execute(artistId: number): Promise<void> {
		let artist: ArtistAggregate;
		try {
			artist = await this.artistRepository.getById(artistId);
		} catch (error) {
			throw new Error('Artist not found', {cause: error});
		}

		artist.calculateStats();

		await this.artistRepository.save(artist);
	}
}
