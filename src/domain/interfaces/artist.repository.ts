import type {ArtistAggregate} from '../entities/artist.aggregate';

export type ArtistRepository = {
	getById(id: number): Promise<ArtistAggregate>;
	save(artist: ArtistAggregate): Promise<ArtistAggregate>;
};
