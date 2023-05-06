import { Stats } from '../entities/Stats';

export interface IStatsService {
  getStatsForArtist(artistId: number): Promise<Stats>;
}
