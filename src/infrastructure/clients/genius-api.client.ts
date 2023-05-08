import {type $Fetch, ofetch} from 'ofetch';
import {type GeniusApi} from '../interfaces/genius-api.interface.js';
import {type ArtistSongsResponse} from '../dtos/artist-songs-response.dto.js';
import {type SearchResponse} from '../dtos/search-response.dto.js';

export class GeniusApiClient implements GeniusApi {
	private readonly client: $Fetch;

	constructor(
		geniusBaseUrl: string,
		geniusAccessToken: string,
	) {
		this.client = ofetch.create({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			baseURL: geniusBaseUrl,
			headers: {
				authorization: `Bearer ${geniusAccessToken}`,
			},
		});
	}

	async search(query: string): Promise<SearchResponse> {
		return this.client<SearchResponse>('/search', {
			params: {
				q: query,
			},
		});
	}

	async getSongsForArtist(artistId: number, page: number): Promise<ArtistSongsResponse> {
		return this.client<ArtistSongsResponse>(`/artists/${artistId}/songs`, {
			params: {
				page,
			},
		});
	}

	async getSong(url: string): Promise<string> {
		return this.client<string, 'text'>(url, {responseType: 'text'});
	}
}
