import type {$Fetch} from 'ofetch';
import type {SearchResponse} from '../interfaces/search.response';
import type {GeniusSong} from '../interfaces/genius-song';
import type {GeniusApiService} from '../interfaces/genius-api.service';

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
