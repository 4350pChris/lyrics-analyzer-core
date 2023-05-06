import type { IArtistRepository } from '../interfaces/IArtistRepository';
import type { IArtistService } from '../interfaces/IArtistService';

export class ArtistService implements IArtistService {
    constructor(
      private artistRepository: IArtistRepository
    )
    {}

    async getStatsForArtist(artistId: number) {
        const artist = await this.artistRepository.getArtistById(artistId);
        const stats = artist.calculateStats();
        return stats;
    }
}
