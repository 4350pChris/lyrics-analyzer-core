import {ArtistAggregate} from '../entities/artist.aggregate';
import {type ArtistFactory} from '../interfaces/concrete-artist.factory.interface';

export const createArtist: ArtistFactory = props => new ArtistAggregate(props);
