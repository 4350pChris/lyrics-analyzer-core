import process from 'node:process';
// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config.js';
import {type $Fetch, ofetch} from 'ofetch';
import type {SearchResponse} from '../interfaces/search.response';
import type {GeniusSong} from '../interfaces/genius-song';

export class GeniusService {
	client: $Fetch;

	// TODO: Use DI to inject the fetch client
	constructor() {
		this.client = ofetch.create({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			baseURL: 'https://api.genius.com',
			headers: {
				authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN ?? ''}`,
			},
		});
	}

	async search(query: string): Promise<GeniusSong[]> {
		const {response} = await this.client<SearchResponse>('/search', {
			params: {
				q: query,
			},
		});
		return response.hits.map(hit => hit.result);
	}
}
