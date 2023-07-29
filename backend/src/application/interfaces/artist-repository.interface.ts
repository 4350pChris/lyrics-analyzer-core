import type {ArtistAggregate} from '../../domain/entities/artist.aggregate';
import type {ArtistDetailDto} from '../dtos/artist-detail.dto';

export type ArtistRepository = {
	list(): Promise<ArtistDetailDto[]>;
	create(artist: ArtistAggregate): Promise<ArtistAggregate>;
	update(artist: ArtistAggregate): Promise<ArtistAggregate>;
	getById(artistId: number): Promise<ArtistAggregate>;
};
