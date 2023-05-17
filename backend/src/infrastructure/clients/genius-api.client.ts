import {type $Fetch, ofetch} from 'ofetch';
import {type GeniusApi} from '../interfaces/genius-api.interface';
import {type GeniusArtistSongsResponse} from '../dtos/genius-artist-songs.dto';
import {type GeniusSearchResponse} from '../dtos/genius-search.dto';
import {type GeniusArtistDetailResponse} from '../dtos/genius-artist-detail.dto';

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

	async getArtist(artistId: number): Promise<GeniusArtistDetailResponse> {
		return this.client<GeniusArtistDetailResponse>(`/artists/${artistId}`, {
			params: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				text_format: 'plain',
			},
		});
	}

	async search(query: string): Promise<GeniusSearchResponse> {
		return this.client<GeniusSearchResponse>('/search', {
			params: {
				q: query,
			},
		});
	}

	async getSongsForArtist(artistId: number, page: number): Promise<GeniusArtistSongsResponse> {
		return this.client<GeniusArtistSongsResponse>(`/artists/${artistId}/songs`, {
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
