import {type SearchArtistsDto} from './search-artist.dto.js';

export type RichSongDto = {
	id: number;
	title: string;
	imageUrl?: string;
	artist: SearchArtistsDto;
	releaseDate: Date;
};
