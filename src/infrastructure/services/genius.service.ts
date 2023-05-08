import type {$Fetch} from 'ofetch';
import type {SearchResponse} from '@/application/interfaces/responses/search.response.js';
import type {GeniusApiService} from '@/application/interfaces/services/genius-api.service.js';
import type {GeniusSong} from '@/application/interfaces/responses/genius-song.response.js';

export class GeniusService implements GeniusApiService {
	constructor(
		private readonly geniusApiClient: $Fetch,
	) {}

	async search(query: string): Promise<GeniusSong[]> {
		const {response} = await this.geniusApiClient<SearchResponse>('/search', {
			params: {
				q: query,
			},
		});
		return response.hits.map(hit => hit.result);
	}

	async retrievePaginatedSongs(artist: string, page: number): Promise<GeniusSong[]> {
		const {response} = await this.geniusApiClient<SearchResponse>('/search', {
			params: {
				q: artist,
				page,
			},
		});
		return response.hits.map(hit => hit.result);
	}
}
