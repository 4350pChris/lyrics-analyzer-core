import {type $Fetch, ofetch} from 'ofetch';
import {type GeniusApi} from '../interfaces/genius-api.interface';
import {type ArtistSongsResponse} from '../dtos/artist-songs-response.dto';
import {type SearchResponse} from '../dtos/search-response.dto';
import {type ArtistDetailResponse} from '../dtos/artist-detail-response.dto';

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

	async getArtist(artistId: number): Promise<ArtistDetailResponse> {
		return this.client<ArtistDetailResponse>(`/artists/${artistId}`, {
			params: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				text_format: 'plain',
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
				sort: 'popularity',
				page,
			},
		});
	}

	async getSong(url: URL): Promise<string> {
		return ofetch<string, 'text'>(url, {responseType: 'text'});
	}
}
