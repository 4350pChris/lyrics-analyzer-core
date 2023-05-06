import { Stats } from '../entities/Stats';

export interface IArtistService {
  getStatsForArtist(artistId: number): Promise<Stats>;
}
