import { Artist } from '../entities/Artist';

export interface IArtistRepository {
  getArtistById(id: number): Promise<Artist>;
}
