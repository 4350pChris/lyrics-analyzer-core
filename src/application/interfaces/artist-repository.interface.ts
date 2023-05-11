import type {ArtistAggregate} from '@/domain/entities/artist.aggregate';

export type ArtistRepository = {
	list(): Promise<ArtistAggregate[]>;
	create(artist: ArtistAggregate): Promise<ArtistAggregate>;
	addSongs(artist: ArtistAggregate): Promise<void>;
	getById(artistId: number): Promise<ArtistAggregate>;
};
