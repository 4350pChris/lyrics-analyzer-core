import type {GeniusArtistDetailResponse} from '../dtos/genius-artist-detail.dto';
import type {GeniusArtistSongsResponse} from '../dtos/genius-artist-songs.dto';
import type {GeniusSearchResponse} from '../dtos/genius-search.dto';

export type GeniusApi = {
	search(query: string): Promise<GeniusSearchResponse>;
	getSongsForArtist(artistId: number, page: number): Promise<GeniusArtistSongsResponse>;
	getSong(url: URL): Promise<string>;
	getArtist(artistId: number): Promise<GeniusArtistDetailResponse>;
};
