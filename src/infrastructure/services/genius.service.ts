import type {$Fetch} from 'ofetch';
import type {SearchResponse} from '@/application/interfaces/search.response';
import type {GeniusApiService} from '@/application/interfaces/genius-api.service';
import type {GeniusSong} from '@/application/interfaces/genius-song';

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
}
