import type {ArtistAggregate} from '../entities/artist.aggregate';

export type ArtistRepository = {
	list(): Promise<ArtistAggregate[]>;
	save(artist: ArtistAggregate): Promise<ArtistAggregate>;
	update(artist: ArtistAggregate): Promise<ArtistAggregate>;
	getById(artistId: number): Promise<ArtistAggregate>;
};
