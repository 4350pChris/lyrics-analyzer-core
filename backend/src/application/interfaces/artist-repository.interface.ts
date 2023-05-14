import type {ArtistAggregate} from '../../domain/entities/artist.aggregate';

export type ArtistRepository = {
	list(): Promise<ArtistAggregate[]>;
	create(artist: ArtistAggregate): Promise<ArtistAggregate>;
	update(artist: ArtistAggregate): Promise<ArtistAggregate>;
	getById(artistId: number): Promise<ArtistAggregate>;
};
