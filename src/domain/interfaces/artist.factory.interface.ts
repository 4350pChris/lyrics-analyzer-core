import {type ArtistAggregate} from '../entities/artist.aggregate';
import {type ArtistProps} from './artist-props.interface';

export type ArtistFactory = {
	createArtist: (props: ArtistProps) => ArtistAggregate;
};
