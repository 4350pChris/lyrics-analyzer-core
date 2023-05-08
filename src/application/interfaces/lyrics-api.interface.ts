import {type ArtistDetailDto} from '../dtos/artist-detail.dto.js';
import {type SongDto} from '../dtos/song.dto.js';
import {type SearchArtistsDto} from '../dtos/search-artist.dto.js';

export type LyricsApiService = {
	searchArtists(query: string): Promise<SearchArtistsDto[]>;
	getArtist(artistId: number): Promise<ArtistDetailDto>;
	retrieveSongsForArtist(artistId: number): Promise<SongDto[]>;
};
