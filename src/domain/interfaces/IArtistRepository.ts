import { ArtistAggregate } from '../entities/ArtistAggregate';

export interface IArtistRepository {
  getById(id: number): Promise<ArtistAggregate>;
  save(artist: ArtistAggregate): Promise<ArtistAggregate>;
}
