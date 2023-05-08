import type {ArtistSongsResponse} from '../dtos/artist-songs-response.dto.js';
import type {SearchResponse} from '../dtos/search-response.dto.js';

export type GeniusApi = {
	search(query: string): Promise<SearchResponse>;
	getSongsForArtist(artistId: number, page: number): Promise<ArtistSongsResponse>;
	getSong(url: string): Promise<string>;
};
