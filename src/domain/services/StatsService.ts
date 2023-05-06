import type { IArtistRepository } from '../interfaces/IArtistRepository';
import type { IStatsService } from '../interfaces/IStatsService';

export class StatsService implements IStatsService {
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
