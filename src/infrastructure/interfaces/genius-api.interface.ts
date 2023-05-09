import type {ArtistDetailResponse} from '../dtos/artist-detail-response.dto';
import type {ArtistSongsResponse} from '../dtos/artist-songs-response.dto';
import type {SearchResponse} from '../dtos/search-response.dto';

export type GeniusApi = {
	search(query: string): Promise<SearchResponse>;
	getSongsForArtist(artistId: number, page: number): Promise<ArtistSongsResponse>;
	getSong(url: URL): Promise<string>;
	getArtist(artistId: number): Promise<ArtistDetailResponse>;
};
